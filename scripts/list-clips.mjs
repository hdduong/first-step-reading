// Prints the exact "cut list" of audio clips the app will look for, derived
// from the book data + phonics rules. This is your checklist for splitting the
// FirstStepReading video: each line is one file to produce in public/audio/.
//
//   npm run audio:list
//
import { clipList } from "./clip-list.mjs";

const byClip = clipList(); // clip key -> human label of what to record

const folders = { sounds: [], words: [], letters: [] };
for (const [clip, say] of [...byClip].sort((a, b) => a[0].localeCompare(b[0]))) {
  const [folder, name] = clip.split("/");
  (folders[folder] ||= []).push({ name, say });
}

const labelFor = (folder, say) =>
  folder === "letters" ? `letter name "${say}"` : `“${say}”`;

console.log(`\nFirstStepReading audio cut list — ${byClip.size} clips total`);
console.log(`Save each as public/audio/<folder>/<name>.mp3\n`);
for (const folder of ["sounds", "letters", "words"]) {
  const items = folders[folder] || [];
  if (!items.length) continue;
  console.log(`public/audio/${folder}/  (${items.length})`);
  for (const { name, say } of items) {
    console.log(`  ${(name + ".mp3").padEnd(16)} ← ${labelFor(folder, say)}`);
  }
  console.log("");
}
