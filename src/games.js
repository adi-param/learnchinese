// Games: short games about one topic at a time (actions, daily routine, the body, animals, food), not tied to
// the lessons. Every game is a round of five: the panda says something, she taps, and the right answer comes to
// life. Pop it: pop the balloon with the thing she hears. I spy: find it in a busy picture. Panda wants: give the
// panda what it asks for. Feed the animal: feed each animal the food it likes.
// A topic's words, sentences and recordings load when it is first played, and are then kept for offline use.
import {chime} from './sfx.js';
import {icon,mascot} from './icons.js';

const CACHE='learnchinese-v1';
export const TOPICS=[
 {id:'actions',title:'动作',english:'Actions'},{id:'routine',title:'日常',english:'Daily routine'},{id:'body',title:'身体',english:'Body'},
 {id:'animals',title:'动物',english:'Animals'},{id:'food',title:'食物',english:'Food'}
];
const GAMES=[
 {id:'pop',name:'Pop it',hint:'Hear it, pop it',topics:['actions','routine','body','animals','food']},
 {id:'spy',name:'I spy',hint:'Find it in the picture',topics:['actions','routine','body','animals','food']},
 {id:'want',name:'Panda wants',hint:'Give the panda what it asks for',topics:['actions','routine','body','animals','food']},
 {id:'feed',name:'Feed the animal',hint:'Who likes to eat what?',topics:['animals','food']}
];
const ROUND=5;
const RATE=.85;
const PAUSE=/[\p{P}\s]/u;
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const units=text=>text.match(/[A-Za-z][A-Za-z'’-]*|[\s\S]/gu)||[];
const chars=text=>units(text).map(c=>`<span class="ch">${escape(c)}</span>`).join('');
const url=path=>new URL('../'+path,import.meta.url).href;
const shuffle=list=>{const a=[...list];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
// (No Audio outside a browser, so the tests can read this module's topic list.)
const audio=typeof Audio==='function'?new Audio():null;if(audio)audio.preload='auto';
let root=null,celebrate=()=>{},art=null,token=0,frame=0,finishLine=null;
const topics=new Map();
const store={get(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}},set(key,value){try{localStorage.setItem(key,JSON.stringify(value));}catch{}}};
let chosenTopic=store.get('games-topic','actions');
class Stopped extends Error{}
const alive=t=>{if(t!==token)throw new Stopped();};
const wait=(ms,t)=>new Promise(resolve=>setTimeout(resolve,ms)).then(()=>alive(t));
const $=selector=>root.querySelector(selector);

export async function mountGames(element,options){root=element;celebrate=options.celebrate;art??=await import('./game-art.js');showMenu();}
export function stopGames(){token++;cancelChoose?.();audio.pause();finishLine?.(false);cancelAnimationFrame(frame);}

async function loadTopic(id){
 if(!topics.has(id)){
  const [data,clips]=await Promise.all([fetch(url(`data/topics/${id}.json`)).then(r=>r.json()),fetch(url(`assets/audio/topics/${id}/clips.json`)).then(r=>r.json())]);
  topics.set(id,{...data,timing:clips});keepOffline(id,clips);
 }
 return topics.get(id);
}
// Keeps a topic's files for offline play, in the background, once it has been played.
async function keepOffline(id,clips){
 if(!('caches' in window))return;
 try{const cache=await caches.open(CACHE);for(const file of [`data/topics/${id}.json`,`assets/audio/topics/${id}/clips.json`,...Object.values(clips).map(c=>c.file)])await cache.add(new Request(url(file),{cache:'no-cache'})).catch(()=>{});}catch{}
}

// ---- The menu: a topic, then a game ----
function showMenu(){
 stopGames();
 const topic=TOPICS.find(t=>t.id===chosenTopic)||TOPICS[0];
 root.innerHTML=`<div class="topic-row" role="group" aria-label="Choose a topic">${TOPICS.map(t=>`<button class="topic-chip ${t.id===topic.id?'active':''}" data-topic="${t.id}" aria-pressed="${t.id===topic.id}"><span class="topic-pic">${art.topicIcon[t.id]}</span><span class="hanzi" lang="zh-Hans">${t.title}</span><small>${t.english}</small></button>`).join('')}</div>
 <div class="games-menu">${GAMES.filter(g=>g.topics.includes(topic.id)).map((g,n)=>`<button class="game-tile tone-${n%5}" data-game="${g.id}"><span class="game-art" aria-hidden="true">${gameArt(g.id,topic.id)}</span><span class="game-name">${g.name}</span><span class="game-hint">${g.hint}</span></button>`).join('')}</div>`;
 root.querySelectorAll('[data-topic]').forEach(b=>b.onclick=()=>{chosenTopic=b.dataset.topic;store.set('games-topic',chosenTopic);showMenu();});
 root.querySelectorAll('[data-game]').forEach(b=>b.onclick=()=>startGame(b.dataset.game,topic.id).catch(()=>b.classList.add('failed')));
}
const balloon=(colour,inner='')=>`<svg class="balloon-art" viewBox="0 0 100 150" aria-hidden="true"><path d="M50 122q-6 12 2 26" fill="none" stroke="#1f1b3a" stroke-width="3"/><path d="M50 116C22 102 8 76 8 52A42 42 0 0 1 92 52C92 76 78 102 50 116Z" fill="${colour}" stroke="#1f1b3a" stroke-width="4"/><path d="M44 122h12l-6-7z" fill="${colour}" stroke="#1f1b3a" stroke-width="3" stroke-linejoin="round"/><ellipse cx="32" cy="36" rx="7" ry="13" fill="#fff" opacity=".4" transform="rotate(25 32 36)"/>${inner}</svg>`;
function gameArt(game,topic){
 if(game==='pop')return `<span class="menu-balloons">${['#7c5cff','#ff7a45','#12a879'].map(c=>balloon(c)).join('')}</span>`;
 if(game==='spy')return `<span class="menu-spy">${art.topicIcon[topic]}<svg class="menu-glass" viewBox="0 0 40 40"><circle cx="16" cy="16" r="11" fill="#fff" fill-opacity=".5" stroke="#1f1b3a" stroke-width="4"/><path d="M24 24l11 11" stroke="#1f1b3a" stroke-width="6" stroke-linecap="round"/></svg></span>`;
 if(game==='want')return `<span class="menu-duo">${mascot('happy','menu-panda')}<span class="menu-pic">${art.topicIcon[topic]}</span></span>`;
 return `<span class="menu-duo"><span class="menu-pic">${art.animalPicture('monkey')}</span><span class="menu-pic">${art.foodPicture('banana')}</span></span>`;
}

// ---- Shared pieces of a game screen ----
function frameHtml(game,topic,stage){
 const g=GAMES.find(x=>x.id===game),tp=TOPICS.find(x=>x.id===topic);
 return `<div class="match-bar"><button class="back-button" id="games-back">${icon('left')}Games</button><span class="level-pill"><span lang="zh-Hans">${game==='feed'?'动物':tp.title}</span> · ${g.name}</span></div>
 <div class="game-play game-${game}">${stage}
 <div class="game-line"><span class="game-line-panda" aria-hidden="true">${mascot('happy','game-line-mascot')}</span><div class="story-words"><p class="hanzi" lang="zh-Hans"></p><p class="pinyin" lang="zh-Latn"></p><p class="meaning"></p></div><button class="round-button story-replay" id="game-replay" aria-label="Hear it again">${icon('speaker')}</button></div>
 <div class="pop-progress">${Array.from({length:ROUND},()=>'<span class="pop-dot"></span>').join('')}</div></div>`;
}
const setDots=done=>root.querySelectorAll('.pop-dot').forEach((d,i)=>d.classList.toggle('on',i<done));
let lastSaid=null;
function showLine(clip){
 const box=$('.game-line');if(!box)return;
 box.querySelector('.hanzi').innerHTML=chars(clip.hanzi);box.querySelector('.pinyin').textContent=clip.pinyin;box.querySelector('.meaning').textContent=clip.english;
}
// Says one of a topic's clips, with the karaoke highlight; resolves when it has been said (or, if the sound
// cannot play, after about as long as it would take).
function say(topic,key,t){
 alive(t);
 const tp=topics.get(topic),clip=tp.clips[key],timing=tp.timing[key];
 finishLine?.(false);lastSaid=[topic,key];showLine(clip);
 return new Promise(resolve=>{
  let settled=false;
  const done=ok=>{if(settled)return;settled=true;finishLine=null;audio.onended=audio.onerror=null;cancelAnimationFrame(frame);root?.querySelectorAll('.game-line .speaking').forEach(e=>e.classList.remove('speaking'));resolve(ok);};
  finishLine=done;audio.onended=()=>done(true);audio.onerror=()=>done(false);
  audio.src=url(timing.file);audio.preservesPitch=audio.webkitPreservesPitch=true;audio.defaultPlaybackRate=audio.playbackRate=RATE;
  audio.play().then(()=>{audio.playbackRate=RATE;karaoke(clip.hanzi,timing.speech);}).catch(()=>done(false));
 }).then(async ok=>{alive(t);if(!ok)await wait(400+units(clip.hanzi).length*260,t);});
}
function karaoke(text,span){
 const list=units(text),spans=[...root.querySelectorAll('.game-line .hanzi .ch')],weights=list.map(u=>PAUSE.test(u)?1.5:1),total=weights.reduce((a,b)=>a+b,0);
 const tick=()=>{
  let index=-1;const [s,e]=span||[0,audio.duration||1];
  if(audio.currentTime>=s){let reach=Math.min(1,(audio.currentTime-s)/(e-s))*total;for(let i=0;i<list.length;i++){reach-=weights[i];if(reach<0||i===list.length-1){index=i;break;}}}
  spans.forEach((el,i)=>el.classList.toggle('speaking',i===index&&!PAUSE.test(list[i])));
  if(!audio.paused&&!audio.ended)frame=requestAnimationFrame(tick);
 };
 tick();
}
const praiseKey=()=>`right-${1+Math.floor(Math.random()*3)}`;
function praise(key,t){
 finishLine?.(false);
 return new Promise(resolve=>{audio.onended=audio.onerror=()=>resolve();audio.src=url(`assets/audio/praise-${key}.m4a`);audio.preservesPitch=audio.webkitPreservesPitch=true;audio.defaultPlaybackRate=audio.playbackRate=RATE;audio.play().catch(()=>resolve());}).then(()=>alive(t));
}
// Each topic's words take turns: the least recently asked come first, remembered across visits.
function pick(topic,pool,count){
 const seen=store.get('games-seen',{}),age=item=>seen[topic+':'+item.id]??-1;
 const chosen=pool.map(item=>({item,key:age(item)+Math.random()*.5})).sort((a,b)=>a.key-b.key).slice(0,count).map(x=>x.item);
 let clock=seen.clock||0;chosen.forEach(item=>{seen[topic+':'+item.id]=++clock;});seen.clock=clock;store.set('games-seen',seen);
 return chosen;
}
const replay=(el,cls)=>{if(!el)return;el.classList.remove(cls);void el.getBoundingClientRect();el.classList.add(cls);};
// Waits for a tap on one of `selector`; `check(el)` says whether it is the right one. A wrong tap shakes and
// says 再试试; after two, the right one glows. Resolves with the element tapped right.
function choose(t,selector,check,{again,hint}={}){
 alive(t);
 return new Promise(resolve=>{
  let misses=0;
  const on=e=>{
   const el=e.target.closest(selector);if(!el||el.disabled||t!==token)return;
   if(check(el)){root.removeEventListener('click',on);resolve(el);return;}
   misses++;chime('oops');replay(el,'nope');again?.(el);
   praise('again',t).then(()=>hint?.(misses)).catch(()=>{});
  };
  root.addEventListener('click',on);
  const stop=()=>root.removeEventListener('click',on);cancelChoose=()=>{stop();resolve(null);};
 }).then(el=>{cancelChoose=null;alive(t);return el;});
}
let cancelChoose=null;
function finishRound(t,game,topic,words){
 alive(t);celebrate(true);chime('fanfare');
 setTimeout(()=>{
  if(t!==token)return;
  root.querySelector('.game-play').innerHTML=`<div class="recap"><h2 lang="zh-Hans">太棒了！</h2><p class="meaning">Words from this game. Tap one to hear it.</p>
  <div class="story-word-grid">${words.map(w=>`<button class="story-word" data-word="${w.id}"><span class="story-word-pic">${art.picture(topic,w)}</span><span class="hanzi" lang="zh-Hans">${escape(w.hanzi)}</span><span class="pinyin" lang="zh-Latn">${escape(w.pinyin)}</span><span class="meaning">${escape(w.english)}</span></button>`).join('')}</div>
  <div class="game-actions"><button class="button primary" id="game-again">${icon('again')} Play again</button><button class="button secondary" id="game-menu">${icon('left')} More games</button></div></div>`;
  root.querySelectorAll('[data-word]').forEach(b=>b.onclick=()=>{say(topic,b.dataset.word,token).catch(()=>{});replay(b,'boing');});
  $('#game-again').onclick=()=>startGame(game,topic);
  $('#game-menu').onclick=showMenu;
 },3800);
}

async function startGame(game,topic){
 stopGames();
 if(game==='feed'){await Promise.all([loadTopic('animals'),loadTopic('food')]);}else await loadTopic(topic);
 const t=++token;
 const run={pop:popIt,spy:iSpy,want:pandaWants,feed:feedTheAnimal}[game];
 run(t,game==='feed'?'animals':topic).catch(error=>{if(!(error instanceof Stopped))throw error;});
}
function bindFrame(){
 $('#games-back').onclick=showMenu;
 $('#game-replay').onclick=()=>{if(lastSaid&&!finishLine)say(lastSaid[0],lastSaid[1],token).catch(()=>{});};
}

// ---- Pop it: the panda says a word; she pops the balloon with its picture ----
const COLOURS=['#7c5cff','#ff7a45','#12a879','#2b8ef0','#f0507a'];
async function popIt(t,topic){
 const tp=topics.get(topic),targets=pick(topic,tp.items,ROUND);
 root.innerHTML=frameHtml('pop',topic,`<div class="pop-stage"><div class="balloons"></div></div>`);bindFrame();
 for(const [n,target] of targets.entries()){
  const count=n<2?3:4,options=shuffle([target,...shuffle(tp.items.filter(i=>i.id!==target.id)).slice(0,count-1)]);
  $('.balloons').innerHTML=options.map((item,k)=>`<button class="balloon pic-balloon" data-id="${item.id}" style="--balloon:${COLOURS[(n+k)%5]};--delay:-${(k*.7).toFixed(1)}s" aria-label="Balloon">${balloon(COLOURS[(n+k)%5])}<span class="balloon-pic">${art.picture(topic,item)}</span></button>`).join('');
  const answer=choose(t,'.balloon',el=>el.dataset.id===target.id,{
   again:el=>{el.classList.add('gone');el.disabled=true;say(topic,target.id,t).catch(()=>{});},
   hint:misses=>{if(misses>=2)root.querySelector(`.balloon[data-id="${target.id}"]`)?.classList.add('hint');}
  });
  await say(topic,target.id,t);const hit=await answer;
  hit.classList.add('popped');hit.insertAdjacentHTML('beforeend',`<span class="burst" aria-hidden="true">${Array.from({length:10},(_,i)=>`<i style="--a:${i*36}deg;--c:${COLOURS[i%5]}"></i>`).join('')}</span>`);
  chime('ding');setDots(n+1);await praise(praiseKey(),t);await say(topic,target.id,t);await wait(500,t);
 }
 finishRound(t,'pop',topic,targets);
}

// ---- I spy: find it in a busy picture ----
async function iSpy(t,topic){
 const tp=topics.get(topic),targets=pick(topic,tp.items,ROUND);
 root.innerHTML=frameHtml('spy',topic,`<div class="spy-stage"></div>`);bindFrame();
 for(const [n,target] of targets.entries()){
  if(topic==='body')$('.spy-stage').innerHTML=art.bodyScene();
  else $('.spy-stage').innerHTML=art.spyScene(topic,shuffle([target,...shuffle(tp.items.filter(i=>i.id!==target.id)).slice(0,5)]));
  const answer=choose(t,'.spy-hit',el=>el.dataset.spy===target.id,{
   again:el=>{replay(root.querySelector(`.spy-thing[data-spy="${el.dataset.spy}"]`),'nope');},
   hint:misses=>{if(misses>=2)root.querySelectorAll(`[data-spy="${target.id}"]`).forEach(e=>e.classList.add('hint'));}
  });
  await say(topic,target.id+'-spy',t);await answer;
  root.querySelectorAll(`[data-spy="${target.id}"]`).forEach(e=>e.classList.add('found'));
  chime('ding');setDots(n+1);await praise(praiseKey(),t);
  await say(topic,tp.clips[target.id+'-done']?target.id+'-done':target.id,t);await wait(500,t);
 }
 finishRound(t,'spy',topic,targets);
}

// ---- Panda wants: the panda asks; she gives it what it wants ----
const bigPanda=pose=>`<svg class="want-panda" viewBox="-44 -70 88 78" aria-hidden="true">${art.panda(pose)}</svg>`;
async function pandaWants(t,topic){
 const tp=topics.get(topic),pool=tp.items.filter(i=>i.want!==false),targets=pick(topic,pool,ROUND);
 const doctor=topic==='body';
 root.innerHTML=frameHtml('want',topic,`<div class="want-stage ${doctor?'doctor':''}"><div class="want-left"></div><div class="want-options"></div></div>`);bindFrame();
 for(const [n,target] of targets.entries()){
  const left=$('.want-left'),opts=$('.want-options');
  if(doctor){
   left.innerHTML=art.bodyScene();opts.innerHTML='';
   const answer=choose(t,'.spy-hit',el=>el.dataset.spy===target.id,{hint:misses=>{if(misses>=2)root.querySelectorAll(`.spy-hit[data-spy="${target.id}"]`).forEach(e=>e.classList.add('hint'));}});
   await say(topic,target.id+'-want',t);await answer;
   root.querySelector('.plasters').innerHTML=art.bodySpots(target.id).map(([x,y])=>art.plaster(x,y)).join('');
   chime('ding');setDots(n+1);await say(topic,'thanks',t);await wait(600,t);continue;
  }
  left.innerHTML=`${bigPanda('stand')}<div class="want-gift"></div>`;
  const choices=shuffle([target,...shuffle(pool.filter(i=>i.id!==target.id)).slice(0,2)]);
  const face=item=>topic==='routine'?art.thingPicture(item.thing):art.picture(topic,item);
  opts.innerHTML=choices.map(item=>`<button class="want-card" data-id="${item.id}">${face(item)}</button>`).join('');
  const answer=choose(t,'.want-card',el=>el.dataset.id===target.id,{hint:misses=>{if(misses>=2)root.querySelector(`.want-card[data-id="${target.id}"]`)?.classList.add('hint');}});
  await say(topic,target.id+'-want',t);const hit=await answer;
  hit.classList.add('chosen');chime('ding');setDots(n+1);
  if(topic==='actions'||topic==='routine'){
   if(topic==='routine')await say(topic,target.id+'-give',t);
   left.querySelector('.want-panda').outerHTML=bigPanda(target.id);replay(left.querySelector('.want-panda'),'acting');
   await say(topic,target.id+'-done',t);
  }else if(topic==='animals'){
   left.querySelector('.want-gift').innerHTML=art.animalPicture(target.id);replay(left.querySelector('.want-gift'),'arrive');
   await say(topic,target.id+'-done',t);
  }else{
   await flyTo(hit,art.foodPicture(target.id),left.querySelector('.want-panda'),[0.5,0.36]);
   await say(topic,'yummy',t);
  }
  await wait(600,t);
 }
 finishRound(t,'want',topic,targets);
}

// ---- Feed the animal: hear who likes to eat what, then feed it ----
async function feedTheAnimal(t){
 const animals=topics.get('animals'),food=topics.get('food'),list=pick('feed',animals.items,ROUND);
 root.innerHTML=frameHtml('feed','animals',`<div class="feed-stage"><div class="eater"><span class="eater-art"></span></div><div class="want-options"></div></div>`);bindFrame();
 const used=[];
 for(const [n,animal] of list.entries()){
  const wanted=animal.likes[Math.floor(Math.random()*animal.likes.length)],liked=food.items.find(f=>f.id===wanted);
  const others=shuffle(food.items.filter(f=>!animal.likes.includes(f.id))).slice(0,2),choices=shuffle([liked,...others]);
  used.push(animal);
  const eater=$('.eater');eater.classList.remove('munch');eater.querySelector('.eater-art').innerHTML=art.animalPicture(animal.id);
  $('.want-options').innerHTML=choices.map(f=>`<button class="want-card" data-id="${f.id}">${art.foodPicture(f.id)}</button>`).join('');
  const answer=choose(t,'.want-card',el=>el.dataset.id===liked.id,{hint:misses=>{if(misses>=2)root.querySelector(`.want-card[data-id="${liked.id}"]`)?.classList.add('hint');}});
  await say('animals',`feed-${animal.id}-${liked.id}`,t);const hit=await answer;
  hit.classList.add('chosen');
  const [mx,my]=art.MOUTHS[animal.id]||[92,44];
  await flyTo(hit,art.foodPicture(liked.id),eater.querySelector('.eater-art'),[mx/120,my/96]);
  eater.classList.add('munch');chime('ding');setDots(n+1);
  await praise(praiseKey(),t);await say('food',liked.id,t);await wait(500,t);
 }
 finishRound(t,'feed','animals',used);
}
// The food she picked flies in an arc into a mouth.
function flyTo(fromEl,svg,toEl,[fx,fy]){
 return new Promise(resolve=>{
  if(!fromEl||!toEl||matchMedia('(prefers-reduced-motion: reduce)').matches){resolve();return;}
  const from=fromEl.getBoundingClientRect(),to=toEl.getBoundingClientRect();
  const x=to.left+to.width*fx,y=to.top+to.height*fy,dx=x-(from.left+from.width/2),dy=y-(from.top+from.height/2);
  const food=document.createElement('div');food.className='flying-food';food.innerHTML=svg;
  Object.assign(food.style,{left:from.left+'px',top:from.top+'px',width:from.width+'px',height:from.height+'px'});document.body.append(food);
  food.animate([{transform:'translate(0,0) scale(1)'},{transform:`translate(${dx*.45}px,${dy*.45-90}px) scale(.7) rotate(-12deg)`,offset:.5},{transform:`translate(${dx}px,${dy}px) scale(.12) rotate(10deg)`}],{duration:800,easing:'cubic-bezier(.45,0,.55,1)'})
   .finished.then(()=>{food.remove();resolve();}).catch(()=>{food.remove();resolve();});
 });
}
