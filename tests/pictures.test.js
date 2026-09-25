import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {wordPictures,lessonPictures,picturesOf,pictureFor} from '../src/pictures.js';
import {illustrations} from '../src/illustrations.js';
import {lessonItems,matchingWords} from '../src/core.js';
const library=JSON.parse(readFileSync(new URL('../data/library.json',import.meta.url)));
const byId=new Map(library.items.map(i=>[i.id,i]));
const word=hanzi=>library.items.find(i=>i.kind==='word'&&i.hanzi===hanzi);
const specs=[...Object.values(wordPictures),...Object.values(lessonPictures).filter(Boolean)];
test('every picture belongs to a real word and no two words share one',()=>{
 for(const hanzi of Object.keys(wordPictures))assert(word(hanzi),hanzi);
 const pictures=Object.values(wordPictures).map(p=>JSON.stringify(p));assert.equal(new Set(pictures).size,pictures.length);
});
test('every illustration a word or lesson uses exists',()=>{
 for(const p of specs.filter(p=>p.art))assert(illustrations[p.art],p.art);
});
test('every picture is a drawing: no photos, no emoji',()=>{
 for(const [hanzi,p] of Object.entries(wordPictures)){assert.equal(typeof p,'object',hanzi);assert(p.art||p.swatch||p.shape,hanzi);}
});
test('qualities are contrast illustrations; family words share one family scene',()=>{
 assert.deepEqual(['大','小','高','长','亮'].map(h=>wordPictures[h].art),['big','small','tall','long','bright']);
 assert.notEqual(illustrations.big,illustrations.small);
 for(const h of ['爸爸','妈妈','妹妹','弟弟'])assert(['dad','mum','sister','brother'].includes(wordPictures[h].art));
});
test('every word the games can use has a picture',()=>{
 const playable=matchingWords(lessonItems(library,'all',{kind:'word'}));
 for(const item of playable)assert(pictureFor(item,byId),item.hanzi);
});
test('colours are paint blobs and shapes are colourless outlines',()=>{
 assert.match(pictureFor(word('红'),byId),/class="swatch"/);
 assert.match(pictureFor(word('三角形'),byId),/<svg class="outline"[^>]*stroke="currentColor"/);
});
test('every lesson has a picture for the lesson picker',()=>{for(const l of library.lessons)assert(l.coverageStatus==='missing'||lessonPictures[l.id],l.id);});
test('phrases borrow at most three component pictures, things first',()=>{
 for(const item of library.items.filter(i=>i.kind!=='word'))assert(picturesOf(item,byId).length<=3);
 const cowSentence=library.items.find(i=>i.kind==='sentence'&&i.hanzi.includes('大黄牛'));
 assert.deepEqual(picturesOf(cowSentence,byId).slice(0,2),[{art:'cow'},{art:'sheep'}]);
});
