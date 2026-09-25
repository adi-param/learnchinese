# Curriculum data contract (version 1)

`data/library.json` is the canonical file a static website can fetch. `data/source-ledger.json` records the transcribed passages, vocabulary targets and useful extracted chunks. `docs/library.md` is generated; edit the JSON rather than that document.

## Items

Each item has:

- `id`: stable opaque ID, unique across all kinds; preserve it during corrections.
- `kind`: `word`, `phrase` or `sentence`.
- `hanzi`, `pinyin`, `english`: simplified Chinese, tone-marked syllable-spaced Pinyin, and contextual English meaning.
- `category`: a semantic category for words (animal, colour, action, grammar, etc.); `phrase` or `sentence` for longer items.
- `occurrences`: lesson, source file, 1-based PDF page, scope and role. A source reference can support a component or chunk rather than display it in isolation. Some full passages are assembled from consecutive printed lines/spreads.
- `reviewStatus`: `draft` or `approved`. Approval is an explicit content-review decision, separate from a child's learning progress.
- `wordIds`: ordered lexical components for phrases and sentences. Repeated components remain repeated. Concatenation reproduces the Chinese after punctuation is removed.
- `audio`: repository-relative path to the bundled Mandarin recording. `image`: currently `null`. Audio generation provenance and content fingerprints are in `assets/audio/manifest.json`.

### Scope and role

`core` means lesson vocabulary or story text. `instruction` means activity directions. `illustration` means incidental printed labels within a picture. A word can appear in more than one scope. Do not put instruction-only words into a child's default revision set.

`role` describes evidence: `passage`, `in-text`, `component`, or `target-or-chunk`. The last combines displayed vocabulary and useful contiguous extracts; it is **not** a claim that every chunk was a publisher-highlighted teaching target. The ledger's `origin` field distinguishes these cases.

Words are lexical units, not an exhaustive character dictionary. For example, 巧克力 (qiǎo kè lì, chocolate) is one word and is not split into unrelated meanings for 巧, 克 and 力. Function words within sentences are included. Phrase lists include teaching targets and useful verbatim chunks, not all mathematically possible substrings.

## Lessons

Each lesson includes an editorial English topic label, `itemIds`, `coverageStatus`, `numberVerified`, `notes` and `learningStatus`.

- `available-excerpt`: the supplied excerpt includes vocabulary and story content; this does not certify that no textbook pages are missing.
- `partial`: known missing opening or continuation pages.
- `missing`: no supplied content.
- `numberVerified`: whether the numbered lesson marker is visible in the scans.
- `learningStatus`: initially `not-confirmed`; may later be explicitly set to `learning` or `covered` by the parent. It is not a mastery score.

Games use a parent-chosen lesson and exclude instruction/illustration-only material unless explicitly enabled. A lesson appearing in a PDF is not evidence that the child has studied it. No automatic mastery or progress values have been invented.

## Pinyin and review

Pinyin uses dictionary tones, separated by syllable for parent readability, with unmarked neutral tones. Connected-speech tone changes are generally not respelled: e.g. 不会 is `bù huì`, commonly spoken `bú huì`. Verb–一–verb activity instructions show unstressed `yi`. 风儿 is represented as `fēng ér`; the supplied scan does not establish the audio pen's regional pronunciation or erhua preference.

Handwritten English/Pinyin annotations were not treated as authoritative. Added Pinyin and translations require review against the audio pen or a proficient Mandarin speaker. `draft` is intentional even where the Chinese transcription was visually checked.

## Coverage and provenance

Both PDFs have 24 file pages; most are photographed two-page spreads. References are **PDF page indexes starting at 1**, not printed textbook page numbers. Original scanned files remain outside the repository. Book 1 pages 17 and 18 repeat the same spread. Lesson 38 continues into book 2 page 1.

Lesson 37 is missing. Lesson numbers 40 and 44 are inferred, and their opening vocabulary spreads are absent. Lesson 46 stops after five vocabulary items. No absent content, picture-only object names, or vocabulary from earlier ChatGPT examples (such as a yellow tub) has been added without support in these scans.

## Editing workflow

1. Add or correct an item and its source occurrences in `library.json`; keep its ID stable.
2. Update the corresponding ledger passages, sources and segmentation.
3. Add the ID to each relevant lesson's `itemIds`.
4. Run `python3 scripts/library.py --write-docs` and review the diff.
5. Approve content only after reviewing Chinese, Pinyin, meaning and source mapping. Track lesson coverage separately.
