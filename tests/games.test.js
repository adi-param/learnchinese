import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {TOPICS} from '../src/games.js';
import * as art from '../src/game-art.js';
const read=path=>JSON.parse(readFileSync(new URL('../'+path,import.meta.url),'utf8'));
const topics=Object.fromEntries(TOPICS.map(t=>[t.id,read(`data/topics/${t.id}.json`)]));

test('no topic game sound is in the install list, so installing the app never downloads them',()=>{
 assert(!Object.keys(read('assets/audio/manifest.json')).some(k=>k.startsWith('topic')));
});
for(const {id,title} of TOPICS){
 const topic=topics[id],clips=read(`assets/audio/topics/${id}/clips.json`);
 test(`${id}: every clip has its own recording, with timing for the karaoke`,()=>{
  assert.equal(topic.title,title);
  for(const [key,clip] of Object.entries(topic.clips)){const c=clips[key];assert(c,key);assert.equal(c.text,clip.hanzi,key);assert(c.speech,key);assert(existsSync(new URL('../'+c.file,import.meta.url)),c.file);}
  assert.equal(Object.keys(clips).length,Object.keys(topic.clips).length,'no leftover recordings');
 });
 test(`${id}: every word has a picture, a Pop it word, an I spy question and a Panda wants line`,()=>{
  for(const item of topic.items){
   assert(art.picture(id,item)?.includes('<svg'),item.id);
   for(const suffix of ['','-spy',...(item.want===false?[]:['-want'])])assert(topic.clips[item.id+suffix],item.id+suffix);
   if(id==='actions'||id==='routine')assert(topic.clips[item.id+'-done'],item.id+'-done');
   if(id==='routine'){assert(topic.clips[item.id+'-give'],item.id+'-give');assert(art.thingPicture(item.thing).includes('<path')||art.thingPicture(item.thing).includes('<rect'),item.thing);}
   if(id==='animals'){assert(art.MOUTHS[item.id],`${item.id} needs a mouth for Feed the animal`);for(const food of item.likes){assert(topics.food.items.some(f=>f.id===food),food);assert(topic.clips[`feed-${item.id}-${food}`],`feed-${item.id}-${food}`);}}
  }
 });
}
test('the body games can find every part on the big panda',()=>{
 const scene=art.bodyScene();
 for(const item of topics.body.items)assert(scene.includes(`data-spy="${item.id}"`),item.id);
 assert(topics.body.clips.thanks);
});
test('I spy scenes have a tap area for each of their six things',()=>{
 for(const id of ['actions','routine','animals','food']){const six=topics[id].items.slice(0,6),scene=art.spyScene(id,six);for(const item of six)assert(scene.includes(`class="spy-hit" fill="transparent" data-spy="${item.id}"`),`${id}: ${item.id}`);}
});
