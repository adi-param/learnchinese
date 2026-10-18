// PAW Patrol 救小鸡 PAW Patrol saves the chicken. The Mayor phones Ryder: her little chicken is stuck up a tree.
// Chase, Rubble and Skye line up; Rubble digs the rocks off the road, Chase runs the traffic light (红灯停，
// 绿灯行！), and Skye flies up to lift the chicken down. Each pup gets a bone. Names stay in English.
import {INK,L,scene,target,actor,bubble,box,tree,star} from '../story-kit.js';

// ---- Pictures ----
const limb=(x1,y1,x2,y2,colour,w=4.5)=>`<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${INK}" stroke-width="${w+3.5}" stroke-linecap="round"/><path d="M${x1} ${y1}L${x2} ${y2}" stroke="${colour}" stroke-width="${w}" stroke-linecap="round"/>`;
const SKIN='#ffd9b8';
// A pup sitting up, facing us, in its uniform. The tail wags when it is happy.
const EARS={
 pointy:fur=>`<path d="M-11 -42-13 -56-3 -48ZM11 -42 13 -56 3 -48Z" fill="${fur}" ${L}/><path d="M-10 -45-11 -52-6 -48ZM10 -45 11 -52 6 -48Z" fill="#f2c7a8"/>`,
 floppy:fur=>`<path d="M-11 -46Q-22 -42 -18 -26Q-12 -30 -9 -38Z" fill="${fur}" ${L}/><path d="M11 -46Q22 -42 18 -26Q12 -30 9 -38Z" fill="${fur}" ${L}/>`,
 folded:fur=>`<path d="M-12 -44-17 -48-14 -38ZM12 -44 17 -48 14 -38Z" fill="${fur}" ${L}/>`
};
const HATS={
 police:`<path d="M-12 -46Q-12 -58 0 -58Q12 -58 12 -46Z" fill="#2b5fd9" ${L}/><path d="M-14 -46H14Q12 -42 0 -42Q-12 -42 -14 -46Z" fill="#1d3f9a" ${L} stroke-width="1.6"/><circle cx="0" cy="-52" r="2.6" fill="#ffd34d" ${L} stroke-width="1"/>`,
 helmet:`<path d="M-13 -45Q-13 -60 0 -60Q13 -60 13 -45Z" fill="#ffc233" ${L}/><path d="M-16 -45H16" ${L} stroke-width="3"/><path d="M-16 -45H16" stroke="#ffc233" stroke-width="1.2"/><path d="M0 -60V-46" stroke="#e5a400" stroke-width="2"/>`,
 goggles:`<path d="M-11 -48Q0 -54 11 -48" fill="none" stroke="#ff5fa2" stroke-width="2.4"/><circle cx="-5" cy="-49" r="3.6" fill="#ffd1e6" ${L} stroke-width="1.4"/><circle cx="5" cy="-49" r="3.6" fill="#ffd1e6" ${L} stroke-width="1.4"/>`
};
function pup({fur,light,ears,hat,vest,wide=false}){
 const cheek=wide?15:13;
 return `<g class="tail"><path d="M8 -12q12-2 12-14" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M8 -12q12-2 12-14" fill="none" stroke="${fur}" stroke-width="3.6" stroke-linecap="round"/></g>
 <ellipse cx="0" cy="-13" rx="11" ry="11" fill="${fur}" ${L}/><path d="M-8 -20Q0 -14 8 -20L9 -8Q0 -4 -9 -8Z" fill="${vest}" ${L} stroke-width="1.6"/><circle cx="0" cy="-12" r="3" fill="#fff" ${L} stroke-width="1"/>
 <ellipse cx="-5" cy="-2" rx="4.5" ry="3" fill="${light}" ${L} stroke-width="1.6"/><ellipse cx="5" cy="-2" rx="4.5" ry="3" fill="${light}" ${L} stroke-width="1.6"/>
 ${EARS[ears](fur)}<ellipse cx="0" cy="-36" rx="${cheek}" ry="13" fill="${fur}" ${L}/>
 <ellipse cx="0" cy="-31" rx="7.5" ry="5.5" fill="${light}" ${L} stroke-width="1.6"/><ellipse cx="0" cy="-34" rx="2.6" ry="1.9" fill="${INK}"/><path d="M-3 -29q3 2.4 6 0" fill="none" ${L} stroke-width="1.4"/>
 <circle cx="-5" cy="-39" r="2.6" fill="${INK}"/><circle cx="5" cy="-39" r="2.6" fill="${INK}"/><circle cx="-4.2" cy="-40" r=".9" fill="#fff"/><circle cx="5.8" cy="-40" r=".9" fill="#fff"/>
 ${HATS[hat]}`;
}
const PUPS={
 chase:pup({fur:'#b5835a',light:'#f2d7b0',ears:'pointy',hat:'police',vest:'#2b5fd9'}),
 rubble:pup({fur:'#e6c48f',light:'#fff3dd',ears:'folded',hat:'helmet',vest:'#ffc233',wide:true}),
 skye:pup({fur:'#e9cfa6',light:'#fff4e0',ears:'floppy',hat:'goggles',vest:'#ff7fb6'})
};
const bone=`<path d="M-9 -2a3 3 0 1 1 1-5h16a3 3 0 1 1 1 5a3 3 0 1 1-1 5H-8a3 3 0 1 1-1-5z" fill="#fffaf0" ${L} stroke-width="1.6"/>`;
// Ryder and the Mayor, standing and facing us.
const person=({top,bottom,hair,dress=false})=>`<rect x="-6.5" y="-20" width="5.5" height="18" rx="2" fill="${bottom}" ${L} stroke-width="1.6"/><rect x="1" y="-20" width="5.5" height="18" rx="2" fill="${bottom}" ${L} stroke-width="1.6"/>
 <ellipse cx="-4" cy="-1.6" rx="5" ry="2.6" fill="#3b2b35" ${L} stroke-width="1.6"/><ellipse cx="4" cy="-1.6" rx="5" ry="2.6" fill="#3b2b35" ${L} stroke-width="1.6"/>
 ${limb(-8,-41,-13,-25,top)}${limb(8,-41,13,-25,top)}<circle cx="-13" cy="-24" r="2.8" fill="${SKIN}" ${L} stroke-width="1.6"/><circle cx="13" cy="-24" r="2.8" fill="${SKIN}" ${L} stroke-width="1.6"/>
 ${dress?`<path d="M-8.5 -44Q-11 -30 -16 -12H16Q11 -30 8.5 -44Z" fill="${top}" ${L}/><path d="M-6 -44 6 -26" stroke="#ffd34d" stroke-width="3"/>`:`<path d="M-9 -44H9L10 -18H-10Z" fill="${top}" ${L}/><path d="M0 -44V-20" stroke="#fff" stroke-width="2"/>`}
 <rect x="-2.5" y="-47" width="5" height="4" fill="${SKIN}"/><circle cx="0" cy="-56" r="11" fill="${SKIN}" ${L}/>
 <circle cx="-3.8" cy="-56.5" r="1.6" fill="${INK}"/><circle cx="3.8" cy="-56.5" r="1.6" fill="${INK}"/><path d="M-3 -51q3 2.6 6 0" fill="none" ${L} stroke-width="1.6"/>${hair}`;
