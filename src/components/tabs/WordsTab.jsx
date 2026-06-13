import { useState, useEffect } from "react";
import { C, cardStyle, ring, h2Style } from "../../theme.js";
import Pill from "../Pill.jsx";
import FamilyWord from "../FamilyWord.jsx";
import PicFor from "../PicFor.jsx";
import { VOWEL_INFO, vowelOf } from "../../lib/phonics.js";

const POP_MODES = [
  { key: "tap", label: "👆 Tap" },
  { key: "hover", label: "🖱️ Hover" },
];

export default function WordsTab({ lesson, speech }) {
  const v = vowelOf(lesson.family);
  const info = VOWEL_INFO[v] ?? { sound: v, word: lesson.family, emoji: "" };

  // A word pops large into the middle of the screen to hold a child's focus; it
  // stays until they close it. It can be triggered by hovering (good on a
  // desktop) or by tapping (the only thing that works on a touchscreen, where
  // hover never fires). The choice is remembered, and defaults to tap on
  // touch-only devices.
  const [popWord, setPopWord] = useState(null);
  const [popMode, setPopMode] = useState(() => {
    if (typeof window === "undefined") return "tap";
    try {
      const saved = localStorage.getItem("fsr.popMode");
      if (saved === "hover" || saved === "tap") return saved;
    } catch {
      /* localStorage may be unavailable */
    }
    return window.matchMedia?.("(hover: none)").matches ? "tap" : "hover";
  });

  useEffect(() => {
    try {
      localStorage.setItem("fsr.popMode", popMode);
    } catch {
      /* ignore */
    }
  }, [popMode]);

  useEffect(() => {
    if (!popWord) return;
    const onKey = (e) => e.key === "Escape" && setPopWord(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [popWord]);

  // Open the pop-out from a card. In hover mode this is wired to onMouseEnter,
  // in tap mode to onClick; keyboard (Enter/Space) works in either mode.
  const triggerProps = (w) =>
    popMode === "hover"
      ? { onMouseEnter: () => setPopWord(w) }
      : { onClick: () => setPopWord(w) };

  return (
    <section>
      <div
        style={{
          ...cardStyle,
          flexDirection: "row",
          justifyContent: "space-between",
          background: C.sky,
          padding: "12px 16px",
          marginBottom: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 42, fontWeight: 700 }}>
            <span style={{ color: C.blue }}>{v.toUpperCase()}</span>
            <span style={{ color: C.red }}>{v}</span>
          </span>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>
              Short {v.toUpperCase()} says “{info.sound}” {info.emoji}
            </div>
            <div style={{ fontSize: 13, color: C.gray }}>
              like in {info.word} and {lesson.family}
            </div>
          </div>
        </div>
        <Pill small onClick={() => speech.playVowelIntro(lesson.family)}>
          🔊 Hear it
        </Pill>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10,
          margin: "4px 0 12px",
        }}
      >
        <h2 style={{ ...h2Style, margin: 0 }}>
          The “-{lesson.family}” words —{" "}
          {popMode === "tap" ? "tap" : "hover over"} a word to pop it big!
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, color: C.gray, fontWeight: 700 }}>
            Pop on:
          </span>
          <div
            role="group"
            aria-label="Pop-out trigger"
            style={{
              display: "inline-flex",
              gap: 2,
              padding: 3,
              borderRadius: 999,
              border: `2px solid ${C.border}`,
              background: "#fff",
            }}
          >
            {POP_MODES.map((m) => {
              const active = popMode === m.key;
              return (
                <button
                  key={m.key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setPopMode(m.key)}
                  style={{
                    border: "none",
                    borderRadius: 999,
                    padding: "6px 12px",
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: "inherit",
                    cursor: "pointer",
                    background: active ? C.blue : "transparent",
                    color: active ? "#fff" : C.gray,
                  }}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

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
              ...cardStyle,
              boxShadow:
                speech.speakingKey === `w-${w.word}`
                  ? ring
                  : "0 2px 0 rgba(0,0,0,0.05)",
            }}
          >
            <div
              {...triggerProps(w)}
              role="button"
              tabIndex={0}
              aria-label={`Pop out ${w.word}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setPopWord(w);
                }
              }}
              style={{
                cursor: "pointer",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
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
                <PicFor pic={w.pic} size={56} />
              </div>
              <FamilyWord word={w.word} family={lesson.family} size={32} />
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <Pill small bg={C.red} onClick={() => speech.soundOut(w.word, lesson.family)}>
                🧩 Sound it
              </Pill>
              <Pill small onClick={() => speech.sayWord(w.word)}>
                🔊 Say
              </Pill>
            </div>
          </div>
        ))}
      </div>

      {popWord && (
        <div
          onClick={() => setPopWord(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "rgba(20,30,60,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            className="pop"
            role="dialog"
            aria-modal="true"
            aria-label={popWord.word}
            onClick={(e) => e.stopPropagation()}
            style={{
              ...cardStyle,
              position: "relative",
              width: "100%",
              maxWidth: 420,
              padding: "34px 24px 26px",
            }}
          >
            <button
              type="button"
              onClick={() => setPopWord(null)}
              aria-label="Close"
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                width: 42,
                height: 42,
                borderRadius: "50%",
                border: `3px solid ${C.border}`,
                background: "#fff",
                color: C.blueDark,
                fontSize: 20,
                fontWeight: 700,
                lineHeight: 1,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              ✕
            </button>
            <div
              style={{
                minHeight: 150,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PicFor pic={popWord.pic} size={150} />
            </div>
            <FamilyWord word={popWord.word} family={lesson.family} size={72} />
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <Pill bg={C.red} onClick={() => speech.soundOut(popWord.word, lesson.family)}>
                🧩 Sound it
              </Pill>
              <Pill onClick={() => speech.sayWord(popWord.word)}>🔊 Say</Pill>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
