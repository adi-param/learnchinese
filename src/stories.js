// Stories: a picture book that acts itself out. Each line is read aloud with the karaoke highlight, and whatever
// the line names lights up in the picture as it is said. Between lines she does what happens in the story:
// she builds the house, knocks on the door, lets the pigs in and blows (into the microphone, or by tapping the wolf).
// One story moves through several scenes (here, three houses) without stopping; each scene has a short script below.
import {chime} from './sfx.js';
import {icon,mascot} from './icons.js';
import {houseScene,interiorScene,overviewScene,storyPictures,avatars,cover} from './story-art.js';

const STORY='three-pigs';
// Each scene: what the house is made of, who ends up in its window (in the order they get there), and who builds it.
const SCENES={
 straw:{material:'straw',faces:['red'],builder:'red',build:buildStraw,wolf:wolfAtStraw},
 wood:{material:'wood',faces:['yellow','red'],builder:'yellow',build:buildWood,wolf:wolfAtWood},
 brick:{material:'brick',faces:['white','red','yellow'],builder:'white',build:buildBrick,wolf:wolfAtBrick}
};
// One recorded voice acts every part: the wolf plays slower and lower, the pig quicker and higher.
const VOICES={narrator:{rate:.85,keep:true},wolf:{rate:.78,keep:false},pig:{rate:1.22,keep:false}};
const PAUSE=/[\p{P}\s]/u;
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const chars=text=>[...text].map(c=>`<span class="ch">${escape(c)}</span>`).join('');
const url=path=>new URL('../'+path,import.meta.url).href;
const audio=new Audio();audio.preload='auto';
const loaded=new Map();
let root=null,story=null,timings={},celebrate=()=>{};
// `token` changes whenever the story stops or restarts; every step of a running story checks it.
let token=0,current=null,finishLine=null,cancelWait=null,mic=null,frame=0;
class Stopped extends Error{}
const alive=t=>{if(t!==token)throw new Stopped();};
const wait=(ms,t)=>new Promise(resolve=>setTimeout(resolve,ms)).then(()=>alive(t));
const $=selector=>root.querySelector(selector);
const stage=()=>$('.story-stage');
const flag=(name,on=true)=>stage().classList.toggle(name,on);
// Restarts a one-shot CSS animation on an element.
const replay=(el,cls)=>{el.classList.remove(cls);void el.getBoundingClientRect();el.classList.add(cls);};

export function mountStories(element,options){root=element;timings=options.timings;celebrate=options.celebrate;showMenu();}
export function stopStory(){token++;audio.pause();finishLine?.(false);cancelWait?.();stopMic();cancelAnimationFrame(frame);}

