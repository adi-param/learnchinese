// 司马光砸缸 Sima Guang saves his friend. Children play chase in an old Chinese courtyard; one climbs the big water
// jar and falls in. Everyone is scared, but Sima Guang thinks, spots a big stone, and she helps him smash the jar
// (砸！砸！砸！) until it breaks, the water gushes out and the friend is safe. Everyone cheers.
import {INK,L,scene,target,actor,box,bubble,countPop,star,funSun,funCloud,funTree,funActors} from '../story-kit.js';

// ---- Pictures ----
const SKIN='#ffe0c2',HAIR='#2b2340';
// The four children, in simple robes with topknots.
const KIDS={
 sima:{robe:'#5b8def',trim:'#fff4d6',sash:'#ffc233',hair:'one',ribbon:'#ff5a5f'},
 friend:{robe:'#6cc24a',trim:'#fff4d6',sash:'#ff7a45',hair:'tuft'},
 kid1:{robe:'#ff8cc6',trim:'#fff',sash:'#9b6bd6',hair:'two',ribbon:'#ff5a5f'},
 kid2:{robe:'#ffb347',trim:'#fff4d6',sash:'#5b8def',hair:'one',ribbon:'#6cc24a'}
};
const limb=(d,c)=>`<path d="${d}" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round"/>`;
const hand=(x,y)=>`<circle cx="${x}" cy="${y}" r="3" fill="${SKIN}" ${L} stroke-width="1.4"/>`;
const ARMS={
 down:c=>`${limb('M-10 -24Q-17 -17 -16 -9',c)}${limb('M10 -24Q17 -17 16 -9',c)}${hand(-16,-8)}${hand(16,-8)}`,
 up:c=>`${limb('M-10 -24Q-21 -34 -15 -52',c)}${limb('M10 -24Q21 -34 15 -52',c)}${hand(-15,-54)}${hand(15,-54)}`
};
const MOUTHS={
 smile:`<path class="m-smile" d="M-3 -31.5q3 3 6 0" fill="none" stroke="${INK}" stroke-width="1.5" stroke-linecap="round"/>`,
 o:`<ellipse class="m-o" cx="0" cy="-30.5" rx="1.8" ry="2.3" fill="${INK}"/>`,
 grin:`<path class="m-grin" d="M-4 -32q4 6 8 0z" fill="#c2414b" stroke="${INK}" stroke-width="1.3" stroke-linejoin="round"/>`
};
const sweat=`<path class="sweat" d="M12 -47q3 4 0 6q-3-2 0-6z" fill="#8fd0ff" ${L} stroke-width="1"/>`;
// A head; with no `mouth` given it carries every mouth, for the story's classes to choose between.
function head(o,mouth){
 const buns=o.hair==='one'?`<circle cx="0" cy="-51" r="5" fill="${HAIR}" ${L} stroke-width="1.6"/><path d="M-5 -49h10" stroke="${o.ribbon}" stroke-width="2.4" stroke-linecap="round"/>`
  :o.hair==='two'?`<circle cx="-9" cy="-47" r="4.2" fill="${HAIR}" ${L} stroke-width="1.6"/><circle cx="9" cy="-47" r="4.2" fill="${HAIR}" ${L} stroke-width="1.6"/><path d="M-12 -44l3-2M12 -44l-3-2" stroke="${o.ribbon}" stroke-width="2.4" stroke-linecap="round"/>`:'';
 const tuft=o.hair==='tuft'?`<path d="M-2 -49q-2-7 3-8q-1 4 2 7z" fill="${HAIR}" ${L} stroke-width="1.4"/>`:'';
 return `${buns}<circle cy="-38" r="11" fill="${SKIN}" ${L}/>
 <path d="M-11 -38Q-12 -50 0 -50Q12 -50 11 -38Q9 -44 4 -45Q0 -41 -4 -45Q-9 -44 -11 -38Z" fill="${HAIR}" ${L} stroke-width="1.6"/>${tuft}
 <g class="blink"><circle cx="-4" cy="-36" r="1.6" fill="${INK}"/><circle cx="4" cy="-36" r="1.6" fill="${INK}"/></g>
 <g class="cheeks"><circle cx="-7" cy="-32" r="2.2" fill="#ff9fa8" opacity=".6"/><circle cx="7" cy="-32" r="2.2" fill="#ff9fa8" opacity=".6"/></g>
 <g class="mouth">${mouth?MOUTHS[mouth]:MOUTHS.smile+MOUTHS.o+MOUTHS.grin}</g>${mouth?'':`<ellipse class="kid-talk" cx="0" cy="-31" rx="2.6" ry="2" fill="${INK}"/>`}`;
}
// A child standing, feet at 0,0. With no `pose` it carries both arm positions and every face, for the scenes;
// a pose ({arms, mouth, sweat}) draws just that, for the cover and the word cards.
function kid(name,pose){
 const o=KIDS[name];
 const arms=pose?ARMS[pose.arms](o.robe):`<g class="arms-down">${ARMS.down(o.robe)}</g><g class="arms-up">${ARMS.up(o.robe)}</g>`;
 return `<ellipse cx="-5" cy="-1.5" rx="4" ry="2.4" fill="${INK}"/><ellipse cx="5" cy="-1.5" rx="4" ry="2.4" fill="${INK}"/>
 <path d="M-10 -27Q-13 -14 -14 -3Q0 1 14 -3Q13 -14 10 -27Q0 -30 -10 -27Z" fill="${o.robe}" ${L}/>
 <path d="M-6 -27.5 3 -18M6 -27.5-1 -21" stroke="${o.trim}" stroke-width="2.2" stroke-linecap="round"/>
 <path d="M-12.5 -15Q0 -12.5 12.5 -15V-11.5Q0 -9 -12.5 -11.5Z" fill="${o.sash}" ${L} stroke-width="1.4"/>
 <path d="M-13.6 -5Q0 -1.5 13.6 -5" stroke="${o.trim}" stroke-width="2" fill="none"/>
 ${arms}${head(o,pose?.mouth)}${pose?(pose.sweat?sweat:''):sweat}`;
}
const stone=`<path d="M-13 0Q-16 -9 -9 -14Q-1 -19 8 -15Q15 -11 13 -2Q12 1 8 1H-10Q-13 1 -13 0Z" fill="#a3a8b0" ${L}/><path d="M-7 -11q4-3 8-1" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".6"/><circle cx="5" cy="-6" r="1.6" fill="#7d838c"/><circle cx="-5" cy="-4" r="1.1" fill="#7d838c"/>`;
// The big water jar, drawn around the middle of its foot. The back of the rim and the water sit behind whoever
// falls in; the body and the front of the rim sit in front, so only a head and waving hands show.
const JAR='#8a5a3c';
const jarBody=`<path d="M-31 -63Q0 -52 31 -63Q46 -40 36 -16Q30 -2 20 0H-20Q-30 -2 -36 -16Q-46 -40 -31 -63Z" fill="${JAR}" ${L}/>
 <path d="M-40 -44Q0 -34 40 -44" fill="none" stroke="#c98b4a" stroke-width="5"/><path d="M-38 -30q6-5 12 0t12 0 12 0 12 0 12 0 12 0" fill="none" stroke="#e8b878" stroke-width="2"/>
 <path d="M-30 -50Q-36 -34 -29 -18" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".3"/>`;
