// 三只山羊过桥 The three billy goats. A small, a middle and a big goat want the grass across the river, but a monster
// lives under the bridge. She walks each goat across plank by plank; the monster pops up (谁在我的桥上？), the
// small and middle goats send him to their bigger brother (哥哥更大！), and the big goat headbutts him into the
// river. On the hill she feeds the goats until they are full.
import {INK,L,scene,target,actor,box,meadow,star,funSun,funCloud,funTree,funFlower,funActors} from '../story-kit.js';

// ---- Pictures ----
// A goat side on, facing right. Size changes the coat, the horns and how big it is drawn.
const GOATS={
 small:{coat:'#fbf6ec',dark:'#d9cbb3',scale:.72,horns:`<path d="M15 -42q0-3 2-4M18 -43q0-3 2-4" stroke="#b9a57f" stroke-width="2.6" stroke-linecap="round" fill="none"/>`},
 mid:{coat:'#ecdcbf',dark:'#c4ab83',scale:.95,horns:`<path d="M15 -42q-2-8-9-8M18 -43q-1-8-7-9" stroke="#9b8257" stroke-width="3" stroke-linecap="round" fill="none"/>`},
 big:{coat:'#c9a77f',dark:'#9b7b55',scale:1.22,horns:`<path d="M15 -41q-4-12-14-9q-6 4 0 8q4 2 6-2" stroke="#6b5636" stroke-width="3.6" stroke-linecap="round" fill="none"/><path d="M18 -42q-2-11-11-11" stroke="#6b5636" stroke-width="3.4" stroke-linecap="round" fill="none"/>`}
};
const goatBody=size=>{const {coat,dark,horns}=GOATS[size];return `<path d="M-18 -27q-7-3-5-10q3 5 6 6z" fill="${coat}" ${L} stroke-width="1.6"/>
 ${[[-15,dark],[-8,coat],[7,dark],[13,coat]].map(([x,c])=>`<rect x="${x}" y="-15" width="4.5" height="14" rx="2" fill="${c}" ${L} stroke-width="1.6"/><rect x="${x}" y="-3" width="4.5" height="3" fill="${INK}"/>`).join('')}
 <ellipse cx="0" cy="-21" rx="19" ry="11" fill="${coat}" ${L}/>
 <g class="goat-head"><path d="M9 -26Q12 -36 17 -40L24 -34Q19 -28 16 -20Z" fill="${coat}" ${L} stroke-width="1.6"/>
 ${horns}<path d="M13 -40q-8-1-10 3q6 2 11 0z" fill="${dark}" ${L} stroke-width="1.4"/>
 <path d="M15 -42Q23 -44 28 -36Q29 -31 25 -30Q19 -30 15 -34Z" fill="${coat}" ${L}/>
 <g class="blink"><circle cx="21" cy="-38" r="1.6" fill="${INK}"/></g><circle cx="27" cy="-34" r=".9" fill="${INK}"/><path d="M23 -30l1 6 2-5z" fill="${dark}" ${L} stroke-width="1.2"/>
 <ellipse class="goat-talk" cx="25.5" cy="-31" rx="2" ry="1.6" fill="${INK}"/></g>`;};
const goat=size=>`<g transform="scale(${GOATS[size].scale})">${goatBody(size)}</g>`;
// The monster under the bridge: big, green and shaggy, more grumpy than scary.
const trollHead=`<path d="M-14 -80-10 -92-5 -82ZM14 -80 10 -92 5 -82Z" fill="#e8dcc4" ${L} stroke-width="1.6"/>
 <ellipse cx="-22" cy="-64" rx="5" ry="7" fill="#6fb38a" ${L}/><ellipse cx="22" cy="-64" rx="5" ry="7" fill="#6fb38a" ${L}/>
 <circle cx="0" cy="-62" r="22" fill="#6fb38a" ${L}/>
 <path d="M-14 -73l9 3M14 -73l-9 3" ${L} stroke-width="3"/>
 <g class="blink"><circle cx="-8" cy="-66" r="5" fill="#fff" ${L} stroke-width="1.6"/><circle cx="8" cy="-66" r="5" fill="#fff" ${L} stroke-width="1.6"/><circle cx="-7" cy="-65" r="2.2" fill="${INK}"/><circle cx="7" cy="-65" r="2.2" fill="${INK}"/></g>
 <ellipse cx="0" cy="-57" rx="6" ry="5" fill="#4f8f68" ${L} stroke-width="1.6"/>
 <path class="troll-mouth" d="M-11 -48Q0 -42 11 -48" fill="none" ${L}/><path class="troll-talk" d="M-11 -48Q0 -36 11 -48Z" fill="${INK}"/><path d="M-8 -47.5l1.5-4 1.5 4zM8 -47.5l-1.5-4-1.5 4z" fill="#fff" ${L} stroke-width="1"/>`;
