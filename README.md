# Little Chinese learning games

**Website: https://adi-param.github.io/learnchinese/**

## Why this exists

This is a fun, homemade project to help my child learn Chinese. The words and sentences they meet at school are here too, turned into short games to play at home: tap a picture to hear a word, flip a card, match words to pictures, and put the words of a sentence onto a train.

The goal is simple: make the learning engaging and interactive, and carry it beyond the classroom. A few minutes together on a phone or tablet, with a friendly panda, lots of pictures and a big celebration when they get it right.

It is built for a four-year-old who can’t read yet, so everything works through pictures and sound, with big buttons and no reading required to play. It is not a commercial product and has no accounts, ads or tracking. Game progress stays in the browser on the device that plays.

## What’s inside

- **Words:** browse a lesson’s words, phrases and sentences; tap any card to hear it.
- **Flip cards:** switch between Words and Phrases, say it together, then flip to see the picture, Pinyin and English.
- **Games:** simple, fun games. Each round she hears one everyday sentence, makes one tap, and something happens: food flies into a mouth, clothes land on the rabbit, a toy hops into the box. A wrong tap shakes and says 再试试; after two, the right one glows. After each round a small 🎤 lets her say the sentence and hear hers next to the right one; if she doesn't tap it the game moves on by itself. Every game picks its words at random from the catalogue, so no two rounds are the same, and each game has its own animal.
  - **喂动物 Feed the animals:** 小猴子要吃香蕉 — fifteen animals, sixteen foods.
  - **穿衣服 Dress up (the rabbit):** 小兔子要穿红色的鞋子 / 戴绿色的帽子 — seven clothes in six colours (the wrong cards are the right thing in another colour, or another thing in the right colour). Sometimes the weather turns: 下雨了 (umbrella), 太阳好大 (sunglasses), 好冷啊 (scarf).
  - **洗澡 Bath time (the piglet):** 洗洗小猪的脚 — she taps that part of the muddy piglet and it foams clean; eight body parts.
  - **收玩具 Tidy up:** 把球放进箱子里 / 放在床上 / 放在桌子下面 — tap the toy, then the place; nine toys, five places.
  - **做饭 The silly kitchen (the cat chef):** 放三个鸡蛋 — tap the plate with that many of that food; it plops into the soup.
  - **熊猫在做什么？ What's the panda doing?:** 熊猫在跳舞 — pick that panda out of three, and the big panda does it; fifteen actions.
  - **开车去 Drive there (the puppy):** 我们去公园 / 我们回家 — tap the place, the car zooms there (公园到了！).
  - **Growing them:** the words live in `data/catalog.json` with pictures in `src/catalog-art.js`; each game's sentences are templates in `data/games/` and its script in `src/games/`. Add a food, toy, colour or place to the catalogue (and draw it), run `python3 scripts/generate-audio.py`, and it appears in every game that uses that list, with every sentence recorded. A game's sound loads when it is first played and is then kept for offline use.
