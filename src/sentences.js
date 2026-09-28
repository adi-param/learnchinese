// Builds sentences from the lesson patterns in data/patterns.json. A choice maps each slot to an option key.
export const slotsOf=pattern=>pattern.parts.filter(part=>part.slot).map(part=>part.slot);
export const optionOf=(data,slot,key)=>data.slots[slot].find(option=>option.key===key);
// Recording file for one filled pattern; scripts/generate-audio.py uses the same naming.
export const audioKey=(pattern,choice)=>[pattern.id,...slotsOf(pattern).map(slot=>choice[slot])].join('_');
export function fill(data,pattern,choice){
 const parts=pattern.parts.map(part=>part.slot?{...optionOf(data,part.slot,choice[part.slot]),slot:part.slot}:part);
 const english=pattern.english.replace(/\{(\w+)(?:\.(\w+))?(\|cap)?\}/g,(_,slot,field,cap)=>{
  const text=optionOf(data,slot,choice[slot])?.[field||'english']??'';
  return cap?text.charAt(0).toUpperCase()+text.slice(1):text;
 });
 return {parts,english,hanzi:parts.map(p=>p.hanzi).join(''),pinyin:parts.map(p=>p.pinyin).join(' '),audio:`assets/audio/patterns/${audioKey(pattern,choice)}.m4a`};
}
// Every choice a pattern allows, for recording and checking.
export function everyChoice(data,pattern){
 return slotsOf(pattern).reduce((choices,slot)=>choices.flatMap(choice=>data.slots[slot].map(option=>({...choice,[slot]:option.key}))),[{}]);
}
export function randomChoice(data,pattern,random=Math.random){
 return Object.fromEntries(slotsOf(pattern).map(slot=>{const options=data.slots[slot];return [slot,options[Math.floor(random()*options.length)].key];}));
}
// Splits Chinese text into lesson words (longest match first); returns null if any part is not a lesson word.
export function lessonWords(text,words){
 const out=[];let i=0;const longest=Math.max(...[...words].map(w=>w.length));
 while(i<text.length){let hit=null;for(let n=Math.min(longest,text.length-i);n>0;n--){const piece=text.slice(i,i+n);if(words.has(piece)){hit=piece;break;}}if(!hit)return null;out.push(hit);i+=hit.length;}
 return out;
}
