// Writes each story's and game's cover as a picture file, so the story list shows covers without loading any story.
// Run after changing a story's pictures: node scripts/story-covers.mjs (or node scripts/story-covers.mjs <id> for one story)
import {writeFile} from 'node:fs/promises';
import {STORIES} from '../src/stories/index.js';
import {GAMES} from '../src/games.js';
import {standalone} from '../src/story-kit.js';
const only=process.argv[2];
for(const {id} of only?[{id:only}]:STORIES){
 const book=(await import(`../src/stories/${id}.js`)).default;
 await writeFile(new URL(`../assets/stories/${id}-cover.svg`,import.meta.url),standalone(book.cover())+'\n');
 console.log(`assets/stories/${id}-cover.svg`);
}
for(const {id} of only?[]:GAMES){
 const game=(await import(`../src/games/${id}.js`)).default;
 await writeFile(new URL(`../assets/games/${id}-cover.svg`,import.meta.url),standalone(game.cover())+'\n');
 console.log(`assets/games/${id}-cover.svg`);
}
