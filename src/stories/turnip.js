// 拔萝卜 Let's pull out the turnip. Grandpa plants a turnip and she waters it until it grows enormous. Grandpa
// can't pull it up (嗨哟，嗨哟，拔不动！), so he calls Grandma, Grandma calls the girl, then the puppy, the kitten
// and at last the little mouse: she taps each helper in, and every pull is her taps, 嗨哟！ by 嗨哟！. With the
// mouse it pops out, everyone tumbles in a heap, and they share the turnip on a picnic blanket. 真甜！
import {INK,L,scene,target,actor,box,meadow,countPop,funSun,funCloud,funTree,funFlower,funActors} from '../story-kit.js';

// ---- Pictures ----
// Everyone is drawn around their feet, facing right, arms reaching forward to hold on to whoever is in front.
const SKIN='#f6c9a0';
const arm=(x1,y1,x2,y2,colour,w=6)=>`<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${INK}" stroke-width="${w+3}" stroke-linecap="round"/><path d="M${x1} ${y1}L${x2} ${y2}" stroke="${colour}" stroke-width="${w}" stroke-linecap="round"/><circle cx="${x2+1}" cy="${y2}" r="${w/2+.6}" fill="${SKIN}" ${L} stroke-width="1.4"/>`;
const eye=(x,y,r=1.5)=>`<g class="blink"><circle cx="${x}" cy="${y}" r="${r}" fill="${INK}"/></g>`;
const mouth=(x,y,w=4)=>`<path class="smile" d="M${x-w/2} ${y}q${w/2} ${w*.6} ${w} 0" fill="none" stroke="${INK}" stroke-width="1.4" stroke-linecap="round"/><ellipse class="talk" cx="${x}" cy="${y+.8}" rx="${w*.4}" ry="${w*.35}" fill="${INK}"/>`;
const grandpa=`<rect x="-8" y="-22" width="7" height="21" rx="2" fill="#8a6a4a" ${L}/><rect x="1" y="-22" width="7" height="21" rx="2" fill="#8a6a4a" ${L}/>
 <ellipse cx="-4" cy="-1" rx="6" ry="3" fill="#5a3e2b" ${L} stroke-width="1.6"/><ellipse cx="6" cy="-1" rx="6" ry="3" fill="#5a3e2b" ${L} stroke-width="1.6"/>
 <rect x="-13" y="-47" width="24" height="29" rx="9" fill="#5b8fd9" ${L}/><path d="M-1 -46v26" stroke="#3f6fb8" stroke-width="1.6"/><circle cx="-1" cy="-38" r="1.2" fill="#fff"/><circle cx="-1" cy="-30" r="1.2" fill="#fff"/>
 ${arm(3,-39,22,-33,'#5b8fd9')}
 <circle cx="0" cy="-57" r="11" fill="${SKIN}" ${L}/><path d="M-11 -58q-2-7 3-10M-10 -52q-4-3-2-8" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/><path d="M-11 -58q-2-7 3-10M-10 -52q-4-3-2-8" fill="none" stroke="${INK}" stroke-width="1" stroke-linecap="round" opacity=".35"/>
 <circle cx="-3" cy="-56" r="2.6" fill="${SKIN}" ${L} stroke-width="1.4"/>
 <path d="M-1 -51Q2 -40 9 -42Q13 -44 11 -51Q5 -48 -1 -51Z" fill="#fff" ${L} stroke-width="1.5"/>
 ${eye(6,-60)}<path d="M3 -64.5q3-1.5 6 0" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><circle cx="11" cy="-56" r="2.6" fill="#f2a882" ${L} stroke-width="1.3"/>
 ${mouth(7,-50,4)}<path d="M2 -52q4-2 9 0" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>`;