const ryder=person({top:'#d94a4a',bottom:'#3d4f9c',hair:`<path d="M-12 -56Q-13 -70 0 -69Q13 -70 12 -56L9 -62 6 -58 3 -64 0 -59-3 -64-6 -58-9 -62Z" fill="#8a5a3b" ${L}/>`});
const mayor=person({top:'#9b6ccf',bottom:'#9b6ccf',dress:true,hair:`<path d="M-12 -52Q-15 -70 0 -70Q15 -70 12 -52Q10 -60 0 -61Q-10 -60 -12 -52Z" fill="#3b2b35" ${L}/><circle cx="0" cy="-70" r="5" fill="#3b2b35" ${L}/>`});
const chicken=`<path d="M-4 0V-6M3 0V-6" stroke="#ff9a3c" stroke-width="2"/><ellipse cx="0" cy="-12" rx="10" ry="8" fill="#fffaf0" ${L}/><path d="M-4 -12q4 5 9 0" fill="none" stroke="#d9d4cc" stroke-width="1.6"/>
 <circle cx="6" cy="-20" r="6" fill="#fffaf0" ${L}/><path d="M4 -26q1-4 3-1q1-4 3 0q2-2 2 2" fill="#e2504f" ${L} stroke-width="1.2"/><path d="M11 -20l5 1.5-5 1.5z" fill="#ff9a3c" ${L} stroke-width="1"/><circle cx="7.5" cy="-21" r="1.2" fill="${INK}"/><path d="M-10 -14q-6-4-4-10q4 3 6 6" fill="#fffaf0" ${L} stroke-width="1.6"/>`;