async function loadStory(){
 if(!loaded.has(STORY))loaded.set(STORY,await (await fetch(url(`data/stories/${STORY}.json`))).json());
 return story=loaded.get(STORY);
}
async function showMenu(){
 stopStory();await loadStory();
 root.innerHTML=`<div class="story-menu"><button class="story-card" id="open-story"><span class="story-cover">${cover()}</span><span class="story-card-text"><span class="hanzi" lang="zh-Hans">${escape(story.title)}</span><span class="story-card-name">${escape(story.english)}</span><small lang="zh-Hans">${story.scenes.map(sc=>escape(sc.title)).join(' · ')}</small></span><span class="story-card-play" aria-hidden="true">${icon('play')}</span></button></div>`;
 $('#open-story').onclick=renderPlayer;
}
// Which house the story is at, shown as the three house names under the title.
const progressDots=index=>story.scenes.map((sc,i)=>`<span class="story-dot ${i===index?'now':''}" title="${escape(sc.english)}"><span lang="zh-Hans">${escape(sc.title)}</span></span>`).join('');
function renderPlayer(){
 stopStory();bitsGone=0;
 const first=SCENES[story.scenes[0].id];
 root.innerHTML=`<div class="story-player">
 <div class="story-bar"><button class="round-button" id="story-back" aria-label="Back to stories">${icon('left')}</button><div class="story-title"><span class="hanzi" lang="zh-Hans">${escape(story.title)}</span><small>${escape(story.english)}</small><span class="story-dots" aria-hidden="true">${progressDots(0)}</span></div><button class="round-button" id="story-restart" aria-label="Start the story again">${icon('again')}</button></div>
 <div class="story-stage" data-hint="">${houseScene(first.material,first.faces)}
  <button class="story-mic" id="story-mic" hidden aria-label="Blow into the microphone">${icon('mic')}</button>
  <div class="story-start"><button class="story-play" id="story-play" aria-label="Start">${icon('play')}</button></div></div>
 <div class="story-line" hidden><span class="story-avatar" aria-hidden="true"></span><div class="story-words"><p class="hanzi" lang="zh-Hans"></p><p class="pinyin" lang="zh-Latn"></p><p class="meaning"></p></div><button class="round-button story-replay" id="story-replay" aria-label="Hear it again">${icon('speaker')}</button></div>
 <div class="story-end" hidden></div></div>`;
 $('#story-back').onclick=showMenu;
 $('#story-restart').onclick=()=>{renderPlayer();begin();};
 $('#story-play').onclick=begin;
 // Hearing a line again never moves the story on.
 $('#story-replay').onclick=()=>{if(current&&!finishLine)say(current,token).catch(()=>{});};
}
// Moves to another picture: it fades through to the new scene, keeping the story going. A house can come back
// already built, with its pig inside.
async function changeScene(t,svg,dot,setup=()=>{}){
 const s=stage();
 s.classList.add('scene-out');await wait(500,t);
 s.querySelector('.story-svg').outerHTML=svg;
 s.className='story-stage';bitsGone=0;$('.story-dots').innerHTML=progressDots(dot);setup(s);
 void s.getBoundingClientRect();s.classList.add('scene-in');await wait(500,t);s.classList.remove('scene-in');
}
const toHouse=(t,index,built=false)=>{const sc=SCENES[story.scenes[index].id];return changeScene(t,houseScene(sc.material,sc.faces),index,s=>{
 if(!built)return;s.querySelectorAll('.layer').forEach((_,i)=>s.classList.add('built-'+(i+1)));s.classList.add('in-'+sc.builder);});};
// First every pig builds a house; then the wolf comes to each house in turn.
async function playStory(t){
 for(const [index,scene] of story.scenes.entries()){if(index)await toHouse(t,index);await SCENES[scene.id].build(t);}
 await changeScene(t,overviewScene(),-1);await wait(300,t);
 await say('allBuilt',t);await wait(600,t);
 for(const [index,scene] of story.scenes.entries()){await toHouse(t,index,true);await SCENES[scene.id].wolf(t);}
 finish(t);
}
function begin(){
 $('.story-start')?.remove();
 const t=++token;
 playStory(t).catch(error=>{if(!(error instanceof Stopped))throw error;});
}

