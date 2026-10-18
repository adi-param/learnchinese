import {createAudioPlayer} from './audio-player.js';
import {showAudioHelp} from './audio-help.js';
import {femaleMandarinVoice, PRONUNCIATION_RATE} from './speech.js';
import {lessonItems,shuffle,sourceLabel} from './core.js';
import {lessonPictures,pictureFor,picturesOf,renderPicture} from './pictures.js';
import {chime} from './sfx.js';
import {icon,mascot} from './icons.js';
import {mountStories,stopStory} from './stories.js';
import {mountGames,stopGames} from './games.js';
const root=document.querySelector('#app');
const views=[['library','Words'],['flashcards','Flip cards'],['match','Games'],['stories','Stories']];
views.icons={library:'words',flashcards:'cards',match:'match',stories:'story'};
const says={library:'Tap a card to hear it',flashcards:'Look, say it, then flip',menu:'Let’s play',stories:'Story time'};
let library; let voiceList=[];let lastSpoken=null;let voiceRequest=0;
const audio=document.createElement('audio');audio.id='pronunciation-audio';audio.preload='auto';document.body.append(audio);
const audioStatus=document.createElement('div');audioStatus.className='audio-status';audioStatus.hidden=true;audioStatus.setAttribute('role','status');document.body.append(audioStatus);
const player=createAudioPlayer(audio,{onState(status){audioStatus.hidden=status==='idle';audioStatus.textContent=status==='loading'?'Getting the sound…':status==='playing'?'🔊 Listen!':'';},onFailure(){openAudioHelp();}});
function openAudioHelp(){showAudioHelp({onRetry:lastSpoken?()=>speak(lastSpoken):null,onDeviceVoice:lastSpoken?target=>deviceSpeak(lastSpoken,target):null});}
// Prime the voice list on load; delayed engines announce when it becomes ready.
if('speechSynthesis' in window){voiceList=speechSynthesis.getVoices();speechSynthesis.addEventListener('voiceschanged',()=>{voiceList=speechSynthesis.getVoices();});}
async function deviceSpeak(id,status){
 player.stop();const current=++voiceRequest;
 if(!('speechSynthesis' in window)){status.textContent='This browser does not support device voices. Open the site in Safari, Chrome or Edge.';return;}
 voiceList=speechSynthesis.getVoices();
 if(!voiceList.length){status.textContent='Checking device voices…';await new Promise(resolve=>{const done=()=>{clearTimeout(timer);speechSynthesis.removeEventListener('voiceschanged',done);resolve();};const timer=setTimeout(done,2000);speechSynthesis.addEventListener('voiceschanged',done,{once:true});});voiceList=speechSynthesis.getVoices();}
 if(current!==voiceRequest||!status.isConnected)return;
 const voice=femaleMandarinVoice(voiceList);
 if(!voice){status.textContent='No recognised female Mandarin voice is available to this browser. Follow the instructions for your device below, then reopen the browser.';return;}
 speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(byId.get(id).hanzi);utterance.voice=voice;utterance.lang=voice.lang;utterance.rate=PRONUNCIATION_RATE;
 utterance.onstart=()=>{status.textContent='Playing with '+voice.name+'.';};utterance.onend=()=>{status.textContent='Finished. You can close this guide.';};utterance.onerror=()=>{if(current===voiceRequest)status.textContent='The device voice could not play. Try the saved recording or open this page in another browser.';};speechSynthesis.speak(utterance);
}
const state={view:'library',lesson:'lesson-34',kind:'word',flashKind:'word',query:'',extra:false,details:false,grownups:false,deck:[],index:0,revealed:false};
const panda=(mood,cls)=>mascot(mood,cls);
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const byId=new Map();
const lesson=()=>library.lessons.find(l=>l.id===state.lesson);
const scoped=opts=>lessonItems(library,state.lesson,opts);
const practice=(kind='word')=>scoped({kind});
function toast(message){document.querySelector('.toast')?.remove();const el=document.createElement('div');el.className='toast';el.setAttribute('role','status');el.textContent=message;document.body.append(el);setTimeout(()=>el.remove(),5500);}
function speak(id){
 const item=byId.get(id);lastSpoken=id;voiceRequest++;
 if('speechSynthesis' in window)speechSynthesis.cancel();
 if(!item.audio){openAudioHelp();return;}
 player.play(new URL('../'+item.audio,import.meta.url).href);
}

