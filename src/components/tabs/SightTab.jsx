import { useState } from "react";
import { C, cardStyle, ring, h2Style } from "../../theme.js";
import Pill from "../Pill.jsx";
import PopOut from "../PopOut.jsx";

export default function SightTab({ lesson, speech }) {
  // Tapping a sight word pops it large into the middle of the screen to hold a
  // child's focus — same behavior as the Words tab. Tap/click only.
  const [popWord, setPopWord] = useState(null);

  return (
    <section>
      <h2 style={h2Style}>
        Sight words for pages {lesson.pages} — tap one to pop it big! ⭐
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
              ...cardStyle,
              background: C.yellowSoft,
              borderColor: "#f2d878",
              boxShadow:
                speech.speakingKey === `s-${w}` || speech.speakingKey === `w-${w}`
                  ? ring
                  : "0 2px 0 rgba(0,0,0,0.05)",
            }}
          >
            <div
              onClick={() => setPopWord(w)}
              role="button"
              tabIndex={0}
              aria-label={`Pop out ${w}`}
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
              <div style={{ fontSize: 26 }}>⭐</div>
              <div style={{ fontSize: 36, fontWeight: 700, color: C.blue }}>
                {w}
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <Pill small onClick={() => speech.sayWord(w)}>
                🔊 Say
              </Pill>
              <Pill small bg={C.pink} onClick={() => speech.spellWord(w)}>
                🔡 Spell
              </Pill>
            </div>
          </div>
        ))}
      </div>

      {popWord && (
        <PopOut label={popWord} onClose={() => setPopWord(null)}>
          <div style={{ fontSize: 64, lineHeight: 1 }}>⭐</div>
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              color: C.blue,
              lineHeight: 1.05,
              margin: "6px 0",
            }}
          >
            {popWord}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <Pill onClick={() => speech.sayWord(popWord)}>🔊 Say</Pill>
            <Pill bg={C.pink} onClick={() => speech.spellWord(popWord)}>
              🔡 Spell
            </Pill>
          </div>
        </PopOut>
      )}
    </section>
  );
}
