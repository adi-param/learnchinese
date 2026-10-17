// Writes each story's cover as a picture file, so the story list shows covers without loading any story.
// Run after changing a story's pictures: node scripts/story-covers.mjs
import {writeFile} from 'node:fs/promises';
import {STORIES} from '../src/stories/index.js';
import {standalone} from '../src/story-kit.js';
for(const {id} of STORIES){
 const book=(await import(`../src/stories/${id}.js`)).default;
 await writeFile(new URL(`../assets/stories/${id}-cover.svg`,import.meta.url),standalone(book.cover())+'\n');
 console.log(`assets/stories/${id}-cover.svg`);
}
