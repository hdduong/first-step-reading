import { existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { VIDEO_CLIPS } from "./video-clips-manifest.js";

const expectedCuts = {
  dad: { approxTime: "01:09:18", minimumBytes: 400_000 },
  cab: { approxTime: "01:10:08", minimumBytes: 400_000 },
  map: { approxTime: "01:11:01", minimumBytes: 500_000 },
};

describe("corrected Disk 1 video clips", () => {
  it.each(Object.entries(expectedCuts))(
    "keeps the verified %s cut",
    (word, expected) => {
      const clip = VIDEO_CLIPS[word]?.[0];
      expect(clip).toMatchObject({
        word,
        disk: "Disk1",
        approxTime: expected.approxTime,
      });

      const filePath = fileURLToPath(
        new URL(`../../public/video/disk-clips/${clip.path}`, import.meta.url),
      );
      expect(existsSync(filePath)).toBe(true);
      expect(statSync(filePath).size).toBeGreaterThan(expected.minimumBytes);
    },
  );
});