const jarRimBack=`<ellipse cx="0" cy="-64" rx="33" ry="8" fill="#6b4329" ${L}/>`;
const jarWater=`<ellipse class="jar-water" data-cue="water" cx="0" cy="-63" rx="27" ry="5" fill="#5bb4ea"/>`;
const waterFront=`<path d="M-27 -62Q0 -58 27 -62Q0 -55 -27 -62Z" fill="#5bb4ea" opacity=".9"/>`;
const rimFront=`<path d="M-33 -64Q0 -50 33 -64" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M-33 -64Q0 -50 33 -64" fill="none" stroke="#a8714c" stroke-width="4" stroke-linecap="round"/>`;
const wholeJar=(inside='')=>`${jarRimBack}${jarWater}${inside}${waterFront}${jarBody}${rimFront}`;
const cracks=`<g class="cracks" fill="none" stroke="${INK}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
 <path class="crack c1" d="M-6 -55l4 8-5 6 6 9"/><path class="crack c2" d="M16 -50l-5 9 6 7-3 10M11 -34l8 3"/><path class="crack c3" d="M-1 -32l-13 5-4 9M-1 -32l11 8-3 10M-1 -32l4-11M-14 -27l-10-4"/></g>`;
const broken=`<g class="gush"><path d="M-14 -14Q-46 -12 -70 6" fill="none" stroke="#5bb4ea" stroke-width="11" stroke-linecap="round"/><path d="M14 -14Q48 -10 70 6" fill="none" stroke="#5bb4ea" stroke-width="11" stroke-linecap="round"/><path d="M-30 -12q-10 2-18 8M30 -12q10 2 18 8" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/></g>
 <ellipse class="puddle" data-cue="water" cx="0" cy="4" rx="74" ry="8" fill="#8fd0ff" opacity=".85"/>
 <path d="M-36 -16Q-30 -2 -20 0H20Q30 -2 36 -16L28 -23 20 -14 10 -25 0 -15-10 -24-20 -14-28 -23Z" fill="${JAR}" ${L}/>
 <path d="M-58 4l8-12 9 8zM46 6l10-10 6 11zM-30 12l10-6 4 8zM26 12l12-4-2 8z" fill="#a8714c" ${L} stroke-width="1.6"/>`;