const grandma=`<rect x="-6" y="-12" width="5" height="11" fill="${SKIN}" ${L} stroke-width="1.6"/><rect x="2" y="-12" width="5" height="11" fill="${SKIN}" ${L} stroke-width="1.6"/>
 <ellipse cx="-3" cy="-1" rx="5" ry="2.6" fill="#7a3b6e" ${L} stroke-width="1.5"/><ellipse cx="5" cy="-1" rx="5" ry="2.6" fill="#7a3b6e" ${L} stroke-width="1.5"/>
 <path d="M-8 -44Q-18 -20 -15 -10H15Q17 -22 8 -44Z" fill="#b07ad9" ${L}/><path d="M-2 -36Q-6 -20 -4 -13H10Q11 -24 6 -36Z" fill="#fff" ${L} stroke-width="1.5"/><path d="M-1 -26h8" stroke="#f0507a" stroke-width="1.4"/>
 ${arm(3,-38,20,-32,'#b07ad9',5.5)}
 <circle cx="-10" cy="-61" r="5.5" fill="#c9c6d6" ${L}/>
 <circle cx="0" cy="-53" r="10" fill="${SKIN}" ${L}/><path d="M-10 -55Q-9 -65 1 -64Q9 -64 9 -58Q2 -61 -4 -57Q-6 -54 -10 -51Z" fill="#c9c6d6" ${L} stroke-width="1.6"/>
 ${eye(5,-54,1.4)}<circle cx="5" cy="-54" r="3.2" fill="none" stroke="#7a6f8f" stroke-width="1"/><circle cx="4" cy="-49" r="2.4" fill="#ffb3c1" opacity=".8"/><circle cx="10" cy="-52" r="1.6" fill="#f2a882" ${L} stroke-width="1"/>
 ${mouth(7,-47.5,3.6)}`;
const girl=`<rect x="-5" y="-11" width="4" height="10" fill="${SKIN}" ${L} stroke-width="1.5"/><rect x="2" y="-11" width="4" height="10" fill="${SKIN}" ${L} stroke-width="1.5"/>
 <ellipse cx="-3" cy="-1" rx="4.4" ry="2.4" fill="#f0507a" ${L} stroke-width="1.4"/><ellipse cx="4" cy="-1" rx="4.4" ry="2.4" fill="#f0507a" ${L} stroke-width="1.4"/>
 <path d="M-6 -31Q-14 -16 -12 -10H12Q13 -17 6 -31Z" fill="#ff6b6b" ${L}/><circle cx="-2" cy="-19" r="1.5" fill="#fff"/><circle cx="5" cy="-15" r="1.5" fill="#fff"/><circle cx="-6" cy="-14" r="1.5" fill="#fff"/>
 ${arm(2,-27,16,-23,'#ff6b6b',4.6)}
 <circle cx="-11" cy="-44" r="4" fill="#3b2c3f" ${L} stroke-width="1.5"/><circle cx="-9" cy="-35" r="4" fill="#3b2c3f" ${L} stroke-width="1.5"/><circle cx="-10" cy="-40" r="2" fill="#ffd34d" ${L} stroke-width="1"/>
 <circle cx="0" cy="-40" r="9" fill="${SKIN}" ${L}/><path d="M-9 -41Q-8 -50 1 -50Q9 -49 9 -43Q3 -46 -3 -44Q-5 -40 -9 -38Z" fill="#3b2c3f" ${L} stroke-width="1.5"/>
 ${eye(4.5,-40,1.4)}<circle cx="3" cy="-36" r="2.2" fill="#ffb3c1" opacity=".85"/>${mouth(6,-35,3.4)}`;
const dog=`<path d="M-11 -14q-7-6-5-13" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M-11 -14q-7-6-5-13" fill="none" stroke="#d9a066" stroke-width="2.6" stroke-linecap="round"/>
 ${[-8,-3,4,8].map(x=>`<rect x="${x-1.8}" y="-9" width="4" height="9" rx="1.6" fill="#d9a066" ${L} stroke-width="1.4"/>`).join('')}
 <ellipse cx="-1" cy="-12" rx="12" ry="7" fill="#d9a066" ${L}/><ellipse cx="-4" cy="-14" rx="4" ry="3" fill="#b9793f"/>
 <circle cx="11" cy="-20" r="7.5" fill="#d9a066" ${L}/><ellipse cx="17" cy="-17" rx="4.5" ry="3.4" fill="#f3d3a8" ${L} stroke-width="1.4"/><circle cx="20.5" cy="-18" r="1.6" fill="${INK}"/>
 <path d="M6 -26q-6 2-4 11q4-1 5-6z" fill="#8c5a2e" ${L} stroke-width="1.4"/>${eye(13,-22,1.3)}<ellipse class="talk" cx="17" cy="-14" rx="1.6" ry="1.2" fill="${INK}"/><path class="smile" d="M15 -14.5q2 1.5 4 0" fill="none" stroke="${INK}" stroke-width="1.2" stroke-linecap="round"/>`;
