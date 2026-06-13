// Shared derivation of the audio "cut list" from the book data + phonics rules.
// Both audio scripts import this so they can never drift from each other or the
// app: list-clips.mjs prints it as a checklist; cut-clips.mjs uses it to verify
// that the names in your labels file are clips the app actually plays.
import { BOOKS } from "../src/data/index.js";
import {
  wordToken,
  soundOutTokens,
  spellTokens,
  vowelIntroTokens,
} from "../src/lib/phonics.js";

// Returns Map<clipKey, sayLabel> — clipKey is the file (no extension), e.g.
// "words/cat"; sayLabel is the human text of what to record, e.g. "Cat".
export function clipList() {
  const byClip = new Map();
  const add = (t) => {
    if (t && t.clip && !byClip.has(t.clip)) byClip.set(t.clip, t.say);
  };
  for (const book of BOOKS) {
    for (const L of book.lessons) {
      vowelIntroTokens(L.family).forEach(add);
      for (const w of L.words) {
        add(wordToken(w.word));
        soundOutTokens(w.word, L.family).forEach(add);
      }
      for (const s of L.sight) {
        add(wordToken(s));
        spellTokens(s).forEach(add);
      }
      for (const sent of L.sentences) {
        sent.words.forEach((word) => add(wordToken(word)));
      }
    }
  }
  return byClip;
}