// Vehicles: Rubble's digger, Skye's helicopter and the cars at the crossing.
const digger=`<rect x="-30" y="-10" width="46" height="10" rx="5" fill="#3b3a4a" ${L}/>${[-24,-12,0,10].map(x=>`<circle cx="${x}" cy="-5" r="3" fill="#77738b"/>`).join('')}
 <rect x="-28" y="-28" width="42" height="18" rx="3" fill="#ffc233" ${L}/><path d="M-24 -28V-46H-4L0 -28Z" fill="#ffc233" ${L}/><path d="M-20 -30V-42H-8L-6 -30Z" fill="#bfe3ff" ${L} stroke-width="1.6"/>
 <g class="arm"><path d="M10 -24 30 -44 46 -26" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 -24 30 -44 46 -26" fill="none" stroke="#e5a400" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
 <path d="M40 -28h14l-3 12h-10z" fill="#77738b" ${L}/><path d="M42 -16l1 3M46 -16v3M50 -16l-1 3" ${L} stroke-width="1.4"/></g>`;
const car=(fill)=>`<path d="M-24 -6V-14Q-22 -20 -14 -20L-8 -30H8L16 -20Q24 -18 24 -12V-6Z" fill="${fill}" ${L}/><path d="M-6 -28H6L12 -20H-11Z" fill="#bfe3ff" ${L} stroke-width="1.4"/><circle cx="-13" cy="-5" r="5.5" fill="#3b3a4a" ${L} stroke-width="1.6"/><circle cx="13" cy="-5" r="5.5" fill="#3b3a4a" ${L} stroke-width="1.6"/><circle cx="-13" cy="-5" r="2" fill="#b6b3c4"/><circle cx="13" cy="-5" r="2" fill="#b6b3c4"/>`;
const copter=`<path d="M10 -24H46" ${L} stroke-width="4"/><path d="M42 -32 48 -18" ${L} stroke-width="3"/>
 <path d="M-26 -18Q-28 -40 -4 -42Q16 -42 18 -24Q16 -12 -4 -12Q-24 -12 -26 -18Z" fill="#ff7fb6" ${L}/><path d="M-20 -22Q-20 -36 -6 -36Q6 -36 8 -26Z" fill="#bfe3ff" ${L} stroke-width="1.6"/>
 <g transform="translate(-8 -16) scale(.42)">${pup({fur:'#e9cfa6',light:'#fff4e0',ears:'floppy',hat:'goggles',vest:'#ff7fb6'}).replace(/<g class="tail">.*?<\/g>/s,'')}</g>
 <path d="M-22 -4H12M-18 -12V-4M6 -12V-4" ${L} stroke-width="2.4"/><path d="M-6 -42V-48" ${L} stroke-width="3"/>
 <g class="rotor"><path d="M-36 -49H24" ${L} stroke-width="3.4"/></g>
 <g class="hook"><path d="M-6 -12V20" stroke="${INK}" stroke-width="1.6"/><path d="M-6 20q0 5 4 5q4 0 4-4" fill="none" ${L} stroke-width="2"/></g>`;
