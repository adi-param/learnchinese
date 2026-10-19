// 谁的尾巴？ Whose tail is it? The classic first-grade rhyme 比尾巴: six animals stand behind a hedge with their
// tails out of sight. For each question (谁的尾巴长？…) she taps the animal she thinks it is; it hops out in front
// and shows its tail off: the monkey swings its long tail, the rabbit wiggles its puff, the squirrel opens its
// tail over its head like an umbrella, the rooster sways its curved feathers, the duck waddles its flat tail and
// the peacock fans out the prettiest tail of all. Then everyone comes out and dances.
import {INK,L,scene,target,actor,box,star,funSun,funCloud,funTree,funFlower,funActors} from '../story-kit.js';

// ---- Pictures ----
// Every animal stands side on, facing right, drawn around its feet; its tail (class tail) sits at the back.
const eye=(x,y)=>`<circle cx="${x}" cy="${y}" r="1.7" fill="${INK}"/><circle cx="${x+.6}" cy="${y-.6}" r=".55" fill="#fff"/>`;
const eyes=(...points)=>`<g class="blink">${points.map(([x,y])=>eye(x,y)).join('')}</g>`;
const cheek=(x,y)=>`<ellipse cx="${x}" cy="${y}" rx="2.4" ry="1.5" fill="#ff9db5" opacity=".75"/>`;
const ANIMALS={
 monkey:{
  tail:`<path d="M-9 -16C-30 -12-38 8-26 13C-14 17-12 4-20 3" fill="none" stroke="${INK}" stroke-width="6.5" stroke-linecap="round"/><path d="M-9 -16C-30 -12-38 8-26 13C-14 17-12 4-20 3" fill="none" stroke="#a8693a" stroke-width="3.6" stroke-linecap="round"/>`,
  body:`<rect x="-8" y="-9" width="6" height="9" rx="3" fill="#a8693a" ${L}/><rect x="3" y="-9" width="6" height="9" rx="3" fill="#a8693a" ${L}/>
  <ellipse cx="0" cy="-17" rx="11" ry="12" fill="#a8693a" ${L}/><ellipse cx="2" cy="-15" rx="6" ry="7" fill="#f3d2a2"/>
  <path d="M7 -22q8 4 6 12" fill="none" ${L} stroke-width="5"/><path d="M7 -22q8 4 6 12" fill="none" stroke="#a8693a" stroke-width="2.6" stroke-linecap="round"/>
  <circle cx="-9" cy="-40" r="5" fill="#a8693a" ${L}/><circle cx="-9" cy="-40" r="2.4" fill="#f3d2a2"/><circle cx="15" cy="-40" r="5" fill="#a8693a" ${L}/><circle cx="15" cy="-40" r="2.4" fill="#f3d2a2"/>
  <circle cx="3" cy="-39" r="11.5" fill="#a8693a" ${L}/><path d="M3 -45c-4-3-10-1-9 5c1 6 4 9 9 9s8-3 9-9c1-6-5-8-9-5z" fill="#f3d2a2"/>
  ${eyes([-.5,-40],[6.5,-40])}<path d="M1 -34.5q2 2 4 0" fill="none" ${L} stroke-width="1.4"/>${cheek(-4,-35)}${cheek(10,-35)}`,
 },
 rabbit:{
  tail:`<g fill="#fff" ${L} stroke-width="1.6"><circle cx="-12" cy="-13" r="5.6"/></g><path d="M-14 -15q2 -1 3 1M-13 -11q2 0 2 2" fill="none" stroke="#c9c2d6" stroke-width="1.2" stroke-linecap="round"/>`,
  body:`<ellipse cx="-6" cy="-2" rx="6" ry="3" fill="#f4f1f6" ${L}/><ellipse cx="7" cy="-2" rx="5" ry="3" fill="#f4f1f6" ${L}/>
  <ellipse cx="0" cy="-13" rx="11" ry="11" fill="#f4f1f6" ${L}/>
  <g class="ears"><ellipse cx="-1" cy="-54" rx="3.8" ry="11" fill="#f4f1f6" ${L} transform="rotate(-12 -1 -54)"/><ellipse cx="-1" cy="-53" rx="1.6" ry="7.5" fill="#ffb3c6" transform="rotate(-12 -1 -53)"/>
  <ellipse cx="9" cy="-54" rx="3.8" ry="11" fill="#f4f1f6" ${L} transform="rotate(14 9 -54)"/><ellipse cx="9" cy="-53" rx="1.6" ry="7.5" fill="#ffb3c6" transform="rotate(14 9 -53)"/></g>
  <circle cx="4" cy="-33" r="10" fill="#f4f1f6" ${L}/>${eyes([0,-35],[8,-35])}<path d="M3 -31h2l-1 1.4z" fill="#ff8fab" ${L} stroke-width="1"/><path d="M4 -29.6q-1.6 1.8-3 .6M4 -29.6q1.6 1.8 3 .6" fill="none" ${L} stroke-width="1.2"/>${cheek(-3,-30)}${cheek(11,-30)}`,
 },
 squirrel:{
  tail:`<path d="M-6 -6C-24 -12-30 -48-10 -60C6 -70 28 -64 32 -48C24 -55 10 -56 0 -50C-12 -42-12 -22-2 -10Z" fill="#d9772e" ${L}/><path d="M-6 -16C-18 -26-18 -46-4 -54C8 -60 20 -58 26 -52" fill="none" stroke="#f0a65e" stroke-width="3" stroke-linecap="round"/>`,
  body:`<ellipse cx="-3" cy="-2" rx="5" ry="2.6" fill="#b85f22" ${L}/><ellipse cx="7" cy="-2" rx="4.5" ry="2.6" fill="#b85f22" ${L}/>
  <ellipse cx="2" cy="-13" rx="9" ry="11" fill="#d9772e" ${L}/><ellipse cx="5" cy="-12" rx="4.5" ry="7" fill="#f6d3a6"/>
  <g class="acorn"><ellipse cx="11" cy="-16" rx="3.4" ry="4" fill="#b9743c" ${L} stroke-width="1.4"/><path d="M7.4 -18.5q3.6-3.4 7.2 0z" fill="#7a4a22" ${L} stroke-width="1.4"/></g>
  <path d="M-1 -38l-1-7 5 4zM9 -38l2-7 3 6z" fill="#d9772e" ${L} stroke-width="1.6"/>
  <circle cx="5" cy="-31" r="9" fill="#d9772e" ${L}/><ellipse cx="8" cy="-28" rx="5" ry="3.8" fill="#f6d3a6"/>${eyes([2,-33],[9,-33])}<circle cx="10.5" cy="-29" r="1.3" fill="${INK}"/>${cheek(0,-28)}`,
 },
 rooster:{
  tail:`<path d="M-10 -22C-22 -44-38 -38-34 -16C-30 -26-22 -30-14 -16Z" fill="#2c8a6e" ${L}/><path d="M-11 -20C-28 -36-38 -26-32 -8C-28 -18-20 -20-13 -12Z" fill="#e8553f" ${L}/><path d="M-12 -18C-26 -26-30 -14-24 -4C-22 -12-17 -14-12 -10Z" fill="#ffb238" ${L}/>`,
  body:`<path d="M-3 -9v9M5 -9v9M-6 0h5M2 0h6" stroke="#f0a020" stroke-width="2.4" stroke-linecap="round"/>
  <ellipse cx="0" cy="-19" rx="13" ry="11" fill="#fff8ec" ${L}/><path d="M-6 -22q6 6 13 0" fill="none" stroke="#e6d9c4" stroke-width="2"/>
  <path d="M6 -28q2-6 6-8l5 6q-4 2-4 6z" fill="#fff8ec" ${L} stroke-width="1.6"/>
  <path d="M7 -42q1-5 3-1q2-5 4-1q3-4 4 1q1 3-3 4h-7q-3-1-1-3z" fill="#e8553f" ${L} stroke-width="1.5"/>
  <circle cx="12" cy="-34" r="7.5" fill="#fff8ec" ${L}/><path d="M19 -35l6 2-6 2z" fill="#ffb238" ${L} stroke-width="1.4"/><path d="M17 -29q1 6-2 6q-2-2 0-6z" fill="#e8553f" ${L} stroke-width="1.3"/>${eyes([14,-36])}${cheek(10,-31)}`,
 },
 duck:{
  tail:`<path d="M-11 -17L-27 -22Q-30 -15 -26 -9L-11 -11Z" fill="#fff" ${L}/><path d="M-24 -19l-3 8M-20 -18l-2 7" stroke="#d8d2c4" stroke-width="1.2" stroke-linecap="round"/>`,
  body:`<path d="M-4 -6v5h-4l4 1h3M5 -6v5h-3l4 1h3" fill="none" stroke="#ff9a3c" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
  <ellipse cx="0" cy="-15" rx="15" ry="10" fill="#fff" ${L}/><path d="M-6 -18q6 7 14 1" fill="none" stroke="#e1dbcf" stroke-width="2"/>
  <path d="M5 -22q0-6 3-10l7 2q-2 4-1 8z" fill="#fff" ${L} stroke-width="1.6"/>
  <circle cx="11" cy="-33" r="8.5" fill="#fff" ${L}/><path d="M18 -33q8-1 10 2q-3 3-10 2z" fill="#ff9a3c" ${L} stroke-width="1.5"/>${eyes([13,-35])}${cheek(10,-30)}`,
 },
 peacock:{
  tail:`${Array.from({length:9},(_,i)=>{const a=-168+i*19.5,r=a*Math.PI/180,x=-6+Math.cos(r)*36,y=-16+Math.sin(r)*36;return `<g transform="rotate(${a+90} ${x} ${y})"><path d="M-6 -16L${x} ${y}" stroke="#2c8a6e" stroke-width="1.2" opacity=".7"/><ellipse cx="${x}" cy="${y}" rx="6" ry="8.5" fill="#3fae6e" ${L} stroke-width="1.4"/><ellipse cx="${x}" cy="${y}" rx="3.4" ry="4.6" fill="#ffd34d"/><ellipse cx="${x}" cy="${y+.5}" rx="2" ry="2.8" fill="#2f6fd6"/></g>`;}).join('')}
  <g class="sparkles">${[[-40,-44],[-6,-62],[28,-46],[-26,-62]].map(([x,y],i)=>`<g class="sparkle" style="--d:${i*.18}s">${star(x,y,1.2,'#fff3a0')}</g>`).join('')}</g>`,
  body:`<path d="M-3 -8v8M4 -8v8" stroke="#a9a5b4" stroke-width="2.2" stroke-linecap="round"/>
  <ellipse cx="0" cy="-15" rx="10" ry="10" fill="#2f6fd6" ${L}/><path d="M-9 -14q6 6 16 2" fill="none" stroke="#3fae6e" stroke-width="2.4"/>
  <path d="M3 -22q-1-8 2-14l6 1q-1 6 1 13z" fill="#2f6fd6" ${L} stroke-width="1.6"/>
  <path d="M7 -42l-2-7M9 -42v-8M11 -42l2-7" stroke="${INK}" stroke-width="1.2"/><circle cx="5" cy="-49" r="1.8" fill="#3fae6e"/><circle cx="9" cy="-50" r="1.8" fill="#3fae6e"/><circle cx="13" cy="-49" r="1.8" fill="#3fae6e"/>
  <circle cx="9" cy="-37" r="6.5" fill="#2f6fd6" ${L}/><ellipse cx="10.5" cy="-38" rx="3" ry="2.4" fill="#fff"/><path d="M15 -37l5 1.5-5 1.5z" fill="#c9a77f" ${L} stroke-width="1.2"/>${eyes([11,-38])}`,
 }
};
const animal=name=>`<g class="tail">${ANIMALS[name].tail}</g><g class="animal-body">${ANIMALS[name].body}</g>`;
// Where each one stands behind the hedge (not in the order she is asked about them) and where they show off.
const ROW={rabbit:34,peacock:86,monkey:138,duck:190,squirrel:242,rooster:294};
const BEHIND=150,FRONT=[160,194],SOUND={monkey:'ooh',rabbit:'hop',squirrel:'nut',rooster:'crow',duck:'quack',peacock:'wow'};
const FUN=Object.fromEntries(Object.keys(ROW).map(n=>[n,n]));
// The squirrel's umbrella gets a little rain to keep off.
const rain=`<g class="rain">${[[-14,-82],[2,-90],[18,-80],[-4,-76]].map(([x,y],i)=>`<path class="drop" style="--d:${i*.22}s" d="M${x} ${y}q-3 4 0 6q3-2 0-6z" fill="#5bb4ea" ${L} stroke-width="1"/>`).join('')}</g>`;
const bush=(x,y,r,fill)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${L}/>`;
const hedge=`<g class="hedge" data-fun="hedge">${[0,24,48,72,96,120,144,168,192,216,240,264,288,312].map((x,i)=>bush(x+4,146+(i%2)*4,17+(i%3)*2,'#5fae4a')).join('')}
 <rect x="-4" y="148" width="328" height="22" fill="#5fae4a"/><path d="M-4 149H324" stroke="#5fae4a" stroke-width="6"/>
 ${[[18,150],[66,156],[110,148],[170,154],[226,150],[276,156],[306,148]].map(([x,y])=>`<path d="M${x-5} ${y}q5-4 10 0" fill="none" stroke="#3f8a37" stroke-width="2" stroke-linecap="round"/>`).join('')}
 ${[[44,144,'#ff8cc6'],[128,140,'#fff'],[204,142,'#ffd34d'],[262,140,'#ff8cc6']].map(([x,y,c])=>`<circle cx="${x}" cy="${y}" r="2.6" fill="${c}" ${L} stroke-width="1"/>`).join('')}
 <path d="M-4 168H324" ${L}/></g>`;
function clearing(){
 return funActors(scene('Six animals behind a hedge in a forest clearing',`<rect width="320" height="200" fill="#cfeaff"/>${funSun(276,32,14)}${funCloud(70,28)}${funCloud(170,20,.8)}
 <path d="M0 112Q60 88 130 104T250 96T320 104V200H0Z" fill="#b8e29a"/>
 <g fill="#4f9a45" ${L}><path d="M8 118l14-44 14 44z"/><path d="M296 116l12-40 12 40z"/></g><rect x="19" y="118" width="6" height="10" fill="#b9743c" ${L}/><rect x="305" y="116" width="6" height="10" fill="#b9743c" ${L}/>
 ${funTree(22,96,16)}${funTree(308,96,16)}
 <rect y="160" width="320" height="40" fill="#8fd16e"/><path d="M0 170Q100 164 180 170T320 168V200H0Z" fill="#7cc867"/>
 ${Object.entries(ROW).map(([name,x])=>actor(name,x,BEHIND,animal(name)+(name==='squirrel'?rain:''),`${name} tails`)).join('')}
 ${hedge}
 ${[[30,186,'#ff8cc6'],[96,192,'#fff'],[150,184,'#ffd34d'],[220,190,'#ff8cc6'],[290,186,'#fff']].map(([x,y,c])=>funFlower(x,y,c)).join('')}
 ${Object.entries(ROW).map(([name,x])=>target(name,x,124,18,24)).join('')}`),FUN);
}
const arrows=(x1,x2,y)=>`<path d="M${x1} ${y}H${x2}" stroke="#ff7a45" stroke-width="3" stroke-linecap="round"/><path d="M${x1+5} ${y-4}l-5 4 5 4M${x2-5} ${y-4}l5 4-5 4" fill="none" stroke="#ff7a45" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
// A soft yellow glow behind the part a word is about.
const glow=(x,y,r)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#ffe066" opacity=".8"/>`;
const pictures={
 tail:box('-36 -70 76 74',`<g class="tail">${ANIMALS.squirrel.tail}</g>`),
 long:box('-42 -26 50 44',`<g transform="translate(6 0)">${ANIMALS.monkey.tail}</g>${arrows(-38,4,-22)}`),
 short:box('-24 -68 44 72',`${glow(-12,-13,9)}${animal('rabbit')}`),
 umbrella:box('-26 -30 52 52',`<path d="M-22 -2Q-22 -26 0 -26Q22 -26 22 -2Q16 -8 11 -2Q6 -8 0 -2Q-6 -8 -11 -2Q-16 -8 -22 -2Z" fill="#ff7a8c" ${L}/><path d="M-11 -2Q-10 -20 0 -26Q10 -20 11 -2" fill="none" ${L} stroke-width="1.4"/><path d="M0 -2V14q0 5-5 5t-5-4" fill="none" ${L} stroke-width="2.4"/>`),
 curved:box('-40 -46 32 44',ANIMALS.rooster.tail),
 flat:box('-32 -44 62 48',`${glow(-19,-15,10)}${animal('duck')}`),
 monkey:box('-36 -54 60 72',animal('monkey')),
 rabbit:box('-20 -68 40 72',animal('rabbit')),
 squirrel:box('-30 -70 66 74',animal('squirrel')),
 rooster:box('-38 -48 66 52',animal('rooster')),
 duck:box('-30 -44 60 48',animal('duck')),
 peacock:box('-50 -66 100 70',animal('peacock'))
};
const cover=()=>box('0 0 320 200',`<rect width="320" height="200" fill="#cfeaff"/><circle cx="276" cy="32" r="14" fill="#ffd34d"/><path d="M0 112Q60 88 130 104T250 96T320 104V200H0Z" fill="#b8e29a"/>
 ${[0,30,60,90,120,150,180,210,240,270,300,330].map((x,i)=>bush(x,150+(i%2)*5,20,'#5fae4a')).join('')}<rect y="152" width="320" height="48" fill="#5fae4a"/><rect y="176" width="320" height="24" fill="#8fd16e"/><path d="M0 176H320" ${L}/>
 ${[['peacock',160,170,1.5],['monkey',40,190,1.3],['rabbit',98,188,1.25],['duck',208,192,1.15],['squirrel',254,188,1.1],['rooster',300,190,1]].map(([n,x,y,s])=>`<g transform="translate(${x} ${y}) scale(${s})">${animal(n)}</g>`).join('')}`);

