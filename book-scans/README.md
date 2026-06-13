# Book scans (local source photos — not committed)

Book page photos are **source material only**: they're read once to pull the
text out and build the app's lesson data, then they're done. The image files are
**git-ignored** (see `.gitignore` in this folder), so they're never committed or
shipped — only this README and the per-book `.gitkeep` folders are tracked.

## Getting page photos to Claude

Claude Code runs in a fresh cloud container, so dropping files onto a local path
on your machine does **not** reach it. Use one of these instead:

- **Attach the photos in chat** (simplest): add them to your message and ask
  Claude to transcribe. The images never touch the repo.
- **Scratch branch**: push the scans to a throwaway branch so Claude can pull and
  read them, then delete the branch. They'd briefly live on that branch but never
  reach `main`.

## What Claude does with them

Reads each page and fills in `src/data/bookN.js` — word families, words, sight
words, sentences, titles, and page numbers. The transcribed text in those data
files is the durable artifact; the photos are throwaway.

Tip: name them by page (`page-01.jpg`, `page-02.jpg`, …) and shoot one clear,
straight-on page per photo so they read cleanly.