const empty=(mood,title,text,extra='')=>`<div class="empty">${panda(mood,'mascot big')}<h2>${title}</h2><p>${text}</p>${extra}</div>`;
const gameKind=()=>state.view==='flashcards'?state.flashKind:'word';
function celebrate(grand=false){
 if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 document.querySelector('.confetti')?.remove();
 const box=document.createElement('div');box.className='confetti'+(grand?' grand':'');box.setAttribute('aria-hidden','true');
 const colours=['#ff7a45','#7c5cff','#1fb584','#2b8ef0','#ffc233','#f0507a'];
 const shapes=['dot','bar','sq','star'];
 const piece=(n,style)=>`<i class="${shapes[n%(grand?4:3)]}" style="background:${colours[n%6]};color:${colours[n%6]};${style}"></i>`;
 const rain=Array.from({length:grand?90:36},(_,n)=>piece(n,`left:${(Math.random()*100).toFixed(1)}%;animation-delay:${(Math.random()*(grand?2.2:.4)).toFixed(2)}s;--spin:${Math.round(Math.random()*720-360)}deg;--drift:${Math.round(Math.random()*160-80)}px`));
 // A grand finish adds two confetti cannons firing in waves from the bottom corners, and a cheering panda.
 const cannons=grand?[0,1].flatMap(side=>Array.from({length:60},(_,n)=>piece(n+side,`${side?'right':'left'}:-10px;bottom:-10px;animation-delay:${(Math.floor(n/20)*.7+Math.random()*.15).toFixed(2)}s;--x:${(side?-1:1)*Math.round(120+Math.random()*420)}px;--y:${-Math.round(260+Math.random()*420)}px;--spin:${Math.round(Math.random()*900-450)}deg`).replace('<i class="','<i class="cannon '))):[];
 box.innerHTML=rain.join('')+cannons.join('')+(grand?`<div class="hooray">${panda('cheer','mascot hooray-mascot')}<strong>Hooray!</strong><span class="hooray-stars">${icon('star','hooray-star')}${icon('star','hooray-star')}${icon('star','hooray-star')}</span></div>`:'');
 document.body.append(box);
 if(grand)box.onclick=()=>box.remove();
 setTimeout(()=>box.remove(),grand?4200:2600);
}
// Phrases can borrow several pictures; they sit side by side as small tiles instead of one full tile.
const picture=(item,cls='stage')=>{const pic=pictureFor(item,byId),multi=picturesOf(item,byId).length>1;return `<span class="${cls}${pic?'':' blank'}${multi?' multi':''}" aria-hidden="true">${pic||'<span class="stage-glyph">字</span>'}</span>`;};

