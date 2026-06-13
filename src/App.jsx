import { useState, useEffect, useRef } from "react";
import { LESSONS } from "./lessons.js";

// ---------- Palette (drawn from the book cover: royal blue, sunny yellow, Mat's red, Pat's pink) ----------
const C = {
  blue: "#1d4f91",
  blueDark: "#143a6d",
  red: "#e8503a",
  yellow: "#ffd23f",
  yellowSoft: "#fff3c4",
  pink: "#ef4d8d",
  cream: "#fffaf0",
  sky: "#eef5ff",
  border: "#d8e6f7",
  gray: "#5b6770",
  green: "#3aa655",
};

// ---------- Original cartoon characters (inspired by Mat, Pat & Dan) ----------
const Mat = ({ size = 70 }) => (
  <svg
    width={size}
    height={size * 1.3}
    viewBox="0 0 120 156"
    aria-label="Mat the rat"
  >
    <path
      d="M80 118 C112 122 116 96 102 90"
      fill="none"
      stroke="#eda03c"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <ellipse cx="30" cy="34" rx="19" ry="22" fill="#f3b964" />
    <ellipse cx="90" cy="34" rx="19" ry="22" fill="#f3b964" />
    <ellipse cx="31" cy="35" rx="10" ry="13" fill="#f8d3a4" />
    <ellipse cx="89" cy="35" rx="10" ry="13" fill="#f8d3a4" />
    <ellipse cx="60" cy="56" rx="25" ry="22" fill="#f3b964" />
    {/* plaid cap */}
    <path d="M36 40 A24 21 0 0 1 84 40 Z" fill="#4a7fc1" />
    <g stroke="#d6402f" strokeWidth="2.6" opacity="0.9">
      <line x1="50" y1="23" x2="50" y2="40" />
      <line x1="60" y1="20" x2="60" y2="40" />
      <line x1="70" y1="23" x2="70" y2="40" />
      <line x1="39" y1="30" x2="81" y2="30" />
      <line x1="38" y1="36" x2="82" y2="36" />
    </g>
    <ellipse cx="60" cy="41" rx="28" ry="4.5" fill="#d6402f" />
    {/* eyes */}
    <circle cx="51" cy="52" r="6" fill="#fff" stroke="#333" strokeWidth="1" />
    <circle cx="69" cy="52" r="6" fill="#fff" stroke="#333" strokeWidth="1" />
    <circle cx="51" cy="53" r="2.5" fill="#222" />
    <circle cx="69" cy="53" r="2.5" fill="#222" />
    {/* long nose */}
    <path d="M60 56 C55 62 54 70 60 76 C66 70 65 62 60 56" fill="#eda03c" />
    <circle cx="60" cy="74" r="2.4" fill="#a86a2a" />
    {/* whiskers */}
    <g stroke="#3a3a3a" strokeWidth="1.3">
      <line x1="36" y1="60" x2="50" y2="62" />
      <line x1="36" y1="66" x2="50" y2="66" />
      <line x1="84" y1="60" x2="70" y2="62" />
      <line x1="84" y1="66" x2="70" y2="66" />
    </g>
    {/* red tee */}
    <path d="M42 76 L78 76 L81 110 L39 110 Z" fill="#e6492f" />
    <ellipse cx="41" cy="81" rx="7" ry="6" fill="#e6492f" />
    <ellipse cx="79" cy="81" rx="7" ry="6" fill="#e6492f" />
    <path
      d="M38 86 C36 94 36 102 39 110"
      stroke="#f3b964"
      strokeWidth="5"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M82 86 C84 94 84 102 81 110"
      stroke="#f3b964"
      strokeWidth="5"
      fill="none"
      strokeLinecap="round"
    />
    {/* navy pants */}
    <rect x="45" y="110" width="12" height="26" rx="3" fill="#2e3f6e" />
    <rect x="63" y="110" width="12" height="26" rx="3" fill="#2e3f6e" />
    {/* white shoes */}
    <ellipse
      cx="51"
      cy="139"
      rx="11"
      ry="5.5"
      fill="#fff"
      stroke="#b9c2cc"
      strokeWidth="1.5"
    />
    <ellipse
      cx="69"
      cy="139"
      rx="11"
      ry="5.5"
      fill="#fff"
      stroke="#b9c2cc"
      strokeWidth="1.5"
    />
  </svg>
);

