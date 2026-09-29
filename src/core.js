export function lessonItems(library, lessonId, {kind='all', scope='core', query='', approvedOnly=false}={}) {
  const q=query.trim().toLocaleLowerCase();
  return library.items.filter(item => (kind==='all'||item.kind===kind) && (!approvedOnly||item.reviewStatus==='approved') && item.occurrences.some(o=>(lessonId==='all'||o.lessonId===lessonId)&&(scope==='all'||o.scope===scope)) && (!q||[item.hanzi,item.pinyin,item.english].some(v=>v.toLocaleLowerCase().includes(q))));
}
export function shuffle(values, random=Math.random) { const a=[...values]; for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a; }
export function matchingWords(items) {
  const meanings=new Set();
  return items.filter(i=>i.kind==='word'&&!['grammar','pronoun','question'].includes(i.category)).filter(i=>{if(meanings.has(i.english))return false;meanings.add(i.english);return true;});
}
export function sentenceComplete(expected, actual) { return expected.length===actual.length && expected.every((id,index)=>id===actual[index]); }
export function sourceLabel(item,lessonId) {return [...new Set(item.occurrences.filter(o=>lessonId==='all'||o.lessonId===lessonId).map(o=>`${o.sourceId==='book-1'?'Book 1':'Book 2'} · PDF page ${o.pdfPage}`))].join('; ');}
// Deals a round fairly across visits: the least recently practised words come first (ties broken at random),
// so every word gets equal turns however short each visit is. `seen` maps word ids to the round they last
// appeared in and is updated here. One mixed-up word may come back per round, but never two rounds running.
export function dealRound(pool, size, progress, random=Math.random) {
  const seen=progress.seen, round=progress.round, last=id=>seen[id]??-1;
  const byAge=items=>items.map(item=>({item,key:last(item.id)+random()*.005})).sort((a,b)=>a.key-b.key).map(x=>x.item);
  const comeback=byAge(pool.filter(item=>progress.missed.includes(item.id)&&last(item.id)<round)).slice(0,1);
  const words=[...comeback,...byAge(pool.filter(item=>!comeback.includes(item)))].slice(0,Math.min(size,pool.length));
  // Each word keeps its place in line (round, then position), so no word can cut ahead of an older one.
  progress.round=round+1;words.forEach((item,index)=>{seen[item.id]=progress.round+index/100;});
  return words;
}
// The same fairness for phrase-game choices: picks the least recently used option (ties at random) and marks it.
export function leastRecent(options, seen, tag, random=Math.random) {
  const age=o=>seen[tag+':'+o.key]??-1;
  const pick=options.map(o=>({o,key:age(o)+random()*.5})).sort((a,b)=>a.key-b.key)[0].o;
  seen[tag+':'+pick.key]=(seen.clock=(seen.clock||0)+1);
  return pick;
}
// Pairs per match round, easiest first.
export const MATCH_LEVELS=[3,4,6];
// Two perfect rounds in a row move up a level; a round with as many mistakes as pairs moves back down.
export function nextLevel({level,perfect},{mistakes,size}) {
  if(mistakes===0){const streak=perfect+1;return streak>=2&&level<MATCH_LEVELS.length-1?{level:level+1,perfect:0}:{level,perfect:streak};}
  if(mistakes>=size&&level>0)return {level:level-1,perfect:0};
  return {level,perfect:0};
}
// Balloon pop: the word to find plus other words from the chosen lessons, in random order.
export function balloonOptions(target, pool, count=3, random=Math.random) {
  const others=shuffle(pool.filter(item=>item.id!==target.id),random).slice(0,count-1);
  return shuffle([target,...others],random);
}
// Records one matched word: first-try matches and mix-ups per word, and whether it should come back soon.
export function recordMatch(progress, id, firstTry) {
  const stat=progress.stats[id]||{right:0,mixed:0};
  progress.stats[id]=firstTry?{...stat,right:stat.right+1}:{...stat,mixed:stat.mixed+1};
  progress.missed=firstTry?progress.missed.filter(x=>x!==id):[...new Set([...progress.missed,id])];
  return progress;
}
