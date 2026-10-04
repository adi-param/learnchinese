# Little Chinese learning games

**Website: https://adi-param.github.io/learnchinese/**

## Why this exists

This is a fun, homemade project to help my child learn Chinese. The words and sentences they meet at school are here too, turned into short games to play at home: tap a picture to hear a word, flip a card, match words to pictures, and put the words of a sentence onto a train.

The goal is simple: make the learning engaging and interactive, and carry it beyond the classroom. A few minutes together on a phone or tablet, with a friendly panda, lots of pictures and a big celebration when they get it right.

It is built for a four-year-old who can’t read yet, so everything works through pictures and sound, with big buttons and no reading required to play. It is not a commercial product and has no accounts, ads or tracking. Game progress stays in the browser on the device that plays.

## What’s inside

- **Words:** browse a lesson’s words, phrases and sentences; tap any card to hear it.
- **Flip cards:** switch between Words and Phrases, say it together, then flip to see the picture, Pinyin and English.
- **Games:** a menu of picture tiles, one per game. Pick lessons first in the lesson row (or turn on **Mix** for several); every game uses words from those lessons.
  - **Pairs:** tap a Chinese word, then its picture. Tapping only selects; a separate speaker button plays the word when wanted. A correct pair says the word, the panda cheers in Mandarin (对了！真棒！好厉害！) and an animated arrow joins the pair in its own colour. Every other round is reversed (pictures on the left, find the character).
  - **Balloon pop:** the panda says a word and she pops the balloon carrying its character. After the right pop, the word's picture, Pinyin and meaning appear; a wrong balloon floats away and the word is repeated.
  - **Paint the animal:** the panda shows and says a phrase (大红马) and she builds it by picking the animal, the colour and the size. Each right pick ticks off its character and changes the drawing; the Pinyin appears once it is complete.
  - **Feed the animal:** the sentence (小白兔喜欢吃草莓) is shown and spoken, and she feeds the animal the right food out of three; the food flies into its mouth.
  - Pairs and Balloon pop have levels (3, 4 then 6 words, stepping back after a hard round), a hint after two misses, mixed-up words dealt first, and a recap of the words learned. Every game ends with a big celebration and a **Play again** button.
  - **Build the sentence:** a picture and its sentence, read aloud (🔊 replays it). She drags the word tiles into the slots in order, or taps a tile to send it to the next slot; each tile is spoken as it clicks in, and the finished sentence plays with the highlight while the picture comes alive. Level 1 shows faint outlines in the slots, level 2 empty slots, level 3 adds one tile that doesn't belong; three clean sentences move up a level. A round is five different sentences: up to three of the book's (split into reading chunks in `data/sentence-chunks.json`, pictured with the scenes in `src/stage.js`) and the rest new sentences made from the lesson's words.
  - The games use three patterns from the lessons (`data/patterns.json`): likes to eat, size + colour + animal, and is on/under. Every option is a lesson word, so all 161 combinations are new but grammatical, and each has its own recording. A lesson without enough words for a game falls back to every lesson and says so.
  - **For grown-ups:** choose exactly which words Pairs and Balloon pop use, and see which characters are known, still being practised or tricky.
- Wherever Chinese is spoken, the text is on screen and the character being said lights up, karaoke style (Balloon pop keeps the word hidden until it is popped, since the balloons are the answer). `scripts/generate-audio.py` measures where speech starts and ends in each recording so the timing fits.
- Game levels and the character list are saved in the browser on that device only; nothing is sent anywhere.

Every word picture is a drawing in one flat, friendly style that matches the panda (`src/illustrations.js`). A picture must show the word itself, never one example of it (an elephant would teach “elephant”, not 大). Qualities are shown by contrast: the same object twice, with the answer glowing under an arrow and the other faded. Family words highlight one person in the same family, actions show someone doing them, colours are shapeless paint blobs and shapes are colourless outlines. Picture choices are mapped in `src/pictures.js`; they are hints, not translations.

**Use it like an app:** add it to the phone or tablet home screen (Android: the **Add to home screen** button in the grown-ups drawer, or the browser menu; iPhone and iPad: Safari → Share → **Add to Home Screen**). It then opens full screen with the panda icon, and a service worker (`sw.js`) keeps the app, the words and every recording on the device so it also works offline. When online it always fetches the latest version first.

Recordings are slow, synthetic female Mandarin (the macOS Tingting voice), not textbook audio. The site always shows its light theme, even when a browser or device prefers dark mode.

## Content

118 unique words, 65 phrases and 31 distinct sentences (including activity instructions), extracted from two supplied textbook PDFs of 24 pages each. Entries shared by several lessons are stored once with all their lesson references.

The supplied material spans Lessons 32–46. Lesson 37 is absent, so the site shows it as an empty lesson that is “not in the books yet”. Lessons 40 and 44 lack their opening pages, so their numbers are inferred from the surrounding lessons. Lesson 46 contains only the opening vocabulary spread. This is an inventory of the **supplied excerpts**, not a claim that the complete textbooks are captured.

Chinese text was visually inspected against the scanned pages. English meanings and tone-marked Pinyin were added editorially and are still marked as drafts for review; the games use everything straight away. The original PDF scans and textbook artwork are not included in this repository. Source references use the original filenames and 1-based PDF page numbers.

- [Review the library by lesson](docs/library.md)
- [Website-ready JSON](data/library.json)
- [Transcribed source ledger](data/source-ledger.json)
- [Data format and content rules](docs/data-format.md)

## Running it

The site is fully static and hosted on GitHub Pages: no backend, account, API key, database or third-party JavaScript. The Fredoka typeface loads from Google Fonts and falls back to the system rounded font offline.

Requires Node.js 20+ and Python 3.9+. No package installation is needed.

```sh
npm run dev        # http://127.0.0.1:4173
npm test
python3 scripts/library.py
npm run build      # complete static site in dist/
```

The dev server (`scripts/serve.py`) disables caching, supports byte ranges and serves `.m4a` as `audio/mp4`, which Safari needs to play the recordings.

The workflow in `.github/workflows/pages.yml` validates the library, runs the tests, builds the site and deploys every push to `main`. Pull requests run the same checks without publishing.

### Updating the library

Edit `data/library.json`, then validate and regenerate the readable review document:

```sh
python3 scripts/library.py --write-docs
```

The checks cover unique IDs, source bounds, lesson references, complete word segmentation, passage provenance, and agreement between the JSON and the review document. They do not certify pronunciation or translation quality. A lesson added to the library appears in the site automatically.

### Audio

Run `python3 scripts/generate-audio.py` on a Mac with the Tingting voice to record new or changed items. Words are spoken at rate 100; phrases and sentences at rate 90 with a short pause only at punctuation, so they stay natural. Playback runs at 0.85× with pitch preserved. The manifest fingerprints the voice, rate and spoken text, so unchanged recordings are reused. Commit the generated files with the library update.

If a recording fails to play, a help dialog offers a retry, an optional device-voice fallback and device setup instructions.