const Pat = ({ size = 70 }) => (
  <svg
    width={size}
    height={size * 1.3}
    viewBox="0 0 120 156"
    aria-label="Pat the mouse"
  >
    <path
      d="M76 118 C108 122 112 94 100 86"
      fill="none"
      stroke="#8e99a4"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <g transform="translate(99 84) rotate(-20)" fill="#f0871f">
      <path d="M0 0 L-10 -6 L-10 6 Z" />
      <path d="M0 0 L10 -6 L10 6 Z" />
      <circle r="2.6" fill="#c96a10" />
    </g>
    <ellipse cx="34" cy="30" rx="20" ry="24" fill="#aab3bd" />
    <ellipse cx="86" cy="30" rx="20" ry="24" fill="#aab3bd" />
    <ellipse cx="35" cy="31" rx="11" ry="15" fill="#eec3cd" />
    <ellipse cx="85" cy="31" rx="11" ry="15" fill="#eec3cd" />
    <ellipse cx="60" cy="52" rx="23" ry="21" fill="#bcc5cd" />
    {/* pink bow */}
    <g transform="translate(60 25)" fill="#ef4d8d">
      <path d="M0 0 L-13 -7 L-13 7 Z" />
      <path d="M0 0 L13 -7 L13 7 Z" />
      <circle r="3.4" fill="#c92a6b" />
    </g>
    {/* lidded eyes + lashes */}
    <circle cx="51" cy="49" r="4.6" fill="#fff" />
    <circle cx="69" cy="49" r="4.6" fill="#fff" />
    <circle cx="51.5" cy="50" r="2.2" fill="#222" />
    <circle cx="68.5" cy="50" r="2.2" fill="#222" />
    <path
      d="M45 47 Q51 41 57 47"
      stroke="#8e99a4"
      strokeWidth="1.6"
      fill="none"
    />
    <path
      d="M63 47 Q69 41 75 47"
      stroke="#8e99a4"
      strokeWidth="1.6"
      fill="none"
    />
    <g stroke="#222" strokeWidth="1.2">
      <line x1="46" y1="45" x2="43" y2="42" />
      <line x1="74" y1="45" x2="77" y2="42" />
    </g>
    {/* nose, whiskers */}
    <ellipse cx="60" cy="62" rx="3.4" ry="2.6" fill="#6b4d4d" />
    <g stroke="#8e99a4" strokeWidth="1.3">
      <line x1="38" y1="58" x2="51" y2="60" />
      <line x1="38" y1="64" x2="51" y2="63" />
      <line x1="82" y1="58" x2="69" y2="60" />
      <line x1="82" y1="64" x2="69" y2="63" />
    </g>
    {/* yellow dress with pink dots */}
    <path
      d="M48 72 L72 72 L82 114 L38 114 Z"
      fill="#ffd23f"
      stroke="#eab308"
      strokeWidth="1.5"
    />
    <ellipse cx="46" cy="76" rx="6" ry="5" fill="#ffd23f" />
    <ellipse cx="74" cy="76" rx="6" ry="5" fill="#ffd23f" />
    <g fill="#ef4d8d" opacity="0.85">
      <circle cx="53" cy="86" r="2" />
      <circle cx="65" cy="82" r="2" />
      <circle cx="58" cy="98" r="2" />
      <circle cx="70" cy="100" r="2" />
      <circle cx="48" cy="105" r="2" />
      <circle cx="62" cy="110" r="2" />
    </g>
    <path
      d="M43 80 C36 90 33 98 34 106"
      stroke="#bcc5cd"
      strokeWidth="4.5"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M77 80 C84 90 87 98 86 106"
      stroke="#bcc5cd"
      strokeWidth="4.5"
      fill="none"
      strokeLinecap="round"
    />
    {/* legs + orange heels */}
    <line
      x1="52"
      y1="114"
      x2="52"
      y2="138"
      stroke="#bcc5cd"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <line
      x1="68"
      y1="114"
      x2="68"
      y2="138"
      stroke="#bcc5cd"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <path d="M45 138 L57 138 L59 146 L43 146 Z" fill="#f0871f" />
    <path d="M61 138 L73 138 L75 146 L59 146 Z" fill="#f0871f" />
  </svg>
);