const cat=`<path d="M-8 -8q-9-2-8-12q1-4 4-2" fill="none" stroke="${INK}" stroke-width="4.6" stroke-linecap="round"/><path d="M-8 -8q-9-2-8-12q1-4 4-2" fill="none" stroke="#f3a64a" stroke-width="2.4" stroke-linecap="round"/>
 ${[-6,-2,3,6].map(x=>`<rect x="${x-1.5}" y="-6" width="3.2" height="6" rx="1.4" fill="#f3a64a" ${L} stroke-width="1.2"/>`).join('')}
 <ellipse cx="-1" cy="-8" rx="9" ry="5.4" fill="#f3a64a" ${L} stroke-width="1.8"/><path d="M-5 -13v4M-1 -13.4v4" stroke="#c97a2a" stroke-width="1.4"/>
 <path d="M4 -19l1-6 4 4zM10 -21l3-5 1 6z" fill="#f3a64a" ${L} stroke-width="1.4"/>
 <circle cx="9" cy="-15" r="6" fill="#f3a64a" ${L} stroke-width="1.8"/>${eye(11,-16,1.1)}<path d="M14 -13.6l-1 1h2z" fill="#f0507a"/>
 <path d="M14 -12l4-.5M14 -11l4 1" stroke="${INK}" stroke-width=".6"/><ellipse class="talk" cx="13" cy="-11" rx="1.2" ry=".9" fill="${INK}"/>`;
const mouse=`<g transform="scale(1.35)"><path d="M-5 -3q-6 1-7-4q0-3 3-2" fill="none" stroke="#e78fa9" stroke-width="1.2" stroke-linecap="round"/>
 <ellipse cx="0" cy="-3.6" rx="5.4" ry="3.6" fill="#b7b3c4" ${L} stroke-width="1.3"/><circle cx="3" cy="-8" r="2.6" fill="#ffc4d6" ${L} stroke-width="1.2"/>
 <circle cx="5" cy="-5.4" r="3" fill="#b7b3c4" ${L} stroke-width="1.3"/><circle cx="8.2" cy="-5" r=".9" fill="#f0507a"/>${eye(5.6,-6.2,.7)}<ellipse class="talk" cx="7" cy="-3.6" rx=".7" ry=".5" fill="${INK}"/></g>`;
const FOLK={grandpa,grandma,girl,dog,cat,mouse};

// The turnip, around the point where it leaves the ground: leaves up, a big round root down, a sleepy face that
// only shows once it is out.
const leaves=`<g class="leaves"><path d="M-2 -6Q-32 -26 -28 -50Q-10 -42 -2 -6Z" fill="#4fb33f" ${L}/><path d="M2 -6Q32 -26 28 -50Q10 -42 2 -6Z" fill="#4fb33f" ${L}/>
 <path d="M0 -6Q-12 -40 0 -62Q12 -40 0 -6Z" fill="#6cc24a" ${L}/><path d="M-3 -10Q-16 -28 -22 -44M3 -10Q16 -28 22 -44M0 -10V-54" fill="none" stroke="#2f7d2a" stroke-width="1.2"/></g>`;
