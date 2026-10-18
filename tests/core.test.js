import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {lessonItems,matchingWords,shuffle} from '../src/core.js';
const library=JSON.parse(readFileSync(new URL('../data/library.json',import.meta.url)));
test('lesson scope excludes instruction-only vocabulary and other lessons',()=>{
 const words=lessonItems(library,'lesson-34',{kind:'word'});
 assert(words.some(w=>w.hanzi==='牛'));assert(!words.some(w=>w.hanzi==='点读笔'));assert(!words.some(w=>w.hanzi==='太阳'));
 assert(lessonItems(library,'lesson-34',{kind:'word',scope:'all'}).some(w=>w.hanzi==='点读笔'));
});
test('draft content cannot enter approved-only games',()=>assert.equal(lessonItems(library,'lesson-34',{approvedOnly:true}).length,0));
test('missing and partial lessons have honest empty states',()=>{
 assert.equal(lessonItems(library,'lesson-37').length,0);
 assert.equal(lessonItems(library,'lesson-46',{kind:'sentence'}).length,0);
 assert.equal(lessonItems(library,'lesson-46',{kind:'word'}).length,5);
});
test('search supports Chinese, Pinyin and case-insensitive English',()=>{
 for(const query of ['绿','lǜ','GREEN'])assert(lessonItems(library,'lesson-34',{query}).some(i=>i.hanzi==='绿'));
});
test('matching pool only has words with distinct meanings',()=>{
 const pool=matchingWords(lessonItems(library,'all'));
 assert(pool.every(i=>i.kind==='word'&&i.category!=='grammar'));
 assert.equal(new Set(pool.map(i=>i.english)).size,pool.length);
});
test('shuffle preserves all tokens without mutating source',()=>{const a=['a','b','a','c'];const b=shuffle(a,()=>0);assert.deepEqual(a,['a','b','a','c']);assert.deepEqual([...b].sort(),[...a].sort());});
test('the offline app stores every script, style and icon the page loads',async()=>{
 const {readdirSync}=await import('node:fs');
 const sw=readFileSync(new URL('../sw.js',import.meta.url),'utf8');
 const shell=JSON.parse(sw.match(/const SHELL=(\[[^\]]*\])/s)[1].replace(/'/g,'"'));
 // Files only: each story in src/stories/ is stored when it is first opened (tests/stories.test.js).
 for(const file of readdirSync(new URL('../src/',import.meta.url),{withFileTypes:true}).filter(f=>f.isFile()).map(f=>f.name))assert(shell.includes('src/'+file),`sw.js SHELL is missing src/${file}`);
 const manifest=JSON.parse(readFileSync(new URL('../manifest.webmanifest',import.meta.url),'utf8'));
 for(const icon of manifest.icons)assert(readFileSync(new URL('../'+icon.src,import.meta.url)).length>1000,icon.src);
});
test('every class the game screens use has a style',()=>{
 const css=readFileSync(new URL('../src/styles.css',import.meta.url),'utf8');
 for(const cls of ['topic-chip','game-tile','balloon','pic-balloon','spy-svg','spy-hit','want-card','want-panda','game-line','eater','flying-food'])assert(new RegExp(`\\.${cls}[\\s{.:,]`).test(css),`.${cls} has no style`);
});
