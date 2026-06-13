import { useState, useEffect } from "react";
import { C, cardStyle, ring, h2Style } from "../../theme.js";
import Pill from "../Pill.jsx";
import FamilyWord from "../FamilyWord.jsx";
import PicFor from "../PicFor.jsx";
import { VOWEL_INFO, vowelOf } from "../../lib/phonics.js";

export default function WordsTab({ lesson, speech }) {
  const v = vowelOf(lesson.family);
  const info = VOWEL_INFO[v] ?? { sound: v, word: lesson.family, emoji: "" };
  // Hovering a word pops it large into the middle of the screen to hold a
  // child's focus; it stays until they close it.
  const [popWord, setPopWord] = useState(null);

  useEffect(() => {
    if (!popWord) return;
    const onKey = (e) => e.key === "Escape" && setPopWord(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [popWord]);

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

      <h2 style={h2Style}>The “-{lesson.family}” words — hover to focus, tap to hear!</h2>
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
            onMouseEnter={() => setPopWord(w)}
            style={{
              ...cardStyle,
              cursor: "pointer",
              boxShadow:
                speech.speakingKey === `w-${w.word}`
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
              <PicFor pic={w.pic} size={56} />
            </div>
            <FamilyWord word={w.word} family={lesson.family} size={32} />
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
