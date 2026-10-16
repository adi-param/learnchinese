import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {houseScene,interiorScene,overviewScene,storyPictures} from '../src/story-art.js';
const story=JSON.parse(readFileSync(new URL('../data/stories/three-pigs.json',import.meta.url)));
const manifest=JSON.parse(readFileSync(new URL('../assets/audio/manifest.json',import.meta.url)));
const files=new Map(Object.values(manifest).map(e=>[e.file,e]));
const engine=readFileSync(new URL('../src/stories.js',import.meta.url),'utf8');
test('every line and word has its own recording, with speech timing for the karaoke',()=>{
 const clips=[...Object.entries(story.lines).map(([key,line])=>[key,line.hanzi]),...story.scenes.flatMap(p=>p.words).map(w=>['word-'+w.id,w.hanzi])];
 for(const [clip,text] of clips){const entry=files.get(`assets/audio/stories/${story.id}/${clip}.m4a`);assert(entry,clip);assert.equal(entry.text,text,clip);assert(entry.speech,clip);}
});
test('every cue is a word of its line and names something in the picture',()=>{
 const named=new Set([...[...['straw','wood','brick'].map(m=>houseScene(m,['red'])),overviewScene(),interiorScene()].join('').matchAll(/data-cue="([^"]+)"/g)].flatMap(m=>m[1].split(' ')));
 for(const [key,line] of Object.entries(story.lines))for(const [word,target] of line.cues){assert(line.hanzi.includes(word),`${key}: ${word}`);assert(named.has(target),`${key}: ${target}`);}
});
test('the story only says lines that exist, and every recap word has a picture',()=>{
 const said=[...engine.matchAll(/say\('(\w+)'/g),...engine.matchAll(/(?:build|fallAndRun)\(t,'(\w+)','(\w+)'/g),...engine.matchAll(/letIn\(t,\[[^\]]*\],'(\w+)'/g)].flatMap(m=>m.slice(1));
 assert(said.length>20);for(const key of said)assert(story.lines[key],key);
 for(const [,key] of engine.matchAll(/\['([a-z]+)','.'\]/g))assert(story.lines[key],key);
 for(const p of story.scenes){assert(engine.includes(`${p.id}:{material:`),p.id);for(const word of p.words)assert(storyPictures[word.id],word.id);}
 const ids=story.scenes.flatMap(p=>p.words.map(w=>w.id));assert.equal(new Set(ids).size,ids.length);
});
test('every house has one tap of the pile per layer, so the count matches the building',()=>{
 for(const m of ['straw','wood','brick']){const scene=houseScene(m,['red']);assert.equal(scene.match(/class="piece piece-/g).length,scene.match(/class="layer layer-/g).length,m);}
});
