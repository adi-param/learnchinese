import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {GAMES} from '../src/games.js';
import {picture} from '../src/catalog-art.js';
import {standalone} from '../src/story-kit.js';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const json=path=>JSON.parse(read(path));
const catalog=json('data/catalog.json');
const lists=Object.entries(catalog).filter(([,v])=>Array.isArray(v));

test('every catalogue word that shows as a picture has one',()=>{
 for(const [list,items] of lists){if(['body','spots'].includes(list))continue;for(const item of items)assert(picture(list,item)?.includes('<svg'),`${list}: ${item.id} needs a picture`);}
});
test('no two words in a list share a picture, so the choices never look the same',()=>{
 for(const [list,items] of lists){if(['body','spots','actions','numbers'].includes(list))continue;
  const seen=new Map();for(const item of items){const pic=picture(list,item);assert(!seen.has(pic),`${list}: ${item.id} looks the same as ${seen.get(pic)}`);seen.set(pic,item.id);}}
});
test('the main recording list holds no game clips',()=>assert(!Object.keys(json('assets/audio/manifest.json')).some(k=>k.startsWith('game'))));
for(const {id,title} of GAMES){
 const data=json(`data/games/${id}.json`),clips=json(`assets/audio/games/${id}/clips.json`),source=read(`src/games/${id}.js`);
 const game=(await import(`../src/games/${id}.js`)).default;
 test(`${id}: every line and every sentence a template can make is recorded`,()=>{
  assert.equal(data.title,title);
  for(const key of Object.keys(data.lines))assert(clips[key],key);
  for(const [name,t] of Object.entries(data.templates)){
   const slots=Object.entries(t.slots),pick=([slot,list])=>catalog[list].filter(i=>!t.only?.[slot]||t.only[slot].includes(i.id)).map(i=>i.id);
   const combos=slots.reduce((acc,s)=>acc.flatMap(a=>pick(s).map(id=>[...a,id])),[[]]);
   for(const ids of combos)assert(clips[`${name}-${ids.join('-')}`],`${name}-${ids.join('-')}`);
  }
  for(const c of Object.values(clips)){assert(c.speech,c.text);assert(existsSync(new URL('../'+c.file,import.meta.url)),c.file);}
 });
 test(`${id}: the script says only lines that exist, every voice has a face, and the cover is up to date`,()=>{
  for(const [,key] of source.matchAll(/say\('(\w+)'/g))assert(clips[key],key);
  for(const speaker of Object.keys(data.voices))assert(game.avatars&&speaker in game.avatars,speaker);
  assert.equal(read(`assets/games/${id}-cover.svg`),standalone(game.cover())+'\n','run node scripts/story-covers.mjs');
 });
}
// The story pictures' own .hint ring is invisible and ignores taps, so a game must not mark the right answer
// in the picture with "hint" (it would vanish and stop working just when she needs it); games use "glow".
test('games never mark a picture with the story hint class',()=>{
 for(const {id} of GAMES)assert(!/classList\.add\('hint'\)/.test(read(`src/games/${id}.js`)),id);
});