- **Stories:** picture books that act themselves out. Each line is read aloud with the karaoke highlight, and whatever the line names lights up in the picture as it is said; between lines she joins in. Speech bubbles say it in pictures, one recorded voice plays every character (lower or higher), and each story ends with its words to tap and hear. Buttons under the title play a story at 0.75×, 1×, 1.25× or 1.5×, speech and pauses together, remembered on the device.
  - **Say it with the panda:** on the refrains (不开，不开！, 变！, 蜘蛛小队，出发！, 谁在我的桥上？, 红灯停，绿灯行！ and others marked `yourTurn` in the story's lines) the story stops, a big mic appears and the panda says 你来说！ She taps it and says the line; recording stops by itself when she goes quiet, and her own voice plays straight back, exactly as she said it. Each refrain asks at most twice a story, and ⏭ skips. At the end, **Hear your story** plays everything she said, in order, over the picture from each moment. Recordings live only in the page's memory: nothing is saved, judged or sent anywhere, and they are gone when the story starts again or the page reloads.
  - **Living pictures (three little pigs so far):** tap anything in the scene for a little surprise whenever the story isn't waiting for her: the sun winks, clouds drift, a bird flies out of the tree, flowers boing, a pig says 哼哼！, the wolf sneezes 阿嚏！. Characters blink, mouths move while they talk, faces show worry or anger, and the camera zooms in on the wolf as he huffs. Soft background sound plays under the story (music, birdsong, the fire), with a ♪ button to turn it off. These sounds are local files made by `scripts/make-sounds.py`, kept offline with the story.
  - **三只小猪 The three little pigs:** each pig builds a house (tap the pile, counting to 三 or 五), then the wolf visits each in turn: she knocks, hears 不开，不开！ and blows the house down (into the microphone, or by tapping the wolf). The brick house stands, so the wolf comes down the chimney; she lights the fire under the pot and he lands in it (好烫！).
  - **灰姑娘 Cinderella:** her stepmother and stepsisters boss her about (快干活！) and she does the chores, walking to each: 扫地！擦桌子！洗碗！ until 都干净了！, and they leave for the prince's dance without her. The fairy godmother arrives and, 变！变！变！, she taps the pumpkin, the mice and Cinderella to make the carriage, the white horses and the dress. At the dance she spins the couple, moves the clock on with each tap (十点了。十一点了。十二点了！) and Cinderella runs, leaving a slipper; at home it is 脚太大了！ for both sisters and 正好！ for Cinderella.
  - **蜘蛛小队救新加坡 Team Spidey saves Singapore:** Ira (in purple and pink) is in Team Spidey with Spider-Man, Ghost-Spider and Spin; names stay in English. At Marina Bay (滨海湾金沙, 鱼尾狮) the team sets off (蜘蛛小队，出发！). At Gardens by the Bay (滨海湾花园) Green Goblin's big robot dinosaur puts the Supertrees' lights out; she swings Ira across the Supertrees (荡过去！), webs the dinosaur's legs and tail, and presses the colour she hears (按红色的按钮！) to put it to sleep. Up Marina Bay Sands she climbs (往上爬！) and catches Green Goblin (抓住你了！), then sets off red, blue and yellow fireworks over the bay.
  - **三只山羊过桥 The three billy goats:** a small, a middle and a big goat (小、中、大) want the grass across the river (山羊喜欢吃草). She taps the planks to walk each goat over the bridge, hooves deeper for each bigger goat; the monster under the bridge pops up (谁在我的桥上？我要吃掉你！), the smaller goats send him to their bigger brother (别吃我！哥哥更大！), and her tap makes the big goat headbutt him into the river (顶！). On the hill she feeds each goat (好吃！) until they are nice and full.
  - **PAW Patrol 救小鸡 PAW Patrol saves the chicken:** names stay in English. Ryder's phone rings (she taps it): the Mayor's little chicken is up a tree. She calls Chase, Rubble and Skye over (准备好了！), taps the rocks for Rubble's digger (挖！), works the traffic light with Chase (红灯停，绿灯行！) so the cars go and then stop for the pups, taps Skye's helicopter up to the treetop to lift the chicken down, and gives each pup a bone (汪汪！). It ends with 没有困难的工作，只有勇敢的狗狗！
  - **How stories are built:** `src/stories.js` is the engine every story shares (the list, player, voices, karaoke, taps, microphone, scene changes, ending). Each story is a module in `src/stories/` with its pictures, script and styles, plus its text in `data/stories/<id>.json`. Only the story list loads with the app; a story's module, text and recordings load when it is opened and are then kept for offline use, so the app stays small however many stories there are. To add one: write the JSON and the module, list it in `src/stories/index.js`, then run `python3 scripts/generate-audio.py` (recordings and their timing in `assets/audio/stories/<id>/`) and `node scripts/story-covers.mjs` (the cover picture). `tests/stories.test.js` checks every story automatically.
- Wherever Chinese is spoken, the text is on screen and the character being said lights up, karaoke style. `scripts/generate-audio.py` measures where speech starts and ends in each recording so the timing fits.
- Which game words she has seen recently, the chosen topic and the story speed are saved in the browser on that device only; nothing is sent anywhere.

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