function lessonPicker(){
 const list=[...(state.view==='library'?[{id:'all',number:'All'}]:[]),...library.lessons];
 const chosen=id=>id===state.lesson;
 return `<div class="lessons-wrap"><div class="lessons" role="group" aria-label="Choose a lesson">${list.map(l=>{const missing=l.coverageStatus==='missing';return `<button class="lesson-chip ${missing?'missing':''} ${chosen(l.id)?'active':''}" data-lesson="${l.id}" aria-pressed="${chosen(l.id)}" aria-label="${l.id==='all'?'All lessons':`Lesson ${l.number}: ${escape(l.title)}${missing?' (not in the books yet)':''}`}"><span class="chip-pic" aria-hidden="true">${missing?'':renderPicture(lessonPictures[l.id])}</span><span class="chip-num">${l.number}</span></button>`;}).join('')}</div></div>`;
}
function grownups(){
 const current=lesson();
 const controls=state.view==='library'
  ?`<label class="field grow"><span>Find a word</span><span class="input-wrap">${icon('search','input-icon')}<input id="search" type="search" placeholder="Chinese, Pinyin or English" value="${escape(state.query)}"></span></label><label class="toggle"><input id="extra" type="checkbox" ${state.extra?'checked':''}><span class="switch"></span>Include activity instructions</label><label class="toggle"><input id="details" type="checkbox" ${state.details?'checked':''}><span class="switch"></span>Show sources and review status</label>`
  :``;
 return `<details class="grownups" ${state.grownups?'open':''}><summary>${icon('grownups')}<span>For grown-ups</span>${icon('chevron','icon chevron')}</summary><div class="gu-body"><div class="gu-grid">${controls}</div>${current?.notes.length?`<p class="lesson-note">${current.notes.map(escape).join(' ')}</p>`:''}<p class="gu-note">Pinyin and meanings are drafts awaiting review. Recordings are slow synthetic female Mandarin, not textbook audio. Pictures are hints, not translations. Game levels and the character list are saved on this device only.</p>${installSection()}<p class="gu-links"><button class="text-button" id="open-audio-help">${icon('speaker')} Sound help</button><a class="text-button" href="./docs/library.md">Complete lesson library</a></p></div></details>`;
}
// Using it like an app: Android offers an install prompt; iPhone and iPad need Share, then Add to Home Screen.
let installPrompt=null;
addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;if(state.grownups)render();});
addEventListener('appinstalled',()=>{installPrompt=null;if(state.grownups)render();});
const installed=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
const appleDevice=()=>/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
function installSection(){
 const body=installed()?'<p class="gu-hint">Installed on this device. It opens full screen and works offline.</p>'
  :installPrompt?'<button class="button primary" id="install-app">Add to home screen</button>'
  :appleDevice()?`<ol class="install-steps"><li>Open this page in <b>Safari</b>.</li><li>Tap the <b>Share</b> button ${icon('share','inline-icon')}.</li><li>Choose <b>Add to Home Screen</b>, then <b>Add</b>.</li></ol>`
  :'<p class="gu-hint">Open your browser menu and choose <b>Install app</b> or <b>Add to Home screen</b>.</p>';
 return `<div class="gu-section install"><h3>Use it like an app</h3><p class="gu-hint">Add it to the home screen to open it full screen, with the words and recordings saved for offline play.</p>${body}</div>`;
}
function card(i,n){
 const meta=state.details?`<div class="card-meta"><span>${[...new Set(i.occurrences.filter(o=>state.lesson==='all'||o.lessonId===state.lesson).map(o=>'Lesson '+o.lessonId.split('-')[1]))].join(' · ')} · ${i.reviewStatus==='draft'?'Draft':'Reviewed'} · ${escape(i.category)}</span><span>${escape(sourceLabel(i,state.lesson))}</span></div>`:'';
 return `<article class="word-card ${i.kind} tone-${n%5}"><button class="card-tap" data-speak="${i.id}" title="Tap to listen">${i.kind==='word'?picture(i):''}<span class="card-text"><span class="hanzi" lang="zh-Hans" ${sayAttr(i.audio)}>${chars(i.hanzi)}</span><span class="pinyin" lang="zh-Latn">${escape(i.pinyin)}</span><span class="meaning">${escape(i.english)}</span></span><span class="play" aria-hidden="true">${icon('speaker')}</span></button>${meta}</article>`;
}
function libraryContent(){
 const items=scoped({kind:state.kind,scope:state.extra?'all':'core',query:state.query});
 const kinds=[['word','Words'],['phrase','Phrases'],['sentence','Sentences']];
 const none=lesson()?.coverageStatus==='missing'?empty('sleep','This lesson isn’t in the books yet','Its pages weren’t in the books we have. Pick another lesson.'):empty('happy','Nothing here yet',state.query?'Try another word or clear the search.':'Pick another lesson above.');
 return `<div class="toolbar"><div class="segmented" role="group" aria-label="Content type">${kinds.map(([id,name])=>`<button data-kind="${id}" class="${state.kind===id?'active':''}" aria-pressed="${state.kind===id}">${name}</button>`).join('')}</div><span class="count">${items.length} ${state.kind==='word'?'words':state.kind==='phrase'?'phrases':'sentences'}</span></div><div class="grid">${items.map(card).join('')||none}</div>`;
}
function practiceGate(){
 if(lesson()?.coverageStatus==='missing')return empty('sleep','This lesson isn’t in the books yet','Its pages weren’t in the books we have. Pick another lesson to play.');
 return '';
}
function initGame(){
 state.feedback='';state.index=0;state.revealed=false;
 state.deck=shuffle(practice(gameKind()));
}
function flashContent(){
 const kinds=`<div class="segmented flash-kinds" role="group" aria-label="Cards to practise">${[['word','Words'],['phrase','Phrases']].map(([id,name])=>`<button data-flash-kind="${id}" class="${state.flashKind===id?'active':''}" aria-pressed="${state.flashKind===id}">${name}</button>`).join('')}</div>`;
 const item=state.deck[state.index];if(!item)return kinds+empty('happy',`No ${state.flashKind==='word'?'words':'phrases'} here yet`,'Try the other cards or pick another lesson above.');
 const last=state.index===state.deck.length-1;
 return `${kinds}<div class="progress-row"><div class="progress" role="img" aria-label="Card ${state.index+1} of ${state.deck.length}"><div class="progress-fill" style="width:${(state.index+1)/state.deck.length*100}%"></div></div><span class="progress-label">${state.index+1} / ${state.deck.length}</span></div>
 <button class="flash ${state.revealed?'is-revealed':''}" id="flip"><span class="flash-inner"><span class="face front" ${state.revealed?'aria-hidden="true"':''}><span class="hanzi" lang="zh-Hans" ${sayAttr(item.audio)}>${chars(item.hanzi)}</span><span class="flash-hint">Tap to flip</span></span><span class="face back" ${state.revealed?'':'aria-hidden="true"'}>${picture(item,'stage large')}<span class="hanzi" lang="zh-Hans" ${sayAttr(item.audio)}>${chars(item.hanzi)}</span><span class="pinyin" lang="zh-Latn">${escape(item.pinyin)}</span><span class="meaning">${escape(item.english)}</span></span></span></button>
 <div class="game-actions"><button class="round-button" id="previous" aria-label="Previous card" ${state.index===0?'disabled':''}>${icon('left')}</button><button class="round-button listen" data-speak="${item.id}" aria-label="Listen">${icon('speaker')}</button><button class="round-button go" id="next" aria-label="${last?'Finish and start again':'Next card'}">${icon(last?'flag':'right')}</button></div>`;
}
// Karaoke: while a recording plays, the character being spoken lights up in every text showing it.
// Each recording's speech span (measured by scripts/generate-audio.py) is shared out across its characters.
let timings={};
const sayAttr=file=>`data-karaoke="${escape(file)}"`;
const chars=text=>[...text].map(c=>`<span class="ch">${escape(c)}</span>`).join('');
const PAUSE=/[\p{P}\s]/u;
let karaokeFrame=0;
function karaoke(){
 cancelAnimationFrame(karaokeFrame);
 document.querySelectorAll('.ch.speaking').forEach(c=>c.classList.remove('speaking'));
 if(audio.paused||audio.ended||!audio.src)return;
 const path=decodeURIComponent(new URL(audio.src,location.href).pathname),at=path.indexOf('assets/audio/'),file=at<0?null:path.slice(at),span=file&&timings[file];
 if(span){
  const progress=Math.min(1,Math.max(0,(audio.currentTime-span[0])/(span[1]-span[0])));
  document.querySelectorAll(`[data-karaoke="${CSS.escape(file)}"]`).forEach(el=>{
   const list=[...el.querySelectorAll('.ch')],weights=list.map(c=>PAUSE.test(c.textContent)?1.5:1);
   let reach=progress*weights.reduce((a,b)=>a+b,0);
   for(let i=0;i<list.length;i++){reach-=weights[i];if(reach<0||i===list.length-1){if(!PAUSE.test(list[i].textContent))list[i].classList.add('speaking');break;}}
  });
 }
 karaokeFrame=requestAnimationFrame(karaoke);
}
['playing','pause','ended','emptied'].forEach(type=>audio.addEventListener(type,karaoke));