const troll=`<rect x="-14" y="-18" width="10" height="16" rx="4" fill="#5c9b76" ${L}/><rect x="4" y="-18" width="10" height="16" rx="4" fill="#5c9b76" ${L}/>
 <path d="M-22 -44Q-28 -14 -18 -14H18Q28 -14 22 -44Z" fill="#6fb38a" ${L}/><path d="M-12 -30q4-4 8 0M4 -26q4-4 8 0M-6 -20q4-4 8 0" fill="none" stroke="#4f8f68" stroke-width="1.6"/>
 <path d="M-22 -40-34 -54M22 -40 34 -54" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M-22 -40-34 -54M22 -40 34 -54" stroke="#6fb38a" stroke-width="6.5" stroke-linecap="round"/>
 ${trollHead}`;
const fish=`<g class="fish"><path d="M-10 0Q0 -8 10 0Q0 8 -10 0ZM10 0l7-5v10Z" fill="#ff9a3c" ${L} stroke-width="1.4"/><circle cx="-4" cy="-1" r="1.2" fill="${INK}"/></g>`;
const goatActors=svg=>funActors(svg,{'goat-small':'goatSmall','goat-mid':'goatMid','goat-big':'goatBig',troll:'troll'});
// The river, the wooden bridge across it and the grassy hill on the far side.
const deckY=x=>130-18*Math.sin(Math.PI*(x-86)/148);
const PLANKS=[125,160,195];
const bridge=`<g class="bridge" data-cue="bridge">
 <path d="M96 200V136Q160 96 224 136V200H206V146Q160 116 114 146V200Z" fill="#a9a5b4" ${L}/><path d="M114 200V146Q160 116 206 146V200Z" fill="#3c4660" opacity=".55"/>
 <path d="M86 130Q160 82 234 130L234 138Q160 92 86 138Z" fill="#c98b4a" ${L}/>
 ${[100,115,130,145,160,175,190,205,220].map(x=>`<path d="M${x} ${deckY(x)+1}v6" stroke="#8c5428" stroke-width="1.4"/>`).join('')}
 ${[92,128,160,192,228].map(x=>`<path d="M${x} ${deckY(x)}v-12" ${L} stroke-width="2.6"/>`).join('')}<path d="M92 ${deckY(92)-10}Q160 ${deckY(160)-34} 228 ${deckY(228)-10}" fill="none" ${L} stroke-width="2.4"/></g>`;