const Dan = ({ size = 70 }) => (
  <svg
    width={size}
    height={size * 1.3}
    viewBox="0 0 120 156"
    aria-label="Dan the man"
  >
    {/* head */}
    <ellipse cx="60" cy="40" rx="18" ry="19" fill="#f2c79b" />
    {/* blonde hair */}
    <path
      d="M42 36 Q42 16 60 15 Q78 16 78 36 Q69 25 60 26 Q51 25 42 36"
      fill="#e9c33c"
    />
    {/* face */}
    <circle cx="53" cy="41" r="2.4" fill="#222" />
    <circle cx="67" cy="41" r="2.4" fill="#222" />
    <path
      d="M52 49 Q60 56 68 49"
      stroke="#a05a2c"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
    {/* neck */}
    <rect x="56" y="57" width="8" height="8" fill="#f2c79b" />
    {/* teal shirt */}
    <path d="M40 64 L80 64 L83 104 L37 104 Z" fill="#2e7d8c" />
    <path
      d="M53 64 L60 71 L67 64"
      fill="none"
      stroke="#205b66"
      strokeWidth="2"
    />
    <ellipse cx="38" cy="71" rx="7" ry="8" fill="#2e7d8c" />
    <ellipse cx="82" cy="71" rx="7" ry="8" fill="#2e7d8c" />
    <path
      d="M36 79 C33 88 33 95 35 102"
      stroke="#f2c79b"
      strokeWidth="5"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M84 79 C87 88 87 95 85 102"
      stroke="#f2c79b"
      strokeWidth="5"
      fill="none"
      strokeLinecap="round"
    />
    {/* khaki pants */}
    <rect x="43" y="104" width="15" height="32" rx="4" fill="#c8a951" />
    <rect x="62" y="104" width="15" height="32" rx="4" fill="#c8a951" />
    {/* gray shoes */}
    <ellipse
      cx="50"
      cy="139"
      rx="11"
      ry="5.5"
      fill="#cfc8bd"
      stroke="#9a948a"
      strokeWidth="1.5"
    />
    <ellipse
      cx="71"
      cy="139"
      rx="11"
      ry="5.5"
      fill="#cfc8bd"
      stroke="#9a948a"
      strokeWidth="1.5"
    />
  </svg>
);

const ONSET_SOUND = {
  B: "buh",
  C: "kuh",
  D: "duh",
  F: "fuh",
  H: "huh",
  J: "juh",
  M: "muh",
  P: "puh",
  R: "ruh",
  S: "suh",
  V: "vuh",
  Y: "yuh",
  Th: "thuh",
};

const FAMILY_END = { at: "tuh", an: "nuh", am: "muh" };

