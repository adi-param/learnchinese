import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {STORIES} from '../src/stories/index.js';
import {standalone} from '../src/story-kit.js';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('the main recording list holds no story clips, so installing the app never downloads the stories',()=>{
 assert(!Object.keys(JSON.parse(read('assets/audio/manifest.json'))).some(k=>k.startsWith('story-')));
 for(const file of ['src/stories.js','src/story-kit.js','src/stories/index.js'])assert(read('sw.js').includes(`'${file}'`),file);
 assert(!/src\/stories\/(?!index)/.test(read('sw.js').match(/const SHELL=\[[^\]]*\]/s)[0]),'no single story is in the install list');
});

for(const {id,title} of STORIES){
 const story=JSON.parse(read(`data/stories/${id}.json`));
 const book=(await import(`../src/stories/${id}.js`)).default;
 const source=read(`src/stories/${id}.js`);
 const clips=JSON.parse(read(`assets/audio/stories/${id}/clips.json`));
 const scenes=book.scenes().join('');

 test(`${id}: the list and the story agree, and the cover picture is up to date`,()=>{
  assert.equal(story.id,id);assert.equal(story.title,title);
  for(const key of ['firstScene','scenes','play','pictures','cover','avatars'])assert(book[key],key);
  assert.equal(read(`assets/stories/${id}-cover.svg`),standalone(book.cover())+'\n','run node scripts/story-covers.mjs');
  for(const tag of read(`assets/stories/${id}-cover.svg`).match(/<[a-zA-Z][^>]*>/g)){const names=[...tag.matchAll(/\s([\w:-]+)="/g)].map(m=>m[1]);assert.equal(new Set(names).size,names.length,`a picture file must not repeat an attribute: ${tag.slice(0,60)}`);}
 });
 test(`${id}: every line and word has its own recording, with speech timing for the karaoke`,()=>{
  const wanted=[...Object.entries(story.lines).map(([key,line])=>[key,line.hanzi]),...story.words.map(w=>['word-'+w.id,w.hanzi]),...Object.entries(story.sounds||{}).map(([key,s])=>['snd-'+key,s.hanzi])];
  for(const [clip,text] of wanted){const entry=clips[clip];assert(entry,clip);assert.equal(entry.text,text,clip);assert(entry.speech,clip);assert(existsSync(new URL('../'+entry.file,import.meta.url)),entry.file);}
  assert.equal(Object.keys(clips).length,wanted.length,'no leftover recordings');
 });
 test(`${id}: every speaker has a voice and a face`,()=>{
  for(const line of Object.values(story.lines))if(line.speaker!=='narrator'){assert(story.voices[line.speaker],line.speaker);assert(book.avatars[line.speaker],line.speaker);}
 });
 test(`${id}: every cue is a word of its line and names something in a picture`,()=>{
  const named=new Set([...scenes.matchAll(/data-cue="([^"]+)"/g)].flatMap(m=>m[1].split(' ')));
  for(const [key,line] of Object.entries(story.lines))for(const [word,target] of line.cues){assert(line.hanzi.includes(word),`${key}: ${word}`);assert(named.has(target),`${key}: ${target}`);}
 });
 test(`${id}: the script says only lines that exist, uses every line, and taps only things in the pictures`,()=>{
  for(const [,key] of source.matchAll(/say\('(\w+)'/g))assert(story.lines[key],key);
  for(const key of Object.keys(story.lines))assert(source.includes(`'${key}'`),`${key} is never said`);
  // A name built in code (tap('dust'+n)) only has to start a target's name.
  for(const [,name,built] of source.matchAll(/tap\('([\w-]+)'(\+?)/g))assert(scenes.includes(`hit-${name}${built?'':'"'}`),name);
 });
 test(`${id}: every word on the last card has a picture`,()=>{
  for(const word of story.words)assert(book.pictures[word.id],word.id);
  const ids=story.words.map(w=>w.id);assert.equal(new Set(ids).size,ids.length);
 });
}
