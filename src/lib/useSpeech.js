import { useState, useEffect, useRef } from "react";
import { hasClip, clipUrl } from "./audio.js";
import { wordToken, soundOutTokens, spellTokens, vowelIntroTokens } from "./phonics.js";
import { DEFAULT_VOICE_ID } from "./voices.js";

export const SPEEDS = [
  ["🐢 Turtle", 0.7],
  ["Slow", 0.85],
  ["Normal", 1],
];

// Owns all audio: prefers a recorded clip per token, falls back to the
// device's speech synthesis. Tokens are spoken in sequence so the Read tab
// can highlight each word as it plays.
export function useSpeech() {
  const [voiceList, setVoiceList] = useState([]);
  const [voiceName, setVoiceName] = useState("");
  const [speed, setSpeed] = useState(1);
  const [speakingKey, setSpeakingKey] = useState(null);

  // Which voice the picker has selected: an ElevenLabs voice id, or DEVICE_VOICE
  // for the built-in offline voice. Persisted so the choice sticks. The actual
  // ElevenLabs synthesis is wired separately (see the seam in `speak` below);
  // voiceIdRef lets that code read the current selection.
  const [voiceId, setVoiceIdState] = useState(() => {
    try {
      return localStorage.getItem("fsr.voiceId") || DEFAULT_VOICE_ID;
    } catch {
      return DEFAULT_VOICE_ID;
    }
  });
  const voiceIdRef = useRef(voiceId);
  const voiceRef = useRef(null);
  const speedRef = useRef(1);
  const audioRef = useRef(null);
  const runRef = useRef(0); // bumped on cancel to abort an in-flight sequence

  const canSpeak = typeof window !== "undefined" && "speechSynthesis" in window;

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
      // --- ElevenLabs voice seam (wired separately by the EL integration) ---
      // When a cloud voice is selected (voiceIdRef.current !== DEVICE_VOICE) and
      // an API key is available, synthesize `t.say` with that voice here: set
      // audioRef.current to the playing audio and call done() when it ends
      // (fall back to speakText on error). Until that is wired, playback falls
      // through to recorded clips / the device voice below.
      if (hasClip(t.clip)) {
        const a = new Audio(clipUrl(t.clip));
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
  const sayWord = (word, key) => speak([wordToken(word)], key ?? `w-${word}`);
  const soundOut = (word, family) =>
    speak(soundOutTokens(word, family), `w-${word}`, { rate: 0.72 });
  const spellWord = (word) => speak(spellTokens(word), `s-${word}`, { rate: 0.85 });
  const playVowelIntro = (family) =>
    speak(vowelIntroTokens(family), "aa", { rate: 0.72 });
  const testVoice = () =>
    speak([wordToken("Hello"), wordToken("Mat"), wordToken("is"), wordToken("a"), wordToken("rat")], "test", {
      rate: 0.85,
    });

  const pickVoice = (name) => {
    setVoiceName(name);
    const v = voiceList.find((x) => x.name === name);
    if (v) voiceRef.current = v;
  };
  const changeSpeed = (v) => {
    setSpeed(v);
    speedRef.current = v;
  };

  // Picker selection: an ElevenLabs voice id, or DEVICE_VOICE. Cancels any
  // in-flight playback so the next sound uses the new voice.
  const setVoice = (id) => {
    cancel();
    setVoiceIdState(id);
    voiceIdRef.current = id;
    try {
      localStorage.setItem("fsr.voiceId", id);
    } catch {
      /* ignore */
    }
  };

  return {
    canSpeak,
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
    pickVoice,
    changeSpeed,
    voiceId,
    setVoice,
    cancel,
  };
}