const bulb=`<path d="M-30 -8Q-38 24 -8 42Q-2 47 0 60Q2 47 8 42Q38 24 30 -8Q0 -16 -30 -8Z" fill="#fbf7ff" ${L}/>
 <path d="M-30 -8Q0 -16 30 -8Q33 3 32 10Q0 2 -32 10Q-33 1 -30 -8Z" fill="#b26bd8" ${L}/>
 <path d="M-18 30q-4 2-6 0M18 30q4 2 6 0M-6 46q-3 2-5 1" fill="none" stroke="#c9bfd9" stroke-width="1.4" stroke-linecap="round"/>
 <g class="turnip-face"><g class="blink"><path d="M-12 20q3 3 6 0M6 20q3 3 6 0" fill="none" stroke="${INK}" stroke-width="1.8" stroke-linecap="round"/></g><circle cx="-14" cy="26" r="3" fill="#ffb3c1" opacity=".8"/><circle cx="14" cy="26" r="3" fill="#ffb3c1" opacity=".8"/><path d="M-4 28q4 4 8 0" fill="none" stroke="${INK}" stroke-width="1.8" stroke-linecap="round"/></g>`;
const turnipArt=(grow=1,face=false)=>`<g class="turnip-art" style="transform:scale(${grow})">${face?bulb.replace('class="turnip-face"','class="turnip-face show"'):bulb}${leaves}</g>`;
const can=`<g class="can-tip"><path d="M10 -16q10 0 9 9" fill="none" ${L} stroke-width="3"/><path d="M-10 -10L-26 -24L-24 -27L-6 -15Z" fill="#3fa9a0" ${L} stroke-width="1.6"/><ellipse cx="-25" cy="-25.5" rx="2.4" ry="3.6" transform="rotate(-45 -25 -25.5)" fill="#2c8a82" ${L} stroke-width="1.4"/>
 <path d="M-12 0V-18Q-1 -22 10 -18V0Z" fill="#4fc4b9" ${L}/><path d="M-12 -12h22" stroke="#2c8a82" stroke-width="1.6"/>
 <g class="drops" fill="#5bb4ea">${[[-30,-18],[-34,-12],[-28,-8]].map(([x,y],i)=>`<path style="--d:${i*.12}s" d="M${x} ${y-3}q2.4 3 0 5q-2.4-2 0-5z"/>`).join('')}</g></g>`;

// The garden: Grandpa's cottage, a fence, the vegetable bed. Helpers wait off the left edge until they are called.
const GROUND=166,TX=262,TY=145,MOUND=156;
const CHAIN=[['grandpa',228],['grandma',200],['girl',174],['dog',156],['cat',140],['mouse',128]];
const folkActors=svg=>funActors(svg,{grandpa:'grandpa',grandma:'grandma',girl:'girl',dog:'dog',cat:'cat',mouse:'mouse',turnip:'turnip'});
const cottage=`<g transform="translate(24 128)"><rect x="0" y="-34" width="54" height="34" fill="#fff4dc" ${L}/><path d="M-6 -32L27 -58L60 -32Z" fill="#e8705a" ${L}/>
 <rect x="8" y="-22" width="13" height="22" rx="2" fill="#b9743c" ${L} stroke-width="1.6"/><rect x="31" y="-26" width="14" height="12" fill="#bfe6ff" ${L} stroke-width="1.6"/><path d="M38 -26v12M31 -20h14" stroke="${INK}" stroke-width="1.2"/>
 <rect x="38" y="-56" width="7" height="12" fill="#c98b4a" ${L} stroke-width="1.6"/></g>`;