const drops=`<g class="drops">${[[-20,-8],[-8,-16],[6,-18],[18,-10],[-14,-20],[12,-22]].map(([dx,dy],i)=>`<circle style="--dx:${dx}px;--dy:${dy}px;--d:${i*.04}s" cx="${dx/4}" cy="-66" r="2.6" fill="#8fd0ff" stroke="${INK}" stroke-width="1"/>`).join('')}</g>`;
// The courtyard: a white wall with a tiled roof and a round moon gate, lanterns, bamboo and a little fish pond.
const lantern=(x,live)=>`<path d="M${x} 66v8" stroke="${INK}" stroke-width="1.6"/><g ${live?`data-fun="lantern" class="lantern"`:''}><g class="lantern-sway"><ellipse cx="${x}" cy="82" rx="9" ry="8" fill="#ff5a5f" ${L}/><path d="M${x-4} 75q-2 7 0 14M${x+4} 75q2 7 0 14" fill="none" stroke="#c2414b" stroke-width="1.4"/><rect x="${x-4}" y="72" width="8" height="3" fill="#ffc233" ${L} stroke-width="1.2"/><rect x="${x-4}" y="89" width="8" height="3" fill="#ffc233" ${L} stroke-width="1.2"/><path d="M${x} 92v7" stroke="#ffc233" stroke-width="2.4" stroke-linecap="round"/></g></g>`;
function courtyard(live){
 return `<rect width="320" height="200" fill="#cfeaff"/>${live?funSun(286,28,13)+funCloud(74,24)+funCloud(190,30,.8):`<circle cx="286" cy="28" r="13" fill="#ffd34d"/>`}
 <rect x="236" y="54" width="7" height="20" fill="#9a6a3c"/><circle cx="240" cy="44" r="22" fill="#5fbf4a" ${L}/><circle cx="226" cy="54" r="13" fill="#5fbf4a" ${L}/><circle cx="256" cy="52" r="14" fill="#5fbf4a" ${L}/><circle cx="232" cy="38" r="5" fill="#7fd36a"/>
 ${live?funTree(240,44,20):''}
 <rect x="-4" y="70" width="328" height="58" fill="#f6efe4" ${L}/><rect x="-4" y="120" width="328" height="8" fill="#d8ccb6"/>
 <path d="M-6 70Q160 62 326 70V60Q160 52 -6 60Z" fill="#5d6577" ${L}/><g fill="#7a8396">${Array.from({length:23},(_,i)=>`<circle cx="${i*14+2}" cy="${70-Math.sin(Math.PI*(i*14+8)/332)*7}" r="3.2" stroke="${INK}" stroke-width="1.2"/>`).join('')}</g>
 <circle cx="60" cy="106" r="26" fill="#a6dc84" stroke="#a89f8f" stroke-width="5"/><circle cx="60" cy="106" r="26" fill="none" ${L}/><path d="M46 114q4-16 14-10q8-12 14 6" fill="#6cc24a" ${L} stroke-width="1.4"/><rect x="34" y="122" width="52" height="8" fill="#eadcc0"/>
 <rect x="152" y="80" width="36" height="26" rx="3" fill="#8fc7e8" stroke="#a8714c" stroke-width="4"/><path d="M164 80v26M176 80v26M152 93h36" stroke="#a8714c" stroke-width="2.4"/>
 ${lantern(120,live)}${lantern(272,live)}
 <rect y="128" width="320" height="72" fill="#eadcc0"/><path d="M0 150H320M0 174H320" stroke="#d8c7a6" stroke-width="1.4"/><path d="M40 128v22M120 128v22M200 128v22M280 128v22M80 150v24M160 150v24M240 150v24M20 174v26M100 174v26M180 174v26M260 174v26" stroke="#d8c7a6" stroke-width="1.4"/>
 <g ${live?`data-fun="bamboo" class="bamboo"`:''}>${[[300,40],[310,54],[292,62]].map(([x,top])=>`<path d="M${x} 132V${top}" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M${x} 132V${top}" stroke="#6cc24a" stroke-width="3.6" stroke-linecap="round"/>${[top+18,top+38,top+58].map(y=>`<path d="M${x-3} ${y}h6" stroke="${INK}" stroke-width="1.4"/>`).join('')}<path d="M${x} ${top+12}q-12-6-16 0q8 4 16 0zM${x} ${top+26}q12-6 16 0q-8 4-16 0z" fill="#7fd36a" ${L} stroke-width="1.2"/>`).join('')}</g>
 <g ${live?`data-fun="pond" class="pond"`:''}><ellipse cx="36" cy="184" rx="36" ry="12" fill="#5bb4ea" stroke="#b8b2a6" stroke-width="5"/><ellipse cx="36" cy="184" rx="36" ry="12" fill="none" ${L}/>
 <ellipse cx="54" cy="182" rx="7" ry="3" fill="#6cc24a" ${L} stroke-width="1.2"/>${live?`<g transform="translate(26 186)"><g class="fish"><path d="M-8 0Q0 -6 8 0Q0 6 -8 0ZM8 0l6-4v8Z" fill="#ff9a3c" ${L} stroke-width="1.2"/><circle cx="-3" cy="-1" r="1" fill="${INK}"/></g></g>`:''}</g>`;
}
const kidActors=svg=>funActors(svg,{sima:'sima',friend:'friend',kid1:'kid1',kid2:'kid2'});
const thinkBubble=bubble('think',-52,-106,-16,-6,-54,`<g transform="translate(-26 -80)">${stone}</g>${star(-12,-98,1.4,'#ffd34d')}${star(-40,-96,1)}`);
const idea=`<g class="sima-idea"><path d="M0 -62v-8M-10 -58l-5-6M10 -58l5-6" stroke="#ffc233" stroke-width="2.4" stroke-linecap="round"/>${star(0,-76,2.2,'#ffd34d')}</g>`;
const confetti=`<g class="confetti">${Array.from({length:22},(_,i)=>`<rect style="--d:${(i*.37)%2.4}s" x="${8+i*14.3}" y="-10" width="5" height="8" rx="1" fill="${['#ff5a5f','#ffc233','#5b8def','#6cc24a','#ff8cc6'][i%5]}"/>`).join('')}</g>`;
// Where everyone stands at the start.
const START={kid1:[80,156],sima:[112,174],friend:[146,158],kid2:[160,186]};
function gardenScene(){
 return kidActors(scene('Sima Guang and his friends in a courtyard with a big water jar',`${courtyard(true)}
 <g transform="translate(212 174)"><g class="jar-layer jar-back" data-cue="jar">${jarRimBack}${jarWater}</g></g>
 ${actor('friend',...START.friend,kid('friend'),'friend')}
 <g transform="translate(212 174)"><g class="jar-layer jar-front" data-cue="jar"><g class="jar-whole">${waterFront}${jarBody}${rimFront}${cracks}</g><g class="jar-broken">${broken}</g>${drops}</g></g>
 ${actor('kid1',...START.kid1,kid('kid1'),'kids')}${actor('kid2',...START.kid2,kid('kid2'),'kids')}
 ${actor('sima',...START.sima,kid('sima')+thinkBubble+idea,'sima')}
 ${actor('stone',296,190,stone,'stone')}
 ${countPop(212,64)}${confetti}
 ${target('kids',122,164,34,42)}${target('stone',296,182,15,24)}${target('jar',212,140,26,36)}`));
}

const pose=(arms,mouth,extra={})=>({arms,mouth,...extra});
const at=(x,y,body)=>`<g transform="translate(${x} ${y})">${body}</g>`;
const pictures={
 play:box('-38 -64 76 68',`${at(-15,0,kid('kid1',pose('up','grin')))}${at(15,0,kid('kid2',pose('up','grin')))}<circle cx="0" cy="-52" r="6" fill="#ff5a5f" ${L}/><path d="M-6 -52h12" stroke="#fff" stroke-width="1.6"/>`),
 big:box('-74 -76 128 80',`${at(-58,0,`<g transform="scale(.4)">${jarBody}${rimFront}</g>`)}${at(10,0,wholeJar())}`),
 water:box('-24 -30 48 36',`<path d="M0 -26Q-14 -8 -12 0Q-10 10 0 10Q10 10 12 0Q14 -8 0 -26Z" fill="#5bb4ea" ${L} transform="scale(.8)"/><path d="M-5 -4q0 6 5 7" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`),
 friend:box('-36 -58 72 62',`${at(-14,0,kid('sima',pose('down','grin')))}${at(14,0,kid('friend',pose('down','grin')))}<path d="M0 -52c-2-3-7 0-3 4l3 2.5 3-2.5c4-4-1-7-3-4z" fill="#f0507a"/>`),
 stone:box('-18 -22 36 26',stone),
 scared:box('-22 -62 44 66',kid('kid1',pose('up','o',{sweat:true}))),
 help:box('-44 -96 88 100',wholeJar(at(0,-36,kid('friend',pose('up','o'))))),
 happy:box('-26 -64 52 68',`${kid('sima',pose('up','grin'))}${star(-20,-50,1.6)}${star(20,-46,1.4,'#ff8cc6')}`)
};
const cover=()=>box('0 0 320 200',`${courtyard(false)}
 ${at(212,174,wholeJar(at(0,-36,kid('friend',pose('up','o')))))}
 ${at(84,172,kid('kid1',pose('up','o',{sweat:true})))}${at(112,190,kid('kid2',pose('down','o',{sweat:true})))}
 ${at(154,176,kid('sima',pose('up','smile')))}${at(154,118,stone)}${star(186,104,2,'#ffd34d')}`);

// ---- The story ----
let api;
const say=(key,t)=>api.say(key,t),wait=(ms,t)=>api.wait(ms,t),flag=(name,on)=>api.flag(name,on),move=(...args)=>api.move(...args);
const $=sel=>api.stage().querySelector(sel);
// Everyone runs to new places in the chase.
const CHASE=[{kid1:[150,178],sima:[84,162],friend:[118,150],kid2:[100,188]},{kid1:[110,158],sima:[156,168],friend:[84,180],kid2:[136,188]},START];
let lap=0;
function chase(){const spots=CHASE[lap++%CHASE.length];for(const [name,[x,y]] of Object.entries(spots))move(name,x,y,900);}
async function playing(t){
 await wait(400,t);
 await say('play',t);
 chase();await say('run',t);chase();await wait(900,t);
 await say('tapKids',t);
 for(let i=0;i<2;i++){
  await api.tap('kids',t,'tapKids');
  chase();api.effect('pop');api.voice('laugh');await wait(1100,t);
 }
 flag('cheer');await say('together',t);flag('cheer',false);
}
async function intoTheJar(t){
 await say('jar',t);
 await say('big',t);
 api.replay($('.jar-water'),'shimmer');await say('water',t);
 // The friend climbs up onto the rim, wobbles and falls in.
 move('friend',186,110,1200);await wait(1200,t);
 api.replay($('.actor-friend .cuebox'),'wobble');await wait(700,t);
 move('friend',212,138,350);flag('in-jar');await wait(300,t);
 api.sounds.whoosh(1);api.replay($('.drops'),'go');api.effect('boing');
 await say('fell',t);
 api.replay($('.drops'),'go');api.sounds.whoosh(.6);await say('splash',t);
 await say('help',t);
 flag('scared');move('kid1',84,170,800);move('kid2',112,190,800);move('sima',160,168,800);await wait(800,t);
 await say('scared',t);
 await say('what',t);
 await say('quick',t);
}
async function theStone(t){
 flag('thinking');await say('think',t);
 await say('look',t);
 await say('tapStone',t);
 await api.tap('stone',t,'tapStone');
 api.replay($('.actor-stone .cuebox'),'happy-hop');api.effect('twinkle');
 flag('thinking',false);flag('idea');api.chime('ding');await say('idea',t);
 move('sima',272,188,1300);await wait(1300,t);
 flag('lifting');move('stone',272,130,500);await wait(500,t);
 await say('lift',t);
 move('sima',154,176,1300);move('stone',154,118,1300);await wait(1300,t);
}
async function smash(t){
 await say('tapJar',t);
 for(let i=1;i<=3;i++){
  await api.tap('jar',t,'tapJar');
  api.replay($('.actor-sima .cuebox'),'smash');api.replay($('.actor-stone .cuebox'),'smash');await wait(180,t);
  api.sounds.knock();flag('crack-'+i);api.replay($('.jar-front'),'shake');api.count('砸');
  await say('za',t);
 }
 // The jar breaks: the water gushes out and the friend is free.
 api.sounds.crash();api.count('砰');flag('broken');flag('in-jar',false);flag('lifting',false);
 move('friend',212,174,250);move('stone',192,196,300);
 await say('bang',t);
 await say('flow',t);
 flag('wet');move('friend',276,182,1200);await wait(1200,t);
 await say('out',t);
}
async function hooray(t){
 api.ambient('music');flag('scared',false);flag('cheer');api.chime('yay');
 await say('great',t);
 await say('thanks',t);
 flag('grin');api.replay($('.actor-sima .cuebox'),'happy-hop');await say('smile',t);
 flag('happy');api.sounds.magic();await say('happy',t);await wait(1400,t);
}
async function play(storyApi,t){
 api=storyApi;lap=0;
 api.ambient('birds');
 await playing(t);
 await intoTheJar(t);
 await theStone(t);
 await smash(t);
 await hooray(t);
}
const VOICES={sima:'hi',friend:'giggle',kid1:'laugh',kid2:'laugh'};
function fun(name,el,storyApi){
 const a=storyApi;
 if(VOICES[name]){a.replay(el.querySelector('.cuebox'),'happy-hop');a.voice(VOICES[name]);return true;}
 if(name==='pond'){a.replay(el.querySelector('.fish'),'jump');a.sounds.whoosh(.4);return true;}
 if(name==='lantern'){a.replay(el,'swing');a.effect('twinkle');return true;}
 if(name==='bamboo'){a.replay(el,'sway');a.effect('swish');return true;}
}

const kidSel=(state,sel)=>['sima','friend','kid1','kid2'].map(n=>`.${state} .actor-${n} ${sel}`).join(',');
const css=`
.story-svg .blink{transform-box:fill-box;transform-origin:center;animation:sima-blink 4.3s infinite}
.story-svg .actor-friend .blink{animation-delay:1.1s}.story-svg .actor-kid1 .blink{animation-delay:2.2s}.story-svg .actor-kid2 .blink{animation-delay:3.1s}
@keyframes sima-blink{0%,94%,100%{transform:none}97%{transform:scaleY(.1)}}
.story-svg .kid-talk,.story-svg .m-o,.story-svg .m-grin,.story-svg .sweat,.story-svg .arms-up{opacity:0}
[data-talking="sima"] .actor-sima .kid-talk,[data-talking="friend"] .actor-friend .kid-talk,[data-talking="kids"] .actor-kid1 .kid-talk,[data-talking="kids"] .actor-kid2 .kid-talk{animation:sima-talk .22s steps(2) infinite}
[data-talking="sima"] .actor-sima .mouth,[data-talking="friend"] .actor-friend .mouth,[data-talking="kids"] .actor-kid1 .mouth,[data-talking="kids"] .actor-kid2 .mouth{opacity:0}
@keyframes sima-talk{0%{opacity:1}100%{opacity:0}}
.scared .actor-kid1 .m-smile,.scared .actor-kid2 .m-smile,.scared .actor-sima .m-smile,.in-jar .actor-friend .m-smile{opacity:0}
.scared .actor-kid1 .m-o,.scared .actor-kid2 .m-o,.scared .actor-sima .m-o,.in-jar .actor-friend .m-o,.scared .actor-kid1 .sweat,.scared .actor-kid2 .sweat{opacity:1}
.scared .actor-kid1 .bob,.scared .actor-kid2 .bob{animation:story-shiver .2s infinite alternate}
.in-jar .actor-friend .arms-up,.lifting .actor-sima .arms-up{opacity:1}
.in-jar .actor-friend .arms-down,.lifting .actor-sima .arms-down{opacity:0}
.in-jar .actor-friend .arms-up{transform-box:fill-box;transform-origin:50% 100%;animation:sima-wave .35s ease-in-out infinite alternate}
@keyframes sima-wave{from{transform:rotate(-6deg)}to{transform:rotate(6deg)}}
.in-jar .actor-friend .bob{animation:sima-float .7s ease-in-out infinite alternate}
@keyframes sima-float{to{transform:translateY(-3px)}}
${kidSel('cheer','.arms-up')},${kidSel('cheer','.m-grin')}{opacity:1}
${kidSel('cheer','.arms-down')},${kidSel('cheer','.m-smile')},${kidSel('cheer','.m-o')}{opacity:0}
.cheer .actor-kid1 .bob,.cheer .actor-kid2 .bob,.cheer .actor-friend .bob,.happy .actor-sima .bob{animation:story-hop .35s ease-in-out infinite alternate}
.cheer .actor-kid2 .bob{animation-delay:.12s}.cheer .actor-friend .bob{animation-delay:.24s}
.grin .actor-sima .cheeks{transform-box:fill-box;transform-origin:center;transform:scale(1.4);transition:transform .4s}
.story-svg .actor-friend .cuebox.wobble{animation:sima-wobble .7s ease-in-out}
@keyframes sima-wobble{25%{transform:rotate(-12deg)}75%{transform:rotate(12deg)}}
.thinking .actor-sima .think{opacity:1;transform:none}
.story-svg .sima-idea{opacity:0;transform-box:fill-box;transform-origin:50% 100%}
.idea .sima-idea{animation:sima-idea 2.4s ease-out forwards}
@keyframes sima-idea{0%{opacity:0;transform:scale(.3)}20%{opacity:1;transform:scale(1.25)}30%{transform:none}80%{opacity:1}100%{opacity:0}}
.story-svg .actor-sima .cuebox.smash{animation:sima-smash .4s ease-in-out}
@keyframes sima-smash{40%{transform:rotate(10deg) translateX(4px)}}
.story-svg .actor-stone .cuebox.smash{animation:sima-stone .4s ease-in-out}
@keyframes sima-stone{40%{transform:translate(24px,16px) rotate(30deg)}}
.story-svg .jar-layer{transform-box:view-box;transform-origin:0 0}
.story-svg .jar-front.shake{animation:sima-shake .35s ease-in-out}
@keyframes sima-shake{25%{transform:rotate(-3deg)}75%{transform:rotate(3deg)}}
.story-svg .jar-water,.story-svg .puddle{transform-box:fill-box;transform-origin:center}
.story-svg .jar-water.shimmer{animation:sima-shimmer .9s ease-in-out}
@keyframes sima-shimmer{50%{fill:#b9e3ff;transform:scaleX(.92)}}
.story-svg .crack{opacity:0;stroke-dasharray:60;stroke-dashoffset:60;transition:opacity .1s,stroke-dashoffset .35s}
.crack-1 .crack.c1,.crack-2 .crack.c2,.crack-3 .crack.c3{opacity:1;stroke-dashoffset:0}
.story-svg .jar-broken{opacity:0}
.broken .jar-broken{opacity:1}.broken .jar-whole,.broken .jar-back{opacity:0}
.story-svg .gush{transform-box:fill-box;transform-origin:50% 0}
.broken .gush{animation:sima-gush 1.6s ease-out forwards}
@keyframes sima-gush{0%{transform:scale(.1)}30%{transform:scale(1.1)}100%{transform:scale(.6,.5);opacity:.3}}
.broken .puddle{animation:sima-puddle 1.6s ease-out}
@keyframes sima-puddle{from{transform:scaleX(.15)}}
.story-svg .drops circle{opacity:0}
.story-svg .drops.go circle{animation:sima-drop .8s ease-out var(--d)}
@keyframes sima-drop{0%{opacity:1;transform:none}60%{opacity:1;transform:translate(var(--dx),var(--dy))}100%{opacity:0;transform:translate(calc(var(--dx)*1.4),4px)}}
.wet .actor-friend .cuebox{filter:drop-shadow(0 2px 0 #8fd0ff)}
.story-svg .confetti rect{opacity:0;transform-box:fill-box;transform-origin:center}
.happy .confetti rect{animation:sima-confetti 2.4s linear var(--d) infinite}
@keyframes sima-confetti{0%{opacity:1;transform:translateY(0) rotate(0)}100%{opacity:1;transform:translateY(220px) rotate(540deg)}}
.story-svg .fish{opacity:0}
.story-svg .fish.jump{animation:sima-fish 1.2s ease-out}
@keyframes sima-fish{0%{opacity:1;transform:translate(0,6px) rotate(30deg)}50%{opacity:1;transform:translate(14px,-24px) rotate(-10deg)}100%{opacity:0;transform:translate(28px,4px) rotate(-60deg)}}
.story-svg .lantern-sway{transform-box:fill-box;transform-origin:50% 0;animation:sima-sway 3s ease-in-out infinite alternate}
.story-svg .lantern+.lantern-sway{animation-delay:1s}
@keyframes sima-sway{from{transform:rotate(-4deg)}to{transform:rotate(4deg)}}
.story-svg .lantern{transform-box:fill-box;transform-origin:50% 0}
.story-svg .lantern.swing{animation:sima-swing 1.2s ease-in-out}
@keyframes sima-swing{20%{transform:rotate(-22deg)}50%{transform:rotate(16deg)}80%{transform:rotate(-8deg)}}
.story-svg .bamboo{transform-box:fill-box;transform-origin:50% 100%}
.story-svg .bamboo.sway{animation:sima-bamboo 1.2s ease-in-out}
@keyframes sima-bamboo{25%{transform:skewX(-8deg)}75%{transform:skewX(6deg)}}
`;

const face=name=>box('-15 -58 30 30',head(KIDS[name],'smile'));
export default {
 firstScene:()=>gardenScene(),
 scenes:()=>[gardenScene()],
 play,pictures,cover,css,fun,
 avatars:{
  sima:face('sima'),friend:face('friend'),
  kids:box('-27 -58 54 34',`${at(-12,0,head(KIDS.kid1,'grin'))}${at(12,0,head(KIDS.kid2,'grin'))}`)
 }
};