const phone=`<g class="phone" data-cue="phone"><rect x="-12" y="-18" width="24" height="34" rx="4" fill="#3b3a4a" ${L}/><rect x="-9" y="-14" width="18" height="24" rx="2" fill="#7cc3ff"/><circle cx="0" cy="13" r="1.8" fill="#77738b"/>
 <g class="rings" fill="none" stroke="#ff7a45" stroke-width="2" stroke-linecap="round"><path d="M-17 -12q-4 6 0 12M17 -12q4 6 0 12"/><path d="M-21 -16q-6 10 0 20M21 -16q6 10 0 20"/></g></g>`;

// Adventure Bay: the lookout tower on the hill above the sea.
const sea=`<rect width="320" height="200" fill="#cdeefc"/><circle cx="270" cy="30" r="14" fill="#ffd34d"/><g fill="#fff"><ellipse cx="140" cy="28" rx="18" ry="6"/><ellipse cx="150" cy="24" rx="10" ry="6"/></g>
 <rect y="96" width="320" height="40" fill="#5bb4ea"/><path d="M200 110q8-4 16 0M250 122q8-4 16 0M150 118q8-4 16 0" fill="none" stroke="#fff" stroke-width="1.6" opacity=".7"/>`;
const lookout=`<g class="town" data-cue="town"><rect x="16" y="56" width="26" height="80" fill="#e8eef5" ${L}/><path d="M12 56H46" ${L} stroke-width="3"/><ellipse cx="29" cy="44" rx="20" ry="13" fill="#bfe3ff" ${L}/><path d="M9 44H49" stroke="#7cc3ff" stroke-width="2"/><path d="M29 31V20" ${L} stroke-width="2"/><path d="M29 20h10l-3 3 3 3H29" fill="#d94a4a" ${L} stroke-width="1.4"/>
 <path d="M50 136V110L58 104 66 110V136Z" fill="#fff6d6" ${L} stroke-width="1.6"/><path d="M70 136V116L80 108 90 116V136Z" fill="#ffe1ef" ${L} stroke-width="1.6"/></g>`;
