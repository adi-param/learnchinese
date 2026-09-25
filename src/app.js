import {createAudioPlayer} from './audio-player.js';
import {showAudioHelp} from './audio-help.js';
import {femaleMandarinVoice, PRONUNCIATION_RATE} from './speech.js';
import {lessonItems,shuffle,matchingWords,sentenceComplete,sourceLabel} from './core.js';
const root=document.querySelector('#app');
const icons={library:'📚',flashcards:'🌟',match:'🧩',sentences:'🚂'};
let library; let voiceList=[];let lastSpoken=null;let voiceRequest=0;
const audio=document.createElement('audio');audio.id='pronunciation-audio';audio.preload='auto';document.body.append(audio);
const audioStatus=document.createElement('div');audioStatus.className='audio-status';audioStatus.hidden=true;audioStatus.setAttribute('role','status');document.body.append(audioStatus);
const player=createAudioPlayer(audio,{onState(status){audioStatus.hidden=status==='idle';audioStatus.textContent=status==='loading'?'Loading your sound…':status==='playing'?'🔊 Listen…':'';},onFailure(){openAudioHelp();}});
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
const state={view:'library',lesson:'lesson-34',kind:'word',flashKind:'word',query:'',extra:false,drafts:false,deck:[],index:0,revealed:false,round:null,sentence:null,selected:[],feedback:''};
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const byId=new Map();
const lesson=()=>library.lessons.find(l=>l.id===state.lesson);
const scoped=opts=>lessonItems(library,state.lesson,opts);
const practice=(kind='word')=>scoped({kind,approvedOnly:!state.drafts});
const sound=(id)=>`<button class="sound" data-speak="${id}" aria-label="Listen to ${escape(byId.get(id).hanzi)}" title="Listen slowly with a female Mandarin voice">🔊</button>`;
function toast(message){document.querySelector('.toast')?.remove();const el=document.createElement('div');el.className='toast';el.setAttribute('role','status');el.textContent=message;document.body.append(el);setTimeout(()=>el.remove(),5500);}
function speak(id){
 const item=byId.get(id);lastSpoken=id;voiceRequest++;
 if('speechSynthesis' in window)speechSynthesis.cancel();
 if(!item.audio){openAudioHelp();return;}
 player.play(new URL('../'+item.audio,import.meta.url).href);
}

