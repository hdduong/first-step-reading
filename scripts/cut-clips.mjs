// Slice ONE recorded file into all the app's named clips in a single pass.
//
//   npm run audio:cut -- <audio-file> [labels-file] [--dry-run]
//
// You record/extract one long file (see AUDIO.md), mark each sound in Audacity,
// then File ▸ Export ▸ Export Labels to get a labels file. Each line is:
//
//   <start>  <end>  <name>      e.g.   3.10   3.55   words/cat
//
// (tab- or space-separated — exactly Audacity's label export format). <name> is
// a clip key from `npm run audio:list`. Blank lines and #-comments are ignored.
//
// For every valid line this writes public/audio/<name>.mp3 — trimmed, faded,
// mono 44.1kHz, and volume-matched (loudnorm) so clips don't jump in loudness.
// --dry-run validates the labels and prints what it would write, cutting nothing
// (and not needing ffmpeg) — handy to check names before committing to a cut.
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { clipList } from "./clip-list.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const [audioFile, labelsFile = "labels.txt"] = args.filter(
  (a) => !a.startsWith("--"),
);

const die = (msg) => {
  console.error(msg);
  process.exit(1);
};

if (!audioFile) {
  die(
    "Usage: npm run audio:cut -- <audio-file> [labels-file] [--dry-run]\n" +
      "  <audio-file>   the WAV/MP3 pulled from the video (AUDIO.md step 2)\n" +
      "  [labels-file]  Audacity-exported labels (default: labels.txt)\n" +
      "  --dry-run      validate + preview without cutting (no ffmpeg needed)",
  );
}
if (!dryRun && !existsSync(audioFile)) die(`Audio file not found: ${audioFile}`);
if (!existsSync(labelsFile)) die(`Labels file not found: ${labelsFile}`);
if (!dryRun && spawnSync("ffmpeg", ["-version"], { stdio: "ignore" }).status !== 0) {
  die("ffmpeg not found — install it (brew/choco/apt install ffmpeg). See AUDIO.md.");
}

const expected = clipList(); // Map<clipKey, say>

const rows = readFileSync(labelsFile, "utf8")
  .split(/\r?\n/)
  .map((line, i) => ({ line: line.trim(), lineNo: i + 1 }))
  .filter(({ line }) => line && !line.startsWith("#"))
  .map(({ line, lineNo }) => {
    const [start, end, ...rest] = line.split(/\s+/);
    return { lineNo, start: Number(start), end: Number(end), name: rest.join(" ") };
  });

if (!rows.length) die(`No labels found in ${labelsFile}.`);

let written = 0;
let skipped = 0;
for (const { lineNo, start, end, name } of rows) {
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start || !name) {
    console.warn(`! line ${lineNo}: expected "<start> <end> <name>" — skipped`);
    skipped++;
    continue;
  }
  if (!expected.has(name)) {
    console.warn(`! line ${lineNo}: "${name}" is not a clip the app uses — check \`npm run audio:list\`, skipped`);
    skipped++;
    continue;
  }
  const dur = end - start;
  const out = join(root, "public", "audio", `${name}.mp3`);
  if (dryRun) {
    console.log(`would write ${name}.mp3  (${dur.toFixed(2)}s) ← “${expected.get(name)}”`);
    written++;
    continue;
  }
  mkdirSync(dirname(out), { recursive: true });
  const fadeOut = Math.max(0, dur - 0.03).toFixed(3);
  const filter = `afade=t=in:d=0.02,afade=t=out:st=${fadeOut}:d=0.03,loudnorm=I=-16:TP=-1.5:LRA=11`;
  const res = spawnSync(
    "ffmpeg",
    ["-y", "-ss", String(start), "-i", audioFile, "-t", String(dur),
      "-af", filter, "-ac", "1", "-ar", "44100", out],
    { stdio: ["ignore", "ignore", "inherit"] },
  );
  if (res.status === 0) {
    console.log(`✓ ${name}.mp3  (${dur.toFixed(2)}s)`);
    written++;
  } else {
    console.warn(`✗ ${name}: ffmpeg failed`);
    skipped++;
  }
}

const verb = dryRun ? "would write" : "wrote";
console.log(`\nDone: ${verb} ${written} clip(s), ${skipped} skipped.`);
if (written && !dryRun) console.log("Next: npm run audio:manifest   (then npm run dev)");
