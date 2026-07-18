import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { LETTER_SOUNDS, LETTER_SOUND_SETS } from "./letterSounds.js";

const PROJECT_ROOT = path.resolve(import.meta.dirname, "../..");

describe("letter sound lesson", () => {
  it("covers every letter exactly once in five DVD lesson groups", () => {
    expect(LETTER_SOUND_SETS).toHaveLength(5);
    expect(LETTER_SOUNDS.map(({ letter }) => letter).join("")).toBe(
      "abcdefghijklmnopqrstuvwxyz",
    );
    expect(new Set(LETTER_SOUNDS.map(({ letter }) => letter)).size).toBe(26);
  });

  it("has an example and a playable Disk 1 clip for every letter", () => {
    for (const item of LETTER_SOUNDS) {
      expect(item.word.toLowerCase().startsWith(item.letter)).toBe(true);
      expect(item.pic).toBeTruthy();
      expect(item.video).toBe(`Disk1/${item.letter}.mp4`);
      expect(
        fs.existsSync(
          path.join(PROJECT_ROOT, "public/video/letter-sounds", item.video),
        ),
      ).toBe(true);
    }
  });
});