function toolbar(){return `<div class="toolbar"><div class="toolbar-top"><div class="field"><label for="lesson">${state.view==='library'?'Explore a lesson':'Practise a lesson'}</label><select id="lesson">${state.view==='library'?'<option value="all">All lessons</option>':''}${library.lessons.map(l=>`<option value="${l.id}" ${l.id===state.lesson?'selected':''}>${l.number} · ${escape(l.title)}${l.coverageStatus==='missing'?' (missing)':l.coverageStatus==='partial'?' (partial)':''}</option>`).join('')}</select></div>${state.view==='library'?`<div class="field grow"><label for="search">Find something</label><input id="search" type="search" placeholder="Search Chinese, Pinyin or English…" value="${escape(state.query)}"></div>`:''}</div>${state.view==='library'?`<div class="filters"><div class="tabs" aria-label="Content type">${[['word','Words'],['phrase','Phrases'],['sentence','Sentences']].map(([id,name])=>`<button data-kind="${id}" class="${state.kind===id?'active':''}" aria-pressed="${state.kind===id}">${name}</button>`).join('')}</div><label class="check"><input id="extra" type="checkbox" ${state.extra?'checked':''}> Include activity instructions</label></div>`:`<div class="filters">${state.view==='flashcards'?`<div class="field"><label for="flash-kind">Practise</label><select id="flash-kind"><option value="word" ${state.flashKind==='word'?'selected':''}>Words</option><option value="phrase" ${state.flashKind==='phrase'?'selected':''}>Phrases</option></select></div>`:''}<label class="check"><input id="drafts" type="checkbox" ${state.drafts?'checked':''}> Parent preview: use draft material</label></div>`}${lesson()?.notes.length?`<p class="lesson-note">${lesson().notes.map(escape).join(' ')}</p>`:''}</div>`;}
function libraryContent(){
 const items=scoped({kind:state.kind,scope:state.extra?'all':'core',query:state.query});
 return `<div class="section-line"><h2>${state.lesson==='all'?'Your whole library':`Lesson ${lesson().number} · ${escape(lesson().title)}`}</h2><span>${items.length} ${state.kind==='word'?'words':state.kind==='phrase'?'phrases':'sentences'}</span></div><div class="grid">${items.map(i=>`<article class="word-card ${i.kind}"><div class="card-top"><span class="category">${escape(i.category)}</span>${sound(i.id)}</div><div class="card-body"><div class="hanzi" lang="zh-Hans">${escape(i.hanzi)}</div><div class="pinyin" lang="zh-Latn">${escape(i.pinyin)}</div><div class="meaning">${escape(i.english)}</div></div><div class="card-bottom"><span>${[...new Set(i.occurrences.filter(o=>state.lesson==='all'||o.lessonId===state.lesson).map(o=>'Lesson '+o.lessonId.split('-')[1]))].join(' · ')}</span><span>${i.reviewStatus==='draft'?'Draft':'Reviewed'}</span></div><details class="source"><summary>Source</summary>${escape(sourceLabel(i,state.lesson))}</details></article>`).join('')||`<div class="empty"><h2>${lesson()?.coverageStatus==='missing'?'This lesson is missing':'Nothing here yet'}</h2><p>${state.query?'Try another word or clear the search.':'The supplied pages do not include this content. Choose another lesson.'}</p></div>`}</div>`;
}
function practiceGate(){
 if(lesson()?.coverageStatus==='missing')return '<div class="empty"><h2>This lesson is not in the supplied books.</h2><p>Choose another lesson to practise.</p></div>';
 if(!state.drafts&&!practice(state.view==='sentences'?'sentence':state.view==='flashcards'?state.flashKind:'word').length)return `<div class="empty"><div class="hanzi" style="font-size:52px" lang="zh-Hans">一起学</div><h2>A little practice, together</h2><p>This lesson’s Pinyin and meanings are still awaiting review.<br>Turn on <b>Parent preview</b> above to try it together.</p></div>`;
 return '';
}
function initGame(){
 state.feedback='';state.selected=[];state.index=0;state.revealed=false;state.sentence=null;
 state.deck=shuffle(practice(state.view==='sentences'?'sentence':state.view==='flashcards'?state.flashKind:'word'));
 const words=shuffle(matchingWords(practice())).slice(0,4);
 state.round={left:words,right:shuffle(words),matched:[],leftPick:null,rightPick:null};
 if(state.view==='sentences') nextSentence(false);
}
function flashContent(){const item=state.deck[state.index];if(!item)return '<div class="empty">No words are available for this lesson yet.</div>';return `<div class="practice-top"><h2>Look. Remember. Reveal.</h2><span class="counter">${state.index+1} / ${state.deck.length}</span></div><div class="progress"><div style="width:${(state.index+1)/state.deck.length*100}%"></div></div><button class="flash ${state.revealed?'is-revealed':''}" id="flip" aria-label="${state.revealed?'Hide meaning':'Reveal meaning'}"><span class="category">${escape(item.category)}</span><span class="hanzi" lang="zh-Hans">${escape(item.hanzi)}</span>${state.revealed?`<span class="pinyin" lang="zh-Latn">${escape(item.pinyin)}</span><span class="meaning">${escape(item.english)}</span>`:''}<span class="flash-hint">${state.revealed?'Tap to hide the meaning':'Say it together, then tap to reveal'}</span></button><div class="game-actions"><button class="button secondary" id="previous" ${state.index===0?'disabled':''}>← Previous</button><button class="button secondary" data-speak="${item.id}">🔊 Listen</button><button class="button" id="next">${state.index===state.deck.length-1?'Start again ↻':'Next word →'}</button></div>`;}
function matchContent(){const r=state.round;if(r.left.length<2)return '<div class="empty">This lesson needs at least two distinct words for matching.</div>';return `<div class="practice-top"><h2>Find the pairs</h2><span class="counter">${r.matched.length} / ${r.left.length} pairs</span></div><p class="meaning">Tap a Chinese word, then its English meaning. Play together.</p><div class="match-grid">${['left','right'].map(side=>`<div class="match-column"><h3>${side==='left'?'Chinese':'Meaning'}</h3>${r[side].map(i=>`<button data-pair="${i.id}" data-side="${side}" class="match-tile ${side==='left'?'hanzi':''} ${r.matched.includes(i.id)?'matched':''} ${r[side+'Pick']===i.id?'selected':''}" ${side==='left'?'lang="zh-Hans"':''} ${r.matched.includes(i.id)?'disabled':''}>${escape(side==='left'?i.hanzi:i.english)}${r.matched.includes(i.id)?' ✓':''}</button>`).join('')}</div>`).join('')}</div><p class="feedback" role="status">${state.feedback||'Take your time. You can try as often as you like.'}</p><div class="game-actions"><button class="button ${r.matched.length===r.left.length?'':'secondary'}" id="new-round">${r.matched.length===r.left.length?'All matched! Play again ↻':'New words ↻'}</button></div>`;}
function nextSentence(advance=true){if(advance)state.index=(state.index+1)%state.deck.length;state.sentence=state.deck[state.index];state.selected=[];state.feedback='';state.bank=state.sentence?shuffle(state.sentence.wordIds.map((id,index)=>({id,index}))):[];}
function sentenceContent(){const s=state.sentence;if(!s)return '<div class="empty">No core sentences were supplied for this lesson. Try Lesson 34.</div>';const complete=sentenceComplete(s.wordIds,state.selected.map(t=>t.id));return `<div class="practice-top"><h2>Build a sentence</h2><span class="counter">${state.index+1} / ${state.deck.length}</span></div><div class="sentence-prompt"><span class="eyebrow">Can you say this in Chinese?</span><div class="meaning">${escape(s.english)}</div><button class="button secondary" style="margin-top:16px" data-speak="${s.id}">🔊 Hear a hint</button></div><div class="sentence-slots" aria-label="Your sentence">${state.selected.length?state.selected.map((t,index)=>`<button class="token hanzi" lang="zh-Hans" data-remove="${index}" aria-label="Remove ${escape(byId.get(t.id).hanzi)}">${escape(byId.get(t.id).hanzi)}</button>`).join(''):'<p>Tap the words below to put them in order.</p>'}</div><div class="word-bank">${state.bank.map(t=>`<button class="token hanzi" lang="zh-Hans" data-token="${t.index}" ${state.selected.some(a=>a.index===t.index)?'disabled':''}>${escape(byId.get(t.id).hanzi)}<small lang="zh-Latn">${escape(byId.get(t.id).pinyin)}</small></button>`).join('')}</div><p class="feedback" role="status">${state.feedback}${complete&&state.feedback?`<br><span lang="zh-Hans">${escape(s.hanzi)}</span><br>${escape(s.pinyin)}`:''}</p><div class="game-actions"><button class="button secondary" id="reset-sentence">Try again</button><button class="button" id="check-sentence">Check sentence</button><button class="button secondary" id="next-sentence">Next →</button></div>`;}
function content(){if(state.view==='library')return libraryContent();const gate=practiceGate();return `<div class="game-wrap">${gate||`${state.drafts?'<div class="preview-note">Parent preview · These words are drafts. Practise together and check the meanings as you go.</div>':''}${state.view==='flashcards'?flashContent():state.view==='match'?matchContent():sentenceContent()}`}</div>`;}
function render(){
 const titles={library:['A little Chinese,','every day.','Pick a lesson. Find a word. Let’s play!'],flashcards:['One word,','one little discovery.','Say it, flip it, and learn together.'],match:['A little game,','a lovely connection.','Find familiar words and their meanings.'],sentences:['Little words,','bigger ideas.','Put familiar words together, one sentence at a time.']};const t=titles[state.view];
 root.innerHTML=`<div class="shell"><aside class="sidebar"><a class="brand" href="#library" aria-label="Ira, little Chinese library"><span class="brand-mark" lang="zh-Hans">学</span><div><strong>ira.</strong><small>LITTLE CHINESE LIBRARY</small></div></a><p class="nav-label">Learn & play</p><nav class="nav" aria-label="Main navigation">${[['library','Word library'],['flashcards','Flashcards'],['match','Match pairs'],['sentences','Build a sentence']].map(([id,name])=>`<button data-view="${id}" class="${state.view===id?'active':''}" ${state.view===id?'aria-current="page"':''}><span class="icon" aria-hidden="true">${icons[id]}</span>${name}</button>`).join('')}</nav><div class="sidebar-note"><b>You’re growing, little learner!</b><br>Made for learning together.<br>One lesson at a time.</div></aside><main class="main"><div class="topline"><span>Our learning corner</span><span class="pill">N2 · Chinese</span></div><header class="hero"><div><span class="eyebrow">${state.view==='library'?'HELLO, LITTLE EXPLORER!':'A FEW MINUTES, TOGETHER.'}</span><h1>${t[0]}<br><em>${t[1]}</em></h1><p>${t[2]}</p></div><div class="hero-stamp" aria-hidden="true"><span class="mascot">🐰</span><span class="mascot-label">Let’s learn!</span></div></header>${state.view==='library'?`<div class="stats">${[['word','字','words to explore'],['phrase','词','little phrases'],['sentence','句','sentences & prompts']].map(([kind,char,label])=>`<div class="stat"><div class="stat-icon" lang="zh-Hans">${char}</div><div><strong>${library.items.filter(i=>i.kind===kind).length}</strong><span>${label}</span></div></div>`).join('')}</div>`:''}${toolbar()}<section id="content" aria-label="${state.view==='library'?'Learning library':'Practice activity'}">${content()}</section><footer class="footer"><span>Made with care, for curious little minds.<br>Draft learning material · Slow female Mandarin audio.</span><div><button class="help-link" id="open-audio-help">🔊 Sound help</button><br><a href="./docs/library.md">View the complete lesson library ↗</a></div></footer></main></div>`;
 const selector=document.querySelector('#lesson');selector.value=state.lesson;
 bind();
}
function bind(){
 root.querySelector('#open-audio-help').onclick=openAudioHelp;
 root.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>navigate(b.dataset.view));
 root.querySelector('.brand').onclick=e=>{e.preventDefault();navigate('library');};
 root.querySelector('#lesson').onchange=e=>{state.lesson=e.target.value;initGame();render();};
 root.querySelector('#search')?.addEventListener('input',e=>{state.query=e.target.value;document.querySelector('#content').innerHTML=libraryContent();bindContent();});
 root.querySelectorAll('[data-kind]').forEach(b=>b.onclick=()=>{state.kind=b.dataset.kind;render();});
 root.querySelector('#extra')?.addEventListener('change',e=>{state.extra=e.target.checked;render();});
 root.querySelector('#flash-kind')?.addEventListener('change',e=>{state.flashKind=e.target.value;initGame();render();});
 root.querySelector('#drafts')?.addEventListener('change',e=>{state.drafts=e.target.checked;initGame();render();});
 bindContent();
}
function bindContent(){
 root.querySelectorAll('[data-speak]').forEach(b=>b.onclick=()=>speak(b.dataset.speak));
 const on=(id,fn)=>{const el=document.getElementById(id);if(el)el.onclick=fn;};
 on('flip',()=>{state.revealed=!state.revealed;render();document.querySelector('#flip').focus();});
 on('next',()=>{state.index=(state.index+1)%state.deck.length;state.revealed=false;render();});
 on('previous',()=>{state.index=Math.max(0,state.index-1);state.revealed=false;render();});
 on('new-round',()=>{initGame();render();});
 root.querySelectorAll('[data-pair]').forEach(b=>b.onclick=()=>{const r=state.round;r[b.dataset.side+'Pick']=b.dataset.pair;state.feedback='';if(r.leftPick&&r.rightPick){if(r.leftPick===r.rightPick){r.matched.push(r.leftPick);state.feedback=r.matched.length===r.left.length?'🎉 Hooray! You found every pair.':'🌟 That’s a match!';}else state.feedback='Not quite. Try another pair.';r.leftPick=null;r.rightPick=null;}render();});
 root.querySelectorAll('[data-token]').forEach(b=>b.onclick=()=>{state.selected.push(state.bank.find(t=>t.index===Number(b.dataset.token)));state.feedback='';render();});
 root.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{state.selected.splice(Number(b.dataset.remove),1);state.feedback='';render();});
 on('reset-sentence',()=>{state.selected=[];state.feedback='';render();});
 on('next-sentence',()=>{nextSentence();render();});
 on('check-sentence',()=>{state.feedback=sentenceComplete(state.sentence.wordIds,state.selected.map(t=>t.id))?'🎉 You built it! Well done.':state.selected.length<state.sentence.wordIds.length?'Keep going—there are still words to add.':'Try a different order. Tap a word above to move it back.';render();});
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