// ---- The story ----
let api;
const say=(key,t)=>api.say(key,t),wait=(ms,t)=>api.wait(ms,t),flag=(name,on)=>api.flag(name,on);
const el=name=>api.stage().querySelector('.actor-'+name);
const svg=()=>api.stage().querySelector('.story-svg');
// Waits for her to tap one animal. She gets a moment to think; then the ring shows which one, and the question
// comes again now and then. Tapping a different animal only makes it giggle (see fun).
function pick(name,t,question){
 return api.waitFor(t,done=>{
  const hit=api.stage().querySelector('.hit-'+name);hit.classList.add('active');
  const ring=setTimeout(()=>api.hint(name,true),3500),nudge=setInterval(()=>say(question,t).catch(()=>{}),11000);
  hit.addEventListener('click',done);
  return ()=>{clearTimeout(ring);clearInterval(nudge);hit.removeEventListener('click',done);api.hint(name,false);};
 });
}
// It hops up over the hedge and lands in front, big, then shows its tail off.
async function showOff(name,answer,t){
 const x=ROW[name];
 api.move(name,x,BEHIND-26,350);api.effect('boing');await wait(350,t);
 svg().appendChild(el(name));api.move(name,FRONT[0],FRONT[1],800,1.5);await wait(800,t);
 el(name).classList.add('shown');flag('show-'+name);api.effect(name==='peacock'?'twinkle':'pop');api.voice(SOUND[name]);
 await wait(1500,t);
 await say(answer,t);
 await wait(500,t);
 flag('show-'+name,false);
 api.move(name,x,BEHIND-26,800);await wait(800,t);
 svg().insertBefore(el(name),svg().querySelector('.hedge'));api.move(name,x,BEHIND,350);await wait(400,t);
}
// Where they dance at the end: the peacock at the back in the middle, so its fan is behind everyone.
const DANCE=[['peacock',160,176],['rabbit',26,192],['monkey',76,194],['duck',214,194],['squirrel',254,192],['rooster',294,194]];
const QUESTIONS=[['monkey','qLong','aLong'],['rabbit','qShort','aShort'],['squirrel','qUmbrella','aUmbrella'],['rooster','qCurved','aCurved'],['duck','qFlat','aFlat'],['peacock','qPretty','aPretty']];
async function play(storyApi,t){
 api=storyApi;
 api.ambient('birds');
 await wait(400,t);
 flag('peek');await say('intro',t);
 for(const [name,question,answer] of QUESTIONS){
  await say(question,t);
  await say('tapAnimal',t);
  await pick(name,t,question);
  api.chime('ding');flag('peek',false);
  await showOff(name,answer,t);
  flag('peek');
 }
 // Everyone comes out and dances, tails and all.
 api.ambient('music');flag('peek',false);
 DANCE.forEach(([name,x,y],i)=>setTimeout(()=>{svg().appendChild(el(name));el(name).classList.add('shown');api.move(name,x,y,700,name==='peacock'?1.15:1.05);},i*120));
 await wait(1300,t);flag('dance');api.chime('yay');
 await say('end',t);await wait(2200,t);
}
function fun(name,node,storyApi){
 if(name==='hedge'){storyApi.replay(node,'rustle');storyApi.effect('swish');return true;}
 if(SOUND[name]){storyApi.replay(node.querySelector('.cuebox'),'giggle');storyApi.voice(SOUND[name]);return true;}
}

