import { useState, useEffect, useRef } from "react";
import { clipUrl, resolveClip } from "./audio.js";
import {
  DEFAULT_VOICE_PACK_ID,
  VOICE_PACKS,
  voicePackById,
} from "../data/voicePacks.js";
import {
  speechWordToken,
  soundOutTokens,
  spellTokens,
  vowelIntroTokens,
} from "./phonics.js";

export const SPEEDS = [
  ["Slow", 0.85],
  ["Normal", 1],
];

// Owns all audio: prefers a recorded clip per token, falls back to the
// device's speech synthesis. Tokens are spoken in sequence so the Read tab
// can highlight each word as it plays.
export function useSpeech() {
  const [voiceList, setVoiceList] = useState([]);
  const [voiceName, setVoiceName] = useState("");
  const [voicePackId, setVoicePackId] = useState(() => {
    if (typeof window === "undefined") return DEFAULT_VOICE_PACK_ID;
    return (
      window.localStorage.getItem("firststepreading.voicePackId") ||
      DEFAULT_VOICE_PACK_ID
    );
  });
  const [speed, setSpeed] = useState(1);
  const [speakingKey, setSpeakingKey] = useState(null);
  const voiceRef = useRef(null);
  const activeVoicePack = voicePackById(voicePackId);
  const voicePackRef = useRef(activeVoicePack);
  const speedRef = useRef(1);
  const audioRef = useRef(null);
  const runRef = useRef(0); // bumped on cancel to abort an in-flight sequence

  const canSpeak = typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    voicePackRef.current = activeVoicePack;
    if (typeof window !== "undefined")
      window.localStorage.setItem(
        "firststepreading.voicePackId",
        activeVoicePack.id,
      );
  }, [activeVoicePack]);

  useEffect(() => {
    if (!canSpeak) return;
    const synth = window.speechSynthesis;
    const load = () => {
      const all = synth.getVoices();
      let vs = all.filter((v) => /en[-_]us/i.test(v.lang));
      if (!vs.length) vs = all.filter((v) => /^en/i.test(v.lang));
      setVoiceList(vs);
      if (!voiceRef.current && vs.length) {
        const pickDefault =
          // Prefer modern neural / "Natural" voices when the device exposes them
          vs.find((v) => /natural|neural|online/i.test(v.name)) ||
          vs.find((v) => /aria|jenny|ava\b|emma|michelle|nova|sara/i.test(v.name)) ||
          vs.find((v) =>
            /samantha|allison|susan|joanna|salli|kimberly|kendra|ivy|female|woman/i.test(
              v.name,
            ),
          ) ||
          vs.find((v) => /zira/i.test(v.name)) ||
          vs[0];
        voiceRef.current = pickDefault;
        setVoiceName(pickDefault.name);
      }
    };
    load();
    if (synth.addEventListener) synth.addEventListener("voiceschanged", load);
    else synth.onvoiceschanged = load;
    return () => {
      if (synth.removeEventListener)
        synth.removeEventListener("voiceschanged", load);
      else synth.onvoiceschanged = null;
    };
  }, [canSpeak]);

  const cancel = () => {
    runRef.current++;
    if (canSpeak) window.speechSynthesis.cancel();
    if (audioRef.current) {
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.pause();
      audioRef.current = null;
    }
    setSpeakingKey(null);
  };

  const speakText = (text, rate, opts, done) => {
    if (!canSpeak || !text) return done();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate;
    u.pitch = opts.pitch ?? 1.15;
    u.lang = (voiceRef.current && voiceRef.current.lang) || "en-US";
    if (voiceRef.current) u.voice = voiceRef.current;
    u.onend = done;
    u.onerror = done;
    window.speechSynthesis.speak(u);
  };

  // Speak an array of { say, clip } tokens. `opts.rate` is the base synthesis
  // rate (multiplied by the chosen speed). cbs.onStart(i)/onEnd fire per token
  // and at the end, used for highlighting.
  const speak = (tokens, key, opts = {}, cbs = {}) => {
    cancel();
    const run = runRef.current;
    if (key !== undefined) setSpeakingKey(key);
    const rate = Math.max(0.1, (opts.rate ?? 0.8) * speedRef.current);
    const clipRate = Math.max(0.5, Math.min(1.2, speedRef.current));
    let i = 0;
    const finish = () => {
      setSpeakingKey((k) => (k === key ? null : k));
      cbs.onEnd && cbs.onEnd();
    };
    const next = () => {
      if (run !== runRef.current) return; // cancelled
      if (i >= tokens.length) return finish();
      const t = tokens[i];
      cbs.onStart && cbs.onStart(i);
      const done = () => {
        if (run !== runRef.current) return;
        i++;
        next();
      };
      const resolvedClip = resolveClip(t.clip, voicePackRef.current);
      if (resolvedClip) {
        const a = new Audio(clipUrl(resolvedClip));
        a.playbackRate = clipRate;
        audioRef.current = a;
        a.onended = done;
        a.onerror = () => speakText(t.say, rate, opts, done);
        a.play().catch(() => speakText(t.say, rate, opts, done));
      } else {
        speakText(t.say, rate, opts, done);
      }
    };
    // A short delay lets speechSynthesis.cancel() settle on some browsers.
    setTimeout(() => {
      if (run === runRef.current) next();
    }, 60);
  };

  // ---- High-level actions ----
  const sayWord = (word, key) =>
    speak([speechWordToken(word)], key ?? `w-${word}`);
  const soundOut = (word, family) =>
    speak(soundOutTokens(word, family), `w-${word}`, { rate: 0.72 });
  const spellWord = (word) => speak(spellTokens(word), `s-${word}`, { rate: 0.85 });
  const playVowelIntro = (family) =>
    speak(vowelIntroTokens(family), "aa", { rate: 0.72 });
  const testVoice = () =>
    speak(
      [
        speechWordToken("Hello"),
        speechWordToken("Mat"),
        speechWordToken("is"),
        speechWordToken("a"),
        speechWordToken("rat"),
      ],
      "test",
      { rate: 0.85 },
    );

  const pickVoice = (name) => {
    setVoiceName(name);
    const v = voiceList.find((x) => x.name === name);
    if (v) voiceRef.current = v;
  };
  const pickVoicePack = (id) => {
    const pack = voicePackById(id);
    voicePackRef.current = pack;
    setVoicePackId(pack.id);
  };
  const changeSpeed = (v) => {
    setSpeed(v);
    speedRef.current = v;
  };

  return {
    canSpeak,
    voicePacks: VOICE_PACKS,
    voicePackId: activeVoicePack.id,
    activeVoicePack,
    voiceList,
    voiceName,
    speed,
    speakingKey,
    SPEEDS,
    speak,
    sayWord,
    soundOut,
    spellWord,
    playVowelIntro,
    testVoice,
    pickVoicePack,
    pickVoice,
    changeSpeed,
    cancel,
  };
}
