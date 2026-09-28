import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {lessonItems,matchingWords,sentenceComplete,shuffle,drawRound} from '../src/core.js';
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
test('sentence checking respects repeated words, order and completeness',()=>{
 assert(sentenceComplete(['a','b','a'],['a','b','a']));
 assert(!sentenceComplete(['a','b','a'],['a','a','b']));
 assert(!sentenceComplete(['a','b','a'],['a','b']));
});
test('shuffle preserves all tokens without mutating source',()=>{const a=['a','b','a','c'];const b=shuffle(a,()=>0);assert.deepEqual(a,['a','b','a','c']);assert.deepEqual([...b].sort(),[...a].sort());});
test('match rounds give every word a turn before repeating',()=>{
 const pool=matchingWords(lessonItems(library,'lesson-34',{kind:'word'}));let queue=[];const seen=new Set();
 for(let round=0;round<Math.ceil(pool.length/4);round++){const dealt=drawRound(queue,pool);assert.equal(new Set(dealt.words).size,dealt.words.length);dealt.words.forEach(w=>seen.add(w.hanzi));queue=dealt.queue;}
 assert.equal(seen.size,pool.length);assert(seen.has('大')&&seen.has('小'));
});
import {MATCH_LEVELS,nextLevel,balloonOptions,recordMatch} from '../src/core.js';
import {defaultProgress,loadProgress,saveProgress} from '../src/progress.js';
test('mixed-up words come back first, but fill at most half a round',()=>{
 const pool=matchingWords(lessonItems(library,'lesson-34',{kind:'word'}));const missed=pool.slice(-3);
 const dealt=drawRound([],pool,4,Math.random,missed);
 assert.deepEqual(dealt.words.slice(0,2),missed.slice(0,2));assert.equal(new Set(dealt.words).size,4);
});
test('levels rise after two perfect rounds and fall after a hard one',()=>{
 let s={level:0,perfect:0};
 s=nextLevel(s,{mistakes:0,size:3});assert.deepEqual(s,{level:0,perfect:1});
 s=nextLevel(s,{mistakes:0,size:3});assert.deepEqual(s,{level:1,perfect:0});
 assert.deepEqual(nextLevel({level:1,perfect:1},{mistakes:1,size:4}),{level:1,perfect:0});
 assert.deepEqual(nextLevel({level:1,perfect:0},{mistakes:4,size:4}),{level:0,perfect:0});
 assert.equal(nextLevel({level:MATCH_LEVELS.length-1,perfect:1},{mistakes:0,size:6}).level,MATCH_LEVELS.length-1);
});
test('balloons always include the word to find, once, among different words',()=>{
 const pool=matchingWords(lessonItems(library,'lesson-34',{kind:'word'}));const target=pool[2];
 for(const count of [3,4]){const options=balloonOptions(target,pool,count);assert.equal(options.length,count);assert.equal(options.filter(o=>o===target).length,1);assert.equal(new Set(options).size,count);}
 assert.equal(balloonOptions(target,[target,pool[0]],4).length,2);
});
test('first-try matches clear a word from review; mix-ups bring it back',()=>{
 const p=defaultProgress();recordMatch(p,'w1',false);assert.deepEqual(p.missed,['w1']);assert.deepEqual(p.stats.w1,{right:0,mixed:1});
 recordMatch(p,'w1',true);assert.deepEqual(p.missed,[]);assert.deepEqual(p.stats.w1,{right:1,mixed:1});
});
test('progress survives a reload and falls back when storage is unavailable',()=>{
 const store=new Map();const storage={getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v)};
 const p=defaultProgress();p.stickers.push('cow');saveProgress(p,storage);assert.deepEqual(loadProgress(storage).stickers,['cow']);
 assert.deepEqual(loadProgress({getItem(){throw new Error('blocked')}}),defaultProgress());
});
test('the offline app stores every script, style and icon the page loads',async()=>{
 const {readdirSync}=await import('node:fs');
 const sw=readFileSync(new URL('../sw.js',import.meta.url),'utf8');
 const shell=JSON.parse(sw.match(/const SHELL=(\[[^\]]*\])/s)[1].replace(/'/g,'"'));
 for(const file of readdirSync(new URL('../src/',import.meta.url)))assert(shell.includes('src/'+file),`sw.js SHELL is missing src/${file}`);
 const manifest=JSON.parse(readFileSync(new URL('../manifest.webmanifest',import.meta.url),'utf8'));
 for(const icon of manifest.icons)assert(readFileSync(new URL('../'+icon.src,import.meta.url)).length>1000,icon.src);
});