const fence=`<g>${Array.from({length:12},(_,i)=>`<path d="M${86+i*12} 142v-18l3-4 3 4v18z" fill="#fff" ${L} stroke-width="1.4"/>`).join('')}<path d="M84 128h146M84 137h146" stroke="${INK}" stroke-width="1.4"/></g>`;
function gardenScene(){
 return folkActors(scene('Grandpa’s garden with a turnip growing',`<rect width="320" height="200" fill="#cfeaff"/>${funSun(290,30,13)}${funCloud(120,28)}${funCloud(212,44,.8)}
 <path d="M0 120Q90 98 170 112T320 104V200H0Z" fill="#b8e29a"/>${cottage}${fence}${funTree(150,98,18)}
 <g transform="translate(160 146)"><rect x="-4" y="-34" width="8" height="34" rx="2" fill="#b9743c" ${L}/><circle cx="0" cy="-48" r="20" fill="#5fbf4a" ${L}/><circle cx="-8" cy="-54" r="5" fill="#7fd36a"/><circle cx="8" cy="-44" r="2.6" fill="#ff6b6b" ${L} stroke-width="1"/><circle cx="-6" cy="-38" r="2.6" fill="#ff6b6b" ${L} stroke-width="1"/></g>
 ${actor('turnip',TX,TY,turnipArt(.2),'turnip')}
 <path d="M0 150Q120 144 230 150T320 148V200H0Z" fill="#7cc867"/><ellipse cx="${TX}" cy="${MOUND}" rx="44" ry="8" fill="#a8774e" ${L}/><path d="M${TX-30} ${MOUND-1}q4-3 8 0M${TX+10} ${MOUND+1}q4-3 8 0" fill="none" stroke="#7b5232" stroke-width="1.4"/>
 ${[[24,184,'#ff8cc6'],[74,192,'#ffd34d'],[300,186,'#fff'],[110,180,'#fff']].map(([x,y,c])=>funFlower(x,y,c)).join('')}
 ${actor('can',300,GROUND,can,'can')}
 ${CHAIN.map(([name,x],i)=>actor(name,i?-40:x,GROUND,FOLK[name],name+' helper')).join('')}
 <g class="dizzy">${[[150,118],[190,124],[226,116]].map(([x,y],i)=>`<g transform="translate(${x} ${y})"><g class="dizzy-star" style="--d:${i*.2}s"><path d="M0 -6l1.8 3.9 4.2.6-3 3 .7 4.2-3.7-2-3.7 2 .7-4.2-3-3 4.2-.6z" fill="#ffd34d" ${L} stroke-width="1.2"/></g></g>`).join('')}</g>
 ${countPop(150,60)}
 ${target('can',300,150,16,22)}${target('turnip',TX,124,22,30)}${target('helper',30,140,22,30)}`));
}
// The picnic: the turnip stands on the blanket and slices fly to everyone.
const PICNIC=[['grandma',34,1],['grandpa',70,1],['girl',108,1],['mouse',204,-1],['dog',228,-1],['cat',258,-1]];
const mouthAt=(name,x,dir)=>({grandma:[x+8*dir,116],grandpa:[x+8*dir,112],girl:[x+6*dir,128],dog:[x+17*dir,150],cat:[x+12*dir,154],mouse:[x+8*dir,160]})[name];
const slice=`<path d="M-7 0A7 7 0 0 1 7 0Z" fill="#fbf7ff" ${L} stroke-width="1.4"/><path d="M-7 0A7 7 0 0 1 -5 -5" fill="none" stroke="#b26bd8" stroke-width="2.6"/>`;
function picnicScene(){
 return folkActors(scene('Everyone shares the turnip on a picnic blanket',`${meadow}${funSun(44,38)}${funCloud(110,30)}${funCloud(236,42,.9)}${funTree(286,106,22)}
 <path d="M40 176L80 150H244L284 176Z" fill="#ff8c8c" ${L}/><path d="M80 150L40 176M121 150L102 176M162 150V176M203 150L222 176M244 150L284 176M60 163H264" stroke="#fff" stroke-width="3" opacity=".7"/>
 ${actor('turnip',160,118,turnipArt(1,true),'turnip')}
 ${PICNIC.map(([name,x,dir])=>actor(name,x,dir<0&&name!=='mouse'?182:178,dir<0?`<g transform="scale(-1 1)">${FOLK[name]}</g>`:FOLK[name],name+' helper')).join('')}
 ${PICNIC.map((_,i)=>actor('slice-'+(i+1),160,140,`<g class="slice">${slice}</g>`,'turnip')).join('')}
 <g class="hearts">${[[60,84],[160,40],[240,96]].map(([x,y],i)=>`<path style="--d:${i*.25}s" transform="translate(${x} ${y})" d="M0 -3c-2-4-8-1-4 4l4 3.5 4-3.5c4-5-2-8-4-4z" fill="#f0507a" ${L} stroke-width="1"/>`).join('')}</g>
 ${target('turnip',160,140,26,34)}`));
}
const pictures={
 turnip:box('-40 -66 80 130',turnipArt(1)),
 pull:box('-18 -78 104 96',`<g transform="translate(70 4)"><g transform="scale(.7)">${turnipArt(1)}</g></g>${grandpa}<path d="M-14 -72l-6-4M-16 -64l-7-1" stroke="#ff7a45" stroke-width="2.4" stroke-linecap="round"/><path d="M52 -6H90" stroke="#7cc867" stroke-width="3"/>`),
 grandpa:box('-16 -72 42 76',grandpa),
 grandma:box('-18 -68 42 72',grandma),
 girl:box('-16 -54 36 58',girl),
 dog:box('-20 -30 44 34',dog),
 cat:box('-18 -27 36 30',cat),
 mouse:box('-18 -15 32 18',mouse),
 help:box('-20 -70 80 74',`<g transform="translate(30 0)">${grandma}</g>${girl}<path d="M14 -60c-2-4-8-1-4 4l4 3.5 4-3.5c4-5-2-8-4-4z" fill="#f0507a" ${L} stroke-width="1"/>`)
};
const cover=()=>box('0 0 320 200',`<rect width="320" height="200" fill="#cfeaff"/><circle cx="290" cy="30" r="13" fill="#ffd34d"/><path d="M0 120Q90 98 170 112T320 104V200H0Z" fill="#b8e29a"/>${cottage}${fence}
 <g transform="translate(${TX} 128)">${turnipArt(1.1)}</g>
 <path d="M0 150Q120 144 230 150T320 148V200H0Z" fill="#7cc867"/><ellipse cx="${TX}" cy="${MOUND}" rx="44" ry="8" fill="#a8774e" ${L}/>
 ${CHAIN.map(([name,x])=>`<g transform="translate(${x} ${GROUND}) rotate(-8)">${FOLK[name]}</g>`).join('')}`);

