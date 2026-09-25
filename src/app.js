import {createAudioPlayer} from './audio-player.js';
import {showAudioHelp} from './audio-help.js';
import {femaleMandarinVoice, PRONUNCIATION_RATE} from './speech.js';
import {lessonItems,shuffle,matchingWords,sentenceComplete,sourceLabel,drawRound} from './core.js';
import {lessonPictures,pictureFor,picturesOf,renderPicture} from './pictures.js';
import {chime} from './sfx.js';
import {icon,mascot} from './icons.js';
const root=document.querySelector('#app');
const views=[['library','Words'],['flashcards','Flip cards'],['match','Match'],['sentences','Build']];
views.icons={library:'words',flashcards:'cards',match:'match',sentences:'build'};
const says={library:'Tap a card to hear it',flashcards:'Look, say it, then flip',match:'Listen, then find the picture',sentences:'Put the words on the train'};
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
const state={view:'library',lesson:'lesson-34',kind:'word',flashKind:'word',query:'',extra:false,details:false,grownups:false,stars:0,pop:false,deck:[],index:0,revealed:false,round:null,sentence:null,selected:[],feedback:'',awarded:false,wrong:null,justMatched:null,matchQueue:[],matchKey:null};
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

const empty=(mood,title,text,extra='')=>`<div class="empty">${mascot(mood,'mascot big')}<h2>${title}</h2><p>${text}</p>${extra}</div>`;
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
 box.innerHTML=rain.join('')+cannons.join('')+(grand?`<div class="hooray">${mascot('cheer','mascot hooray-mascot')}<strong>Hooray!</strong><span class="hooray-stars">${icon('star','hooray-star')}${icon('star','hooray-star')}${icon('star','hooray-star')}</span></div>`:'');
 document.body.append(box);
 if(grand)box.onclick=()=>box.remove();
 setTimeout(()=>box.remove(),grand?4200:2600);
}
// Phrases can borrow several pictures; they sit side by side as small tiles instead of one full tile.
const picture=(item,cls='stage')=>{const pic=pictureFor(item,byId),multi=picturesOf(item,byId).length>1;return `<span class="${cls}${pic?'':' blank'}${multi?' multi':''}" aria-hidden="true">${pic||'<span class="stage-glyph">字</span>'}</span>`;};

