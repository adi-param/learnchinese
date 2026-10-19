import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {GAMES} from '../src/games.js';
import {picture} from '../src/catalog-art.js';
import {standalone} from '../src/story-kit.js';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const json=path=>JSON.parse(read(path));
const catalog=json('data/catalog.json'),words=json('assets/audio/catalog/clips.json');
const lists=Object.entries(catalog).filter(([,v])=>Array.isArray(v));

test('every catalogue word has a picture and its own recording',()=>{
 for(const [list,items] of lists)for(const item of items){
  assert(picture(list,item)?.includes('<svg'),`${list}: ${item.id} needs a picture in src/catalog-art.js`);
  const clip=words[`${list}-${item.id}`];assert(clip,`${list}-${item.id} is not recorded`);assert.equal(clip.text,item.hanzi);assert(existsSync(new URL('../'+clip.file,import.meta.url)));
 }
 for(const food of catalog.foods)assert(food.measure&&Number.isInteger(food.price),food.id);
});
test('the main recording list holds no situation clips',()=>assert(!Object.keys(json('assets/audio/manifest.json')).some(k=>k.startsWith('scenario')||k.startsWith('catalog'))));
for(const {id} of GAMES){
 const data=json(`data/scenarios/${id}.json`),clips=json(`assets/audio/scenarios/${id}/clips.json`),source=read(`src/scenarios/${id}.js`);
 const game=(await import(`../src/scenarios/${id}.js`)).default;
 test(`${id}: every line, card and template sentence is recorded, for every catalogue word it can use`,()=>{
  for(const key of Object.keys(data.lines))assert(clips[key],key);
  for(const key of Object.keys(data.chunks||{}))assert(clips['chunk-'+key],'chunk-'+key);
  for(const [name,t] of Object.entries(data.templates)){
   const [[slot,list],...more]=Object.entries(t.slots);
   for(const item of catalog[list].filter(i=>!t.only?.[slot]||t.only[slot].includes(i.id)))
    if(!more.length)assert(clips[`${name}-${item.id}`],`${name}-${item.id}`);
    else for(const other of catalog[more[0][1]])assert(clips[`${name}-${item.id}-${other.id}`],`${name}-${item.id}-${other.id}`);
  }
  for(const c of Object.values(clips)){assert(c.speech,c.text);assert(existsSync(new URL('../'+c.file,import.meta.url)),c.file);}
 });
 test(`${id}: every voice has a face, and the cover is up to date`,()=>{
  for(const speaker of Object.keys(data.voices))assert(speaker in game.avatars,speaker);
  assert.equal(read(`assets/games/${id}-cover.svg`),standalone(game.cover())+'\n','run node scripts/story-covers.mjs');
 });
 test(`${id}: the script says only lines that exist`,()=>{
  for(const [,key] of source.matchAll(/say\('(\w+)'/g))assert(clips[key],key);
 });
}
test('every café food uses a measure word the café has a card for',()=>{
 const src=read('src/scenarios/cafe.js'),cafe=json('data/scenarios/cafe.json');
 for(const food of catalog.foods.filter(f=>cafe.templates.order.only.food.includes(f.id))){const m=src.match(new RegExp(`${food.measure}:'(\\w+)'`));assert(m,`no card for ${food.measure}`);assert(cafe.chunks[m[1]],m[1]);}
});