const tuft=(x,y,flower)=>`<path d="M${x-10} ${y}q2-12 4-2q1-14 5-1q2-13 5 0q3-10 5 3z" fill="#4fb33f" ${L} stroke-width="1.4"/>${flower?`<circle cx="${x+6}" cy="${y-10}" r="2.4" fill="${flower}" ${L} stroke-width="1"/>`:''}`;
function riverScene(){
 return goatActors(scene('Three goats and a bridge over the river',`<rect width="320" height="200" fill="#cfeaff"/>${funSun(270,34,14)}${funCloud(80,30)}${funCloud(170,22,.8)}
 <path d="M0 110Q80 92 160 104T320 98V200H0Z" fill="#b8e29a"/>
 <rect class="river" data-cue="river" data-fun="river" y="128" width="320" height="72" fill="#5bb4ea"/><g transform="translate(130 176)">${fish}</g><path d="M110 160q8-4 16 0M150 176q8-4 16 0M190 158q8-4 16 0M130 190q8-4 16 0" fill="none" stroke="#fff" stroke-width="1.6" opacity=".7"/>
 <path d="M0 140Q50 136 104 142L98 200H0Z" fill="#7cc867" ${L}/>
 <path d="M216 142Q260 120 320 112V200H222Z" fill="#7cc867" ${L}/>
 <g class="grass" data-cue="grass">${[[244,134,'#ff8cc6'],[268,126,''],[292,120,'#ffd34d'],[304,138,''],[252,154,'#fff'],[282,150,'']].map(([x,y,f])=>tuft(x,y,f)).join('')}</g>${[[30,160],[64,176],[14,186]].map(([x,y])=>funFlower(x,y,'#ff8cc6')).join('')}
 ${bridge}
 ${actor('troll',160,252,troll,'troll')}
 <g class="ripples">${[0,1,2].map(i=>`<ellipse class="ripple" style="--d:${i*.25}s" cx="250" cy="176" rx="${10+i*8}" ry="${3+i*2}" fill="none" stroke="#fff" stroke-width="2"/>`).join('')}</g>
 ${actor('goat-big',20,146,goat('big'),'goats goat-big')}${actor('goat-mid',46,144,goat('mid'),'goats goat-mid')}${actor('goat-small',72,142,goat('small'),'goats goat-small')}
 ${PLANKS.map((x,i)=>target('plank-'+(i+1),x,deckY(x)-4,11,16)).join('')}${target('goat-big',160,78,22,30)}`));
}
// The hill on the far side, where the goats eat.
const HILL=[['small',76],['mid',156],['big',232]];
function hillScene(){
 return goatActors(scene('The goats on the grassy hill',`${meadow}${funSun(44,38)}${funCloud(110,30)}${funCloud(236,42,.9)}${funTree(286,106,22)}${funTree(22,108,16)}
 ${HILL.map(([size,x])=>actor('goat-'+size,x,176,goat(size),'goats goat-'+size)).join('')}
 <g class="grass" data-cue="grass">${HILL.map(([size,x],i)=>`<g class="tuft tuft-${i+1}">${tuft(x+30*GOATS[size].scale+10,186,['#ff8cc6','#ffd34d','#fff'][i])}</g>`).join('')}</g>
 ${HILL.map(([size,x],i)=>target('tuft-'+(i+1),x+30*GOATS[size].scale+10,178,13,18)).join('')}`));
}
const arrow=(x,tip)=>`<path d="M${x} ${tip-15}v6" stroke="#ff7a45" stroke-width="4" stroke-linecap="round"/><path d="M${x-6} ${tip-9}h12l-6 8z" fill="#ff7a45" stroke="#ff7a45" stroke-width="2" stroke-linejoin="round"/>`;
const pictures={
 goat:box('-26 -52 60 56',goat('mid')),
 middle:box('-30 -66 150 70',`<g opacity=".4">${goat('small')}</g><g transform="translate(45 0)"><ellipse cx="4" cy="-22" rx="30" ry="20" fill="#fff0a0" opacity=".85"/>${goat('mid')}</g><g transform="translate(95 0)" opacity=".4">${goat('big')}</g>${arrow(49,-58)}`),
 bigger:box('-30 -76 110 80',`<g opacity=".45">${goat('mid')}</g><g transform="translate(46 0)"><ellipse cx="4" cy="-26" rx="34" ry="24" fill="#fff0a0" opacity=".85"/>${goat('big')}</g>${arrow(52,-64)}`),
 bridge:box('80 76 160 70',bridge),
 river:box('0 0 60 36',`<rect width="60" height="36" rx="6" fill="#5bb4ea"/><path d="M8 12q8-5 16 0t16 0M14 24q8-5 16 0t16 0" fill="none" stroke="#fff" stroke-width="2.4"/>`),
 under:box('86 84 150 116',`${bridge}<circle cx="152" cy="168" r="3" fill="#fff"/><circle cx="168" cy="168" r="3" fill="#fff"/><circle cx="152" cy="168" r="1.4" fill="${INK}"/><circle cx="168" cy="168" r="1.4" fill="${INK}"/>${arrow(160,150)}`),
 monster:box('-38 -96 76 98',troll),
 walk:box('-30 -52 76 58',`${goat('mid')}<g fill="#9b8257">${[[-26,4],[-14,2],[30,4],[40,2]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="2.4" ry="1.4"/>`).join('')}</g>`),
 butt:box('-30 -66 90 70',`${goat('big')}${star(48,-44,3,'#ffd34d')}`),
 swim:box('-34 -92 68 60',`<g transform="translate(0 0)">${trollHead}</g><rect x="-34" y="-46" width="68" height="14" fill="#5bb4ea"/><path d="M-28 -44q6-3 12 0M10 -44q6-3 12 0" fill="none" stroke="#fff" stroke-width="2"/>`),
 yummy:box('-30 -60 80 64',`${goat('small')}${tuft(30,2,'#ff8cc6')}<path d="M24 -52c-2-3-7 0-3 4l3 2.5 3-2.5c4-4-1-7-3-4z" fill="#f0507a"/>`),
 full:box('-30 -56 70 60',`<g transform="scale(1.12 1.08)">${goat('mid')}</g><path d="M-6 -24q6 5 12 0" fill="none" ${L}/>`)
};
const cover=()=>box('0 0 320 200',`<rect width="320" height="200" fill="#cfeaff"/><circle cx="270" cy="34" r="14" fill="#ffd34d"/><path d="M0 110Q80 92 160 104T320 98V200H0Z" fill="#b8e29a"/><rect y="128" width="320" height="72" fill="#5bb4ea"/>
 <path d="M0 140Q50 136 104 142L98 200H0Z" fill="#7cc867" ${L}/><path d="M216 142Q260 120 320 112V200H222Z" fill="#7cc867" ${L}/>${[[244,134,'#ff8cc6'],[292,120,'#ffd34d'],[262,154,'']].map(([x,y,f])=>tuft(x,y,f)).join('')}
 <g transform="translate(160 214)">${troll}</g>${bridge}<g transform="translate(22 146)">${goat('big')}</g><g transform="translate(50 144)">${goat('mid')}</g><g transform="translate(76 142)">${goat('small')}</g>`);

// ---- The story ----
let api;
const say=(key,t)=>api.say(key,t),wait=(ms,t)=>api.wait(ms,t),flag=(name,on)=>api.flag(name,on),move=(...args)=>api.move(...args);
const SIZE={small:1,mid:2,big:3};
// Walks one goat across, a plank per tap; at the middle the monster pops up and they talk.
async function cross(t,size,{goes,me,reply,landing}){
 const name='goat-'+size;
 await say(goes,t);
 move(name,92,deckY(92),800);await wait(800,t);
 await say('tapPlank',t);
 for(let i=0;i<PLANKS.length;i++){
  await api.tap('plank-'+(i+1),t,'tapPlank');
  api.sounds.clop(SIZE[size]);move(name,PLANKS[i],deckY(PLANKS[i]),500);await wait(250,t);api.sounds.clop(SIZE[size]);await wait(300,t);
  if(i===1){
   move('troll',160,206,700);api.sounds.whoosh(.7);flag('troll-up');await wait(700,t);
   await say('who',t);
   await say(me,t);
   await say('eatYou',t);
   if(reply==='comeOn')return;
   await say(reply,t);
   await say('goOn',t);
   move('troll',160,252,700);flag('troll-up',false);await wait(700,t);
  }
 }
 move(name,landing[0],landing[1],900);await wait(900,t);
}
async function atTheRiver(t){
 await wait(400,t);
 await say('once',t);
 await say('sizes',t);
 await say('likeGrass',t);
 await say('otherSide',t);
 await say('crossing',t);
 flag('peek');await say('monster',t);
 await cross(t,'small',{goes:'smallGoes',me:'meSmall',reply:'dontSmall',landing:[302,122]});
 await cross(t,'mid',{goes:'midGoes',me:'meMid',reply:'dontMid',landing:[278,128]});
 await cross(t,'big',{goes:'bigGoes',me:'meBig',reply:'comeOn'});
 // The big goat stands up to him.
 await say('comeOn',t);
 await say('tapBig',t);
 await api.tap('goat-big',t,'tapBig');
 api.replay(api.stage().querySelector('.actor-goat-big .cuebox'),'charge');api.sounds.knock();await wait(250,t);
 flag('tumble');move('troll',250,214,700);await wait(700,t);
 api.sounds.crash();api.replay(api.stage(),'splash');await say('butt',t);
 await say('fell',t);
 flag('tumble',false);flag('swimming');move('troll',380,250,2600);await wait(900,t);
 await say('swam',t);
 move('goat-big',196,deckY(196),500);await wait(500,t);move('goat-big',254,134,700);await wait(700,t);
 await say('allAcross',t);await wait(400,t);
}
async function onTheHill(t){
 await api.changeScene(t,hillScene());
 await say('feed',t);
 for(const [i,[size,line]] of [['small','yumSmall'],['mid','yumMid'],['big','yumBig']].entries()){
  await api.tap('tuft-'+(i+1),t,'feed');
  api.stage().querySelector('.tuft-'+(i+1)).classList.add('eaten');api.replay(api.stage().querySelector(`.actor-goat-${size} .goat-head`),'munch');api.chime('ding');
  await wait(500,t);await say(line,t);
 }
 flag('full');api.chime('yay');await say('full',t);await wait(900,t);
}
async function play(storyApi,t){
 api=storyApi;
 api.ambient('birds');
 await atTheRiver(t);
 api.ambient('music');
 await onTheHill(t);
}
const BAA={goatSmall:'baaSmall',goatMid:'baaMid',goatBig:'baaBig'};
function fun(name,el,storyApi){
 const a=storyApi;
 if(BAA[name]){a.replay(el.querySelector('.cuebox'),'happy-hop');a.voice(BAA[name]);return true;}
 if(name==='troll'){a.replay(el.querySelector('.cuebox'),'sneeze');a.voice('grumble');return true;}
 if(name==='river'){a.replay(a.stage().querySelector('.fish'),'jump');a.sounds.whoosh(.4);return true;}
}

const css=`
.story-svg .blink{transform-box:fill-box;transform-origin:center;animation:goats-blink 4.4s infinite}
.story-svg .actor-goat-mid .blink{animation-delay:1.4s}.story-svg .actor-goat-big .blink{animation-delay:2.7s}.story-svg .actor-troll .blink{animation-delay:.6s;animation-duration:5.2s}
@keyframes goats-blink{0%,94%,100%{transform:none}97%{transform:scaleY(.1)}}
.story-svg .goat-talk,.story-svg .troll-talk{opacity:0}
[data-talking="goatSmall"] .actor-goat-small .goat-talk,[data-talking="goatMid"] .actor-goat-mid .goat-talk,[data-talking="goatBig"] .actor-goat-big .goat-talk,[data-talking="troll"] .troll-talk{animation:goats-talk .22s steps(2) infinite}
[data-talking="troll"] .troll-mouth{opacity:0}
@keyframes goats-talk{0%{opacity:1}100%{opacity:0}}
.story-svg .fish{opacity:0}
.story-svg .fish.jump{animation:goats-fish 1.2s ease-out}
@keyframes goats-fish{0%{opacity:1;transform:translate(0,10px) rotate(30deg)}50%{opacity:1;transform:translate(24px,-34px) rotate(-10deg)}100%{opacity:0;transform:translate(48px,10px) rotate(-60deg)}}
.story-svg .actor-troll{transition:transform .7s ease-out}
.peek .actor-troll .bob{animation:goats-peek 2s ease-in-out infinite}
@keyframes goats-peek{50%{transform:translateY(-3px)}}
.troll-up .actor-troll .bob{animation:story-shiver .18s infinite alternate}
.tumble .actor-troll .cuebox{transform-box:fill-box;transform-origin:center;animation:goats-tumble .7s linear}
@keyframes goats-tumble{to{transform:rotate(320deg)}}
.swimming .actor-troll .bob{animation:goats-swim .5s ease-in-out infinite alternate}
@keyframes goats-swim{to{transform:translateY(-3px) rotate(4deg)}}
.story-svg .ripple{opacity:0;transform-box:fill-box;transform-origin:center}
.splash .ripple{animation:goats-ripple 1.4s var(--d) ease-out}
@keyframes goats-ripple{0%{opacity:1;transform:scale(.3)}100%{opacity:0;transform:scale(1.4)}}
.story-svg .cuebox.charge{animation:goats-charge .45s ease-in-out}
@keyframes goats-charge{40%{transform:translateX(10px) rotate(8deg)}}
.story-svg .goat-head{transform-box:fill-box;transform-origin:20% 80%}
.story-svg .goat-head.munch{animation:goats-munch .3s ease-in-out 4}
@keyframes goats-munch{50%{transform:rotate(18deg)}}
.story-svg .tuft{transform-box:fill-box;transform-origin:50% 100%;transition:transform .5s,opacity .5s}
.story-svg .tuft.eaten{transform:scaleY(.2);opacity:.3}
.full .actor-goat-small .cuebox,.full .actor-goat-mid .cuebox,.full .actor-goat-big .cuebox{transform-box:fill-box;transform-origin:50% 100%;transform:scale(1.12,1.06);transition:transform .6s var(--spring)}
.full .actor-goat-small .bob,.full .actor-goat-mid .bob,.full .actor-goat-big .bob{animation:story-hop .4s ease-in-out infinite alternate}
.full .actor-goat-mid .bob{animation-delay:.13s}.full .actor-goat-big .bob{animation-delay:.26s}
`;

export default {
 firstScene:()=>riverScene(),
 scenes:()=>[riverScene(),hillScene()],
 play,pictures,cover,css,fun,
 avatars:{
  goatSmall:box('10 -50 24 24',goatBody('small')),goatMid:box('10 -50 24 24',goatBody('mid')),goatBig:box('2 -54 32 32',goatBody('big')),
  troll:box('-28 -94 56 52',trollHead)
 }
};