function showLine(key){
 const line=story.lines[key],box=$('.story-line');
 box.hidden=false;box.dataset.speaker=line.speaker;
 box.querySelector('.story-avatar').innerHTML=line.speaker==='narrator'?mascot('happy','story-avatar-art'):avatars[line.speaker];
 box.querySelector('.hanzi').innerHTML=chars(line.hanzi);
 box.querySelector('.pinyin').textContent=line.pinyin;
 box.querySelector('.meaning').textContent=line.english;
}
// Plays one line in its character's voice. Resolves when it has been said; if the sound cannot play, the text
// stays up for about as long as it would take to say, so the story still moves on.
function say(key,t){
 alive(t);
 const line=story.lines[key],path=`assets/audio/stories/${story.id}/${key}.m4a`,voice=VOICES[line.speaker];
 finishLine?.(false);current=key;showLine(key);
 return new Promise(resolve=>{
  let settled=false;
  const done=ok=>{if(settled)return;settled=true;finishLine=null;audio.onended=audio.onerror=null;stopKaraoke();resolve(ok);};
  finishLine=done;audio.onended=()=>done(true);audio.onerror=()=>done(false);
  audio.src=url(path);audio.preservesPitch=audio.webkitPreservesPitch=voice.keep;audio.defaultPlaybackRate=audio.playbackRate=voice.rate;
  audio.play().then(()=>{audio.playbackRate=voice.rate;karaoke(line,path);}).catch(()=>done(false));
 }).then(async ok=>{alive(t);if(!ok)await wait(300+[...line.hanzi].length*250,t);});
}
function playWord(id){
 finishLine?.(false);audio.onended=audio.onerror=null;
 audio.src=url(`assets/audio/stories/${story.id}/word-${id}.m4a`);audio.preservesPitch=audio.webkitPreservesPitch=true;audio.defaultPlaybackRate=audio.playbackRate=VOICES.narrator.rate;
 audio.play().catch(()=>{});
}
// The character being said lights up, and so does the thing in the picture its word names. A named thing
// bounces as it is said and keeps glowing until the line ends.
function cueRanges(line){
 const text=[...line.hanzi],ranges=[];
 for(const [word,target] of line.cues){const w=[...word];for(let i=0;i+w.length<=text.length;i++)if(w.every((c,j)=>text[i+j]===c))ranges.push({from:i,to:i+w.length,target});}
 return ranges;
}
function setCues(active,lit){stage().querySelectorAll('[data-cue]').forEach(el=>{const names=el.dataset.cue.split(' ');el.classList.toggle('cue',names.some(n=>active.has(n)));el.classList.toggle('lit',names.some(n=>lit.has(n)));});}
function karaoke(line,path){
 cancelAnimationFrame(frame);
 const text=[...line.hanzi],spans=[...$('.story-line .hanzi').querySelectorAll('.ch')],ranges=cueRanges(line),lit=new Set();
 const weights=text.map(c=>PAUSE.test(c)?1.5:1),total=weights.reduce((a,b)=>a+b,0);
 const tick=()=>{
  const span=timings[path]||[0,audio.duration||1];
  let index=-1;
  if(audio.currentTime>=span[0]){let reach=Math.min(1,(audio.currentTime-span[0])/(span[1]-span[0]))*total;for(let i=0;i<text.length;i++){reach-=weights[i];if(reach<0||i===text.length-1){index=i;break;}}}
  spans.forEach((el,i)=>el.classList.toggle('speaking',i===index&&!PAUSE.test(text[i])));
  const active=new Set(ranges.filter(r=>index>=r.from&&index<r.to).map(r=>r.target));active.forEach(n=>lit.add(n));
  setCues(active,lit);
  if(!audio.paused&&!audio.ended)frame=requestAnimationFrame(tick);
 };
 tick();
}
function stopKaraoke(){cancelAnimationFrame(frame);root?.querySelectorAll('.story-line .speaking').forEach(el=>el.classList.remove('speaking'));if(stage())setCues(new Set(),new Set());}

// Waits for her to tap something in the picture. A pulsing ring shows where; if nothing happens for a while
// the prompt is said again.
function tap(name,t,prompt){
 alive(t);
 const s=stage();s.dataset.hint=name;
 const hit=s.querySelector(`.hit-${name}`);
 return new Promise(resolve=>{
  const nudge=setInterval(()=>{if(prompt&&!finishLine&&t===token)say(prompt,t).catch(()=>{});},9000);
  const cleanup=()=>{clearInterval(nudge);hit.removeEventListener('click',onTap);s.dataset.hint='';cancelWait=null;};
  const onTap=()=>{cleanup();resolve();};
  hit.addEventListener('click',onTap);cancelWait=()=>{cleanup();resolve();};
 }).then(()=>alive(t));
}
const move=(name,x,y,ms=1400,scale=1)=>{
 const el=$(`.actor-${name}`);el.style.transitionDuration=ms+'ms';el.style.transform=`translate(${x}px,${y}px)${scale===1?'':` scale(${scale})`}`;
 if(ms){el.classList.add('walking');setTimeout(()=>el.classList.remove('walking'),ms);}else void el.getBoundingClientRect();
};

