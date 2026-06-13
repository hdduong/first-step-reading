import { describe, it, expect } from "vitest";
import { wordKey, letterKey, soundKey, clipUrl, hasClip } from "./audio.js";

describe("clip key builders", () => {
  it("slugs words (lowercase, alphanumeric only)", () => {
    expect(wordKey("Cat")).toBe("words/cat");
    expect(wordKey("Jim's")).toBe("words/jims");
    expect(letterKey("A")).toBe("letters/a");
  });

  it("builds sound keys from kind + id", () => {
    expect(soundKey("onset", "c")).toBe("sounds/onset-c");
    expect(soundKey("rime", "at")).toBe("sounds/rime-at");
    expect(soundKey("vowel", "a")).toBe("sounds/vowel-a");
  });
});

describe("clipUrl / hasClip", () => {
  it("builds a url under the audio base path", () => {
    expect(clipUrl("words/cat")).toMatch(/audio\/words\/cat\.mp3$/);
  });

  it("reports no clip when the manifest is empty or the key is missing", () => {
    expect(hasClip("words/cat")).toBe(false);
    expect(hasClip("")).toBe(false);
    expect(hasClip(undefined)).toBe(false);
  });
});
