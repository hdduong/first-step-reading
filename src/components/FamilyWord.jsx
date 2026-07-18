import { C } from "../theme.js";
import { familyForWord, familyRimeColor } from "../lib/familyColors.js";

// Renders a word with its family ending colored for easy rime recognition.
export default function FamilyWord({ word, family, size = 30 }) {
  const m = word.match(/^([^A-Za-z']*)([A-Za-z']+)([^A-Za-z']*)$/) || [
    null,
    "",
    word,
    "",
  ];
  const lead = m[1];
  const clean = m[2];
  const tail = m[3];
  const displayFamily = familyForWord(clean, family);
  const hit = Boolean(displayFamily);
  const familyStart = hit
    ? clean.toLowerCase().lastIndexOf(displayFamily)
    : -1;
  const familyEnd = hit ? familyStart + displayFamily.length : -1;
  const onset = hit ? clean.slice(0, familyStart) : clean;
  const rime = hit ? clean.slice(familyStart, familyEnd) : "";
  const suffix = hit ? clean.slice(familyEnd) : "";
  return (
    <span
      data-word={clean.toLowerCase()}
      data-family={displayFamily || undefined}
      style={{ fontSize: size, fontWeight: 700, letterSpacing: 1 }}
    >
      {lead && <span style={{ color: C.blueDark }}>{lead}</span>}
      <span style={{ color: hit ? C.blue : C.blueDark }}>{onset}</span>
      {hit && (
        <span
          data-family-rime={displayFamily}
          style={{ color: familyRimeColor(displayFamily, family) }}
        >
          {rime}
        </span>
      )}
      {suffix && (
        <span data-family-suffix style={{ color: C.blueDark }}>
          {suffix}
        </span>
      )}
      {tail && <span style={{ color: C.blueDark }}>{tail}</span>}
    </span>
  );
}