function lessonPicker(){
 const list=[...(state.view==='library'?[{id:'all',number:'All'}]:[]),...library.lessons];const current=lesson();
 return `<div class="lessons-wrap"><div class="lessons" role="group" aria-label="Choose a lesson">${list.map(l=>{const missing=l.coverageStatus==='missing';return `<button class="lesson-chip ${missing?'missing':''} ${l.id===state.lesson?'active':''}" data-lesson="${l.id}" aria-pressed="${l.id===state.lesson}" aria-label="${l.id==='all'?'All lessons':`Lesson ${l.number}: ${escape(l.title)}${missing?' (not in the books yet)':''}`}"><span class="chip-pic" aria-hidden="true">${missing?'':renderPicture(lessonPictures[l.id])}</span><span class="chip-num">${l.number}</span></button>`;}).join('')}</div></div>`;
}
function grownups(){
 const current=lesson();
 const controls=state.view==='library'
  ?`<label class="field grow"><span>Find a word</span><span class="input-wrap">${icon('search','input-icon')}<input id="search" type="search" placeholder="Chinese, Pinyin or English" value="${escape(state.query)}"></span></label><label class="toggle"><input id="extra" type="checkbox" ${state.extra?'checked':''}><span class="switch"></span>Include activity instructions</label><label class="toggle"><input id="details" type="checkbox" ${state.details?'checked':''}><span class="switch"></span>Show sources and review status</label>`
  :``;
 return `<details class="grownups" ${state.grownups?'open':''}><summary>${icon('grownups')}<span>For grown-ups</span>${icon('chevron','icon chevron')}</summary><div class="gu-body"><div class="gu-grid">${controls}</div>${current?.notes.length?`<p class="lesson-note">${current.notes.map(escape).join(' ')}</p>`:''}<p class="gu-note">Pinyin and meanings are drafts awaiting review. Recordings are slow synthetic female Mandarin, not textbook audio. Pictures are hints, not translations. Stars reset when the page closes.</p><p class="gu-links"><button class="text-button" id="open-audio-help">${icon('speaker')} Sound help</button><a class="text-button" href="./docs/library.md">Complete lesson library</a></p></div></details>`;
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
 const pool=matchingWords(practice());const key=state.lesson;
 if(state.matchKey!==key){state.matchKey=key;state.matchQueue=[];}
 const dealt=drawRound(state.matchQueue,pool);state.matchQueue=dealt.queue;const words=dealt.words;
 state.round={left:words,right:shuffle(words),matched:[],leftPick:null,rightPick:null};
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
function tile(i,side){
 const r=state.round,pair=r.matched.indexOf(i.id),matched=pair>=0,selected=r[side+'Pick']===i.id,pic=pictureFor(i,byId);
 const classes=['match-tile',side==='left'?'chinese':'picture',matched&&'matched',selected&&'selected',state.wrong?.[side]===i.id&&'shake',state.justMatched===i.id&&'pop'].filter(Boolean).join(' ');
 const face=side==='left'?`<span class="hanzi" lang="zh-Hans">${escape(i.hanzi)}</span>`:pic?`<span class="stage small" aria-hidden="true">${pic}</span><span class="caption">${escape(i.english)}</span>`:`<span class="caption big">${escape(i.english)}</span>`;
 const button=`<button data-pair="${i.id}" data-side="${side}" class="${classes}" ${matched?`style="--pair:${pairColours[pair%5]}"`:''} aria-pressed="${selected}" ${matched?'disabled':''}>${face}${matched?`<span class="tick" aria-hidden="true">${icon('check')}</span>`:''}</button>`;
 // Sound is a separate choice: tapping the word only selects it.
 const listen=side==='left'?`<button class="tile-listen" data-speak="${i.id}" aria-label="Listen to ${escape(i.hanzi)}">${icon('speaker')}</button>`:'';
 return `<div class="tile-slot">${button}${listen}</div>`;
}
const coach=(mood,text,extra='')=>`<div class="coach">${mascot(mood,'mascot small')}<p class="bubble" role="status">${text}${extra}</p></div>`;
function matchContent(){
 const r=state.round;if(r.left.length<2)return empty('happy','Not enough words to match','This lesson needs at least two different words. Pick another lesson.');
 const done=r.matched.length===r.left.length;
 return `<div class="match-grid" id="match-grid"><svg class="links" aria-hidden="true"></svg><div class="match-column" role="group" aria-label="Chinese words">${r.left.map(i=>tile(i,'left')).join('')}</div><div class="match-column" role="group" aria-label="Pictures">${r.right.map(i=>tile(i,'right')).join('')}</div></div>
 ${coach(done?'cheer':'happy',state.feedback||'Tap a Chinese word, then tap its picture.')}
 <div class="game-actions"><button class="button ${done?'primary':'secondary'}" id="new-round">${icon('shuffle')}${done?'Play again':'New words'}</button></div>`;
}
// Draws an arrow from each matched word to its picture; the newest one animates in.
function drawLinks(){
 const grid=document.getElementById('match-grid');if(!grid)return;
 const svg=grid.querySelector('.links'),box=grid.getBoundingClientRect();
 svg.setAttribute('viewBox',`0 0 ${box.width} ${box.height}`);
 svg.innerHTML=state.round.matched.map((id,n)=>{
  const a=grid.querySelector(`[data-side=left][data-pair="${id}"]`)?.getBoundingClientRect(),b=grid.querySelector(`[data-side=right][data-pair="${id}"]`)?.getBoundingClientRect();
  if(!a||!b)return '';
  const x1=a.right-box.left-4,y1=a.top+a.height/2-box.top,x2=b.left-box.left+2,y2=b.top+b.height/2-box.top,mid=(x1+x2)/2;
  return `<g class="link${id===state.freshLink?' fresh':''}" style="--pair:${pairColours[n%5]}"><path class="line" d="M${x1} ${y1}C${mid} ${y1} ${mid} ${y2} ${x2-9} ${y2}" pathLength="1"/><path class="head" d="M${x2-12} ${y2-8}L${x2} ${y2}L${x2-12} ${y2+8}Z"/><circle cx="${x1}" cy="${y1}" r="6"/></g>`;
 }).join('');
 state.freshLink=null;
}
addEventListener('resize',()=>{if(state.view==='match')drawLinks();});
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
function content(){if(state.view==='library')return libraryContent();const gate=practiceGate();return `<div class="game-wrap">${gate||`${state.view==='flashcards'?flashContent():state.view==='match'?matchContent():sentenceContent()}`}</div>`;}
function render(){
 const current=lesson();
 root.innerHTML=`<div class="backdrop" aria-hidden="true"></div><div class="app view-${state.view}"><header class="topbar"><a class="brand" href="#library" aria-label="Ira’s Chinese, home">${mascot('happy','brand-mark')}<span class="brand-text"><strong>Ira’s Chinese</strong><small lang="zh-Hans">一起学中文</small></span></a><nav class="nav" aria-label="Main navigation">${views.map(([id,name])=>`<button data-view="${id}" class="nav-${id} ${state.view===id?'active':''}" ${state.view===id?'aria-current="page"':''}>${icon(views.icons[id],'nav-icon')}<span>${name}</span></button>`).join('')}</nav><span class="stars ${state.pop?'pop':''}" role="status" aria-label="${state.stars} ${state.stars===1?'star':'stars'}">${icon('star','star-icon')}<b>${state.stars}</b></span></header>
 <main class="main"><section class="hero">${mascot('happy','mascot hero-mascot')}<div class="hero-text"><h1>${says[state.view]}</h1><p class="hero-sub">${current?`Lesson ${current.number} · ${current.coverageStatus==='missing'?'Not in the books yet':escape(current.title)}${current.coverageStatus==='partial'?' · some pages missing':''}`:'All lessons'}</p></div></section>${lessonPicker()}<section id="content" aria-label="${state.view==='library'?'Word library':'Game'}">${content()}</section>${grownups()}</main><footer class="footer">Made with love for a curious little learner</footer></div>`;
 state.pop=false;state.wrong=null;state.justMatched=null;
 bind();
 if(state.view==='match')drawLinks();
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
 const row=root.querySelector('.lessons'),active=row.querySelector('.active');if(active)row.scrollLeft=active.offsetLeft-(row.clientWidth-active.offsetWidth)/2;
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
 root.querySelectorAll('[data-pair]').forEach(b=>b.onclick=()=>{
  const r=state.round,side=b.dataset.side;r[side+'Pick']=b.dataset.pair;state.feedback='';
  if(r.leftPick&&r.rightPick){
   if(r.leftPick===r.rightPick){r.matched.push(r.leftPick);state.justMatched=r.leftPick;state.freshLink=r.leftPick;award();const all=r.matched.length===r.left.length;state.feedback=all?'Hooray! You found every pair!':'Yes! That’s a match!';chime(all?'fanfare':'ding');if(all)celebrate(true);}
   else{state.wrong={left:r.leftPick,right:r.rightPick};state.feedback='Oops! Let’s try again.';chime('oops');}
   r.leftPick=null;r.rightPick=null;
  }
  render();});
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
async function start(){try {const response=await fetch(new URL('../data/library.json',import.meta.url));if(!response.ok)throw new Error('Library unavailable');library=await response.json();library.items.forEach(i=>byId.set(i.id,i));initGame();render();}catch(error){root.innerHTML='<div class="empty"><h1>The library could not open.</h1><p>Please check your connection and reload the page.</p><button class="button" id="reload">Try again</button></div>';document.getElementById('reload').onclick=()=>location.reload();}}
function registerLibraryTool(){
 const context=document.modelContext;if(!context?.registerTool)return;
 const lifecycle=new AbortController();window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
 try{Promise.resolve(context.registerTool({name:'browse_chinese_library',title:'Browse the Chinese library',description:'Open the word library at a lesson and search term. Does not approve content or change learning progress.',inputSchema:{type:'object',properties:{lessonId:{type:'string'},query:{type:'string'},kind:{type:'string',enum:['word','phrase','sentence']}},required:['lessonId'],additionalProperties:false},annotations:{readOnlyHint:false},execute(input){
 if(!input||typeof input!=='object'||Object.keys(input).some(k=>!['lessonId','query','kind'].includes(k))||!['all',...library.lessons.map(l=>l.id)].includes(input.lessonId)||(input.query!==undefined&&typeof input.query!=='string')||(input.kind!==undefined&&!['word','phrase','sentence'].includes(input.kind)))throw new Error('Provide a valid lessonId, optional text query and word/phrase/sentence kind.');
 state.lesson=input.lessonId;state.query=input.query||'';state.kind=input.kind||'word';navigate('library');return {lessonId:state.lesson,count:scoped({kind:state.kind,query:state.query,scope:state.extra?'all':'core'}).length};
 }},{signal:lifecycle.signal})).catch(()=>{});}catch{}
}
start().then(()=>{if(library)registerLibraryTool();});