const cleanWord = (w) => w.replace(/[^A-Za-z']/g, "");

const soundOutParts = (word, family) => {
  const lower = cleanWord(word).toLowerCase();
  if (lower === family) return ["ah", FAMILY_END[family], word];
  const onset = lower.startsWith("th") ? "Th" : lower[0].toUpperCase();
  return [ONSET_SOUND[onset] || onset, family, word];
};

const SPEEDS = [
  ["🐢 Turtle", 0.7],
  ["Slow", 0.85],
  ["Normal", 1],
];

const shuffle = (arr) =>
  arr
    .map((v) => [Math.random(), v])
    .sort((a, b) => a[0] - b[0])
    .map((x) => x[1]);

// Word with the family ending colored red (e.g. M + at, C + an, H + am)
const FamilyWord = ({ word, family, size = 30 }) => {
  const m = word.match(/^([^A-Za-z']*)([A-Za-z']+)([^A-Za-z']*)$/) || [
    null,
    "",
    word,
    "",
  ];
  const lead = m[1];
  const clean = m[2];
  const tail = m[3];
  const hit = clean.toLowerCase().endsWith(family);
  const onset = hit ? clean.slice(0, clean.length - family.length) : clean;
  const rime = hit ? clean.slice(clean.length - family.length) : "";
  return (
    <span style={{ fontSize: size, fontWeight: 700, letterSpacing: 1 }}>
      {lead && <span style={{ color: C.blueDark }}>{lead}</span>}
      <span style={{ color: hit ? C.blue : C.blueDark }}>{onset}</span>
      {hit && <span style={{ color: C.red }}>{rime}</span>}
      {tail && <span style={{ color: C.blueDark }}>{tail}</span>}
    </span>
  );
};

// Picture for a sentence card: character drawing or a big emoji
const PicFor = ({ pic, size = 84 }) => {
  if (pic === "mat") return <Mat size={size} />;
  if (pic === "pat") return <Pat size={size} />;
  if (pic === "dan") return <Dan size={size} />;
  if (pic === "matpat")
    return (
      <div style={{ display: "flex" }}>
        <Mat size={size * 0.68} />
        <Pat size={size * 0.68} />
      </div>
    );
  return <span style={{ fontSize: size * 0.66 }}>{pic}</span>;
};

export default function App() {
  const [tab, setTab] = useState("words");
  const [lessonIdx, setLessonIdx] = useState(0);
  const [speakingKey, setSpeakingKey] = useState(null);
  const [active, setActive] = useState({ s: -1, w: -1 });
  const [game, setGame] = useState(null);
  const [score, setScore] = useState(0);
  const [voiceList, setVoiceList] = useState([]);
  const [voiceName, setVoiceName] = useState("");
  const [speed, setSpeed] = useState(1);
  const voiceRef = useRef(null);
  const speedRef = useRef(1);

  const lesson = LESSONS[lessonIdx];
  const pool = [
    ...new Set([...lesson.words.map((w) => w.word), ...lesson.sight]),
  ];

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

  // Stop audio when switching tabs
  useEffect(() => {
    if (canSpeak) window.speechSynthesis.cancel();
    setSpeakingKey(null);
    setActive({ s: -1, w: -1 });
  }, [tab, canSpeak]);

  const speakParts = (parts, key, opts = {}, cbs = {}) => {
    if (!canSpeak) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    if (key !== undefined) setSpeakingKey(key);
    setTimeout(() => {
      parts.forEach((p, i) => {
        const u = new SpeechSynthesisUtterance(p);
        u.rate = Math.max(0.1, (opts.rate ?? 0.8) * speedRef.current);
        u.pitch = opts.pitch ?? 1.15;
        u.lang = (voiceRef.current && voiceRef.current.lang) || "en-US";
        if (voiceRef.current) u.voice = voiceRef.current;
        u.onstart = () => cbs.onStart && cbs.onStart(i);
        if (i === parts.length - 1) {
          u.onend = () => {
            setSpeakingKey((k) => (k === key ? null : k));
            cbs.onEnd && cbs.onEnd();
          };
        }
        synth.speak(u);
      });
    }, 90);
  };

  const sayWord = (word, key) =>
    speakParts([cleanWord(word)], key ?? `w-${word}`);

  const soundOut = (word) =>
    speakParts(soundOutParts(word, lesson.family), `w-${word}`, { rate: 0.72 });

  const spellWord = (word) =>
    speakParts([...word.toUpperCase().split(""), word], `s-${word}`, {
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

  const testVoice = () =>
    speakParts(["Hello!", "Mat is a rat."], "test", { rate: 0.85 });

  const chooseLesson = (i) => {
    if (canSpeak) window.speechSynthesis.cancel();
    setSpeakingKey(null);
    setActive({ s: -1, w: -1 });
    setGame(null);
    setLessonIdx(i);
  };

  const chipTap = (i, j) => {
    const word = cleanWord(lesson.sentences[i].words[j]);
    speakParts(
      [word],
      undefined,
      { rate: 0.78 },
      {
        onStart: () => setActive({ s: i, w: j }),
        onEnd: () => setActive({ s: -1, w: -1 }),
      },
    );
  };

  const playSentence = (i) => {
    const words = lesson.sentences[i].words.map(cleanWord);
    speakParts(
      words,
      `sent-${i}`,
      { rate: 0.68 },
      {
        onStart: (j) => setActive({ s: i, w: j }),
        onEnd: () => setActive({ s: -1, w: -1 }),
      },
    );
  };

  const newRound = () => {
    const target = pool[Math.floor(Math.random() * pool.length)];
    const others = shuffle(pool.filter((w) => w !== target)).slice(0, 3);
    setGame({
      target,
      choices: shuffle([target, ...others]),
      status: "idle",
      picked: null,
    });
    setTimeout(() => sayWord(target, "game"), 350);
  };

  const pick = (c) => {
    if (!game || game.status === "right") return;
    if (c === game.target) {
      setGame((g) => ({ ...g, status: "right", picked: c }));
      setScore((s) => s + 1);
      speakParts(["Yes!", game.target], "game", { rate: 0.85, pitch: 1.3 });
      setTimeout(newRound, 1700);
    } else {
      setGame((g) => ({ ...g, status: "wrong", picked: c }));
      speakParts(["Try again!"], "game", { rate: 0.9 });
      setTimeout(
        () =>
          setGame((g) =>
            g && g.status === "wrong"
              ? { ...g, status: "idle", picked: null }
              : g,
          ),
        800,
      );
    }
  };

  // ---------- Styles ----------
  const card = {
    background: "#fff",
    border: `3px solid ${C.border}`,
    borderRadius: 22,
    padding: "14px 10px 12px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    transition: "box-shadow .2s",
  };
  const ring = `0 0 0 5px ${C.yellow}`;
  const h2 = {
    color: C.blueDark,
    fontSize: 20,
    margin: "4px 0 12px",
    fontWeight: 700,
  };

  const Pill = ({ children, onClick, bg = C.blue, small }) => (
    <button
      className="press"
      onClick={onClick}
      style={{
        background: bg,
        color: "#fff",
        border: "none",
        borderRadius: 999,
        padding: small ? "7px 12px" : "10px 18px",
        fontWeight: 700,
        fontSize: small ? 13 : 16,
        cursor: "pointer",
        boxShadow: "0 3px 0 rgba(0,0,0,0.18)",
        fontFamily: "inherit",
      }}
    >
      {children}
    </button>
  );

  const tabs = [
    ["words", "🔤 Words"],
    ["sight", "⭐ Sight Words"],
    ["read", "📖 Read It"],
    ["game", "🎮 Game"],
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.cream,
        backgroundImage:
          "radial-gradient(rgba(29,79,145,0.06) 2px, transparent 2px)",
        backgroundSize: "26px 26px",
        fontFamily:
          "'Fredoka','Comic Sans MS','Chalkboard SE','Comic Neue',sans-serif",
        color: C.blueDark,
        paddingBottom: 32,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap');
        * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
        .press:active { transform: scale(0.94); }
        .wiggle { animation: wiggle .5s ease; }
        .pop { animation: pop .45s ease; }
        @keyframes wiggle { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-7px)} 75%{transform:translateX(7px)} }
        @keyframes pop { 0%{transform:scale(1)} 50%{transform:scale(1.14)} 100%{transform:scale(1)} }
        @media (prefers-reduced-motion: reduce) { .wiggle,.pop{animation:none} .press:active{transform:none} }
        button:focus-visible { outline: 3px solid ${C.blue}; outline-offset: 2px; }
        .layout { display: flex; gap: 18px; max-width: 880px; margin: 0 auto; padding: 14px 14px 0; align-items: flex-start; }
        .pagemenu { flex: 0 0 176px; position: sticky; top: 12px; }
        .pagemenu .pagebtns { display: flex; flex-direction: column; gap: 8px; }
        .content { flex: 1; min-width: 0; }
        @media (max-width: 720px) {
          .layout { flex-direction: column; gap: 12px; }
          .pagemenu { position: static; flex: none; width: 100%; }
          .pagemenu .pagebtns { flex-direction: row; }
        }
      `}</style>

      {/* ----- Book-cover header ----- */}
      <header
        style={{
          background: C.yellow,
          borderRadius: "0 0 36px 36px",
          padding: "16px 14px 20px",
          textAlign: "center",
          position: "relative",
          boxShadow: "0 4px 0 rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 12,
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: C.blue,
            color: "#fff",
            border: "3px dashed #fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            transform: "rotate(8deg)",
          }}
        >
          <span style={{ fontSize: 9, letterSpacing: 1 }}>STEP</span>
          <span style={{ fontSize: 22, lineHeight: 1 }}>1</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            gap: 6,
          }}
        >
          <Mat size={58} />
          <div style={{ padding: "0 2px" }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 2,
                color: C.blueDark,
                textTransform: "uppercase",
              }}
            >
              FirstStepReading • Step 1
            </div>
            <h1
              style={{
                margin: "2px 0 0",
                color: C.blue,
                fontSize: 30,
                lineHeight: 1.05,
              }}
            >
              Short Vowel A
            </h1>
            <div style={{ fontWeight: 600, fontSize: 16 }}>
              {lesson.title} • Pages {lesson.pages}
            </div>
          </div>
          <Pat size={58} />
        </div>
      </header>

      {!canSpeak && (
        <p
          style={{
            textAlign: "center",
            color: C.red,
            fontWeight: 600,
            margin: "10px 14px 0",
            fontSize: 14,
          }}
        >
          This device can’t play speech, so the sound buttons won’t talk.
        </p>
      )}

      {/* ----- Body: left page menu + content ----- */}
      <div className="layout">
        {/* ----- Left page menu ----- */}
        <aside className="pagemenu">
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 1.5,
              color: C.gray,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            📚 Choose your pages
          </div>
          <div className="pagebtns">
            {LESSONS.map((L, i) => {
              const on = i === lessonIdx;
              return (
                <button
                  key={L.id}
                  className="press"
                  onClick={() => chooseLesson(i)}
                  style={{
                    flex: 1,
                    background: on ? C.blue : "#fff",
                    color: on ? "#fff" : C.blueDark,
                    border: `3px solid ${on ? C.blue : C.border}`,
                    borderRadius: 16,
                    padding: "12px 8px",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: 22 }}>
                    -{L.family}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.95 }}>
                    Pages {L.pages}
                  </div>
                  <div style={{ fontSize: 11, opacity: 0.85 }}>{L.title}</div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* ----- Content (tabs + panels) ----- */}
        <div className="content">
          {/* ----- Tabs ----- */}
          <nav
            style={{
              display: "flex",
              gap: 8,
              overflowX: "auto",
              padding: "0 0 4px",
            }}
          >
        {tabs.map(([id, label]) => (
          <button
            key={id}
            className="press"
            onClick={() => setTab(id)}
            style={{
              flex: "0 0 auto",
              background: tab === id ? C.blue : "#fff",
              color: tab === id ? "#fff" : C.blue,
              border: `3px solid ${C.blue}`,
              borderRadius: 999,
              padding: "9px 16px",
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {label}
          </button>
        ))}
      </nav>

          <main style={{ padding: "12px 0 0" }}>
        {/* ----- Voice & speed settings ----- */}
        <div
          style={{
            ...card,
            alignItems: "stretch",
            textAlign: "left",
            padding: "12px 14px",
            marginBottom: 14,
            gap: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 14, flex: "0 0 auto" }}>
              🗣️ Voice
            </span>
            <select
              value={voiceName}
              onChange={(e) => pickVoice(e.target.value)}
              style={{
                flex: 1,
                minWidth: 150,
                fontFamily: "inherit",
                fontWeight: 600,
                fontSize: 14,
                padding: "8px 10px",
                borderRadius: 12,
                border: `2px solid ${C.border}`,
                color: C.blueDark,
                background: "#fff",
              }}
            >
              {voiceList.length === 0 && (
                <option value="">Default voice</option>
              )}
              {voiceList.map((v) => (
                <option key={v.name} value={v.name}>
                  {v.name.split(" - ")[0].replace("Desktop", "").trim()}
                </option>
              ))}
            </select>
            <Pill small onClick={testVoice}>
              🔊 Test
            </Pill>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 14 }}>⏱️ Speed</span>
            {SPEEDS.map(([label, v]) => (
              <button
                key={label}
                className="press"
                onClick={() => changeSpeed(v)}
                style={{
                  background: speed === v ? C.blue : "#fff",
                  color: speed === v ? "#fff" : C.blue,
                  border: `2px solid ${C.blue}`,
                  borderRadius: 999,
                  padding: "7px 14px",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 12, color: C.gray }}>
            American English (en-US) voices only — the most natural-sounding
            voice on your device is picked automatically. For richer voices on
            Windows, open this app in Microsoft Edge, or add voices in Settings ▸
            Time &amp; language ▸ Speech.
          </div>
        </div>

        {/* ================= WORDS ================= */}
        {tab === "words" && (
          <section>
            <div
              style={{
                ...card,
                flexDirection: "row",
                justifyContent: "space-between",
                background: C.sky,
                padding: "12px 16px",
                marginBottom: 14,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 42, fontWeight: 700 }}>
                  <span style={{ color: C.blue }}>A</span>
                  <span style={{ color: C.red }}>a</span>
                </span>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>
                    Short A says “a” 🍎
                  </div>
                  <div style={{ fontSize: 13, color: C.gray }}>
                    like in apple and {lesson.family}
                  </div>
                </div>
              </div>
              <Pill
                small
                onClick={() =>
                  speakParts(["ah", "ah", "apple", lesson.family], "aa", {
                    rate: 0.72,
                  })
                }
              >
                🔊 Hear it
              </Pill>
            </div>

            <h2 style={h2}>The “-{lesson.family}” words — tap to hear!</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                gap: 12,
              }}
            >
              {lesson.words.map((w) => (
                <div
                  key={w.word}
                  style={{
                    ...card,
                    boxShadow:
                      speakingKey === `w-${w.word}`
                        ? ring
                        : "0 2px 0 rgba(0,0,0,0.05)",
                  }}
                >
                  <div
                    style={{
                      height: 80,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {w.pic === "mat" ? (
                      <Mat size={56} />
                    ) : w.pic === "pat" ? (
                      <Pat size={56} />
                    ) : w.pic === "dan" ? (
                      <Dan size={56} />
                    ) : (
                      <span style={{ fontSize: 48 }}>{w.pic}</span>
                    )}
                  </div>
                  <FamilyWord word={w.word} family={lesson.family} size={32} />
                  <div style={{ display: "flex", gap: 6 }}>
                    <Pill small bg={C.red} onClick={() => soundOut(w.word)}>
                      🧩 Sound it
                    </Pill>
                    <Pill small onClick={() => sayWord(w.word)}>
                      🔊 Say
                    </Pill>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= SIGHT WORDS ================= */}
        {tab === "sight" && (
          <section>
            <h2 style={h2}>
              Sight words for pages {lesson.pages} — know them by heart! ⭐
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                gap: 12,
              }}
            >
              {lesson.sight.map((w) => (
                <div
                  key={w}
                  style={{
                    ...card,
                    background: C.yellowSoft,
                    borderColor: "#f2d878",
                    boxShadow:
                      speakingKey === `s-${w}` || speakingKey === `w-${w}`
                        ? ring
                        : "0 2px 0 rgba(0,0,0,0.05)",
                  }}
                >
                  <div style={{ fontSize: 26 }}>⭐</div>
                  <div style={{ fontSize: 36, fontWeight: 700, color: C.blue }}>
                    {w}
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Pill small onClick={() => sayWord(w)}>
                      🔊 Say
                    </Pill>
                    <Pill small bg={C.pink} onClick={() => spellWord(w)}>
                      🔡 Spell
                    </Pill>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= READ IT ================= */}
        {tab === "read" && (
          <section>
            <h2 style={h2}>Read pages {lesson.pages} — tap any word 👇</h2>
            {lesson.sentences.map((s, i) => (
              <div
                key={s.page}
                style={{
                  ...card,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 14,
                  padding: 16,
                }}
              >
                <PicFor pic={s.pic} size={84} />
                <div style={{ flex: 1, textAlign: "left" }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: 1.5,
                      color: C.gray,
                      textTransform: "uppercase",
                      marginBottom: 6,
                    }}
                  >
                    Page {s.page}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                      marginBottom: 12,
                    }}
                  >
                    {s.words.map((word, j) => {
                      const on = active.s === i && active.w === j;
                      return (
                        <button
                          key={j}
                          className="press"
                          onClick={() => chipTap(i, j)}
                          style={{
                            background: on ? C.yellow : C.sky,
                            border: `2px solid ${on ? "#e3b416" : C.border}`,
                            borderRadius: 14,
                            padding: "8px 12px",
                            cursor: "pointer",
                            transform: on ? "scale(1.1)" : "none",
                            transition: "all .15s",
                            fontFamily: "inherit",
                          }}
                        >
                          <FamilyWord
                            word={word}
                            family={lesson.family}
                            size={24}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <Pill bg={C.green} onClick={() => playSentence(i)}>
                    ▶ Read it to me
                  </Pill>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* ================= GAME ================= */}
        {tab === "game" && (
          <section>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ ...h2, margin: 0 }}>Listen and find 👂</h2>
              <div style={{ fontSize: 20, fontWeight: 700 }}>⭐ {score}</div>
            </div>
            <div style={{ fontSize: 13, color: C.gray, marginTop: 4 }}>
              Words from pages {lesson.pages}
            </div>

            {!game ? (
              <div style={{ ...card, marginTop: 14, padding: 24 }}>
                <div style={{ fontSize: 50 }}>👂</div>
                <p
                  style={{
                    margin: "4px 0 10px",
                    fontSize: 17,
                    fontWeight: 600,
                  }}
                >
                  I’ll say a word from pages {lesson.pages}.
                  <br />
                  Tap the word you hear!
                </p>
                <Pill bg={C.green} onClick={newRound}>
                  ▶ Start
                </Pill>
              </div>
            ) : (
              <div style={{ marginTop: 14 }}>
                <div style={{ textAlign: "center", marginBottom: 14 }}>
                  <button
                    className="press"
                    onClick={() => sayWord(game.target, "game")}
                    style={{
                      width: 78,
                      height: 78,
                      borderRadius: "50%",
                      border: "none",
                      background: C.blue,
                      color: "#fff",
                      fontSize: 34,
                      cursor: "pointer",
                      boxShadow:
                        speakingKey === "game"
                          ? ring
                          : "0 4px 0 rgba(0,0,0,0.2)",
                    }}
                  >
                    🔊
                  </button>
                  <div style={{ fontSize: 13, color: C.gray, marginTop: 6 }}>
                    Tap to hear it again
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                  }}
                >
                  {game.choices.map((c) => {
                    const wrongPick =
                      game.status === "wrong" && game.picked === c;
                    const right = game.status === "right" && c === game.target;
                    return (
                      <button
                        key={c}
                        className={`press ${wrongPick ? "wiggle" : ""} ${right ? "pop" : ""}`}
                        onClick={() => pick(c)}
                        style={{
                          background: right
                            ? C.green
                            : wrongPick
                              ? "#fde2de"
                              : "#fff",
                          color: right ? "#fff" : C.blueDark,
                          border: `3px solid ${right ? C.green : wrongPick ? C.red : C.border}`,
                          borderRadius: 20,
                          padding: "22px 8px",
                          fontSize: 28,
                          fontWeight: 700,
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>

                <div style={{ textAlign: "center", marginTop: 16 }}>
                  <button
                    onClick={newRound}
                    style={{
                      background: "none",
                      border: "none",
                      color: C.blue,
                      fontWeight: 700,
                      fontSize: 15,
                      cursor: "pointer",
                      textDecoration: "underline",
                      fontFamily: "inherit",
                    }}
                  >
                    ↻ New word
                  </button>
                </div>
              </div>
            )}
          </section>
        )}
          </main>
        </div>
      </div>

      <footer
        style={{
          textAlign: "center",
          color: C.gray,
          fontSize: 12,
          marginTop: 26,
          padding: "0 16px",
        }}
      >
        Practice app for FirstStepReading Step 1 · Short Vowel A · Pages 1–16 ·
        Sounds use your device’s voice 🔊
      </footer>
    </div>
  );
}
