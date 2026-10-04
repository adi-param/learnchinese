import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fill,everyChoice,audioKey,lessonWords,slotsOf} from '../src/sentences.js';
import {illustrations} from '../src/illustrations.js';
const data=JSON.parse(readFileSync(new URL('../data/patterns.json',import.meta.url)));
const library=JSON.parse(readFileSync(new URL('../data/library.json',import.meta.url)));
const words=new Set(library.items.filter(i=>i.kind==='word').map(i=>i.hanzi));
const audio=JSON.parse(readFileSync(new URL('../assets/audio/manifest.json',import.meta.url)));
test('every sentence the games can make uses only lesson words',()=>{
 for(const [slot,options] of Object.entries(data.slots))for(const o of options)assert(lessonWords(o.hanzi,words),`${slot}: ${o.hanzi}`);
 for(const p of data.patterns)for(const part of p.parts.filter(x=>x.hanzi))assert(lessonWords(part.hanzi,words),`${p.id}: ${part.hanzi}`);
});
test('each pattern starts from its lesson sentence and fills its English',()=>{
 const base=id=>{const p=data.patterns.find(x=>x.id===id);return fill(data,p,p.base);};
 assert.equal(base('likes').hanzi,'小黑马喜欢吃草');assert.equal(base('likes').english,'The little black horse likes to eat grass.');
 assert.equal(base('creature').english,'A little black horse!');
 const likes=data.patterns.find(x=>x.id==='likes');assert.equal(fill(data,likes,{who:'mum',food:'grapes'}).english,'Mum likes to eat grapes.');
 for(const p of data.patterns)for(const slot of slotsOf(p))assert(data.slots[slot].some(o=>o.key===p.base[slot]),`${p.id}.${slot}`);
});
test('every combination has a unique recording and every picture exists',()=>{
 const keys=data.patterns.flatMap(p=>everyChoice(data,p).map(c=>audioKey(p,c)));
 assert.equal(new Set(keys).size,keys.length);
 for(const key of keys)assert(audio['pattern-'+key],`missing recording ${key}`);
 for(const options of Object.values(data.slots))for(const o of options)if(o.art)assert(illustrations[o.art],o.art);
});
test('silly animals really take the chosen colour, legs and all',async()=>{
 const {animal}=await import('../src/illustrations.js');
 for(const a of data.slots.animal)for(const c of data.slots.colour){const art=animal(a.key,c.swatch);assert(!art.includes('${'),a.key);assert(art.includes(c.swatch),`${a.key} ${c.key}`);}
});
test('every book sentence splits into chunks that spell it exactly, each with its own recording',()=>{
 const chunks=JSON.parse(readFileSync(new URL('../data/sentence-chunks.json',import.meta.url))).sentences;
 const core=library.items.filter(i=>i.kind==='sentence'&&i.occurrences.some(o=>o.scope==='core'));
 assert.equal(Object.keys(chunks).length,core.length);
 const recorded=new Set(Object.entries(audio).filter(([k])=>k.startsWith('chunk-')).map(([,e])=>e.text));
 for(const s of core){
  const row=chunks[s.id];assert(row,s.hanzi);
  assert.equal(row.map(c=>c.hanzi).join(''),s.hanzi.replace(/[，。！？、]/g,''),s.hanzi);
  assert(row.length>=2&&row.length<=4,`${s.hanzi}: ${row.length} chunks`);
  for(const c of row){assert(recorded.has(c.hanzi),`no recording for ${c.hanzi}`);assert.equal(c.pinyin.split(' ').length,[...c.hanzi].length,c.hanzi);}
 }
});
test('every Make it happen scene acts out its own book sentence with props and places that exist',async()=>{
 const {SCENES,BACKGROUNDS,HIDE_ROOM}=await import('../src/stage.js');
 const chunks=JSON.parse(readFileSync(new URL('../data/sentence-chunks.json',import.meta.url))).sentences;
 for(const [id,scene] of Object.entries(SCENES)){
  assert(chunks[id],id);const bg=BACKGROUNDS[scene.bg];assert(bg,scene.bg);
  for(const step of scene.steps){assert(bg.zones[step.zone],`${id} ${step.zone}`);assert(illustrations[step.prop],step.prop);for(const c of step.chunks)assert(chunks[id][c],`${id} chunk ${c}`);}
  for(const p of scene.spare){assert(illustrations[p],p);assert(!scene.steps.some(s=>s.prop===p),`${id}: spare ${p} is also needed`);}
 }
 for(const spot of data.slots.spot)assert(HIDE_ROOM.spots[spot.key],spot.key);
});