// ---- The story ----
let api;
const say=(key,t)=>api.say(key,t),wait=(ms,t)=>api.wait(ms,t),flag=(name,on)=>api.flag(name,on),move=(...args)=>api.move(...args);
const $=sel=>api.stage().querySelector(sel);
const grow=(scale,ms=600)=>{const art=$('.actor-turnip .turnip-art');art.style.transitionDuration=ms+'ms';art.style.transform=`scale(${scale})`;};
// One 嗨哟！: she taps, everyone in the chain leans back and strains, and the turnip's leaves stretch.
async function heave(t){
 await api.tap('turnip',t,'tapPull');
 api.replay(api.stage(),'strain');api.count('嗨哟');api.sounds.whoosh(.6);
 await wait(800,t);
}
async function pull(t,line){
 await say('tapPull',t);
 flag('pulling');await heave(t);await heave(t);
 await say(line,t);
 if(line!=='heaveLast'){api.sounds.beep();flag('pulling',false);await wait(300,t);}
}
const HELPERS=[['grandma','callGrandma','comeGrandma'],['girl','callGirl','comeGirl'],['dog','callDog','comeDog'],['cat','callCat','comeCat'],['mouse','callMouse','comeMouse']];
async function inTheGarden(t){
 await wait(400,t);
 await say('plant',t);
 // She waters it, and every tap it grows.
 await say('tapWater',t);
 for(const size of [.42,.64,.84]){
  await api.tap('can',t,'tapWater');
  api.replay($('.can-tip'),'pour');api.effect('swish');await wait(700,t);
  grow(size);api.effect('boing');await wait(500,t);
 }
 api.sounds.magic();grow(1.12,1400);api.replay(api.stage(),'grown');
 await say('grow',t);
 move('can',350,GROUND,900);
 await say('pullGrandpa',t);
 $('.actor-grandpa').classList.add('puller');
 await pull(t,'heave');
 // Each helper runs up to the edge, she taps them in, and they join the end of the chain.
 for(const [i,[name,call,come]] of HELPERS.entries()){
  move(name,26,GROUND,900);
  await say(call,t);
  await say('tapHelper',t);
  await api.tap('helper',t,'tapHelper');
  api.voice({dog:'woof',cat:'mew',mouse:'squeak',girl:'giggle'}[name]||'');
  const x=CHAIN[i+1][1];move(name,x,GROUND,1100);await wait(1100,t);
  $('.actor-'+name).classList.add('puller');
  await say(come,t);
  await pull(t,name==='mouse'?'heaveLast':'still');
 }
 // Out it comes, and everyone falls over.
 flag('pulling',false);
 api.sounds.whoosh(1.2);api.effect('pop');move('turnip',TX,86,500);api.replay(api.stage(),'popped');await wait(500,t);
 api.chime('yay');await say('out',t);
 flag('tumble');CHAIN.forEach(([name,x])=>move(name,x-10,GROUND,500));api.sounds.crash();
 move('turnip',236,126,700);await wait(700,t);
 api.effect('boing');await say('tumble',t);await wait(600,t);
}
async function atThePicnic(t){
 await api.changeScene(t,picnicScene());
 await say('eat',t);
 // Each tap sends two slices flying, one to each side of the blanket.
 for(let i=0;i<3;i++){
  await api.tap('turnip',t,'eat');
  api.effect('swish');api.replay($('.actor-turnip .cuebox'),'happy-hop');
  for(const k of [i,PICNIC.length-1-i]){
   const [name,x,dir]=PICNIC[k],[mx,my]=mouthAt(name,x,dir),piece=$('.actor-slice-'+(k+1));
   piece.classList.add('flying');move('slice-'+(k+1),mx,my,600);
  }
  await wait(650,t);
  for(const k of [i,PICNIC.length-1-i]){$('.actor-slice-'+(k+1)).classList.add('eaten');api.replay($(`.actor-${PICNIC[k][0]} .cuebox`),'munch');}
  api.chime('ding');await wait(500,t);
 }
 flag('yum');api.chime('yay');
 await say('sweet',t);await wait(1200,t);
}
async function play(storyApi,t){
 api=storyApi;
 api.ambient('birds');
 await inTheGarden(t);
 api.ambient('music');
 await atThePicnic(t);
}
const SOUND={grandpa:'hmm',dog:'woof',cat:'mew',mouse:'squeak',girl:'giggle'};
function fun(name,el,storyApi){
 const a=storyApi;
 if(name==='turnip'){a.replay(el.querySelector('.leaves'),'tug');a.effect('boing');return true;}
 if(FOLK[name]){a.replay(el.querySelector('.cuebox'),'happy-hop');if(SOUND[name])a.voice(SOUND[name]);else a.effect('pop');return true;}
}

