import { useState } from "react";
import { C, cardStyle, ring, h2Style } from "../../theme.js";
import Pill from "../Pill.jsx";
import FamilyWord from "../FamilyWord.jsx";
import PicFor from "../PicFor.jsx";
import PopOut from "../PopOut.jsx";
import { VOWEL_INFO, vowelOf } from "../../lib/phonics.js";

export default function WordsTab({ lesson, speech }) {
  const v = vowelOf(lesson.family);
  const info = VOWEL_INFO[v] ?? { sound: v, word: lesson.family, emoji: "" };

  // Tapping a word pops it large into the middle of the screen to hold a
  // child's focus; it stays until they close it. Tap/click works on every
  // device — there is no hover, which never fires on a touchscreen.
  const [popWord, setPopWord] = useState(null);

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

      <h2 style={h2Style}>
        The “-{lesson.family}” words — tap a word to pop it big!
      </h2>
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
              onClick={() => setPopWord(w)}
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
        <PopOut label={popWord.word} onClose={() => setPopWord(null)}>
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
        </PopOut>
      )}
    </section>
  );
}