function content(){if(state.view==='stories')return '<div class="stories-wrap" id="stories"></div>';if(state.view==='library')return libraryContent();if(state.view==='match')return '<div class="games-wrap" id="games"></div>';const gate=practiceGate();return `<div class="game-wrap">${gate||flashContent()}</div>`;}
function render(){
 const current=lesson();
 root.innerHTML=`<div class="backdrop" aria-hidden="true"></div><div class="app view-${state.view}"><header class="topbar"><a class="brand" href="#library" aria-label="Ira’s Chinese, home">${panda('happy','brand-mark')}<span class="brand-text"><strong>Ira’s Chinese</strong><small lang="zh-Hans">一起学中文</small></span></a><nav class="nav" aria-label="Main navigation">${views.map(([id,name])=>`<button data-view="${id}" class="nav-${id} ${state.view===id?'active':''}" ${state.view===id?'aria-current="page"':''}>${icon(views.icons[id],'nav-icon')}<span>${name}</span></button>`).join('')}</nav></header>
 <main class="main"><section class="hero">${panda('happy','mascot hero-mascot')}<div class="hero-text"><h1>${says[state.view==='match'?'menu':state.view]}</h1><p class="hero-sub">${state.view==='stories'?'Listen, tap and blow along':state.view==='match'?'Pick a topic, then a game':current?`Lesson ${current.number} · ${current.coverageStatus==='missing'?'Not in the books yet':escape(current.title)}${current.coverageStatus==='partial'?' · some pages missing':''}`:'All lessons'}</p></div></section>${state.view==='stories'||state.view==='match'?'':lessonPicker()}<section id="content" aria-label="${state.view==='library'?'Word library':state.view==='stories'?'Stories':'Game'}">${content()}</section>${grownups()}</main><footer class="footer">Made with love for a curious little learner</footer></div>`;
 bind();
 if(state.view==='stories')mountStories(root.querySelector('#stories'),{celebrate});
 if(state.view==='match')mountGames(root.querySelector('#games'),{celebrate});
}
function bind(){
 root.querySelector('#open-audio-help').onclick=openAudioHelp;
 root.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>navigate(b.dataset.view));
 root.querySelector('.brand').onclick=e=>{e.preventDefault();navigate('library');};
 root.querySelectorAll('[data-lesson]').forEach(b=>b.onclick=()=>{state.lesson=b.dataset.lesson;initGame();render();});
 root.querySelector('.grownups').addEventListener('toggle',e=>{state.grownups=e.target.open;});
 root.querySelector('#search')?.addEventListener('input',e=>{state.query=e.target.value;document.querySelector('#content').innerHTML=libraryContent();bindContent();});
 root.querySelector('#extra')?.addEventListener('change',e=>{state.extra=e.target.checked;render();});
 root.querySelector('#details')?.addEventListener('change',e=>{state.details=e.target.checked;render();});
 const row=root.querySelector('.lessons'),active=row?.querySelector('.active');if(active)row.scrollLeft=active.offsetLeft-(row.clientWidth-active.offsetWidth)/2;
 bindContent();
}
function bindContent(){
 root.querySelectorAll('[data-speak]').forEach(b=>b.onclick=()=>{speak(b.dataset.speak);const card=b.closest('.word-card');if(card){card.classList.remove('boing');void card.offsetWidth;card.classList.add('boing');}});
 root.querySelectorAll('[data-kind]').forEach(b=>b.onclick=()=>{state.kind=b.dataset.kind;render();});
 root.querySelectorAll('[data-flash-kind]').forEach(b=>b.onclick=()=>{state.flashKind=b.dataset.flashKind;initGame();render();});
 const on=(id,fn)=>{const el=document.getElementById(id);if(el)el.onclick=fn;};
 // Flip in place so the card turns over instead of being redrawn.
 on('flip',()=>{state.revealed=!state.revealed;const flip=document.getElementById('flip');flip.classList.toggle('is-revealed',state.revealed);
  const [front,back]=flip.querySelectorAll('.face');const hide=(face,hidden)=>hidden?face.setAttribute('aria-hidden','true'):face.removeAttribute('aria-hidden');hide(front,state.revealed);hide(back,!state.revealed);
  if(state.revealed)speak(state.deck[state.index].id);});
 on('next',()=>{if(state.index===state.deck.length-1){celebrate();chime('yay');}state.index=(state.index+1)%state.deck.length;state.revealed=false;render();});
 on('previous',()=>{state.index=Math.max(0,state.index-1);state.revealed=false;render();});
 on('install-app',async()=>{if(!installPrompt)return;installPrompt.prompt();await installPrompt.userChoice.catch(()=>{});installPrompt=null;render();});

}
function navigate(view){stopStory();stopGames();state.view=view;if(state.lesson==='all'&&view!=='library')state.lesson='lesson-34';initGame();render();window.scrollTo({top:0});}
async function start(){try {const response=await fetch(new URL('../data/library.json',import.meta.url));if(!response.ok)throw new Error('Library unavailable');library=await response.json();library.items.forEach(i=>byId.set(i.id,i));const audioManifest=await (await fetch(new URL('../assets/audio/manifest.json',import.meta.url))).json();timings=Object.fromEntries(Object.values(audioManifest).map(e=>[e.file,e.speech]));initGame();render();}catch(error){root.innerHTML='<div class="empty"><h1>The library could not open.</h1><p>Please check your connection and reload the page.</p><button class="button" id="reload">Try again</button></div>';document.getElementById('reload').onclick=()=>location.reload();}}
function registerLibraryTool(){
 const context=document.modelContext;if(!context?.registerTool)return;
 const lifecycle=new AbortController();window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
 try{Promise.resolve(context.registerTool({name:'browse_chinese_library',title:'Browse the Chinese library',description:'Open the word library at a lesson and search term. Does not approve content or change learning progress.',inputSchema:{type:'object',properties:{lessonId:{type:'string'},query:{type:'string'},kind:{type:'string',enum:['word','phrase','sentence']}},required:['lessonId'],additionalProperties:false},annotations:{readOnlyHint:false},execute(input){
 if(!input||typeof input!=='object'||Object.keys(input).some(k=>!['lessonId','query','kind'].includes(k))||!['all',...library.lessons.map(l=>l.id)].includes(input.lessonId)||(input.query!==undefined&&typeof input.query!=='string')||(input.kind!==undefined&&!['word','phrase','sentence'].includes(input.kind)))throw new Error('Provide a valid lessonId, optional text query and word/phrase/sentence kind.');
 state.lesson=input.lessonId;state.query=input.query||'';state.kind=input.kind||'word';navigate('library');return {lessonId:state.lesson,count:scoped({kind:state.kind,query:state.query,scope:state.extra?'all':'core'}).length};
 }},{signal:lifecycle.signal})).catch(()=>{});}catch{}
}
start().then(()=>{if(library)registerLibraryTool();});
// Offline support for the installed app (and a faster start for everyone).
if('serviceWorker' in navigator)navigator.serviceWorker.register(new URL('../sw.js',import.meta.url)).catch(()=>{});
