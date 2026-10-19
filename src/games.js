// Games: simple, fun games like Feed the animal. Each round she hears one everyday sentence, makes one tap, and
// something funny happens: the food flies into the mouth, the coat lands on the rabbit, the toy bounces into the
// box. Rounds are short and the words are picked at random from the catalogue (data/catalog.json), so adding a
// food or a toy puts it into every game that uses that list. After each round a small 🎤 lets her say the
// sentence and hear hers next to the right one; it never holds the game up.
// Each game is a module in src/games/ with its sentences in data/games/; a game loads only when it is opened.
import {chime} from './sfx.js';
import {icon,mascot} from './icons.js';
import {record,canRecord,stopRecording,playUrl} from './recorder.js';

const CACHE='learnchinese-v1';
export const GAMES=[
 {id:'feed',title:'喂动物',english:'Feed the animals'},
 {id:'dress',title:'穿衣服',english:'Dress up'},
 {id:'bath',title:'洗澡',english:'Bath time'},
 {id:'tidy',title:'收玩具',english:'Tidy up'},
 {id:'kitchen',title:'做饭',english:'The silly kitchen'},
 {id:'says',title:'熊猫在做什么？',english:'What’s the panda doing?'},
 {id:'drive',title:'开车去',english:'Drive there'}
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
let game=null,module=null,clips={},catalog=null,current=null;
const loaded=new Map();
class Stopped extends Error{}
const alive=t=>{if(t!==token)throw new Stopped();};
const wait=(ms,t)=>new Promise(resolve=>setTimeout(resolve,ms)).then(()=>alive(t));
const $=selector=>root.querySelector(selector);
const replay=(el,cls)=>{if(!el)return;el.classList.remove(cls);void el.getBoundingClientRect();el.classList.add(cls);};

export function mountGames(element,options){root=element;celebrate=options.celebrate;showMenu();}
export function stopGames(){token++;cancelWait?.();stopRecording();audio?.pause();mine?.pause();finishLine?.(false);cancelAnimationFrame(frame);}

function showMenu(){
 stopGames();
 root.innerHTML=`<div class="story-menu games-list">${GAMES.map(g=>`<button class="story-card" data-game="${g.id}"><img class="story-cover" src="${url(`assets/games/${g.id}-cover.svg`)}" alt="" loading="lazy"><span class="story-card-text"><span class="hanzi" lang="zh-Hans">${escape(g.title)}</span><span class="story-card-name">${escape(g.english)}</span></span><span class="story-card-play" aria-hidden="true">${icon('play')}</span></button>`).join('')}</div>`;
 root.querySelectorAll('[data-game]').forEach(b=>b.onclick=()=>openGame(b.dataset.game).catch(()=>b.classList.add('failed')));
}
const getJson=path=>fetch(url(path)).then(r=>r.json());
async function openGame(id){
 catalog??=await getJson('data/catalog.json');
 if(!loaded.has(id)){
  const [text,mod,timing]=await Promise.all([getJson(`data/games/${id}.json`),import(`./games/${id}.js`),getJson(`assets/audio/games/${id}/clips.json`)]);
  loaded.set(id,{text,module:mod.default,timing});
  if(mod.default.css&&!document.querySelector(`style[data-game="${id}"]`)){const style=document.createElement('style');style.dataset.game=id;style.textContent=mod.default.css;document.head.append(style);}
  keepOffline(id,timing);
 }
 ({text:game,module,timing:clips}=loaded.get(id));
 renderPlayer();
}
// Keeps a game's files for offline play once it has been opened.
async function keepOffline(id,timing){
 if(!('caches' in window))return;
 try{const cache=await caches.open(CACHE);
  for(const file of [`src/games/${id}.js`,`data/games/${id}.json`,`assets/audio/games/${id}/clips.json`,'data/catalog.json',...Object.values(timing).map(c=>c.file)])await cache.add(new Request(url(file),{cache:'no-cache'})).catch(()=>{});
 }catch{}
}
function renderPlayer(){
 stopGames();
 root.innerHTML=`<div class="story-player game-player">
 <div class="story-bar"><button class="round-button" id="game-back" aria-label="Back to games">${icon('left')}</button><div class="story-title"><span class="hanzi" lang="zh-Hans">${escape(game.title)}</span><small>${escape(game.english)}</small></div><button class="round-button" id="game-restart" aria-label="Start again">${icon('again')}</button></div>
 <div class="story-stage">${module.scene(catalog)}<div class="story-start"><button class="story-play" id="game-play" aria-label="Start">${icon('play')}</button></div></div>
 <div class="story-line" hidden><span class="story-avatar" aria-hidden="true"></span><div class="story-words"><p class="hanzi" lang="zh-Hans"></p><p class="pinyin" lang="zh-Latn"></p><p class="meaning"></p></div><button class="round-button story-replay" id="game-replay" aria-label="Hear it again">${icon('speaker')}</button></div>
 <div class="game-panel" hidden></div>
 <div class="pop-progress game-dots"></div>
 <div class="story-end" hidden></div></div>`;
 $('#game-back').onclick=showMenu;
 $('#game-restart').onclick=()=>{renderPlayer();begin();};
 $('#game-play').onclick=begin;
 $('#game-replay').onclick=()=>{if(current&&!finishLine)say(current,token).catch(()=>{});};
}
function begin(){
 $('.story-start')?.remove();
 // Bring the whole game (picture, line and cards) into view.
 const bar=$('.story-bar');if(bar)scrollTo({top:bar.getBoundingClientRect().top+scrollY-8});
 const t=++token;
 module.play(api,t).then(()=>finish(t)).catch(error=>{if(!(error instanceof Stopped))throw error;});
}

// ---- Saying a line, with the karaoke highlight ----
const voiceOf=speaker=>speaker&&speaker!=='narrator'?game.voices[speaker]||NARRATOR:NARRATOR;
function showLine(key){
 const clip=clips[key],box=$('.story-line'),voice=voiceOf(clip.speaker);
 box.hidden=false;
 const avatar=box.querySelector('.story-avatar');
 avatar.innerHTML=module.avatars?.[clip.speaker]||mascot('happy','story-avatar-art');
 avatar.style.background=voice.tint||'';
 box.querySelector('.hanzi').innerHTML=chars(clip.text);
 box.querySelector('.pinyin').textContent=clip.pinyin||'';
 box.querySelector('.meaning').textContent=clip.english||'';
}
function say(key,t){
 alive(t);
 const clip=clips[key];if(!clip)throw new Error(`No clip called ${key}`);
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
 const list=units(clip.text),spans=[...root.querySelectorAll('.story-line .hanzi .ch')],weights=list.map(u=>/^\s$/.test(u)?.3:PAUSE.test(u)?1.5:/^[A-Za-z]/.test(u)?Math.max(1,u.length*.3):1),total=weights.reduce((a,b)=>a+b,0);
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

// ---- Tapping the answer ----
// Listens for taps on `selector` (inside `within`) from the moment it is asked, even while the sentence is still
// being said. A wrong tap shakes and says 再试试, then the sentence again; after two misses the right one glows.
function listen(t,{within,selector,isRight,prompt,hint}){
 return waitFor(t,done=>{
  let misses=0;
  const on=e=>{
   const el=e.target.closest(selector);if(!el||el.classList.contains('gone'))return;
   if(isRight(el)){chime('ding');done(el);return;}
   misses++;replay(el,'nope');chime('oops');
   const asked=current;praise('again').then(()=>{if(prompt&&!finishLine&&current===asked&&t===token)say(prompt,t).catch(()=>{});});
   if(misses>=2)hint?.();
  };
  within.addEventListener('click',on);
  return ()=>within.removeEventListener('click',on);
 });
}
// Picture cards under the stage: hear the sentence, tap the right picture.
async function ask(t,{say:key,options,answer}){
 panel(`<div class="pick-cards">${shuffle(options).map(o=>`<button class="pick-card" data-id="${escape(o.id)}">${o.art}</button>`).join('')}</div>`);
 const chosen=listen(t,{within:$('.game-panel'),selector:'.pick-card',isRight:el=>el.dataset.id===answer,prompt:key,hint:()=>$(`.pick-card[data-id="${CSS.escape(answer)}"]`)?.classList.add('hint')});
 say(key,t).catch(()=>{});
 const el=await chosen;
 return el;
}
// Something to tap in the picture itself (a part of the piglet, a place in the room).
// `quiet` waits for the tap without saying the sentence again (the second tap of a two-tap round).
async function askIn(t,{say:key,selector,isRight,hint,quiet=false}){
 const chosen=listen(t,{within:$('.story-stage'),selector,isRight,prompt:key,hint});
 if(!quiet)say(key,t).catch(()=>{});
 return chosen;
}
// The picked thing flies in an arc from where she tapped to a spot on a target (a mouth, a box).
function fly(t,fromEl,svg,toEl,[fx,fy]=[.5,.5]){
 return new Promise(resolve=>{
  if(!fromEl||!toEl||matchMedia('(prefers-reduced-motion: reduce)').matches){resolve();return;}
  const from=fromEl.getBoundingClientRect(),to=toEl.getBoundingClientRect();
  const x=to.left+to.width*fx,y=to.top+to.height*fy,dx=x-(from.left+from.width/2),dy=y-(from.top+from.height/2);
  const thing=document.createElement('div');thing.className='flying-food';thing.innerHTML=svg;
  Object.assign(thing.style,{left:from.left+'px',top:from.top+'px',width:from.width+'px',height:from.height+'px'});document.body.append(thing);
  thing.animate([{transform:'translate(0,0) scale(1)'},{transform:`translate(${dx*.45}px,${dy*.45-90}px) scale(.7) rotate(-12deg)`,offset:.5},{transform:`translate(${dx}px,${dy}px) scale(.25) rotate(10deg)`}],{duration:800,easing:'cubic-bezier(.45,0,.55,1)'})
   .finished.then(()=>{thing.remove();resolve();}).catch(()=>{thing.remove();resolve();});
 }).then(()=>alive(t));
}
// After a round: a small 🎤 to say the sentence and hear hers, then the right one. If she doesn't tap it, the
// game moves on by itself after a few seconds; if she does, she taps ▶ when she is ready.
function sayIt(t,key){
 if(!canRecord())return wait(1200,t);
 panel(`<div class="sayit"><button class="sayit-mic" id="sayit-mic" aria-label="Say it">${icon('mic')}</button><div class="sayit-compare" hidden><button class="sayit-hear" id="hear-mine">${icon('speaker')}<span>Me</span></button><button class="sayit-hear" id="hear-right">${icon('speaker')}<span lang="zh-Hans">${escape(clips[key].text)}</span></button></div><button class="sayit-next" id="sayit-next" aria-label="Next">${icon('right')}</button><span class="sayit-timer"></span></div>`);
 let take=null;
 return waitFor(t,done=>{
  const mic=$('#sayit-mic');let busy=false,auto=setTimeout(()=>done(),4500);
  $('.sayit-timer').style.animationDuration='4.5s';
  mic.onclick=async()=>{
   clearTimeout(auto);$('.sayit').classList.add('held');
   if(busy){stopRecording();return;}
   busy=true;audio.pause();mine.pause();mic.classList.add('recording');
   const blob=await record(level=>mic.style.setProperty('--level',level.toFixed(2)));
   mic.classList.remove('recording');mic.style.setProperty('--level',0);busy=false;
   if(t!==token||!blob)return;
   if(take)URL.revokeObjectURL(take);take=URL.createObjectURL(blob);
   $('.sayit-compare').hidden=false;
   $('#hear-mine').classList.add('playing');await playUrl(mine,take);$('#hear-mine')?.classList.remove('playing');
   if(t!==token)return;await new Promise(r=>setTimeout(r,250));
   $('#hear-right')?.classList.add('playing');await say(key,t).catch(()=>{});$('#hear-right')?.classList.remove('playing');
  };
  $('#hear-mine').onclick=()=>take&&playUrl(mine,take);
  $('#hear-right').onclick=()=>say(key,t).catch(()=>{});
  $('#sayit-next').onclick=()=>done();
  return ()=>{clearTimeout(auto);stopRecording();mic.onclick=null;mine.pause();};
 }).then(()=>{if(take)URL.revokeObjectURL(take);panel('');});
}
const dots=(n,done)=>{$('.game-dots').innerHTML=Array.from({length:n},(_,i)=>`<span class="pop-dot ${i<done?'on':''}"></span>`).join('');};
const flag=(name,on=true)=>$('.story-stage').classList.toggle(name,on);
const move=(name,x,y,ms=1200,scale=1)=>{const el=$(`.actor-${name}`);if(!el)return;el.style.transitionDuration=ms+'ms';el.style.transform=`translate(${x}px,${y}px)${scale===1?'':` scale(${scale})`}`;if(ms){el.classList.add('walking');setTimeout(()=>el.classList.remove('walking'),ms);}else void el.getBoundingClientRect();};

// Everything a game's script can use.
const api={say,wait,ask,askIn,fly,sayIt,dots,flag,move,replay,chime,shuffle,panel,stage:()=>$('.story-stage'),catalog:()=>catalog,has:key=>!!clips[key]};
function finish(t){
 alive(t);celebrate(true);chime('fanfare');current=null;panel('');
 $('.story-line').hidden=true;
 const end=$('.story-end');end.hidden=false;
 end.innerHTML=`<h2 lang="zh-Hans">太棒了！</h2><div class="game-actions"><button class="button primary" id="game-again">${icon('again')} Play again</button><button class="button secondary" id="game-list">More games</button></div>`;
 $('#game-again').onclick=()=>{renderPlayer();begin();};
 $('#game-list').onclick=showMenu;
 end.scrollIntoView({behavior:'smooth',block:'nearest'});
}
