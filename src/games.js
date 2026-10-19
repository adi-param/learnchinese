// Games: real-life situations (the café, the animal train…) where she says real sentences. Each situation is a
// script in src/scenarios/ that uses four kinds of step:
//  choose — which reply fits? Each card says its sentence when tapped; the right one moves the scene on.
//  build  — make the sentence from talking picture cards, in order.
//  speak  — say it into the mic; her recording plays, then the right one, so she (or a grown-up) can compare.
//  pay    — count Singapore dollar coins into the waiter's hand.
// The words come from the catalogue (data/catalog.json), the sentences from each situation's templates, so new
// animals or foods show up in every situation that uses them. A situation loads only when it is opened.
import {chime} from './sfx.js';
import {icon,mascot} from './icons.js';
import {record,canRecord,stopRecording,playUrl} from './recorder.js';

const CACHE='learnchinese-v1';
export const GAMES=[
 {id:'cafe',title:'小餐厅',english:'The café',hint:'Order, eat, pay and say goodbye'},
 {id:'train',title:'动物火车',english:'The animal train',hint:'Seat the animals, feed them, drop them off'}
];
const NARRATOR={rate:.85,keep:true};
const PAUSE=/[\p{P}\s]/u;
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const units=text=>text.match(/[A-Za-z][A-Za-z'’-]*|[\s\S]/gu)||[];
const chars=text=>units(text).reduce((g,c)=>{const span=`<span class="ch">${escape(c)}</span>`;if(g.length&&PAUSE.test(c)&&!/\s/.test(c))g[g.length-1]+=span;else g.push(span);return g;},[]).map(g=>`<span class="ch-group">${g}</span>`).join('');
const url=path=>new URL('../'+path,import.meta.url).href;
export const shuffle=list=>{const a=[...list];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
// (No Audio outside a browser, so the tests can read this module's game list.)
const audio=typeof Audio==='function'?new Audio():null,mine=typeof Audio==='function'?new Audio():null;
let root=null,celebrate=()=>{},token=0,frame=0,finishLine=null,cancelWait=null;
let game=null,scene=null,clips={},words={},catalog=null,current=null;
const loaded=new Map();
class Stopped extends Error{}
const alive=t=>{if(t!==token)throw new Stopped();};
const wait=(ms,t)=>new Promise(resolve=>setTimeout(resolve,ms)).then(()=>alive(t));
const $=selector=>root.querySelector(selector);
const $$=selector=>[...root.querySelectorAll(selector)];
const replay=(el,cls)=>{if(!el)return;el.classList.remove(cls);void el.getBoundingClientRect();el.classList.add(cls);};

export function mountGames(element,options){root=element;celebrate=options.celebrate;showMenu();}
export function stopGames(){token++;cancelWait?.();stopRecording();audio?.pause();mine?.pause();finishLine?.(false);cancelAnimationFrame(frame);}

function showMenu(){
 stopGames();
 root.innerHTML=`<div class="story-menu">${GAMES.map(g=>`<button class="story-card" data-game="${g.id}"><img class="story-cover" src="${url(`assets/games/${g.id}-cover.svg`)}" alt="" loading="lazy"><span class="story-card-text"><span class="hanzi" lang="zh-Hans">${escape(g.title)}</span><span class="story-card-name">${escape(g.english)}</span><small>${escape(g.hint)}</small></span><span class="story-card-play" aria-hidden="true">${icon('play')}</span></button>`).join('')}</div>`;
 root.querySelectorAll('[data-game]').forEach(b=>b.onclick=()=>openGame(b.dataset.game).catch(()=>b.classList.add('failed')));
}
const getJson=path=>fetch(url(path)).then(r=>r.json());
async function openGame(id){
 catalog??=await getJson('data/catalog.json');
 if(!Object.keys(words).length)words=await getJson('assets/audio/catalog/clips.json');
 if(!loaded.has(id)){
  const [text,module,timing]=await Promise.all([getJson(`data/scenarios/${id}.json`),import(`./scenarios/${id}.js`),getJson(`assets/audio/scenarios/${id}/clips.json`)]);
  loaded.set(id,{text,scene:module.default,timing});
  if(module.default.css&&!document.querySelector(`style[data-game="${id}"]`)){const style=document.createElement('style');style.dataset.game=id;style.textContent=module.default.css;document.head.append(style);}
  keepOffline(id,timing);
 }
 ({text:game,scene,timing:clips}=loaded.get(id));
 renderPlayer();
}
// Keeps a situation's files (and the catalogue's words) for offline play once it has been opened.
async function keepOffline(id,timing){
 if(!('caches' in window))return;
 try{const cache=await caches.open(CACHE);
  for(const file of [`src/scenarios/${id}.js`,`data/scenarios/${id}.json`,`assets/audio/scenarios/${id}/clips.json`,'data/catalog.json','assets/audio/catalog/clips.json',...Object.values(timing).map(c=>c.file),...Object.values(words).map(c=>c.file)])await cache.add(new Request(url(file),{cache:'no-cache'})).catch(()=>{});
 }catch{}
}
function renderPlayer(){
 stopGames();
 root.innerHTML=`<div class="story-player game-player">
 <div class="story-bar"><button class="round-button" id="game-back" aria-label="Back to games">${icon('left')}</button><div class="story-title"><span class="hanzi" lang="zh-Hans">${escape(game.title)}</span><small>${escape(game.english)}</small></div><button class="round-button" id="game-restart" aria-label="Start again">${icon('again')}</button></div>
 <div class="story-stage">${scene.firstScene()}<div class="story-start"><button class="story-play" id="game-play" aria-label="Start">${icon('play')}</button></div></div>
 <div class="story-line" hidden><span class="story-avatar" aria-hidden="true"></span><div class="story-words"><p class="hanzi" lang="zh-Hans"></p><p class="pinyin" lang="zh-Latn"></p><p class="meaning"></p></div><button class="round-button story-replay" id="game-replay" aria-label="Hear it again">${icon('speaker')}</button></div>
 <div class="game-panel" hidden></div>
 <div class="story-end" hidden></div></div>`;
 $('#game-back').onclick=showMenu;
 $('#game-restart').onclick=()=>{renderPlayer();begin();};
 $('#game-play').onclick=begin;
 $('#game-replay').onclick=()=>{if(current&&!finishLine)play(current,token).catch(()=>{});};
}
function begin(){
 $('.story-start')?.remove();
 // Bring the whole game (picture, line and cards) into view.
 const bar=$('.story-bar');if(bar)scrollTo({top:bar.getBoundingClientRect().top+scrollY-8});
 const t=++token;
 scene.play(api,t).then(()=>finish(t)).catch(error=>{if(!(error instanceof Stopped))throw error;});
}
async function changeScene(t,svg,setup=()=>{}){
 const s=$('.story-stage');s.classList.add('scene-out');await wait(450,t);
 s.querySelector('.story-svg').outerHTML=svg;s.className='story-stage';setup(s);
 void s.getBoundingClientRect();s.classList.add('scene-in');await wait(450,t);s.classList.remove('scene-in');
}

// ---- Saying a line ----
// A clip is a situation's line or sentence (by key), or a catalogue word ('word:animals-monkey').
const clipOf=key=>key.startsWith('word:')?(words[key.slice(5)]&&{...words[key.slice(5)],speaker:'narrator'}):clips[key];
const voiceOf=speaker=>speaker&&speaker!=='narrator'?game.voices[speaker]||NARRATOR:NARRATOR;
function showLine(key){
 const clip=clipOf(key),box=$('.story-line'),voice=voiceOf(clip.speaker);
 box.hidden=false;box.dataset.speaker=clip.speaker||'narrator';
 const avatar=box.querySelector('.story-avatar');
 avatar.innerHTML=scene.avatars[clip.speaker]||mascot('happy','story-avatar-art');
 avatar.style.background=voice.tint||'';
 box.querySelector('.hanzi').innerHTML=chars(clip.text);
 box.querySelector('.pinyin').textContent=clip.pinyin||'';
 box.querySelector('.meaning').textContent=clip.english||'';
}
function play(key,t){
 alive(t);
 const clip=clipOf(key);if(!clip)throw new Error(`No clip called ${key}`);
 const voice=voiceOf(clip.speaker);
 finishLine?.(false);current=key;showLine(key);
 return new Promise(resolve=>{
  let settled=false;
  const done=ok=>{if(settled)return;settled=true;finishLine=null;audio.onended=audio.onerror=null;cancelAnimationFrame(frame);root?.querySelectorAll('.story-line .speaking').forEach(e=>e.classList.remove('speaking'));resolve(ok);};
  finishLine=done;audio.onended=()=>done(true);audio.onerror=()=>done(false);
  audio.src=url(clip.file);audio.preservesPitch=audio.webkitPreservesPitch=voice.keep;audio.defaultPlaybackRate=audio.playbackRate=voice.rate;
  audio.play().then(()=>{audio.playbackRate=voice.rate;karaoke(clip);}).catch(()=>done(false));
 }).then(async ok=>{alive(t);if(!ok)await wait(400+units(clip.text).length*240,t);});
}
function karaoke(clip){
 const list=units(clip.text),spans=$$('.story-line .hanzi .ch'),weights=list.map(u=>/^\s$/.test(u)?.3:PAUSE.test(u)?1.5:/^[A-Za-z]/.test(u)?Math.max(1,u.length*.3):1),total=weights.reduce((a,b)=>a+b,0);
 const tick=()=>{
  let index=-1;const [s,e]=clip.speech||[0,audio.duration||1];
  if(audio.currentTime>=s){let reach=Math.min(1,(audio.currentTime-s)/(e-s))*total;for(let i=0;i<list.length;i++){reach-=weights[i];if(reach<0||i===list.length-1){index=i;break;}}}
  spans.forEach((el,i)=>el.classList.toggle('speaking',i===index&&!PAUSE.test(list[i])));
  if(!audio.paused&&!audio.ended)frame=requestAnimationFrame(tick);
 };
 tick();
}
const praise=key=>playUrl(audio,url(`assets/audio/praise-${key}.m4a`),{rate:NARRATOR.rate});
function waitFor(t,setup){
 alive(t);
 return new Promise(resolve=>{let cleanup=null,over=false;const done=value=>{if(over)return;over=true;cleanup?.();cancelWait=null;resolve(value);};cancelWait=()=>done(null);cleanup=setup(done);if(over)cleanup?.();}).then(value=>{alive(t);return value;});
}
const panel=html=>{const p=$('.game-panel');p.hidden=!html;p.innerHTML=html||'';return p;};
// A talking card: its picture (if any), its words, and a speaker mark.
const card=(o,extra='')=>`<button class="say-card" data-key="${escape(o.key)}" ${extra}>${o.art?`<span class="say-card-pic">${o.art}</span>`:''}<span class="hanzi" lang="zh-Hans">${escape(o.label??clipOf(o.key).text)}</span><span class="say-card-play" aria-hidden="true">${icon('speaker')}</span></button>`;

// choose: which reply fits? Each card says itself; the right one resolves, the others shake and say 再试试.
function choose(t,{options,answer,prompt}){
 panel(`<div class="say-cards">${shuffle(options).map(o=>card(o)).join('')}</div>`);
 return waitFor(t,done=>{
  let misses=0,busy=false;
  const on=async e=>{
   const b=e.target.closest('.say-card');if(!b||busy)return;busy=true;
   const key=b.dataset.key;
   try{await play(key,t);}catch{return;}
   if(key===answer){b.classList.add('right');chime('ding');done(key);return;}
   // A wrong one: shake, 再试试, and (unless she taps again first) the question once more. She can tap again
   // straight away.
   misses++;replay(b,'nope');chime('oops');busy=false;
   if(misses>=2)$(`.say-card[data-key="${CSS.escape(answer)}"]`)?.classList.add('hint');
   const asked=current;praise('again').then(()=>{if(prompt&&!finishLine&&current===asked&&t===token)play(prompt,t).catch(()=>{});});
  };
  const p=$('.game-panel');p.addEventListener('click',on);
  return ()=>p.removeEventListener('click',on);
 }).then(key=>{panel('');return key;});
}
// build: the sentence's parts, in order, from a tray of talking cards (with a few that do not belong).
function build(t,{sentence,parts,extras=[]}){
 const tray=shuffle([...parts.map((p,i)=>({...p,slot:i})),...extras.map(p=>({...p,slot:-1}))]);
 panel(`<div class="build-slots">${parts.map((p,i)=>`<span class="build-slot2" data-slot="${i}"></span>`).join('')}</div><div class="say-cards build-tray">${tray.map((p,i)=>card(p,`data-tile="${i}"`)).join('')}</div>`);
 return waitFor(t,done=>{
  let next=0,misses=0,busy=false;
  const on=async e=>{
   const b=e.target.closest('.say-card');if(!b||busy||b.classList.contains('placed'))return;busy=true;
   const tile=tray[Number(b.dataset.tile)];
   try{await play(tile.key,t);}catch{return;}
   busy=false;
   if(tile.slot===next||(tile.slot>=0&&parts[tile.slot].key===parts[next].key)){
    const slot=$(`.build-slot2[data-slot="${next}"]`);slot.innerHTML=b.innerHTML;slot.classList.add('filled');b.classList.add('placed');chime('ding');next++;
    if(next===parts.length)done(true);
   }else{misses++;replay(b,'nope');chime('oops');if(misses>=2){const want=tray.findIndex(p=>p.slot===next);$(`.say-card[data-tile="${want}"]`)?.classList.add('hint');}}
  };
  const p=$('.game-panel');p.addEventListener('click',on);
  return ()=>p.removeEventListener('click',on);
 }).then(async()=>{await wait(300,t);await play(sentence,t);await wait(200,t);panel('');});
}
// speak: her turn to say it. Her recording plays, then the right one, so she can hear the difference; she can
// try again as often as she likes, then move on. Nothing is judged, saved or sent anywhere.
function speak(t,key){
 if(!canRecord())return Promise.resolve();
 showLine(key);$('.story-line').classList.add('your-turn');
 panel(`<div class="speak-panel"><button class="speak-mic" id="speak-mic" aria-label="Say it">${icon('mic')}</button><div class="speak-compare" hidden><button class="speak-hear" id="hear-mine">${icon('speaker')}<span>Me</span></button><button class="speak-hear" id="hear-right">${icon('speaker')}<span lang="zh-Hans">${escape(clipOf(key).text)}</span></button></div><button class="speak-next" id="speak-next" aria-label="Next">${icon('right')}</button></div>`);
 let take=null;
 return waitFor(t,done=>{
  const mic=$('#speak-mic');let busy=false;
  const compare=async()=>{
   $('.speak-compare').hidden=false;
   $('#hear-mine').classList.add('playing');await playUrl(mine,take);$('#hear-mine').classList.remove('playing');
   if(t!==token)return;await new Promise(r=>setTimeout(r,250));
   $('#hear-right')?.classList.add('playing');await play(key,t).catch(()=>{});$('#hear-right')?.classList.remove('playing');
  };
  mic.onclick=async()=>{
   if(busy){stopRecording();return;}
   busy=true;audio.pause();mine.pause();mic.classList.add('recording');
   const blob=await record(level=>mic.style.setProperty('--level',level.toFixed(2)));
   mic.classList.remove('recording');mic.style.setProperty('--level',0);busy=false;
   if(t!==token)return;
   if(!blob){if(!canRecord())done();return;}
   if(take)URL.revokeObjectURL(take);take=URL.createObjectURL(blob);
   mic.classList.add('again');await compare();
  };
  $('#hear-mine').onclick=()=>take&&playUrl(mine,take);
  $('#hear-right').onclick=()=>play(key,t).catch(()=>{});
  $('#speak-next').onclick=()=>done();
  return ()=>{stopRecording();mic.onclick=null;mine.pause();};
 }).then(()=>{$('.story-line').classList.remove('your-turn');if(take)URL.revokeObjectURL(take);panel('');});
}
// pay: tap one-dollar coins into the hand until the total is paid; each coin is counted aloud.
function pay(t,{total,coinArt,countKey}){
 panel(`<div class="pay-panel"><div class="pay-tray" aria-label="Paid">${Array.from({length:total},()=>'<span class="pay-spot"></span>').join('')}</div><div class="pay-purse">${Array.from({length:Math.min(12,total+3)},(_,i)=>`<button class="pay-coin" data-coin="${i}" aria-label="One dollar">${coinArt}</button>`).join('')}</div></div>`);
 return waitFor(t,done=>{
  let paid=0,busy=false;
  const on=async e=>{
   const b=e.target.closest('.pay-coin');if(!b||busy||b.classList.contains('spent'))return;busy=true;
   b.classList.add('spent');const spot=$$('.pay-spot')[paid];spot.innerHTML=coinArt;spot.classList.add('filled');paid++;
   try{await play(countKey(paid),t);}catch{return;}
   busy=false;if(paid===total){chime('yay');done();}
  };
  const p=$('.game-panel');p.addEventListener('click',on);
  return ()=>p.removeEventListener('click',on);
 }).then(()=>panel(''));
}
const move=(name,x,y,ms=1200,scale=1)=>{const el=$(`.actor-${name}`);if(!el)return;el.style.transitionDuration=ms+'ms';el.style.transform=`translate(${x}px,${y}px)${scale===1?'':` scale(${scale})`}`;if(ms){el.classList.add('walking');setTimeout(()=>el.classList.remove('walking'),ms);}else void el.getBoundingClientRect();};
const flag=(name,on=true)=>$('.story-stage').classList.toggle(name,on);
// Waits for a tap on something in the picture (an animal at a window, say); a wrong one shakes.
function tapIn(t,selector,check){
 return waitFor(t,done=>{const on=e=>{const el=e.target.closest(selector);if(!el)return;if(check(el))done(el);else{replay(el,'nope');chime('oops');}};const s=$('.story-stage');s.addEventListener('click',on);return ()=>s.removeEventListener('click',on);});
}

// Everything a situation's script can use.
const api={
 say:play,wait,choose,build,speak,pay,tapIn,move,flag,replay,changeScene,chime,shuffle,
 stage:()=>$('.story-stage'),catalog:()=>catalog,clip:clipOf,has:key=>!!clipOf(key),
 word:(list,id)=>`word:${list}-${id}`
};
function finish(t){
 alive(t);celebrate(true);chime('fanfare');current=null;panel('');
 $('.story-line').hidden=true;
 const end=$('.story-end');end.hidden=false;
 end.innerHTML=`<h2 lang="zh-Hans">太棒了！</h2><div class="game-actions"><button class="button primary" id="game-again">${icon('again')} Play again</button><button class="button secondary" id="game-list">More games</button></div>`;
 $('#game-again').onclick=()=>{renderPlayer();begin();};
 $('#game-list').onclick=showMenu;
 end.scrollIntoView({behavior:'smooth',block:'nearest'});
}