const css=`
.story-svg .blink{transform-box:fill-box;transform-origin:center;animation:tails-blink 4.2s infinite}
.story-svg .actor-rabbit .blink{animation-delay:.7s}.story-svg .actor-monkey .blink{animation-delay:1.5s}.story-svg .actor-duck .blink{animation-delay:2.2s}
.story-svg .actor-squirrel .blink{animation-delay:2.9s}.story-svg .actor-rooster .blink{animation-delay:3.4s}.story-svg .actor-peacock .blink{animation-delay:1.1s}
@keyframes tails-blink{0%,94%,100%{transform:none}97%{transform:scaleY(.1)}}
.story-svg .actor .tail{opacity:0;transform-box:fill-box;transform:scale(.2);transition:opacity .4s,transform .8s var(--spring)}
.story-svg .actor-monkey .tail{transform-origin:85% 6%}.story-svg .actor-rabbit .tail{transform-origin:50% 50%}.story-svg .actor-squirrel .tail{transform-origin:14% 90%}
.story-svg .actor-rooster .tail{transform-origin:85% 20%}.story-svg .actor-duck .tail{transform-origin:95% 70%}.story-svg .actor-peacock .tail{transform-origin:50% 100%}
.story-svg .actor.shown .tail{opacity:1;transform:none}
.story-svg .actor-peacock.shown .tail{transform:scale(.4,.3) rotate(-30deg)}
.show-peacock .actor-peacock.shown .tail,.dance .actor-peacock.shown .tail{transform:none}
.story-svg .sparkle{opacity:0;transform-box:fill-box;transform-origin:center}
.show-peacock .sparkle,.dance .sparkle{animation:tails-sparkle 1s var(--d) ease-in-out infinite}
@keyframes tails-sparkle{0%,100%{opacity:0;transform:scale(.3)}50%{opacity:1;transform:scale(1.3) rotate(40deg)}}
.show-monkey .actor-monkey .tail,.dance .actor-monkey .tail{animation:tails-swing .7s ease-in-out .5s 6 alternate}
@keyframes tails-swing{from{transform:rotate(-16deg)}to{transform:rotate(18deg)}}
.show-rabbit .actor-rabbit .tail,.dance .actor-rabbit .tail{animation:tails-puff .22s ease-in-out .5s 14 alternate}
@keyframes tails-puff{to{transform:scale(1.45) translateX(-2px)}}
.show-squirrel .actor-squirrel .tail{animation:tails-umbrella 1.2s var(--spring)}
@keyframes tails-umbrella{0%{transform:rotate(-95deg) scale(.5)}100%{transform:none}}
.story-svg .rain{opacity:0}
.show-squirrel .rain{opacity:1}
.show-squirrel .drop{animation:tails-rain .9s var(--d) ease-in infinite}
@keyframes tails-rain{0%{opacity:0;transform:translateY(-14px)}30%{opacity:1}80%{opacity:1;transform:translateY(8px)}100%{opacity:0;transform:translateY(8px) translateX(10px)}}
.show-rooster .actor-rooster .tail,.dance .actor-rooster .tail{animation:tails-sway .6s ease-in-out .5s 6 alternate}
@keyframes tails-sway{from{transform:rotate(-10deg)}to{transform:rotate(12deg)}}
.story-svg .animal-body{transform-box:fill-box;transform-origin:50% 100%}
.show-rooster .actor-rooster .animal-body{animation:tails-crow .5s ease-in-out .4s 2 alternate}
@keyframes tails-crow{to{transform:rotate(-8deg) translateY(-2px)}}
.show-duck .actor-duck .bob,.dance .actor-duck .bob{animation:tails-waddle .35s ease-in-out infinite alternate}
@keyframes tails-waddle{from{transform:rotate(-8deg) translateX(-2px)}to{transform:rotate(8deg) translateX(2px)}}
.show-duck .actor-duck .tail{animation:tails-wag .18s ease-in-out .5s 14 alternate}
@keyframes tails-wag{to{transform:rotate(14deg)}}
.peek .actor .bob{animation:tails-peek 1.8s ease-in-out infinite}
.peek .actor-peacock .bob{animation-delay:.3s}.peek .actor-monkey .bob{animation-delay:.6s}.peek .actor-duck .bob{animation-delay:.9s}.peek .actor-squirrel .bob{animation-delay:1.2s}.peek .actor-rooster .bob{animation-delay:1.5s}
@keyframes tails-peek{50%{transform:translateY(-4px)}}
.dance .actor:not(.actor-duck) .bob{animation:story-hop .35s ease-in-out infinite alternate}
.dance .actor-peacock .bob{animation-delay:.1s}.dance .actor-monkey .bob{animation-delay:.2s}.dance .actor-squirrel .bob{animation-delay:.25s}.dance .actor-rooster .bob{animation-delay:.15s}
.story-svg .cuebox.giggle{animation:tails-giggle .5s ease-in-out}
@keyframes tails-giggle{20%{transform:rotate(-9deg) translateY(-3px)}50%{transform:rotate(8deg) translateY(-5px)}80%{transform:rotate(-4deg)}}
.story-svg .hedge{transform-box:fill-box;transform-origin:50% 100%}
.story-svg .hedge.rustle{animation:story-no .2s ease-in-out 3}
`;

const face=(name,viewBox)=>box(viewBox,ANIMALS[name].body);
export default {
 firstScene:()=>clearing(),
 scenes:()=>[clearing()],
 play,pictures,cover,css,fun,
 avatars:{
  monkey:face('monkey','-13 -55 32 32'),rabbit:face('rabbit','-12 -58 32 32'),squirrel:face('squirrel','-8 -46 26 26'),
  rooster:face('rooster','-2 -48 30 30'),duck:face('duck','-2 -47 30 30'),peacock:face('peacock','-6 -55 30 30')
 }
};
