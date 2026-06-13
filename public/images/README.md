# Book images

Drop image files here to use real pictures in the app instead of the emoji and
character drawings. Anything under `public/` is served as-is, so an image saved
at `public/images/words/cat.png` is available to the app at `images/words/cat.png`.

## Where to put what

- **`words/`** — one picture per word, named by the word in lowercase:
  `cat.png`, `hat.png`, `mat.png`, `that.png`, `apple.png`, … These names match
  the `words/` entries printed by `npm run audio:list`, so the picture, the
  recorded clip, and the on-screen word all line up.
- **`scenes/`** — optional page / sentence pictures for the Read tab, e.g.
  `page-2.png`, `page-6.png`.

Formats: `.png`, `.jpg` / `.jpeg`, `.webp`, or `.svg`. Keep each one reasonably
small (a few hundred KB is plenty for phone and tablet screens).

## What happens next

Once your images are in here, tell me and I'll wire the app to use them —
preferring a real image when one exists and falling back to the current
emoji / character for any word you haven't added yet (the same
clip-when-available approach used for the recorded audio).
