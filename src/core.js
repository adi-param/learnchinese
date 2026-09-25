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
// Deals match rounds from a shuffled queue so every word gets a turn before any repeats.
export function drawRound(queue, pool, size=4, random=Math.random) {
  const next=queue.filter(item=>pool.includes(item));
  if(next.length<size)next.push(...shuffle(pool.filter(item=>!next.includes(item)),random));
  return {words:next.slice(0,size),queue:next.slice(size)};
}