// Small synthesised sound effects, so the story needs no extra files.
let context;
function sound(){try{context??=new (window.AudioContext||window.webkitAudioContext)();if(context.state==='suspended')context.resume().catch(()=>{});return context;}catch{return null;}}
function noise(c,seconds){const buffer=c.createBuffer(1,Math.ceil(c.sampleRate*seconds),c.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;const source=c.createBufferSource();source.buffer=buffer;return source;}
function knockSound(){
 const c=sound();if(!c)return;const t=c.currentTime,o=c.createOscillator(),g=c.createGain();
 o.type='sine';o.frequency.setValueAtTime(190,t);o.frequency.exponentialRampToValueAtTime(70,t+.12);
 g.gain.setValueAtTime(.6,t);g.gain.exponentialRampToValueAtTime(.001,t+.18);o.connect(g).connect(c.destination);o.start(t);o.stop(t+.2);
}
function whoosh(strength=1){
 const c=sound();if(!c)return;const t=c.currentTime,length=.6+strength*.25,source=noise(c,length),filter=c.createBiquadFilter(),g=c.createGain();
 filter.type='bandpass';filter.Q.value=.8;filter.frequency.setValueAtTime(350,t);filter.frequency.exponentialRampToValueAtTime(1600,t+length*.6);
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.18*strength,t+.12);g.gain.exponentialRampToValueAtTime(.001,t+length);
 source.connect(filter).connect(g).connect(c.destination);source.start(t);
}
function crash(){
 const c=sound();if(!c)return;const t=c.currentTime,source=noise(c,1.3),filter=c.createBiquadFilter(),g=c.createGain();
 filter.type='lowpass';filter.frequency.setValueAtTime(1400,t);filter.frequency.exponentialRampToValueAtTime(200,t+1.2);
 g.gain.setValueAtTime(.5,t);g.gain.exponentialRampToValueAtTime(.001,t+1.3);source.connect(filter).connect(g).connect(c.destination);source.start(t);
}

// Blowing: the microphone hears a long, loud breath as one puff. It only listens while nothing is being said,
// so the wolf's own voice never blows the house down.
async function startMic(onPuff){
 const button=$('#story-mic');if(mic)return;
 try{
  const stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}});
  const c=sound(),analyser=c.createAnalyser();analyser.fftSize=1024;c.createMediaStreamSource(stream).connect(analyser);
  const data=new Float32Array(analyser.fftSize);let loud=0,quietUntil=0;
  mic={stream,frame:0};button.classList.add('listening');
  const listen=()=>{
   if(!mic)return;analyser.getFloatTimeDomainData(data);let sum=0;for(const v of data)sum+=v*v;const level=Math.sqrt(sum/data.length),now=performance.now();
   button.style.setProperty('--level',Math.min(1,level*6).toFixed(2));
   if(level>.08&&audio.paused&&now>quietUntil){if(++loud>=6){loud=0;quietUntil=now+1200;onPuff();}}else loud=0;
   mic.frame=requestAnimationFrame(listen);
  };
  listen();
 }catch{button.classList.add('denied');}
}
function stopMic(){if(!mic)return;cancelAnimationFrame(mic.frame);mic.stream.getTracks().forEach(track=>track.stop());mic=null;root?.querySelector('#story-mic')?.classList.remove('listening');}
// Puffs at the house: each one the wolf says 吹, the house wobbles by the next amount in `wobbles` (degrees) and a
// few bits fly off. Resolves after the last puff.
let bitsGone=0;
function blowPuffs(t,wobbles,bitsEach=0){
 alive(t);
 const s=stage(),button=$('#story-mic'),hit=s.querySelector('.hit-wolf'),house=s.querySelector('.house'),bits=[...s.querySelectorAll('.bit')];let puffs=0;
 button.hidden=false;s.dataset.hint='wolf';
 return new Promise(resolve=>{
  const nudge=setInterval(()=>{if(!finishLine&&t===token&&!mic)say('blowNow',t).catch(()=>{});},9000);
  const puff=()=>{
   if(puffs>=wobbles.length||t!==token)return;const w=wobbles[puffs++];
   replay(s,'blowing');setTimeout(()=>s.classList.remove('blowing'),900);whoosh(Math.min(3,1+w/3));
   house.style.setProperty('--w',w);replay(house,'wobble');
   bits.slice(bitsGone,bitsGone+=bitsEach).forEach(b=>b.classList.add('off'));
   say('chui',t).catch(()=>{});
   if(puffs===wobbles.length){cleanup();setTimeout(resolve,700);}
  };
  const cleanup=()=>{clearInterval(nudge);hit.removeEventListener('click',puff);button.onclick=null;button.hidden=true;s.dataset.hint='';cancelWait=null;};
  hit.addEventListener('click',puff);button.onclick=()=>startMic(puff);
  cancelWait=()=>{cleanup();resolve();};
 }).then(()=>alive(t));
}

