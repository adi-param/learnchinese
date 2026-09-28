import {createAudioPlayer} from './audio-player.js';
import {showAudioHelp} from './audio-help.js';
import {femaleMandarinVoice, PRONUNCIATION_RATE} from './speech.js';
import {lessonItems,shuffle,matchingWords,sentenceComplete,sourceLabel,drawRound,MATCH_LEVELS,nextLevel,balloonOptions,recordMatch} from './core.js';
import {loadProgress,saveProgress} from './progress.js';
import {fill,slotsOf,optionOf} from './sentences.js';
import {illustrations,animal} from './illustrations.js';
import {lessonPictures,pictureFor,picturesOf,renderPicture} from './pictures.js';
import {chime} from './sfx.js';
import {icon,mascot,HATS} from './icons.js';
const root=document.querySelector('#app');
const views=[['library','Words'],['flashcards','Flip cards'],['match','Games'],['sentences','Build']];
views.icons={library:'words',flashcards:'cards',match:'match',sentences:'build'};
const says={library:'Tap a card to hear it',flashcards:'Look, say it, then flip',match:'Find the pairs',balloons:'Pop the right balloon',sentences:'Put the words on the train',swap:'Swap a word, make a new sentence',silly:'Spin a silly sentence'};
let library;let patterns; let voiceList=[];let lastSpoken=null;let voiceRequest=0;
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
const state={view:'library',lesson:'lesson-34',kind:'word',flashKind:'word',query:'',extra:false,details:false,grownups:false,stars:0,pop:false,deck:[],index:0,revealed:false,round:null,sentence:null,selected:[],feedback:'',awarded:false,wrong:null,justMatched:null,matchQueue:[],matchKey:null,matchMode:'pairs',roundsDone:0,coachReact:null,sayNext:false,buildMode:'train',swap:null,silly:null,made:new Set()};
const progress=loadProgress();
// The panda wears whichever hat was chosen in the sticker book.
const panda=(mood,cls)=>mascot(mood,cls,progress.hat);
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
const gameKind=()=>state.view==='sentences'?'sentence':state.view==='flashcards'?state.flashKind:'word';
function award(){state.stars++;state.pop=true;}
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
 // In Games, Mix lets several lessons be chosen at once.
 const mixing=state.view==='match'&&progress.mix,chosen=id=>mixing?progress.mixLessons.includes(id):id===state.lesson;
 const mix=state.view==='match'?`<button class="lesson-chip mix-chip ${progress.mix?'active':''}" id="mix-toggle" aria-pressed="${progress.mix}" aria-label="Mix words from several lessons"><span class="chip-pic" aria-hidden="true">${icon('shuffle','chip-icon')}</span><span class="chip-num">Mix</span></button>`:'';
 return `<div class="lessons-wrap"><div class="lessons ${mixing?'mixing':''}" role="group" aria-label="Choose a lesson">${mix}${list.map(l=>{const missing=l.coverageStatus==='missing';return `<button class="lesson-chip ${missing?'missing':''} ${chosen(l.id)?'active':''}" data-lesson="${l.id}" aria-pressed="${chosen(l.id)}" aria-label="${l.id==='all'?'All lessons':`Lesson ${l.number}: ${escape(l.title)}${missing?' (not in the books yet)':''}`}"><span class="chip-pic" aria-hidden="true">${missing?'':renderPicture(lessonPictures[l.id])}</span><span class="chip-num">${l.number}</span>${mixing&&chosen(l.id)?`<span class="chip-check" aria-hidden="true">${icon('check')}</span>`:''}</button>`;}).join('')}</div></div>`;
}
function grownups(){
 const current=lesson();
 const controls=state.view==='library'
  ?`<label class="field grow"><span>Find a word</span><span class="input-wrap">${icon('search','input-icon')}<input id="search" type="search" placeholder="Chinese, Pinyin or English" value="${escape(state.query)}"></span></label><label class="toggle"><input id="extra" type="checkbox" ${state.extra?'checked':''}><span class="switch"></span>Include activity instructions</label><label class="toggle"><input id="details" type="checkbox" ${state.details?'checked':''}><span class="switch"></span>Show sources and review status</label>`
  :state.view==='match'?`<div class="gu-section"><h3>Words in play</h3><p class="gu-hint">Tap a word to leave it out of the games. Turn on Mix above to add more lessons.</p><div class="word-toggles">${matchPool({all:true}).map(w=>{const off=progress.excluded.includes(w.id);return `<button class="word-toggle ${off?'off':''}" data-exclude="${w.id}" aria-pressed="${!off}"><span class="hanzi" lang="zh-Hans">${escape(w.hanzi)}</span><small>${escape(w.english.split(';')[0])}</small></button>`;}).join('')}</div></div><div class="gu-section"><h3>How it’s going</h3>${progressTable()}</div>`:``;
 return `<details class="grownups" ${state.grownups?'open':''}><summary>${icon('grownups')}<span>For grown-ups</span>${icon('chevron','icon chevron')}</summary><div class="gu-body"><div class="gu-grid">${controls}</div>${current?.notes.length?`<p class="lesson-note">${current.notes.map(escape).join(' ')}</p>`:''}<p class="gu-note">Pinyin and meanings are drafts awaiting review. Recordings are slow synthetic female Mandarin, not textbook audio. Pictures are hints, not translations. Stars reset when the page closes; stickers, hats and game progress are saved on this device only.</p>${installSection()}<p class="gu-links"><button class="text-button" id="open-audio-help">${icon('speaker')} Sound help</button><a class="text-button" href="./docs/library.md">Complete lesson library</a></p></div></details>`;
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
 return `<article class="word-card ${i.kind} tone-${n%5}"><button class="card-tap" data-speak="${i.id}" title="Tap to listen">${i.kind==='word'?picture(i):''}<span class="card-text"><span class="hanzi" lang="zh-Hans">${escape(i.hanzi)}</span><span class="pinyin" lang="zh-Latn">${escape(i.pinyin)}</span><span class="meaning">${escape(i.english)}</span></span><span class="play" aria-hidden="true">${icon('speaker')}</span></button>${meta}</article>`;
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
 state.feedback='';state.selected=[];state.index=0;state.revealed=false;state.sentence=null;state.awarded=false;
 state.deck=shuffle(practice(gameKind()));
 newMatchRound();
 if(state.view==='sentences') nextSentence(false);
}
function flashContent(){
 const kinds=`<div class="segmented flash-kinds" role="group" aria-label="Cards to practise">${[['word','Words'],['phrase','Phrases']].map(([id,name])=>`<button data-flash-kind="${id}" class="${state.flashKind===id?'active':''}" aria-pressed="${state.flashKind===id}">${name}</button>`).join('')}</div>`;
 const item=state.deck[state.index];if(!item)return kinds+empty('happy',`No ${state.flashKind==='word'?'words':'phrases'} here yet`,'Try the other cards or pick another lesson above.');
 const last=state.index===state.deck.length-1;
 return `${kinds}<div class="progress-row"><div class="progress" role="img" aria-label="Card ${state.index+1} of ${state.deck.length}"><div class="progress-fill" style="width:${(state.index+1)/state.deck.length*100}%"></div></div><span class="progress-label">${state.index+1} / ${state.deck.length}</span></div>
 <button class="flash ${state.revealed?'is-revealed':''}" id="flip"><span class="flash-inner"><span class="face front" ${state.revealed?'aria-hidden="true"':''}><span class="hanzi" lang="zh-Hans">${escape(item.hanzi)}</span><span class="flash-hint">Tap to flip</span></span><span class="face back" ${state.revealed?'':'aria-hidden="true"'}>${picture(item,'stage large')}<span class="hanzi" lang="zh-Hans">${escape(item.hanzi)}</span><span class="pinyin" lang="zh-Latn">${escape(item.pinyin)}</span><span class="meaning">${escape(item.english)}</span></span></span></button>
 <div class="game-actions"><button class="round-button" id="previous" aria-label="Previous card" ${state.index===0?'disabled':''}>${icon('left')}</button><button class="round-button listen" data-speak="${item.id}" aria-label="Listen">${icon('speaker')}</button><button class="round-button go" id="next" aria-label="${last?'Finish and start again':'Next card'}">${icon(last?'flag':'right')}</button></div>`;
}
// Each matched pair keeps one colour for its tiles and the arrow joining them.
const pairColours=['#7c5cff','#ff7a45','#12a879','#2b8ef0','#f0507a'];
// Stickers are the thing drawings; one is won for each finished round until the book is full.
const STICKERS=['horse','duck','cow','sheep','rabbit','sun','moon','tree','mountain','boat','train','strawberry','cake','chocolate','milk','biscuit','grapes','vegetables','ball','toys','blocks','shoes','socks','school'];
const praiseText={'right-1':'对了！','right-2':'真棒！','right-3':'好厉害！',again:'再试试！',done:'太棒了！'};
const praiseUrl=key=>new URL(`../assets/audio/praise-${key}.m4a`,import.meta.url).href;
const wordUrl=item=>new URL('../'+item.audio,import.meta.url).href;
// Lessons feeding the games: one lesson, or several when grown-ups turn on Mix.
const matchLessons=()=>progress.mix&&progress.mixLessons.length?progress.mixLessons:[state.lesson];
function matchPool({all=false}={}){
 const seen=new Set();
 const words=matchingWords(matchLessons().flatMap(id=>lessonItems(library,id,{kind:'word'})).filter(w=>!seen.has(w.id)&&seen.add(w.id)));
 return all?words:words.filter(w=>!progress.excluded.includes(w.id));
}
function newMatchRound(){
 const pool=matchPool(),key=matchLessons().join(',')+'|'+progress.excluded.join(',');
 if(state.matchKey!==key){state.matchKey=key;state.matchQueue=[];}
 const size=Math.min(MATCH_LEVELS[progress.level]||MATCH_LEVELS[0],pool.length);
 const dealt=drawRound(state.matchQueue,pool,size,Math.random,progress.missed.map(id=>byId.get(id)).filter(Boolean));
 state.matchQueue=dealt.queue;
 const words=dealt.words,pairs=state.matchMode==='pairs';
 state.round={words,chars:shuffle(words),pics:shuffle(words),
  reverse:pairs&&state.roundsDone%2===1,matched:[],charPick:null,picPick:null,mistakes:0,misses:{},hint:null,done:false,recap:false,reward:null,
  balloon:pairs?null:{queue:words.map(w=>w.id)}};
 if(!pairs)nextBalloon();
}
const leftKind=()=>state.round.reverse?'pic':'char';
const rightKind=()=>state.round.reverse?'char':'pic';
function matchTile(i,kind){
 const r=state.round,pair=r.matched.indexOf(i.id),matched=pair>=0,selected=r[kind+'Pick']===i.id,pic=pictureFor(i,byId);
 const classes=['match-tile',kind==='char'?'chinese':'picture',matched&&'matched',selected&&'selected',state.wrong?.[kind]===i.id&&'shake',state.justMatched===i.id&&'pop',
  r.hint===i.id&&kind===rightKind()&&'hint'].filter(Boolean).join(' ');
 const face=kind==='char'?`<span class="hanzi" lang="zh-Hans">${escape(i.hanzi)}</span>`:pic?`<span class="stage small" aria-hidden="true">${pic}</span><span class="caption">${escape(i.english)}</span>`:`<span class="caption big">${escape(i.english)}</span>`;
 const button=`<button data-match="${kind}" data-pair="${i.id}" class="${classes}" ${matched?`style="--pair:${pairColours[pair%5]}"`:''} aria-pressed="${selected}" ${matched||r.done?'disabled':''}>${face}${matched?`<span class="tick" aria-hidden="true">${icon('check')}</span>`:''}</button>`;
 // Sound is a separate choice: tapping the word only selects it.
 const listen=kind==='char'?`<button class="tile-listen" data-speak="${i.id}" aria-label="Listen to ${escape(i.hanzi)}">${icon('speaker')}</button>`:'';
 return `<div class="tile-slot">${button}${listen}</div>`;
}
const coach=(mood,text,extra='')=>`<div class="coach">${panda(mood,`mascot small ${state.coachReact||''}`)}<p class="bubble" role="status">${text}${extra}</p></div>`;
function pairsBoard(){
 const r=state.round,column=kind=>(kind==='char'?r.chars:r.pics).map(i=>matchTile(i,kind)).join(''),label=kind=>kind==='char'?'Chinese words':'Pictures';
 return `<div class="match-grid ${r.pics.length>5?'compact':''}" id="match-grid"><svg class="links" aria-hidden="true"></svg><div class="match-column" role="group" aria-label="${label(leftKind())}">${column(leftKind())}</div><div class="match-column" role="group" aria-label="${label(rightKind())}">${column(rightKind())}</div></div>`;
}
// Balloon pop: the panda says a word and she pops the balloon carrying its character.
const balloonColours=['#7c5cff','#ff7a45','#12a879','#2b8ef0','#f0507a'];
function nextBalloon(){
 const r=state.round,b=r.balloon,id=b.queue.shift();if(!id)return false;
 const target=byId.get(id),count=Math.min(progress.level>0?4:3,matchPool().length);
 Object.assign(b,{current:id,options:balloonOptions(target,matchPool(),count).map(w=>w.id),gone:[],popped:null,hint:false,advanced:false,advance:null});
 state.sayNext=true;return true;
}
function balloonBoard(){
 const r=state.round,b=r.balloon;
 const balloons=b.options.map((id,k)=>{
  const w=byId.get(id),cls=[b.popped===id&&'popped',b.gone.includes(id)&&'gone',b.hint&&id===b.current&&!b.popped&&'hint'].filter(Boolean).join(' ');
  const burst=b.popped===id?`<span class="burst" aria-hidden="true">${Array.from({length:10},(_,n)=>`<i style="--a:${n*36}deg;--c:${balloonColours[(n+k)%5]}"></i>`).join('')}</span>`:'';
  return `<button class="balloon ${cls}" data-balloon="${id}" style="--balloon:${balloonColours[k%5]};--delay:-${(k*.7).toFixed(1)}s" aria-label="${escape(w.hanzi)}" ${b.popped||b.gone.includes(id)?'disabled':''}><svg class="balloon-art" viewBox="0 0 100 160" aria-hidden="true"><path d="M50 122q-6 12 2 22t-2 16" fill="none" stroke="#1f1b3a" stroke-width="2" stroke-linecap="round"/><path d="M50 116C22 102 8 76 8 52A42 42 0 0 1 92 52C92 76 78 102 50 116Z" fill="var(--balloon)" stroke="#1f1b3a" stroke-width="3"/><path d="M44 122h12l-6-7z" fill="var(--balloon)" stroke="#1f1b3a" stroke-width="2.5" stroke-linejoin="round"/><ellipse cx="32" cy="36" rx="7" ry="13" fill="#fff" opacity=".4" transform="rotate(25 32 36)"/></svg><span class="hanzi" lang="zh-Hans">${escape(w.hanzi)}</span>${burst}</button>`;
 }).join('');
 const dots=r.words.map((w,k)=>`<span class="pop-dot ${k<r.matched.length?'on':''}"></span>`).join('');
 // After the right pop, the word's picture, Pinyin and meaning spring up from the burst.
 const found=b.popped&&byId.get(b.popped);
 const reveal=found?`<div class="reveal-card" role="status">${picture(found,'stage reveal-stage')}<span class="hanzi" lang="zh-Hans">${escape(found.hanzi)}</span><span class="pinyin" lang="zh-Latn">${escape(found.pinyin)}</span><span class="meaning">${escape(found.english)}</span><button class="button primary" id="balloon-next">${b.queue.length?'Next':'Finish'}${icon('right')}</button></div>`:'';
 return `<div class="balloon-stage ${found?'revealing':''}"><button class="hear-target" id="hear-target" aria-label="Hear the word again">${icon('speaker')}</button><div class="balloons">${balloons}</div>${reveal}<div class="pop-progress" aria-label="${r.matched.length} of ${r.words.length} words found">${dots}</div></div>`;
}
function sayTarget(){const b=state.round?.balloon;if(b?.current)player.play(wordUrl(byId.get(b.current)));}
function recapContent(){
 const r=state.round,w=r.reward;
 const sticker=w.sticker?`<div class="reward">${`<span class="reward-art">${illustrations[w.sticker]}</span>`}<div><strong>New sticker!</strong><span>Tap the star to see your sticker book.</span></div></div>`:'';
 const hat=w.hat?`<div class="reward">${mascot('cheer','mascot reward-panda',w.hat)}<div><strong>The panda won a new hat!</strong><span>Three perfect rounds in a row.</span></div></div>`
  :w.streakLeft?`<p class="streak-note">${progress.streak} perfect round${progress.streak>1?'s':''} in a row. ${w.streakLeft} more for a surprise!</p>`:'';
 return `<div class="recap"><h2>You learned</h2><div class="game-actions recap-actions"><button class="button primary big" id="new-round">${icon('shuffle')}Play again</button><button class="button secondary" id="recap-again">${icon('speaker')}Hear them again</button></div><div class="recap-cards">${r.words.map((i,n)=>`<div class="recap-card" data-recap="${n}"><span class="stage small" aria-hidden="true">${pictureFor(i,byId)}</span><span class="hanzi" lang="zh-Hans">${escape(i.hanzi)}</span><span class="pinyin" lang="zh-Latn">${escape(i.pinyin)}</span></div>`).join('')}</div>${sticker}${hat}</div>`;
}
// Brings the recap's top (with Play again) into view, clear of the header, on any screen size.
function showRecap(){const recap=root.querySelector('.recap');if(recap)scrollTo({top:recap.getBoundingClientRect().top+scrollY-12,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}
// The recap shows each matched word in turn as it is spoken.
function playRecap(){
 const cards=[...root.querySelectorAll('[data-recap]')];cards.forEach(c=>c.classList.remove('shown'));
 player.playAll(state.round.words.map(wordUrl),{gap:450,onStep(index){if(index<0)cards.forEach(c=>c.classList.add('shown'));else cards[index]?.classList.add('shown');}});
}
function matchContent(){
 const r=state.round,balloons=state.matchMode==='balloons';
 const streak=Array.from({length:3},(_,n)=>icon('star',`streak-star ${n<progress.streak?'on':''}`)).join('');
 const bar=`<div class="match-bar"><div class="segmented" role="group" aria-label="Game">${[['pairs','Pairs'],['balloons','Balloon pop']].map(([id,name])=>`<button data-match-mode="${id}" class="${state.matchMode===id?'active':''}" aria-pressed="${state.matchMode===id}">${name}</button>`).join('')}</div><span class="level-pill">Level ${progress.level+1} · ${r.words.length} ${balloons?'words':'pairs'}<span class="streak" title="Perfect rounds in a row">${streak}</span></span></div>`;
 if(r.words.length<2)return bar+empty('happy','Not enough words to match',progress.excluded.length?'Turn some words back on in For grown-ups, or add more lessons.':'This lesson needs at least two different words. Pick another lesson.');
 if(r.recap)return bar+recapContent();
 const prompt=balloons?'Listen, then pop the balloon with that word.':r.reverse?'Tap a picture, then find its Chinese word.':'Tap a Chinese word, then find its picture.';
 return `${bar}${balloons?balloonBoard():pairsBoard()}${coach(r.done||state.coachReact==='dance'?'cheer':'happy',state.feedback||prompt)}
 <div class="game-actions"><button class="button secondary" id="new-round">${icon('shuffle')}New words</button></div>`;
}
// Draws an arrow from each matched tile in the left column to its partner; the newest one animates in.
function drawLinks(){
 const grid=document.getElementById('match-grid');if(!grid)return;
 const svg=grid.querySelector('.links'),box=grid.getBoundingClientRect();
 svg.setAttribute('viewBox',`0 0 ${box.width} ${box.height}`);
 svg.innerHTML=state.round.matched.map((id,n)=>{
  const a=grid.querySelector(`[data-match=${leftKind()}][data-pair="${id}"]`)?.getBoundingClientRect(),b=grid.querySelector(`[data-match=${rightKind()}][data-pair="${id}"]`)?.getBoundingClientRect();
  if(!a||!b)return '';
  const x1=a.right-box.left-4,y1=a.top+a.height/2-box.top,x2=b.left-box.left+2,y2=b.top+b.height/2-box.top,mid=(x1+x2)/2;
  return `<g class="link${id===state.freshLink?' fresh':''}" style="--pair:${pairColours[n%5]}"><path class="line" d="M${x1} ${y1}C${mid} ${y1} ${mid} ${y2} ${x2-9} ${y2}" pathLength="1"/><path class="head" d="M${x2-12} ${y2-8}L${x2} ${y2}L${x2-12} ${y2+8}Z"/><circle cx="${x1}" cy="${y1}" r="6"/></g>`;
 }).join('');
 state.freshLink=null;
}
addEventListener('resize',()=>{if(state.view==='match')drawLinks();});
// A correct pair: say the word, then praise in Mandarin; the last pair ends the round.
function pairFound(id){
 const r=state.round;r.matched.push(id);state.justMatched=id;state.freshLink=id;state.coachReact='dance';award();
 const all=r.matched.length===r.words.length,praise=all?'done':`right-${1+Math.floor(Math.random()*3)}`;
 state.feedback=`<span lang="zh-Hans">${praiseText[praise]}</span> ${all?'You found every pair!':'That’s a match!'}`;
 player.playAll([wordUrl(byId.get(id)),praiseUrl(praise)],{gap:150,onStep:index=>{if(index<0&&all)chime('fanfare');}});
 if(all)finishRound();
}
function finishRound(){
 const r=state.round;r.done=true;let hat=null;state.roundsDone++;
 {
  const next=nextLevel({level:progress.level,perfect:progress.levelPerfect},{mistakes:r.mistakes,size:r.words.length});progress.level=next.level;progress.levelPerfect=next.perfect;
  if(r.mistakes===0){progress.streak++;if(progress.streak>=3){progress.streak=0;hat=HATS.find(h=>!progress.hats.includes(h))||null;if(hat){progress.hats.push(hat);progress.hat=hat;}}}else progress.streak=0;
 }
 const spare=STICKERS.filter(s=>!progress.stickers.includes(s)),sticker=spare.length?spare[Math.floor(Math.random()*spare.length)]:null;
 if(sticker)progress.stickers.push(sticker);
 saveProgress(progress);
 r.reward={sticker,hat,streakLeft:r.mistakes===0&&!hat?3-progress.streak:0};
 celebrate(true);
 setTimeout(()=>{if(state.round===r&&state.view==='match'){r.recap=true;render();showRecap();playRecap();}},4300);
}
function openAlbum(){
 document.querySelector('#album')?.remove();
 const dialog=document.createElement('dialog');dialog.id='album';dialog.className='album';
 const draw=()=>{dialog.innerHTML=`<h2>My sticker book</h2><p class="album-count">${progress.stickers.length} of ${STICKERS.length} stickers</p><div class="album-grid">${STICKERS.map(s=>progress.stickers.includes(s)?`<span class="album-slot owned">${illustrations[s]}</span>`:`<span class="album-slot"><span class="slot-shadow">${illustrations[s]}</span></span>`).join('')}</div>${progress.hats.length?`<h3>Panda hats</h3><div class="hat-row">${[null,...progress.hats].map(h=>`<button class="hat-choice ${progress.hat===h?'active':''}" data-hat="${h||''}" aria-label="${h?`Wear the ${h} hat`:'No hat'}" aria-pressed="${progress.hat===h}">${mascot('happy','mascot hat-panda',h)}</button>`).join('')}</div>`:'<p class="album-hint">Three perfect rounds in a row win the panda a hat.</p>'}<div class="game-actions"><button class="button primary" id="close-album">Close</button></div>`;
  dialog.querySelector('#close-album').onclick=()=>dialog.close();
  dialog.querySelectorAll('[data-hat]').forEach(b=>b.onclick=()=>{progress.hat=b.dataset.hat||null;saveProgress(progress);draw();});
 };
 draw();document.body.append(dialog);dialog.addEventListener('close',()=>{dialog.remove();render();});dialog.showModal();
}
function progressTable(){
 const rows=matchPool({all:true}).map(w=>({w,...(progress.stats[w.id]||{right:0,mixed:0})})).filter(x=>x.right||x.mixed).sort((a,b)=>b.mixed-a.mixed||a.right-b.right);
 if(!rows.length)return '<p class="gu-hint">Play a few rounds to see which characters are going well.</p>';
 const status=x=>x.mixed>x.right?['tricky','Tricky']:x.right>=3&&x.mixed*3<=x.right?['known','Knows it']:['practising','Practising'];
 return `<table class="progress-table"><thead><tr><th>Character</th><th>First try</th><th>Mixed up</th><th></th></tr></thead><tbody>${rows.map(x=>{const [cls,label]=status(x);return `<tr><td><span class="hanzi" lang="zh-Hans">${escape(x.w.hanzi)}</span> <small>${escape(x.w.english.split(';')[0])}</small></td><td>${x.right}</td><td>${x.mixed}</td><td><span class="status ${cls}">${label}</span></td></tr>`;}).join('')}</tbody></table><button class="text-button" id="reset-progress">Reset game progress</button>`;
}

function nextSentence(advance=true){if(advance)state.index=(state.index+1)%state.deck.length;state.sentence=state.deck[state.index];state.selected=[];state.feedback='';state.awarded=false;state.bank=state.sentence?shuffle(state.sentence.wordIds.map((id,index)=>({id,index}))):[];}
function sentenceContent(){
 const s=state.sentence;if(!s)return empty('happy','No sentences in this lesson','Try Lesson 34 — it has lots.');
 const complete=sentenceComplete(s.wordIds,state.selected.map(t=>t.id)),won=complete&&state.feedback,pic=pictureFor(s,byId);
 return `<div class="prompt-card">${pic?`<span class="stage wide" aria-hidden="true">${pic}</span>`:''}<p class="prompt-text">${escape(s.english)}</p><div class="prompt-actions"><button class="button secondary" data-speak="${s.id}">${icon('speaker')}Hear it</button><button class="button secondary" id="word-by-word">${icon('words')}Word by word</button></div></div>
 <div class="track" aria-label="Your sentence">${state.selected.length?state.selected.map((t,index)=>`<button class="token placed hanzi" lang="zh-Hans" data-remove="${index}" aria-label="Remove ${escape(byId.get(t.id).hanzi)}">${escape(byId.get(t.id).hanzi)}</button>`).join(''):'<span class="track-hint">Tap the words below</span>'}</div>
 <div class="word-bank">${state.bank.map(t=>`<button class="token hanzi" lang="zh-Hans" data-token="${t.index}" ${state.selected.some(a=>a.index===t.index)?'disabled':''}>${escape(byId.get(t.id).hanzi)}<small lang="zh-Latn">${escape(byId.get(t.id).pinyin)}</small></button>`).join('')}</div>
 ${coach(won?'cheer':'happy',state.feedback||'Tap each word to hear it and add it to the train.',won?`<span class="answer"><span class="hanzi" lang="zh-Hans">${escape(s.hanzi)}</span><span lang="zh-Latn">${escape(s.pinyin)}</span></span>`:'')}
 <div class="game-actions"><button class="button secondary" id="reset-sentence">${icon('again')}Again</button><button class="button primary" id="check-sentence">${icon('check')}Check</button><button class="button secondary" id="next-sentence">Next${icon('right')}</button></div><p class="counter">Sentence ${state.index+1} of ${state.deck.length}</p>`;
}
// Swap it and the Silly machine: new sentences from lesson patterns (data/patterns.json).
const patternById=id=>patterns.patterns.find(p=>p.id===id);
const patternAudio=sentence=>new URL('../'+sentence.audio,import.meta.url).href;
function sceneArt(pattern,choice){
 const pick=slot=>optionOf(patterns,slot,choice[slot]),art=name=>illustrations[name]||'';
 const tile=(inner,cls='')=>`<span class="scene-tile ${cls}">${inner}</span>`;
 switch(pattern.scene){
  case 'eat':return tile(art(pick('who').art))+tile(art(pattern.relation),'small')+tile(art(pick('food').art));
  case 'on':{const place=pick('place');return tile(`<span class="on-place">${art(place.art)}</span><span class="on-thing" style="bottom:${place.surface}%">${art(pick('who').art)}</span>`,'on');}
  case 'hobby':return tile(art(pick('doer').art))+tile(art(pick('activity').art));
  case 'tasty':return tile(art(pick('food').art))+tile(art('fragrant'),'small')+tile(art('sweet'),'small');
  // A fixed tuft of grass beside the animal shows whether it is big or little.
  case 'creature':return tile(`<span class="ref">${art('grass')}</span><span class="beast">${animal(pick('animal').key,pick('colour').swatch)}</span>`,`creature ${pick('size').key}`);
 }
 return '';
}
const optionFace=option=>`<span class="stage small" aria-hidden="true">${option.art?illustrations[option.art]:`<span class="swatches"><span class="swatch" style="--swatch:${option.swatch}"></span></span>`}</span><span class="hanzi" lang="zh-Hans">${escape(option.hanzi)}</span>`;
const chunkLine=(sentence,swappable)=>sentence.parts.map(part=>part.slot&&swappable
 ?`<button class="chunk slot ${state.swap.open===part.slot?'open':''} ${state.swap.popped===part.slot?'pop':''}" data-swap-slot="${part.slot}" aria-expanded="${state.swap.open===part.slot}"><span class="hanzi" lang="zh-Hans">${escape(part.hanzi)}</span><span class="chunk-pinyin" lang="zh-Latn">${escape(part.pinyin)}</span><span class="swap-badge" aria-hidden="true">${icon('shuffle')}</span></button>`
 :`<span class="chunk ${part.slot?'filled':''}"><span class="hanzi" lang="zh-Hans">${escape(part.hanzi)}</span><span class="chunk-pinyin" lang="zh-Latn">${escape(part.pinyin)}</span></span>`).join('');
function starterRow(attr,active){
 return `<div class="starters" role="group" aria-label="Sentences">${patterns.patterns.map(p=>{const base=fill(patterns,p,p.base);return `<button class="starter ${p.id===active?'active':''}" ${attr}="${p.id}" aria-pressed="${p.id===active}" aria-label="${escape(base.hanzi)}"><span class="starter-scene" aria-hidden="true">${sceneArt(p,p.base)}</span><span class="hanzi" lang="zh-Hans">${escape(base.hanzi)}</span></button>`;}).join('')}</div>`;
}
function swapContent(){
 const w=state.swap,p=patternById(w.pattern),s=fill(patterns,p,w.choice),isBase=slotsOf(p).every(k=>w.choice[k]===p.base[k]);
 const lessonNumber=library.lessons.find(l=>l.id===p.lesson)?.number;
 const tray=w.open?`<div class="swap-tray" role="group" aria-label="Choose a new word">${patterns.slots[w.open].map(o=>`<button class="swap-option ${w.choice[w.open]===o.key?'active':''}" data-swap-pick="${o.key}">${optionFace(o)}</button>`).join('')}</div>`:'';
 return `${starterRow('data-starter',p.id)}<div class="sentence-card"><span class="sentence-tag ${isBase?'':'new'}">${isBase?`From Lesson ${lessonNumber}`:'Your new sentence!'}</span><div class="scene" aria-hidden="true">${sceneArt(p,w.choice)}</div><div class="chunks">${chunkLine(s,true)}</div>${tray}<p class="sentence-english">${escape(s.english)}</p><div class="sentence-actions"><button class="round-button listen" id="say-sentence" aria-label="Hear the sentence">${icon('speaker')}</button>${isBase?'':`<button class="button secondary" id="swap-reset">${icon('again')}Lesson sentence</button>`}</div></div>
 ${coach(state.coachReact==='dance'?'cheer':'happy',state.feedback||(w.open?'Pick a new word!':'Tap a word with the swap sign to change it.'))}`;
}
function sillyContent(){
 const m=state.silly,p=patternById(m.pattern),s=fill(patterns,p,m.choice);
 const reels=p.parts.map(part=>part.slot?`<button class="reel" data-reel="${part.slot}" aria-label="Spin this reel" ${m.spinning?'disabled':''}><span class="reel-window" id="reel-${part.slot}">${optionFace(optionOf(patterns,part.slot,m.choice[part.slot]))}</span></button>`:`<span class="reel-fixed"><span class="hanzi" lang="zh-Hans">${escape(part.hanzi)}</span></span>`).join('');
 const result=m.spun?`<div class="sentence-card silly"><div class="scene" aria-hidden="true">${sceneArt(p,m.choice)}</div><div class="chunks">${chunkLine(s,false)}</div><p class="sentence-english">${escape(s.english)}</p><div class="sentence-actions"><button class="round-button listen" id="say-sentence" aria-label="Hear the sentence">${icon('speaker')}</button></div></div>`:'';
 return `${starterRow('data-silly-pattern',p.id)}<div class="machine"><div class="reels">${reels}</div><button class="button primary big" id="spin" ${m.spinning?'disabled':''}>${icon('shuffle')}Spin!</button></div>${result}
 ${coach(m.spun?'cheer':'happy',state.feedback||'Pull the lever for a silly sentence, or tap one reel to spin it.')}`;
}
function buildContent(){
 const bar=`<div class="match-bar"><div class="segmented" role="group" aria-label="Game">${[['train','Train'],['swap','Swap it'],['silly','Silly machine']].map(([id,name])=>`<button data-build-mode="${id}" class="${state.buildMode===id?'active':''}" aria-pressed="${state.buildMode===id}">${name}</button>`).join('')}</div></div>`;
 return bar+(state.buildMode==='swap'?swapContent():state.buildMode==='silly'?sillyContent():sentenceContent());
}
// Every sentence she makes that she has not made before earns a star.
function madeSentence(sentence){if(state.made.has(sentence.audio))return false;state.made.add(sentence.audio);award();return true;}
function spinReels(slots){
 const m=state.silly,p=patternById(m.pattern);m.spinning=true;state.feedback='';render();
 const target={...m.choice};for(const slot of slots){const options=patterns.slots[slot].filter(o=>o.key!==m.choice[slot]);target[slot]=options[Math.floor(Math.random()*options.length)].key;}
 let stopped=0;chime('ding');
 slots.forEach((slot,n)=>{
  const windowEl=document.getElementById('reel-'+slot);windowEl?.classList.add('spinning');
  const timer=setInterval(()=>{const options=patterns.slots[slot];if(windowEl)windowEl.innerHTML=optionFace(options[Math.floor(Math.random()*options.length)]);},80);
  setTimeout(()=>{clearInterval(timer);if(windowEl){windowEl.classList.remove('spinning');windowEl.innerHTML=optionFace(optionOf(patterns,slot,target[slot]));}
   if(++stopped===slots.length){m.choice=target;m.spinning=false;m.spun=true;const s=fill(patterns,p,target);madeSentence(s);state.feedback=`<span lang="zh-Hans">哈哈！</span> ${escape(s.english)}`;state.coachReact='dance';render();player.play(patternAudio(s));}
  },650+n*380);
 });
}
function content(){if(state.view==='library')return libraryContent();if(state.view==='sentences'&&state.buildMode!=='train')return `<div class="game-wrap">${buildContent()}</div>`;const gate=practiceGate();return `<div class="game-wrap">${gate||`${state.view==='flashcards'?flashContent():state.view==='match'?matchContent():buildContent()}`}</div>`;}
function render(){
 const current=lesson();
 root.innerHTML=`<div class="backdrop" aria-hidden="true"></div><div class="app view-${state.view}"><header class="topbar"><a class="brand" href="#library" aria-label="Ira’s Chinese, home">${panda('happy','brand-mark')}<span class="brand-text"><strong>Ira’s Chinese</strong><small lang="zh-Hans">一起学中文</small></span></a><nav class="nav" aria-label="Main navigation">${views.map(([id,name])=>`<button data-view="${id}" class="nav-${id} ${state.view===id?'active':''}" ${state.view===id?'aria-current="page"':''}>${icon(views.icons[id],'nav-icon')}<span>${name}</span></button>`).join('')}</nav><button class="stars ${state.pop?'pop':''}" id="open-album" aria-label="${state.stars} ${state.stars===1?'star':'stars'}. Open the sticker book">${icon('star','star-icon')}<b>${state.stars}</b><span class="sticker-count" aria-hidden="true">${progress.stickers.length}</span></button></header>
 <main class="main"><section class="hero">${panda('happy','mascot hero-mascot')}<div class="hero-text"><h1>${says[state.view==='match'&&state.matchMode==='balloons'?'balloons':state.view==='sentences'&&state.buildMode!=='train'?state.buildMode:state.view]}</h1><p class="hero-sub">${state.view==='sentences'&&state.buildMode!=='train'?'Using words from your lessons':state.view==='match'&&progress.mix?`Mixing lessons ${progress.mixLessons.map(id=>library.lessons.find(l=>l.id===id).number).sort((a,b)=>a-b).join(', ')}`:current?`Lesson ${current.number} · ${current.coverageStatus==='missing'?'Not in the books yet':escape(current.title)}${current.coverageStatus==='partial'?' · some pages missing':''}`:'All lessons'}</p></div></section>${state.view==='sentences'&&state.buildMode!=='train'?'':lessonPicker()}<section id="content" aria-label="${state.view==='library'?'Word library':'Game'}">${content()}</section>${grownups()}</main><footer class="footer">Made with love for a curious little learner</footer></div>`;
 state.pop=false;state.wrong=null;state.justMatched=null;state.coachReact=null;if(state.swap)state.swap.popped=null;
 bind();
 if(state.view==='match')drawLinks();
 // Balloon pop asks its question out loud as each word comes up.
 if(state.view==='match'&&state.sayNext&&state.matchMode==='balloons'&&!state.round.recap){state.sayNext=false;sayTarget();}
}
function bind(){
 root.querySelector('#open-audio-help').onclick=openAudioHelp;
 root.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>navigate(b.dataset.view));
 root.querySelector('.brand').onclick=e=>{e.preventDefault();navigate('library');};
 root.querySelectorAll('[data-lesson]').forEach(b=>b.onclick=()=>{
  const id=b.dataset.lesson;
  if(state.view==='match'&&progress.mix){
   if(b.classList.contains('missing'))return;
   const on=progress.mixLessons.includes(id);if(on&&progress.mixLessons.length===1)return;
   progress.mixLessons=on?progress.mixLessons.filter(x=>x!==id):[...progress.mixLessons,id];saveProgress(progress);
  }else state.lesson=id;
  initGame();render();});
 root.querySelector('#mix-toggle')?.addEventListener('click',()=>{progress.mix=!progress.mix;if(progress.mix&&!progress.mixLessons.length)progress.mixLessons=[state.lesson];saveProgress(progress);initGame();render();});
 root.querySelector('#open-album').onclick=openAlbum;
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
 on('next',()=>{if(state.index===state.deck.length-1){award();celebrate();chime('yay');}state.index=(state.index+1)%state.deck.length;state.revealed=false;render();});
 on('previous',()=>{state.index=Math.max(0,state.index-1);state.revealed=false;render();});
 on('new-round',()=>{initGame();render();});
 root.querySelectorAll('[data-match]').forEach(b=>b.onclick=()=>{
  const r=state.round,kind=b.dataset.match;if(r.done)return;
  r[kind+'Pick']=b.dataset.pair;state.feedback='';
  if(r.charPick&&r.picPick){
   const anchor=r.reverse?r.picPick:r.charPick;
   if(r.charPick===r.picPick){recordMatch(progress,anchor,!r.misses[anchor]);saveProgress(progress);r.hint=null;pairFound(anchor);r.charPick=r.picPick=null;}
   else{
    r.mistakes++;r.misses[anchor]=(r.misses[anchor]||0)+1;state.wrong={char:r.charPick,pic:r.picPick};state.coachReact='shake';
    player.play(praiseUrl('again'));
    // After two misses the right partner glows, and the first tile stays selected.
    if(r.misses[anchor]>=2&&r.words.some(w=>w.id===anchor)){r.hint=anchor;state.feedback=`<span lang="zh-Hans">${praiseText.again}</span> Look, here it is!`;}
    else state.feedback=`<span lang="zh-Hans">${praiseText.again}</span> Let’s try again.`;
    r.charPick=r.picPick=null;if(r.hint)r[r.reverse?'picPick':'charPick']=anchor;
   }
  }
  render();});
 root.querySelectorAll('[data-balloon]').forEach(el=>el.onclick=()=>{
  const r=state.round,b=r.balloon,id=el.dataset.balloon;if(!b||b.popped||r.done||b.gone.includes(id))return;
  const target=byId.get(b.current);
  if(id===b.current){
   b.popped=id;recordMatch(progress,id,!r.misses[id]);saveProgress(progress);r.matched.push(id);award();state.coachReact='dance';
   const last=!b.queue.length,praise=last?'done':`right-${1+Math.floor(Math.random()*3)}`;
   state.feedback=`<span lang="zh-Hans">${praiseText[praise]}</span> ${last?'You found every word!':'Pop!'}`;
   chime('ding');player.playAll([wordUrl(target),praiseUrl(praise)],{gap:150,onStep:index=>{if(index<0&&last)chime('fanfare');}});
   const advance=()=>{clearTimeout(b.timer);if(state.round!==r||b.advanced)return;b.advanced=true;if(last)finishRound();else nextBalloon();render();};
   b.advance=advance;b.timer=setTimeout(advance,3200);
  }else{
   r.mistakes++;r.misses[b.current]=(r.misses[b.current]||0)+1;b.gone.push(id);state.coachReact='shake';
   if(r.misses[b.current]>=2)b.hint=true;
   state.feedback=`<span lang="zh-Hans">${praiseText.again}</span> ${b.hint?'Look, this one!':'Listen again.'}`;
   player.playAll([praiseUrl('again'),wordUrl(target)],{gap:250});
  }
  render();});
 on('hear-target',sayTarget);
 on('balloon-next',()=>state.round.balloon?.advance?.());
 root.querySelectorAll('[data-match-mode]').forEach(b=>b.onclick=()=>{state.matchMode=b.dataset.matchMode;initGame();render();});
 on('recap-again',playRecap);
 root.querySelectorAll('[data-build-mode]').forEach(b=>b.onclick=()=>{state.buildMode=b.dataset.buildMode;state.feedback='';initGame();render();});
 root.querySelectorAll('[data-starter]').forEach(b=>b.onclick=()=>{const p=patternById(b.dataset.starter);Object.assign(state.swap,{pattern:p.id,choice:{...p.base},open:null});state.feedback='';render();player.play(patternAudio(fill(patterns,p,p.base)));});
 root.querySelectorAll('[data-swap-slot]').forEach(b=>b.onclick=()=>{state.swap.open=state.swap.open===b.dataset.swapSlot?null:b.dataset.swapSlot;render();});
 root.querySelectorAll('[data-swap-pick]').forEach(b=>b.onclick=()=>{
  const w=state.swap,p=patternById(w.pattern),slot=w.open;w.choice={...w.choice,[slot]:b.dataset.swapPick};w.open=null;w.popped=slot;
  const s=fill(patterns,p,w.choice),isBase=slotsOf(p).every(k=>w.choice[k]===p.base[k]);
  if(!isBase&&madeSentence(s)){state.feedback=`<span lang="zh-Hans">真棒！</span> A new sentence!`;state.coachReact='dance';chime('ding');}else state.feedback='';
  render();player.play(patternAudio(s));});
 on('swap-reset',()=>{const p=patternById(state.swap.pattern);Object.assign(state.swap,{choice:{...p.base},open:null});state.feedback='';render();player.play(patternAudio(fill(patterns,p,p.base)));});
 on('say-sentence',()=>{const mode=state.buildMode==='swap'?state.swap:state.silly;player.play(patternAudio(fill(patterns,patternById(mode.pattern),mode.choice)));});
 root.querySelectorAll('[data-silly-pattern]').forEach(b=>b.onclick=()=>{if(state.silly.spinning)return;const p=patternById(b.dataset.sillyPattern);Object.assign(state.silly,{pattern:p.id,choice:{...p.base},spun:false});state.feedback='';render();});
 on('spin',()=>{if(!state.silly.spinning)spinReels(slotsOf(patternById(state.silly.pattern)));});
 root.querySelectorAll('[data-reel]').forEach(b=>b.onclick=()=>{if(!state.silly.spinning)spinReels([b.dataset.reel]);});
 on('install-app',async()=>{if(!installPrompt)return;installPrompt.prompt();await installPrompt.userChoice.catch(()=>{});installPrompt=null;render();});
 root.querySelectorAll('[data-exclude]').forEach(b=>b.onclick=()=>{
  const id=b.dataset.exclude,off=progress.excluded.includes(id);
  progress.excluded=off?progress.excluded.filter(x=>x!==id):[...progress.excluded,id];saveProgress(progress);initGame();render();});
 on('reset-progress',()=>{if(!confirm('Reset game progress? Levels and the character list start again; stickers and hats stay.'))return;Object.assign(progress,{level:0,levelPerfect:0,streak:0,stats:{},missed:[]});saveProgress(progress);initGame();render();});
 root.querySelectorAll('[data-token]').forEach(b=>b.onclick=()=>{const token=state.bank.find(t=>t.index===Number(b.dataset.token));speak(token.id);state.selected.push(token);state.feedback='';render();});
 root.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{state.selected.splice(Number(b.dataset.remove),1);state.feedback='';render();});
 // Word by word: each word's own recording in order, lighting up its tile as it is spoken.
 on('word-by-word',()=>{
  const ids=state.sentence.wordIds;
  player.playAll(ids.map(id=>new URL('../'+byId.get(id).audio,import.meta.url).href),{onStep(index){
   root.querySelectorAll('.token.speaking').forEach(t=>t.classList.remove('speaking'));
   if(index>=0)root.querySelector(`[data-token="${index}"]`)?.classList.add('speaking');
  }});
 });
 on('reset-sentence',()=>{state.selected=[];state.feedback='';render();});
 on('next-sentence',()=>{nextSentence();render();});
 on('check-sentence',()=>{
  if(sentenceComplete(state.sentence.wordIds,state.selected.map(t=>t.id))){state.feedback='You built it! Choo choo!';if(!state.awarded){state.awarded=true;award();}chime('yay');celebrate();}
  else{state.feedback=state.selected.length<state.sentence.wordIds.length?'Keep going! More words need to get on the train.':'Hmm, try a different order. Tap a word on the train to take it off.';chime('oops');}
  render();});
}
function navigate(view){state.view=view;if(state.lesson==='all'&&view!=='library')state.lesson='lesson-34';initGame();render();window.scrollTo({top:0});}
async function start(){try {const response=await fetch(new URL('../data/library.json',import.meta.url));if(!response.ok)throw new Error('Library unavailable');library=await response.json();library.items.forEach(i=>byId.set(i.id,i));patterns=await (await fetch(new URL('../data/patterns.json',import.meta.url))).json();const first=patterns.patterns[0];state.swap={pattern:first.id,choice:{...first.base},open:null,popped:null};state.silly={pattern:first.id,choice:{...first.base},spun:false,spinning:false};initGame();render();}catch(error){root.innerHTML='<div class="empty"><h1>The library could not open.</h1><p>Please check your connection and reload the page.</p><button class="button" id="reload">Try again</button></div>';document.getElementById('reload').onclick=()=>location.reload();}}
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
