# Chinese learning library

A phone-friendly Mandarin learning website and curriculum library, hosted entirely on GitHub Pages. No backend, third-party JavaScript dependencies, account, API key or database is required.

- [Review the library by lesson](docs/library.md)
- [Website-ready JSON](data/library.json)
- [Transcribed source ledger](data/source-ledger.json)
- [Data format and content rules](docs/data-format.md)

## Current content

118 unique words, 65 phrases and 31 distinct sentences (including activity instructions), extracted from the two supplied textbook PDFs, 24 PDF pages each. Entries shared by several lessons are stored once with all their lesson references.

The supplied material spans Lessons 32–46. Lesson 37 is absent. Lessons 40 and 44 lack their opening pages, so their numbers are inferred from the surrounding lessons. Lesson 46 contains only the opening vocabulary spread. This is an inventory of the **supplied excerpts**, not a claim that the complete textbooks are captured.

Chinese text was visually inspected against the scanned pages. English meanings and tone-marked Pinyin were added editorially and remain drafts for review. No lesson is automatically marked learned, and no item is automatically approved for games. Audio and images are `null` until real assets are added.

The original PDF scans and textbook artwork are not included in this repository. Source references use the original filenames and 1-based PDF page numbers. Duplicate photographed pages and repeated illustrated sentences are deduplicated.

## Validate or update

Requires Python 3.9+; no third-party dependencies.

```sh
python3 scripts/library.py
```

After editing the JSON, regenerate the readable review document:

```sh
python3 scripts/library.py --write-docs
```

The checks cover unique IDs, source bounds, lesson references, complete word segmentation, passage provenance, and agreement between JSON and the readable review document. They do not certify pronunciation or translation quality.

## Website

- Browse and search words, phrases and sentences by lesson.
- Flip word or phrase flashcards to reveal Pinyin and English.
- Match Chinese words with English meanings, with gentle retry feedback.
- Build the textbook sentences from their actual word tokens.
- Play slower device-provided female Mandarin speech (rate 0.5) when a recognised female voice is available; otherwise use the audio pen. This is browser speech synthesis, not a textbook recording. Device voices can require connectivity.

Games start with approved content only. While the curriculum is in draft, enable **Parent preview: use draft material** to try the activities together. This setting lasts only for the current page session and does not approve content or assert mastery. There is no saved learning progress in this first version.

### Local development

Requires Node.js 20+ and Python 3.9+. No package installation is needed.

```sh
npm run dev
# Open http://127.0.0.1:4173
```

```sh
npm test
python3 scripts/library.py
npm run build
```

`dist/` contains the complete static website. Relative URLs support both a repository path and a custom-domain root. The app intentionally does not use history-based routing.

### GitHub Pages

The workflow in `.github/workflows/pages.yml` validates the library, tests game rules, builds the website and deploys pushes to `main`. Pull requests run the same checks without publishing. Set **Settings → Pages → Source → GitHub Actions** in GitHub (already enabled for this repository).

Website: https://adi-param.github.io/learnchinese/

Source data lives in `data/library.json`; the site reads it directly. Add a lesson to the library and regenerate the review document to make it available in the site automatically.