// Steps every scene shares.
const NUMBERS=[['one','一'],['two','二'],['three','三'],['four','四'],['five','五']];
const place=(name,x,y=168)=>move(name,x,y,0);
async function build(t,line,prompt){
 const s=stage(),pieces=s.querySelectorAll('.piece').length;
 flag('show-ghost');flag('show-pile');
 await say(line,t);
 for(let n=1;n<=pieces;n++){
  if(n===1)await say(prompt,t);
  await tap('pile',t,prompt);
  s.querySelector('.piece-'+n).classList.add('taken');replay(s.querySelector('.fly-'+n),'go');
  await wait(550,t);
  flag('built-'+n);const pop=s.querySelector('.count-pop');pop.textContent=NUMBERS[n-1][1];replay(pop,'pop');
  await say(NUMBERS[n-1][0],t);
 }
 flag('show-ghost',false);flag('show-pile',false);chime('yay');
}
// Walks a pig to the door and in; its face then shows at the window.
async function goIn(t,colour,ms=1100){move('pig-'+colour,172,166,ms);await wait(ms,t);flag('in-'+colour);}
// Pigs running from the last house knock to be let in: she opens the door for them.
async function letIn(t,colours,line){
 colours.forEach((c,i)=>{place('pig-'+c,-40-i*34);});flag('scared');
 colours.forEach((c,i)=>move('pig-'+c,96-i*30,168,1500));await wait(1500,t);
 await say(line,t);
 await say('quick',t);
 await tap('door',t,'quick');
 flag('door-open');flag('scared',false);
 for(const c of colours)await goIn(t,c,700);
 flag('door-open',false);await wait(500,t);
}
async function wolfKnocks(t){
 const s=stage();
 move('wolf',238,160,2400);await wait(1200,t);
 await say('wolf',t);await wait(500,t);
 await say('tapDoor',t);
 for(let i=0;i<3;i++){await tap('door',t,'tapDoor');knockSound();replay(s.querySelector('.door'),'knocked');replay(s.querySelector('.actor-wolf'),'knock');await say('dong',t);}
 await wait(300,t);
 flag('say-open');await say('open',t);await wait(400,t);flag('say-open',false);
 await say('tapPig',t);
 await tap('pig-window',t,'tapPig');
 flag('say-no');flag('pig-no');await say('no',t);await wait(400,t);flag('say-no',false);flag('pig-no',false);
 await wait(300,t);
 await say('blow',t);
 await say('blowNow',t);
}
// The house falls; the pigs inside pop out of the heap and run, with the wolf close behind.
async function fallAndRun(t,fell,run,colours){
 flag('fallen');crash();
 await wait(1300,t);
 await say(fell,t);
 colours.forEach((c,i)=>{place('pig-'+c,150-(colours.length-1)*16+i*32);flag('in-'+c,false);});flag('scared');
 await say(run,t);
 colours.forEach((c,i)=>move('pig-'+c,-60-i*30,170,1800));await wait(500,t);move('wolf',-110,162,2600);
 await wait(2400,t);
}

