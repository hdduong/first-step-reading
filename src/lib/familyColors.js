import { C } from "../theme.js";

export const FAMILY_RIME_COLORS = {
  ab: C.red,
  ad: C.red,
  ag: C.red,
  an: C.red,
  ap: C.red,
  at: C.red,
};

const CROSS_FAMILY_RIME_COLORS = {
  an: {
    at: C.green,
  },
  am: {
    at: C.green,
  },
  ad: {
    ag: C.red,
    at: C.green,
  },
  ap: {
    ab: C.red,
    at: C.green,
  },
};

const endsWithFamily = (word, family) =>
  word.endsWith(family) || word.endsWith(`${family}s`);

export const familyForWord = (word, preferredFamily) => {
  const clean = String(word || "").toLowerCase();
  const preferred = String(preferredFamily || "").toLowerCase();

  if (preferred && endsWithFamily(clean, preferred)) return preferred;

  return Object.keys(CROSS_FAMILY_RIME_COLORS[preferred] || {}).find((family) =>
    endsWithFamily(clean, family),
  );
};

export const familyRimeColor = (family, preferredFamily) => {
  const display = String(family || "").toLowerCase();
  const preferred = String(preferredFamily || "").toLowerCase();
  return (
    CROSS_FAMILY_RIME_COLORS[preferred]?.[display] ||
    FAMILY_RIME_COLORS[display] ||
    C.red
  );
};
