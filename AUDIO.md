# Recorded voice clips

The app speaks with **recorded clips when they exist**, and falls back to the
device's speech-synthesis voice otherwise. Clips live in `public/audio/` and are
keyed by name (no extension), e.g. `public/audio/words/cat.mp3`.

This guide covers turning the FirstStepReading video into per-sound clips.

## 1. Get the exact list of clips to produce

```bash
npm run audio:list
```

This prints every file the app looks for, grouped into three folders:

- `public/audio/sounds/` — letter sounds + family rimes
  (`vowel-a`, `onset-b`…`onset-th`, `rime-at/an/am`, `end-t/n/m`)
- `public/audio/letters/` — letter **names** for the Spell button (`a`…`z`)
- `public/audio/words/` — whole words (`cat`, `mat`, `apple`…)

The list is generated from the book data, so it always matches the app. (Right
now only Book 1 has content, so only Book 1's clips appear.)

## 2. Pull the audio out of the video

[ffmpeg](https://ffmpeg.org/) (one-time: `brew install ffmpeg` /
`choco install ffmpeg` / `apt install ffmpeg`):

```bash
ffmpeg -i firststepreading.mp4 -vn -ac 1 -ar 44100 audio.wav
```

`-vn` drops the video, `-ac 1` makes it mono, `-ar 44100` sets the sample rate.

## 3. Label each sound, then cut them all at once

The names in the cut list contain a folder (`words/cat`, `sounds/onset-c`).
`npm run audio:cut` reads an Audacity label file and writes every clip into the
right folder for you — trimmed, faded, mono, and volume-matched (`loudnorm`) so
nothing is jarringly loud or quiet.

1. In Audacity: **File ▸ Import ▸ Audio** → `audio.wav`.
2. At the start of each sound, press **Ctrl+B** to add a label and type the clip
   name from the cut list, *including the folder* — e.g. `words/cat`,
   `sounds/onset-c`, `letters/a`. Drag the label edges to tightly bracket the
   sound (trim silence).
3. **File ▸ Export ▸ Export Labels…** → `labels.txt` (each line is
   `<start>  <end>  <name>`).
4. Cut every clip:

   ```bash
   npm run audio:cut -- audio.wav labels.txt --dry-run   # preview + check names
   npm run audio:cut -- audio.wav labels.txt             # write the clips
   ```

`--dry-run` validates every name against the cut list (catching typos like
`word/cat`) and prints what it would write — no ffmpeg needed. Drop the flag to
do the real cut (that step needs ffmpeg on your PATH).

You don't have to do them all in one sitting — label and cut a handful at a
time; any clip you haven't recorded yet just falls back to the device voice.

## 4. Register the clips

```bash
npm run audio:manifest   # rewrites src/lib/clips-manifest.js from public/audio/
npm run dev              # the app now uses your recorded clips
```

Commit `public/audio/**` and the regenerated `src/lib/clips-manifest.js`.
