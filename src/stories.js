// Stories: picture books that act themselves out. Each line is read aloud with the karaoke highlight, and whatever
// the line names lights up in the picture as it is said. Between lines she does what happens in the story.
// This file is the engine every story shares: the story list, the player, voices, karaoke, taps, the microphone,
// scene changes and the ending. Each story is a module in src/stories/ that draws its scenes and runs its script
// through the `api` handed to it; it loads only when the story is opened.
import {chime} from './sfx.js';
import {icon,mascot} from './icons.js';
import {STORIES} from './stories/index.js';

// Same name as in sw.js: a story's files go into the offline store the first time it is opened.
const CACHE='learnchinese-v1';
const NARRATOR={rate:.85,keep:true};
// How fast stories play, chosen under the title and remembered on this device. Speech and the pauses between
// steps both follow it, so the whole story speeds up or slows down together.
const SPEEDS=[.75,1,1.25,1.5];
let speed=(()=>{try{const saved=Number(localStorage.getItem('story-speed'));return SPEEDS.includes(saved)?saved:1;}catch{return 1;}})();
const PAUSE=/[\p{P}\s]/u;
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// A line in units: each Chinese character is one, and an English name (Ira, Spider-Man) is one, so a name lights
// up whole while it is said. A name takes longer to say than one character, so it counts for more of the time.
const units=text=>text.match(/[A-Za-z][A-Za-z'’-]*|[\s\S]/gu)||[];
const weight=unit=>/^\s$/.test(unit)?.3:PAUSE.test(unit)?1.5:/^[A-Za-z]/.test(unit)?Math.max(1,unit.length*.3):1;
// Punctuation stays on the same line as the character before it.
const chars=text=>units(text).reduce((groups,c)=>{const span=`<span class="ch">${escape(c)}</span>`;if(groups.length&&PAUSE.test(c)&&!/\s/.test(c))groups[groups.length-1]+=span;else groups.push(span);return groups;},[]).map(g=>`<span class="ch-group">${g}</span>`).join('');
const url=path=>new URL('../'+path,import.meta.url).href;
const audio=new Audio();audio.preload='auto';
const loaded=new Map();
let root=null,celebrate=()=>{};
// The open story: its text (story), its module (book) and when speech starts and ends in each recording (clips).
let story=null,book=null,clips={};
// `token` changes whenever the story stops or restarts; every step of a running story checks it.
let token=0,current=null,finishLine=null,cancelWait=null,mic=null,frame=0;
class Stopped extends Error{}
const alive=t=>{if(t!==token)throw new Stopped();};
const wait=(ms,t)=>new Promise(resolve=>setTimeout(resolve,ms/speed)).then(()=>alive(t));
const $=selector=>root.querySelector(selector);
const stage=()=>$('.story-stage');
const flag=(name,on=true)=>stage().classList.toggle(name,on);
// Restarts a one-shot CSS animation on an element.
const replay=(el,cls)=>{el.classList.remove(cls);void el.getBoundingClientRect();el.classList.add(cls);};
const clipUrl=clip=>url(`assets/audio/stories/${story.id}/${clip}.m4a`);
const voiceOf=speaker=>speaker==='narrator'?NARRATOR:story.voices[speaker];

export function mountStories(element,options){root=element;celebrate=options.celebrate;showMenu();}
export function stopStory(){token++;audio.pause();finishLine?.(false);cancelWait?.();stopMic();cancelAnimationFrame(frame);}

function showMenu(){
 stopStory();
 root.innerHTML=`<div class="story-menu">${STORIES.map(s=>`<button class="story-card" data-story="${s.id}"><img class="story-cover" src="${url(`assets/stories/${s.id}-cover.svg`)}" alt="" loading="lazy"><span class="story-card-text"><span class="hanzi" lang="zh-Hans">${escape(s.title)}</span><span class="story-card-name">${escape(s.english)}</span></span><span class="story-card-play" aria-hidden="true">${icon('play')}</span></button>`).join('')}</div>`;
 root.querySelectorAll('[data-story]').forEach(b=>b.onclick=()=>openStory(b.dataset.story).catch(()=>{b.classList.add('failed');}));
}
async function openStory(id){
 if(!loaded.has(id)){
  const [text,module,timing]=await Promise.all([fetch(url(`data/stories/${id}.json`)).then(r=>r.json()),import(`./stories/${id}.js`),fetch(url(`assets/audio/stories/${id}/clips.json`)).then(r=>r.json())]);
  loaded.set(id,{text,book:module.default,timing});
  if(module.default.css&&!document.querySelector(`style[data-story="${id}"]`)){const style=document.createElement('style');style.dataset.story=id;style.textContent=module.default.css;document.head.append(style);}
  keepOffline(id,timing);
 }
 ({text:story,book,timing:clips}=loaded.get(id));
 renderPlayer();
}
// Saves everything the story needs into the offline store in the background, so it plays without a connection
// next time. Only stories she has opened take up space.
async function keepOffline(id,timing){
 if(!('caches' in window))return;
 try{
  const cache=await caches.open(CACHE);
  const files=[`src/stories/${id}.js`,`data/stories/${id}.json`,`assets/audio/stories/${id}/clips.json`,...Object.values(timing).map(c=>c.file)];
  for(const file of files)await cache.add(new Request(url(file),{cache:'no-cache'})).catch(()=>{});
 }catch{}
}
// Where the story is, for stories told in chapters, shown as names under the title.
const chapterNames=index=>(story.chapters||[]).map((c,i)=>`<span class="story-dot ${i===index?'now':''}" title="${escape(c.english)}"><span lang="zh-Hans">${escape(c.title)}</span></span>`).join('');
function renderPlayer(){
 stopStory();
 root.innerHTML=`<div class="story-player">
 <div class="story-bar"><button class="round-button" id="story-back" aria-label="Back to stories">${icon('left')}</button><div class="story-title"><span class="hanzi" lang="zh-Hans">${escape(story.title)}</span><small>${escape(story.english)}</small><span class="story-dots" aria-hidden="true">${chapterNames(0)}</span><span class="story-speed" role="group" aria-label="Story speed">${SPEEDS.map(v=>`<button data-speed="${v}" class="${v===speed?'active':''}" aria-pressed="${v===speed}">${v}×</button>`).join('')}</span></div><button class="round-button" id="story-restart" aria-label="Start the story again">${icon('again')}</button></div>
 <div class="story-stage">${book.firstScene()}
  <button class="story-mic" id="story-mic" hidden aria-label="Blow into the microphone">${icon('mic')}</button>
  <div class="story-start"><button class="story-play" id="story-play" aria-label="Start">${icon('play')}</button></div></div>
 <div class="story-line" hidden><span class="story-avatar" aria-hidden="true"></span><div class="story-words"><p class="hanzi" lang="zh-Hans"></p><p class="pinyin" lang="zh-Latn"></p><p class="meaning"></p></div><button class="round-button story-replay" id="story-replay" aria-label="Hear it again">${icon('speaker')}</button></div>
 <div class="story-end" hidden></div></div>`;
 $('#story-back').onclick=showMenu;
 $('#story-restart').onclick=()=>{renderPlayer();begin();};
 $('#story-play').onclick=begin;
 root.querySelectorAll('[data-speed]').forEach(b=>b.onclick=()=>setSpeed(Number(b.dataset.speed)));
 // Hearing a line again never moves the story on.
 $('#story-replay').onclick=()=>{if(current&&!finishLine)say(current,token).catch(()=>{});};
}
// A new speed applies straight away, even to the line being said.
function setSpeed(value){
 speed=value;try{localStorage.setItem('story-speed',String(value));}catch{}
 root.querySelectorAll('[data-speed]').forEach(b=>{const on=Number(b.dataset.speed)===value;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});
 if(current&&finishLine){const rate=voiceOf(story.lines[current].speaker).rate*speed;audio.defaultPlaybackRate=audio.playbackRate=rate;}
}
function begin(){
 $('.story-start')?.remove();
 const t=++token;
 book.play(api,t).then(()=>finish(t)).catch(error=>{if(!(error instanceof Stopped))throw error;});
}
// Moves to another picture: it fades through to the new scene, keeping the story going. `setup` can set the new
// scene's starting state before it fades in.
async function changeScene(t,svg,setup=()=>{}){
 const s=stage();
 s.classList.add('scene-out');await wait(500,t);
 s.querySelector('.story-svg').outerHTML=svg;
 s.className='story-stage';setup(s);
 void s.getBoundingClientRect();s.classList.add('scene-in');await wait(500,t);s.classList.remove('scene-in');
}

function showLine(key){
 const line=story.lines[key],box=$('.story-line'),voice=voiceOf(line.speaker);
 box.hidden=false;box.dataset.speaker=line.speaker;
 const avatar=box.querySelector('.story-avatar');
 avatar.innerHTML=line.speaker==='narrator'?mascot('happy','story-avatar-art'):book.avatars[line.speaker];
 avatar.style.background=voice.tint||'';
 box.querySelector('.hanzi').innerHTML=chars(line.hanzi);
 box.querySelector('.pinyin').textContent=line.pinyin;
 box.querySelector('.meaning').textContent=line.english;
}
// Plays one line in its character's voice: one recorded voice acts every part, played slower and lower or
// quicker and higher. Resolves when it has been said; if the sound cannot play, the text stays up for about as
// long as it would take to say, so the story still moves on.
function say(key,t){
 alive(t);
 const line=story.lines[key];if(!line)throw new Error(`No line called ${key}`);
 const voice=voiceOf(line.speaker);
 finishLine?.(false);current=key;showLine(key);
 return new Promise(resolve=>{
  let settled=false;
  const done=ok=>{if(settled)return;settled=true;finishLine=null;audio.onended=audio.onerror=null;stopKaraoke();resolve(ok);};
  finishLine=done;audio.onended=()=>done(true);audio.onerror=()=>done(false);
  const rate=voice.rate*speed;
  audio.src=clipUrl(key);audio.preservesPitch=audio.webkitPreservesPitch=voice.keep;audio.defaultPlaybackRate=audio.playbackRate=rate;
  audio.play().then(()=>{audio.playbackRate=rate;karaoke(line,key);}).catch(()=>done(false));
 }).then(async ok=>{alive(t);if(!ok)await wait(300+units(line.hanzi).reduce((sum,u)=>sum+weight(u),0)*250,t);});
}
function playWord(id){
 finishLine?.(false);audio.onended=audio.onerror=null;
 audio.src=clipUrl('word-'+id);audio.preservesPitch=audio.webkitPreservesPitch=true;audio.defaultPlaybackRate=audio.playbackRate=NARRATOR.rate*speed;
 audio.play().catch(()=>{});
}
// The character being said lights up, and so does the thing in the picture its word names. A named thing
// bounces as it is said and keeps glowing until the line ends.
function cueRanges(line){
 const text=units(line.hanzi),ranges=[];
 for(const [word,target] of line.cues){const w=units(word);for(let i=0;i+w.length<=text.length;i++)if(w.every((c,j)=>text[i+j]===c))ranges.push({from:i,to:i+w.length,target});}
 return ranges;
}
function setCues(active,lit){stage().querySelectorAll('[data-cue]').forEach(el=>{const names=el.dataset.cue.split(' ');el.classList.toggle('cue',names.some(n=>active.has(n)));el.classList.toggle('lit',names.some(n=>lit.has(n)));});}
function karaoke(line,key){
 cancelAnimationFrame(frame);
 const text=units(line.hanzi),spans=[...$('.story-line .hanzi').querySelectorAll('.ch')],ranges=cueRanges(line),lit=new Set();
 const weights=text.map(weight),total=weights.reduce((a,b)=>a+b,0);
 const tick=()=>{
  const span=clips[key]?.speech||[0,audio.duration||1];
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

// Waits for something the story sets up: `setup` gets a `done` callback and returns its own cleanup. Stopping the
// story cleans up too.
function waitFor(t,setup){
 alive(t);
 return new Promise(resolve=>{
  let cleanup=null,over=false;
  const done=()=>{if(over)return;over=true;cleanup?.();cancelWait=null;resolve();};
  cancelWait=done;cleanup=setup(done);if(over)cleanup?.();
 }).then(()=>alive(t));
}
const hint=(name,on)=>stage().querySelectorAll(`.hint-${name},.hit-${name}`).forEach(el=>el.classList.toggle('active',on));
// Waits for her to tap something in the picture. A pulsing ring shows where; if nothing happens for a while
// the prompt is said again.
function tap(name,t,prompt){
 return waitFor(t,done=>{
  const hit=stage().querySelector(`.hit-${name}`);hint(name,true);
  const nudge=setInterval(()=>{if(prompt&&!finishLine&&t===token)say(prompt,t).catch(()=>{});},9000);
  hit.addEventListener('click',done);
  return ()=>{clearInterval(nudge);hit.removeEventListener('click',done);hint(name,false);};
 });
}
const move=(name,x,y,ms=1400,scale=1)=>{
 ms/=speed;const el=$(`.actor-${name}`);el.style.transitionDuration=ms+'ms';el.style.transform=`translate(${x}px,${y}px)${scale===1?'':` scale(${scale})`}`;
 if(ms){el.classList.add('walking');setTimeout(()=>el.classList.remove('walking'),ms);}else void el.getBoundingClientRect();
};
// The big character that pops up when counting.
const count=hanzi=>{const pop=stage().querySelector('.count-pop');if(!pop)return;pop.textContent=hanzi;replay(pop,'pop');};

// Small synthesised sound effects, so stories need no extra files.
let context;
function sound(){try{context??=new (window.AudioContext||window.webkitAudioContext)();if(context.state==='suspended')context.resume().catch(()=>{});return context;}catch{return null;}}
function noise(c,seconds){const buffer=c.createBuffer(1,Math.ceil(c.sampleRate*seconds),c.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;const source=c.createBufferSource();source.buffer=buffer;return source;}
const tone=(c,type,frequency,start,length,volume)=>{const o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(frequency,start);g.gain.setValueAtTime(volume,start);g.gain.exponentialRampToValueAtTime(.001,start+length);o.connect(g).connect(c.destination);o.start(start);o.stop(start+length+.05);return o;};
const sounds={
 knock(){const c=sound();if(!c)return;const t=c.currentTime,o=tone(c,'sine',190,t,.18,.6);o.frequency.exponentialRampToValueAtTime(70,t+.12);},
 whoosh(strength=1){
  const c=sound();if(!c)return;const t=c.currentTime,length=.6+strength*.25,source=noise(c,length),filter=c.createBiquadFilter(),g=c.createGain();
  filter.type='bandpass';filter.Q.value=.8;filter.frequency.setValueAtTime(350,t);filter.frequency.exponentialRampToValueAtTime(1600,t+length*.6);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.18*strength,t+.12);g.gain.exponentialRampToValueAtTime(.001,t+length);
  source.connect(filter).connect(g).connect(c.destination);source.start(t);
 },
 crash(){
  const c=sound();if(!c)return;const t=c.currentTime,source=noise(c,1.3),filter=c.createBiquadFilter(),g=c.createGain();
  filter.type='lowpass';filter.frequency.setValueAtTime(1400,t);filter.frequency.exponentialRampToValueAtTime(200,t+1.2);
  g.gain.setValueAtTime(.5,t);g.gain.exponentialRampToValueAtTime(.001,t+1.3);source.connect(filter).connect(g).connect(c.destination);source.start(t);
 },
 // A web shooting out: a quick, high hiss.
 thwip(){const c=sound();if(!c)return;const t=c.currentTime,source=noise(c,.18),filter=c.createBiquadFilter(),g=c.createGain();
  filter.type='bandpass';filter.Q.value=2;filter.frequency.setValueAtTime(5000,t);filter.frequency.exponentialRampToValueAtTime(1800,t+.15);
  g.gain.setValueAtTime(.25,t);g.gain.exponentialRampToValueAtTime(.001,t+.18);source.connect(filter).connect(g).connect(c.destination);source.start(t);},
 // A firework: a soft boom, then crackle.
 boom(){const c=sound();if(!c)return;const t=c.currentTime,o=tone(c,'sine',120,t,.5,.5);o.frequency.exponentialRampToValueAtTime(40,t+.4);
  const source=noise(c,.8),filter=c.createBiquadFilter(),g=c.createGain();filter.type='highpass';filter.frequency.value=2500;
  g.gain.setValueAtTime(0,t+.15);g.gain.linearRampToValueAtTime(.12,t+.25);g.gain.exponentialRampToValueAtTime(.001,t+.9);source.connect(filter).connect(g).connect(c.destination);source.start(t);},
 // Not that one: a short low buzz.
 beep(){const c=sound();if(!c)return;const t=c.currentTime;tone(c,'square',180,t,.22,.06);},
 // A clock ticking: two short wooden clicks.
 tick(){const c=sound();if(!c)return;const t=c.currentTime;tone(c,'square',1800,t,.03,.08);tone(c,'square',1400,t+.18,.03,.08);},
 // A big clock bell: a low note with a few ringing overtones.
 bell(){const c=sound();if(!c)return;const t=c.currentTime;[[196,.5,2.4],[392,.22,1.6],[523,.12,1.2],[784,.06,.8]].forEach(([f,v,l])=>tone(c,'sine',f,t,l,v));},
 // Magic: a quick run of sparkling notes up the scale.
 magic(){const c=sound();if(!c)return;const t=c.currentTime;[1047,1319,1568,2093,2637].forEach((f,i)=>tone(c,'triangle',f,t+i*.06,.4,.07));}
};

// Blowing: the microphone hears a long, loud breath as one puff. It only listens while nothing is being said,
// so a character's own voice never counts.
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
// Shows the microphone button; tapping it starts listening for puffs. Returns the function that hides it again.
function micButton(onPuff){
 const button=$('#story-mic');button.hidden=false;button.onclick=()=>startMic(onPuff);
 return ()=>{button.onclick=null;button.hidden=true;stopMic();};
}

// Everything a story's script can use.
const api={
 say,wait,tap,waitFor,hint,move,flag,replay,stage,changeScene,count,chime,sounds,
 mic:micButton,listening:()=>!!mic,quiet:()=>!finishLine,
 chapter:index=>{const dots=$('.story-dots');if(dots)dots.innerHTML=chapterNames(index);}
};

function finish(t){
 alive(t);celebrate(true);chime('fanfare');current=null;
 $('.story-line').hidden=true;api.chapter(-1);
 const end=$('.story-end');end.hidden=false;
 end.innerHTML=`<h2 lang="zh-Hans">太棒了！</h2><p class="meaning">Words from the story. Tap one to hear it.</p>
 <div class="story-word-grid">${story.words.map(w=>`<button class="story-word" data-word="${w.id}"><span class="story-word-pic">${book.pictures[w.id]}</span><span class="hanzi" lang="zh-Hans">${escape(w.hanzi)}</span><span class="pinyin" lang="zh-Latn">${escape(w.pinyin)}</span><span class="meaning">${escape(w.english)}</span></button>`).join('')}</div>
 <div class="game-actions"><button class="button primary" id="story-again">${icon('again')} Again</button><button class="button secondary" id="story-list">Back to stories</button></div>`;
 end.querySelectorAll('[data-word]').forEach(b=>b.onclick=()=>{playWord(b.dataset.word);replay(b,'boing');});
 $('#story-again').onclick=()=>{renderPlayer();begin();};
 $('#story-list').onclick=showMenu;
 end.scrollIntoView({behavior:'smooth',block:'nearest'});
}