const LINEUP={chase:136,rubble:168,skye:200},PLAY={chase:226,rubble:262,skye:298};
function lookoutScene(){
 return scene('The lookout in Adventure Bay',`${sea}<path d="M0 126Q120 112 320 130V200H0Z" fill="#7cc867"/><path d="M0 160Q160 150 320 166V200H0Z" fill="#6cc24a"/>${lookout}
 ${actor('ryder',96,188,ryder,'ryder')}
 ${Object.entries(PUPS).map(([name,art])=>actor(name,PLAY[name],188,art,'pups '+name)).join('')}
 <g transform="translate(60 96)">${phone}</g>
 ${bubble('bubble-call',80,22,92,92,84,`<g data-cue="call"><g transform="translate(96 54) scale(.5)">${tree(0,0,1)}</g><g transform="translate(96 36) scale(.7)">${chicken}</g><g transform="translate(116 58) scale(.42)">${mayor}</g></g>`)}
 ${target('phone',60,96,18,24)}${Object.keys(PUPS).map(name=>target(name,PLAY[name],166,17,22)).join('')}`);
}
// The road out of town, blocked by rocks.
const rock=(i,x,y,s)=>`<g class="rock rock-${i}" data-cue="rocks"><path d="M${x-12*s} ${y}Q${x-14*s} ${y-12*s} ${x-2*s} ${y-15*s}Q${x+12*s} ${y-14*s} ${x+12*s} ${y}Z" fill="#a9a5b4" ${L}/><path d="M${x-4*s} ${y-9*s}l5 2" stroke="#7d7a8b" stroke-width="1.4"/></g>`;
function roadScene(){
 return scene('Rocks on the road',`<rect width="320" height="200" fill="#cdeefc"/><path d="M0 110Q100 92 200 104T320 96V200H0Z" fill="#b8e29a"/>${tree(40,128,.9)}${tree(290,124,1)}
 <rect class="road" data-cue="road" y="146" width="320" height="38" fill="#7d7a8b"/><path d="M0 165H320" stroke="#fff" stroke-width="2.4" stroke-dasharray="14 12"/><rect y="184" width="320" height="16" fill="#7cc867"/>
 ${rock(1,186,176,1.2)}${rock(2,212,174,1)}${rock(3,236,177,1.3)}
 <g transform="translate(120 182)"><g class="digger" data-cue="digger">${digger}</g></g>
 ${actor('rubble',62,190,PUPS.rubble,'pups rubble')}
 ${target('rock-1',186,164,13,18)}${target('rock-2',212,164,13,18)}${target('rock-3',236,164,13,18)}`);
}
// The crossing: cars, a zebra crossing and the traffic light Chase looks after.
function crossingScene(){
 return scene('The traffic light at the crossing',`<rect width="320" height="200" fill="#cdeefc"/>${[[20,40,30],[56,56,24],[250,46,28],[284,30,30]].map(([x,y,w])=>`<rect x="${x}" y="${y}" width="${w}" height="${80-y+30}" fill="#e8d9f5" ${L} stroke-width="1.4"/>`).join('')}
 <rect y="110" width="320" height="10" fill="#d9d4cc"/><rect class="street" y="120" width="320" height="42" fill="#7d7a8b"/>${[0,1,2,3,4].map(i=>`<rect x="${150+i*9}" y="122" width="5" height="38" fill="#fff"/>`).join('')}<rect y="162" width="320" height="38" fill="#d9d4cc"/>
 <g class="light" data-cue="light"><path d="M214 162V76" ${L} stroke-width="4"/><rect x="202" y="56" width="24" height="40" rx="5" fill="#3b3a4a" ${L}/>
  <g class="lamp-red" data-cue="light-red"><circle cx="214" cy="67" r="7" fill="#ff4d4d" ${L} stroke-width="1.4"/></g><g class="lamp-green" data-cue="light-green"><circle cx="214" cy="85" r="7" fill="#3ccf6e" ${L} stroke-width="1.4"/></g></g>
 <g class="cars" data-cue="cars">${actor('car-1',64,158,car('#ff7a45'),'cars')}${actor('car-2',116,158,car('#ffc233'),'cars')}${actor('car-3',-60,158,car('#7cc3ff'),'cars')}</g>
 ${actor('chase',258,196,PUPS.chase,'pups chase')}${actor('rubble',150,196,PUPS.rubble,'pups rubble')}${actor('skye',182,196,PUPS.skye,'pups skye')}
 ${target('light',214,76,20,26)}`);
}
// The park: the big tree with the chicken at the top, Skye's helicopter on the grass.
function parkScene(){
 return scene('The park, with the chicken up the big tree',`<rect width="320" height="200" fill="#cdeefc"/><circle cx="40" cy="30" r="13" fill="#ffd34d"/><path d="M0 120Q160 104 320 122V200H0Z" fill="#8fd16e"/><path d="M0 160Q160 150 320 164V200H0Z" fill="#6cc24a"/>
 <g class="tree" data-cue="tree"><path d="M226 190V80" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><path d="M226 190V80" stroke="#b9743c" stroke-width="10" stroke-linecap="round"/><path d="M226 110 252 84M226 96 202 76" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M226 110 252 84M226 96 202 76" stroke="#b9743c" stroke-width="4" stroke-linecap="round"/>
  ${[[226,58,30],[196,74,20],[256,72,22],[214,40,18],[244,44,16]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#5fbf4a" ${L}/>`).join('')}</g>
 ${actor('chicken',230,40,chicken,'chicken')}
 ${actor('copter',74,176,copter,'copter skye')}
 ${actor('mayor',150,188,mayor,'mayor')}${actor('ryder',-40,188,ryder,'ryder')}
 ${actor('chase',-40,188,PUPS.chase,'pups chase')}${actor('rubble',-40,188,PUPS.rubble,'pups rubble')}${actor('skye',-40,188,PUPS.skye,'pups skye')}
 <g class="bones">${[1,2,3].map(i=>`<g class="bone bone-${i}" data-cue="bones">${bone}</g>`).join('')}</g>
 ${target('copter',70,150,24,32)}${target('chicken',232,28,14,20)}
 ${[['chase',172],['rubble',206],['skye',240]].map(([name,x])=>target('give-'+name,x,166,16,22)).join('')}`);
}
const pictures={
 dog:box('-22 -60 44 62',PUPS.chase),
 phone:box('-24 -22 48 42',phone),
 rock:box('-18 -20 36 22',rock(0,0,0,1.3)),
 dig:box('-34 -50 92 52',digger),
 road:box('0 0 60 30',`<rect width="60" height="30" rx="4" fill="#7d7a8b"/><path d="M4 15H56" stroke="#fff" stroke-width="2.4" stroke-dasharray="8 6"/>`),
 car:box('-28 -34 56 36',car('#ff7a45')),
 redLight:box('-14 -24 28 48',`<rect x="-12" y="-22" width="24" height="44" rx="5" fill="#3b3a4a" ${L}/><circle cx="0" cy="-10" r="7" fill="#ff4d4d" ${L} stroke-width="1.4"/><circle cx="0" cy="10" r="7" fill="#3c4a3f" ${L} stroke-width="1.4"/>`),
 greenLight:box('-14 -24 28 48',`<rect x="-12" y="-22" width="24" height="44" rx="5" fill="#3b3a4a" ${L}/><circle cx="0" cy="-10" r="7" fill="#4a3b3b" ${L} stroke-width="1.4"/><circle cx="0" cy="10" r="7" fill="#3ccf6e" ${L} stroke-width="1.4"/>`),
 stop:box('-20 -20 40 40',`<path d="M-8 -18H8L18 -8V8L8 18H-8L-18 8V-8Z" fill="#e2504f" ${L}/><rect x="-10" y="-3" width="20" height="6" rx="2" fill="#fff"/>`),
 chick:box('-14 -30 34 32',chicken),
 helicopter:box('-40 -54 92 60',copter.replace('class="hook"','class="hook" opacity="0"')),
 fly:box('-40 -60 92 66',`${copter.replace('class="hook"','class="hook" opacity="0"')}<path d="M-34 -2q10 6 20 0M0 4q10 6 20 0" fill="none" stroke="#7cc3ff" stroke-width="2.4" stroke-linecap="round"/>`),
 bone:box('-16 -12 32 18',bone),
 brave:box('-24 -64 48 66',`${PUPS.skye}${star(-18,-54,1.6)}${star(18,-56,1.3)}`)
};
const cover=()=>box('0 0 320 200',`${sea}<path d="M0 126Q120 112 320 130V200H0Z" fill="#7cc867"/><path d="M0 160Q160 150 320 166V200H0Z" fill="#6cc24a"/>${lookout}
 <g transform="translate(104 190)">${ryder}</g><g transform="translate(150 190) scale(1.1)">${PUPS.chase}</g><g transform="translate(196 190) scale(1.1)">${PUPS.rubble}</g><g transform="translate(242 190) scale(1.1)">${PUPS.skye}</g><g transform="translate(284 88) scale(.6)">${copter.replace('class="hook"','class="hook" opacity="0"')}</g>`);

// ---- The story ----
let api;
const say=(key,t)=>api.say(key,t),wait=(ms,t)=>api.wait(ms,t),flag=(name,on)=>api.flag(name,on),move=(...args)=>api.move(...args);

async function atTheLookout(t){
 await wait(400,t);
 await say('here',t);
 flag('ringing');await say('ring',t);
 await say('tapPhone',t);
 await api.tap('phone',t,'tapPhone');
 flag('ringing',false);flag('calling');api.chime('ding');
 await say('help',t);flag('calling',false);
 await say('coming',t);
 await say('assemble',t);
 // She calls each pup over; it runs to Ryder and reports for duty.
 await say('tapPup',t);
 const ready={chase:'chaseReady',rubble:'rubbleReady',skye:'skyeReady'};
 const left=new Set(Object.keys(PUPS));
 while(left.size){
  let picked=null;
  await api.waitFor(t,done=>{
   const hits=[...left].map(name=>{const hit=api.stage().querySelector('.hit-'+name),on=()=>{picked=name;done();};api.hint(name,true);hit.addEventListener('click',on);return [name,hit,on];});
   const nudge=setInterval(()=>{if(api.quiet())say('tapPup',t).catch(()=>{});},9000);
   return ()=>{clearInterval(nudge);hits.forEach(([name,hit,on])=>{hit.removeEventListener('click',on);api.hint(name,false);});};
  });
  left.delete(picked);
  move(picked,LINEUP[picked],188,700);await wait(700,t);api.replay(api.stage().querySelector('.actor-'+picked),'wag');
  await say(ready[picked],t);
 }
 flag('wagging');await say('go',t);await wait(400,t);flag('wagging',false);
}
async function clearTheRoad(t){
 await api.changeScene(t,roadScene());
 await say('rocks',t);
 await say('dig',t);
 await say('tapRock',t);
 for(let i=1;i<=3;i++){
  await api.tap('rock-'+i,t,'tapRock');
  api.replay(api.stage().querySelector('.arm'),'scoop');api.sounds.crash();await wait(450,t);
  api.stage().querySelector('.rock-'+i).classList.add('gone');
  await say('wa',t);
 }
 await say('clear',t);await wait(300,t);
}
async function atTheCrossing(t){
 await api.changeScene(t,crossingScene(),s=>s.classList.add('signal-red'));
 await say('cars',t);
 await say('rhyme',t);
 // Green: the waiting cars drive on. Red: the next car stops, and the pups cross.
 await say('tapLight',t);
 await api.tap('light',t,'tapLight');
 flag('signal-red',false);flag('signal-green');api.chime('ding');
 move('car-1',400,158,1800);move('car-2',450,158,2000);
 await say('greenGo',t);await wait(600,t);
 move('car-3',110,158,1400);await wait(1000,t);
 await say('tapLight',t);
 await api.tap('light',t,'tapLight');
 flag('signal-green',false);flag('signal-red');api.chime('ding');
 await say('redStop',t);
 for(const name of ['rubble','skye'])move(name,name==='rubble'?160:176,118,1300);await wait(1300,t);
 move('rubble',400,118,1600);move('skye',420,118,1700);move('chase',440,196,1800);
 await say('cross',t);await wait(600,t);
}
async function inThePark(t){
 await api.changeScene(t,parkScene());
 await say('upTree',t);
 api.replay(api.stage().querySelector('.actor-chicken'),'flap');await say('cluck',t);
 await say('fly',t);
 await say('tapCopter',t);
 await api.tap('copter',t,'tapCopter');
 flag('flying');api.sounds.whoosh(1);move('copter',180,84,1600);await wait(1600,t);
 await say('flewUp',t);
 flag('hooked');
 await say('tapChicken',t);
 await api.tap('chicken',t,'tapChicken');
 api.chime('ding');move('chicken',174,118,700);await wait(500,t);
 move('copter',120,140,1600);move('chicken',114,174,1600);await wait(1600,t);
 move('chicken',176,190,600);flag('hooked',false);await wait(300,t);move('copter',74,176,900);await wait(900,t);flag('flying',false);
 await say('down',t);
 await say('thanks',t);
 // The team arrives; each pup gets a bone.
 move('mayor',290,188,900);move('chicken',308,190,900);
 move('ryder',134,188,1200);move('chase',172,188,1300);move('rubble',206,188,1400);move('skye',240,188,1500);await wait(1500,t);
 await say('wellDone',t);
 await say('tapBone',t);
 for(const [i,name] of ['chase','rubble','skye'].entries()){
  await api.tap('give-'+name,t,'tapBone');
  const b=api.stage().querySelector('.bone-'+(i+1));b.style.transform=`translate(${[172,206,240][i]}px,188px)`;b.classList.add('given');
  api.replay(api.stage().querySelector('.actor-'+name),'wag');api.chime('ding');await say('woof',t);
 }
 flag('dance');await say('brave',t);await wait(900,t);
}
async function play(storyApi,t){
 api=storyApi;
 await atTheLookout(t);
 await clearTheRoad(t);
 await atTheCrossing(t);
 await inThePark(t);
}

const css=`
.story-svg .tail{transform-box:fill-box;transform-origin:0 100%}
.actor-chase.wag .tail,.actor-rubble.wag .tail,.actor-skye.wag .tail,.wagging .tail,.dance .tail{animation:paw-wag .25s ease-in-out 6 alternate}
.dance .tail{animation-iteration-count:infinite}
@keyframes paw-wag{to{transform:rotate(-30deg)}}
.dance .actor-chase .bob,.dance .actor-rubble .bob,.dance .actor-skye .bob,.wagging .actor-chase .bob,.wagging .actor-rubble .bob,.wagging .actor-skye .bob{animation:story-hop .35s ease-in-out infinite alternate}
.dance .actor-rubble .bob,.wagging .actor-rubble .bob{animation-delay:.12s}.dance .actor-skye .bob,.wagging .actor-skye .bob{animation-delay:.24s}
.story-svg .phone{transform-box:fill-box;transform-origin:center}
.story-svg .rings{opacity:0}
.ringing .phone{animation:story-no .3s ease-in-out infinite}
.ringing .rings{opacity:1;animation:paw-ring .6s ease-out infinite}
@keyframes paw-ring{from{opacity:1}to{opacity:.2}}
.calling .bubble-call{opacity:1;transform:none}
.story-svg .arm{transform-box:view-box;transform-origin:130px 158px}
.story-svg .arm.scoop{animation:paw-scoop .45s ease-in-out}
@keyframes paw-scoop{50%{transform:rotate(16deg)}}
.story-svg .rock{transform-box:fill-box;transform-origin:center;transition:transform .5s ease-in,opacity .5s}
.story-svg .rock.gone{opacity:0;transform:translate(-90px,-40px) scale(.4) rotate(-120deg)}
.story-svg .lamp-red circle,.story-svg .lamp-green circle{transition:fill .2s,filter .2s}
.signal-green .lamp-red circle,.signal-red .lamp-green circle{fill:#4a4250}
.signal-red .lamp-red circle,.signal-green .lamp-green circle{filter:url(#story-glow)}
.story-svg .rotor{transform-box:fill-box;transform-origin:center}
.flying .rotor{animation:paw-rotor .15s linear infinite}
@keyframes paw-rotor{50%{transform:scaleX(.15)}}
.story-svg .hook{opacity:0;transition:opacity .3s}
.hooked .hook{opacity:1}
.story-svg .actor-chicken.flap .cuebox{animation:story-hop .2s ease-in-out 4 alternate}
.story-svg .bone{opacity:0;transform-box:fill-box;transition:opacity .3s}
.story-svg .bone.given{opacity:1}
`;

export default {
 firstScene:()=>lookoutScene(),
 scenes:()=>[lookoutScene(),roadScene(),crossingScene(),parkScene()],
 play,pictures,cover,css,
 avatars:{
  ryder:box('-16 -74 32 34',ryder),mayor:box('-18 -78 36 38',mayor),
  chase:box('-18 -60 36 36',PUPS.chase),rubble:box('-19 -62 38 38',PUPS.rubble),skye:box('-22 -60 44 40',PUPS.skye),
  pups:box('-42 -60 84 40',`<g transform="translate(-26 0)">${PUPS.chase}</g><g transform="translate(0 0)">${PUPS.rubble}</g><g transform="translate(26 0)">${PUPS.skye}</g>`),
  chicken:box('-12 -30 32 32',chicken)
 }
};