// Building. The story opens on the three pigs; two go off to build their own houses, and the red one builds with straw.
async function buildStraw(t){
 place('pig-red',140);place('pig-yellow',180);place('pig-white',220);
 await wait(400,t);
 await say('once',t);
 await wait(300,t);
 move('pig-yellow',380,168,2400);move('pig-white',420,168,2400);move('pig-red',84,168,1400);
 await wait(1500,t);
 await build(t,'build','tapStraw');
 await say('done',t);
 await goIn(t,'red');await wait(600,t);
}
async function buildWood(t){
 place('pig-yellow',-40);move('pig-yellow',84,168,1300);await wait(1400,t);
 await build(t,'w_build','tapWood');
 await say('w_done',t);
 await goIn(t,'yellow');await wait(600,t);
}
async function buildBrick(t){
 place('pig-white',-40);move('pig-white',84,168,1300);await wait(1400,t);
 await build(t,'b_build','tapBrick');
 await say('b_done',t);
 await goIn(t,'white');await wait(600,t);
}
// The wolf comes. Straw falls after three puffs.
async function wolfAtStraw(t){
 await wolfKnocks(t);
 await blowPuffs(t,[2,5,8],5);
 await fallAndRun(t,'fell','run',['red']);
 await wait(300,t);
}
// The red pig runs to the yellow pig's wooden house. Wood takes more blowing.
async function wolfAtWood(t){
 await letIn(t,['red'],'redComes');
 await wolfKnocks(t);
 await blowPuffs(t,[1.5,3,4.5],3);
 await say('again',t);
 await blowPuffs(t,[6,9],4);
 await fallAndRun(t,'w_fell','twoRun',['yellow','red']);
 await wait(300,t);
}
// Both run to the white pig's brick house. However hard he blows, it stays up, so the wolf climbs onto the roof
// and comes down the chimney, straight into the pot of water the pigs have boiled. Off he runs, for good.
async function wolfAtBrick(t){
 await letIn(t,['red','yellow'],'twoCome');
 await wolfKnocks(t);
 await blowPuffs(t,[.4,.5,.6]);
 await say('strong',t);
 await say('again',t);
 await blowPuffs(t,[.6,.7]);
 await say('strong',t);
 await say('chimneyPlan',t);
 move('wolf',214,134,900,.85);await wait(900,t);move('wolf',192,98,900,.65);await wait(900,t);move('wolf',173,64,800,.5);await wait(1000,t);
 flag('wolf-down');move('wolf',173,100,700,.5);await wait(700,t);
 await changeScene(t,interiorScene(),2);
 await say('boil',t);
 await say('tapFire',t);
 await tap('fire',t,'tapFire');
 flag('fire-lit');whoosh(1);await wait(1400,t);
 flag('boiling');await say('boiling',t);await wait(400,t);
 // Down the chimney he comes.
 move('wolf',160,150,700);await wait(700,t);
 crash();replay(stage(),'splashed');await say('splash',t);
 flag('ouch');await say('hot',t);
 move('wolf',160,-150,650);await wait(700,t);flag('ouch',false);
 await say('wolfRan',t);
 flag('dance');
 await say('happy',t);
 await wait(800,t);
}
function finish(t){
 alive(t);celebrate(true);chime('fanfare');current=null;
 $('.story-line').hidden=true;$('.story-dots').innerHTML=progressDots(story.scenes.length);
 const end=$('.story-end');end.hidden=false;
 end.innerHTML=`<h2 lang="zh-Hans">太棒了！</h2><p class="meaning">Words from the story. Tap one to hear it.</p>
 <div class="story-word-grid">${story.scenes.flatMap(sc=>sc.words).map(w=>`<button class="story-word" data-word="${w.id}"><span class="story-word-pic">${storyPictures[w.id]}</span><span class="hanzi" lang="zh-Hans">${escape(w.hanzi)}</span><span class="pinyin" lang="zh-Latn">${escape(w.pinyin)}</span><span class="meaning">${escape(w.english)}</span></button>`).join('')}</div>
 <div class="game-actions"><button class="button primary" id="story-again">${icon('again')} Again</button><button class="button secondary" id="story-list">Back to stories</button></div>`;
 end.querySelectorAll('[data-word]').forEach(b=>b.onclick=()=>{playWord(b.dataset.word);replay(b,'boing');});
 $('#story-again').onclick=()=>{renderPlayer();begin();};
 $('#story-list').onclick=showMenu;
 end.scrollIntoView({behavior:'smooth',block:'nearest'});
}
