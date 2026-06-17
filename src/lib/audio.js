import { CLIPS } from "./clips-manifest.js";

// Recorded clips live in public/audio/<key>.mp3 and are served from
// BASE_URL + "audio/" (so it works whatever base path the site is hosted at).
// The env guard keeps this file importable from plain Node (the audio scripts
// reuse the key builders below), where import.meta.env is undefined.
const ENV = (typeof import.meta !== "undefined" && import.meta.env) || {};
const BASE = `${ENV.BASE_URL || "/"}audio/`;
const EXT = "mp3";

export const clipUrl = (key) => `${BASE}${key}.${EXT}`;
export const hasClip = (key) => !!key && CLIPS.has(key);
export const resolveClip = (key, voicePack) => {
  if (!key || voicePack?.prefix === null) return null;
  const packedKey = voicePack?.prefix ? `${voicePack.prefix}/${key}` : key;
  return CLIPS.has(packedKey) ? packedKey : null;
};

// ---- Clip-key builders ----
// These define the canonical file names. They are also imported by
// scripts/list-clips.mjs to print the exact "cut list" for the video, so the
// app and the extraction checklist can never drift apart.
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "");

export const wordKey = (word) => `words/${slug(word)}`;
export const letterKey = (ch) => `letters/${slug(ch)}`;
export const soundKey = (kind, id) => `sounds/${kind}-${slug(String(id))}`;
export const sentenceKey = (bookId, lessonId, page) =>
  `sentences/${slug(bookId)}-${slug(lessonId)}-page-${slug(String(page))}`;