const SPEAKERS=['grandpa','grandma','girl','dog','cat','mouse'];
const css=`
.story-svg .blink{transform-box:fill-box;transform-origin:center;animation:turnip-blink 4.3s infinite}
${SPEAKERS.map((s,i)=>`.story-svg .actor-${s} .blink{animation-delay:${(i*.7).toFixed(1)}s}`).join('')}
@keyframes turnip-blink{0%,94%,100%{transform:none}97%{transform:scaleY(.1)}}
.story-svg .talk{opacity:0}
${SPEAKERS.map(s=>`[data-talking="${s}"] .actor-${s} .talk`).join(',')},[data-talking="all"] .talk{animation:turnip-talk .22s steps(2) infinite}
${SPEAKERS.map(s=>`[data-talking="${s}"] .actor-${s} .smile`).join(',')},[data-talking="all"] .smile{opacity:0}
@keyframes turnip-talk{0%{opacity:1}100%{opacity:0}}
.story-svg .turnip-art{transform-box:view-box;transform-origin:0 0;transition:transform .6s var(--spring)}
.story-svg .leaves{transform-box:fill-box;transform-origin:50% 100%}
.story-svg .leaves.tug{animation:turnip-tug .6s ease-in-out}
.grown .actor-turnip .leaves{animation:turnip-tug .5s ease-in-out 3}
@keyframes turnip-tug{30%{transform:scaleY(1.14) rotate(-6deg)}70%{transform:scaleY(1.06) rotate(5deg)}}
.story-svg .can-tip{transform-box:fill-box;transform-origin:30% 100%}
.story-svg .can-tip.pour{animation:turnip-pour .7s ease-in-out}
@keyframes turnip-pour{30%,70%{transform:rotate(-28deg)}}
.story-svg .drops path{opacity:0}
.story-svg .can-tip.pour .drops path{animation:turnip-drop .5s var(--d) ease-in 2}
@keyframes turnip-drop{0%{opacity:1;transform:none}100%{opacity:0;transform:translate(-4px,14px)}}
.story-svg .actor-can{transition:transform .9s ease-in}
.pulling .puller .cuebox{transform:rotate(-9deg);transition:transform .3s}
.strain .puller .cuebox{animation:turnip-strain .7s ease-in-out}
@keyframes turnip-strain{0%,100%{transform:rotate(-9deg)}35%{transform:rotate(-17deg) translateX(-2px)}60%{transform:rotate(-6deg)}80%{transform:rotate(-12deg)}}
.strain .actor-turnip .leaves{animation:turnip-tug .7s ease-in-out}
.strain .actor-turnip .bob{animation:story-shiver .1s 6 alternate}
.story-svg .actor-turnip{transition:transform .5s cubic-bezier(.2,1.4,.5,1)}
.story-svg .actor-turnip .cuebox{transform-box:view-box;transform-origin:0 0;transition:transform .7s ease-in}
.tumble .actor-turnip .cuebox{transform:rotate(-90deg)}
.story-svg .turnip-face{opacity:0;transition:opacity .4s}
.popped .turnip-face,.tumble .turnip-face,.story-svg .turnip-face.show{opacity:1}
.tumble .puller .cuebox{transform:rotate(-78deg);transition:transform .5s cubic-bezier(.3,1.5,.6,1)}
.story-svg .dizzy{opacity:0;transition:opacity .4s}
.tumble .dizzy{opacity:1}
.tumble .dizzy-star{transform-box:fill-box;transform-origin:center;animation:story-spin 1.4s var(--d) linear infinite}
.story-svg [class*="actor-slice"]{opacity:0;transition:transform .6s ease-out,opacity .3s}
.story-svg .actor.flying{opacity:1}
.story-svg .actor.eaten{opacity:0}
.story-svg .cuebox.munch{animation:story-hop .15s ease-in-out 4 alternate}
.story-svg .hearts path{opacity:0}
.yum .hearts path{animation:turnip-heart 1.6s var(--d) ease-out infinite}
@keyframes turnip-heart{0%{opacity:0;transform:translateY(8px) scale(.6)}30%{opacity:1}100%{opacity:0;transform:translateY(-16px) scale(1.2)}}
.yum .actor:not([class*="actor-slice"]) .bob{animation:story-hop .4s ease-in-out infinite alternate}
.yum .actor-grandpa .bob,.yum .actor-dog .bob{animation-delay:.13s}.yum .actor-girl .bob,.yum .actor-cat .bob{animation-delay:.26s}
`;

export default {
 firstScene:()=>gardenScene(),
 scenes:()=>[gardenScene(),picnicScene()],
 play,pictures,cover,css,fun,
 avatars:{
  grandpa:box('-14 -71 28 28',grandpa),grandma:box('-17 -68 30 30',grandma),girl:box('-14 -53 26 26',girl),
  dog:box('2 -30 24 24',dog),cat:box('0 -26 20 20',cat),mouse:box('-2 -16 16 16',mouse),
  all:box('-16 -74 70 76',`${grandpa}<g transform="translate(24 0)">${girl}</g><g transform="translate(40 0)">${dog}</g>`)
 }
};
