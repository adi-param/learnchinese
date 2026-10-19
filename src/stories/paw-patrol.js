// PAW Patrol 救小鸡 PAW Patrol saves the chicken. The Mayor phones Ryder: her little chicken is stuck up a tree.
// Chase, Rubble and Skye line up; Rubble digs the rocks off the road, Chase runs the traffic light (红灯停，
// 绿灯行！), and Skye flies up to lift the chicken down. Each pup gets a bone. Names stay in English.
// Tap anything for fun: pups bark, the chicken clucks, gulls and boats move, cars honk.
import {INK,L,scene,target,actor,bubble,box,star,funSun,funCloud,funTree,funFlower,funActors} from '../story-kit.js';

// ---- Pictures ----
const SKIN='#ffd9b8';
const limb=(x1,y1,x2,y2,colour,w=4.5)=>`<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${INK}" stroke-width="${w+3.4}" stroke-linecap="round"/><path d="M${x1} ${y1}L${x2} ${y2}" stroke="${colour}" stroke-width="${w}" stroke-linecap="round"/>`;
const sky=(id,stops)=>`<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${stops.map(([o,c])=>`<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient></defs>`;
// A pup sitting up, facing us: big head, shiny eyes, a lighter muzzle, a collar with its badge, a pup-pack, and its
// uniform. Feet at (0,0), about 64 tall. The tail wags; the eyes blink; the mouth opens when it talks.
const EARS={
 pointy:(fur,inner)=>`<path d="M-13 -48-17 -66-4 -56ZM13 -48 17 -66 4 -56Z" fill="${fur}" ${L}/><path d="M-12.5 -52-14.5 -61-8 -56ZM12.5 -52 14.5 -61 8 -56Z" fill="${inner}"/>`,
 floppy:fur=>`<path d="M-12 -54Q-26 -52 -22 -32Q-18 -28 -12 -34Q-10 -42 -9 -48Z" fill="${fur}" ${L}/><path d="M12 -54Q26 -52 22 -32Q18 -28 12 -34Q10 -42 9 -48Z" fill="${fur}" ${L}/><path d="M-19 -46q-2 6 1 10M19 -46q2 6-1 10" fill="none" stroke="#d9b98a" stroke-width="1.4"/>`,
 folded:fur=>`<path d="M-13 -52Q-22 -56 -20 -46Q-17 -44 -12 -46Z" fill="${fur}" ${L}/><path d="M13 -52Q22 -56 20 -46Q17 -44 12 -46Z" fill="${fur}" ${L}/>`
};
const HATS={
 police:`<path d="M-14 -57Q-14 -72 0 -72Q14 -72 14 -57Z" fill="#2b5fd9" ${L}/><path d="M-17 -57H17Q15 -52 0 -52Q-15 -52 -17 -57Z" fill="#1d3f9a" ${L} stroke-width="1.6"/><path d="M0 -69l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4z" fill="#ffd34d" stroke="${INK}" stroke-width=".8"/>`,
 helmet:`<path d="M-15 -56Q-15 -74 0 -74Q15 -74 15 -56Z" fill="#ffc233" ${L}/><path d="M-19 -56H19" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M-19 -56H19" stroke="#ffc233" stroke-width="2.4" stroke-linecap="round"/><path d="M0 -74V-57" stroke="#e5a400" stroke-width="3"/><circle cx="-8" cy="-66" r="2" fill="#fff" opacity=".6"/>`,
 goggles:`<path d="M-14 -58Q0 -66 14 -58" fill="none" stroke="#ff5fa2" stroke-width="3"/><circle cx="-6.5" cy="-60" r="4.6" fill="#ffd1e6" ${L} stroke-width="1.6"/><circle cx="6.5" cy="-60" r="4.6" fill="#ffd1e6" ${L} stroke-width="1.6"/><circle cx="-8" cy="-61.5" r="1.4" fill="#fff"/><circle cx="5" cy="-61.5" r="1.4" fill="#fff"/>`
};
function pup({fur,light,dark,ears,inner='#f2c7a8',hat,vest,pack,tag,wide=false,saddle=false}){
 const cheek=wide?17:15;
 return `<ellipse cx="0" cy="1" rx="17" ry="3" fill="${INK}" opacity=".14"/>
 <g class="tail"><path d="M9 -12q14-2 14-17" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M9 -12q14-2 14-17" fill="none" stroke="${fur}" stroke-width="4.6" stroke-linecap="round"/></g>
 <rect x="-14" y="-28" width="7" height="14" rx="3" fill="${pack}" ${L} stroke-width="1.6"/><rect x="7" y="-28" width="7" height="14" rx="3" fill="${pack}" ${L} stroke-width="1.6"/>
 <ellipse cx="0" cy="-14" rx="12" ry="12.5" fill="${fur}" ${L}/>${saddle?`<path d="M-11 -18Q0 -26 11 -18L10 -12Q0 -18 -10 -12Z" fill="${dark}"/>`:''}
 <path d="M-9.5 -22Q0 -15 9.5 -22L10 -9Q0 -4 -10 -9Z" fill="${vest}" ${L} stroke-width="1.6"/>
 <ellipse cx="-5.5" cy="-2" rx="5" ry="3.2" fill="${light}" ${L} stroke-width="1.6"/><ellipse cx="5.5" cy="-2" rx="5" ry="3.2" fill="${light}" ${L} stroke-width="1.6"/>
 ${EARS[ears](fur,inner)}
 <ellipse cx="0" cy="-40" rx="${cheek}" ry="15" fill="${fur}" ${L}/>${saddle?`<path d="M-13 -46Q0 -54 13 -46Q12 -52 0 -54Q-12 -52 -13 -46Z" fill="${dark}"/>`:''}
 <path d="M-9 -27Q-11 -36 0 -38Q11 -36 9 -27Q5 -24 0 -24Q-5 -24 -9 -27Z" fill="${light}" ${L} stroke-width="1.6"/>
 <ellipse cx="0" cy="-35" rx="3.2" ry="2.3" fill="${INK}"/><ellipse cx="-1" cy="-35.8" rx="1" ry=".6" fill="#fff" opacity=".6"/>
 <path class="pup-mouth" d="M-3.4 -30q3.4 2.6 6.8 0" fill="none" ${L} stroke-width="1.4"/><path class="pup-talk" d="M-3.4 -30.5q3.4 6 6.8 0Z" fill="#c2414b" ${L} stroke-width="1.2"/>
 <g class="blink"><ellipse cx="-6.4" cy="-43" rx="3.6" ry="4" fill="${INK}"/><ellipse cx="6.4" cy="-43" rx="3.6" ry="4" fill="${INK}"/><circle cx="-5.2" cy="-44.6" r="1.4" fill="#fff"/><circle cx="7.6" cy="-44.6" r="1.4" fill="#fff"/><circle cx="-7.4" cy="-41.6" r=".7" fill="#fff"/><circle cx="5.4" cy="-41.6" r=".7" fill="#fff"/></g>
 <circle cx="-11" cy="-36" r="2.4" fill="#ff9fb0" opacity=".6"/><circle cx="11" cy="-36" r="2.4" fill="#ff9fb0" opacity=".6"/>
 <path d="M-10 -26Q0 -22 10 -26" fill="none" stroke="${vest}" stroke-width="3"/><circle cx="0" cy="-22.6" r="3.4" fill="${tag}" ${L} stroke-width="1.2"/><path d="M-1.4 -23.4a1 1 0 0 1 2.8 0" fill="none" stroke="#fff" stroke-width=".8"/>
 ${HATS[hat]}`;
}
export const PUPS={
 chase:pup({fur:'#c08a5c',light:'#f3dcb8',dark:'#5a3d2a',ears:'pointy',hat:'police',vest:'#2b5fd9',pack:'#1d3f9a',tag:'#2b5fd9',saddle:true}),
 rubble:pup({fur:'#e6c48f',light:'#fff3dd',dark:'#c99a5e',ears:'folded',hat:'helmet',vest:'#ffc233',pack:'#e5a400',tag:'#ffc233',wide:true}),
 skye:pup({fur:'#ecd2a8',light:'#fff6e6',dark:'#c99a5e',ears:'floppy',hat:'goggles',vest:'#ff7fb6',pack:'#e0559a',tag:'#ff7fb6'})
};
const bone=`<path d="M-9 -2a3 3 0 1 1 1-5h16a3 3 0 1 1 1 5a3 3 0 1 1-1 5H-8a3 3 0 1 1-1-5z" fill="#fffaf0" ${L} stroke-width="1.6"/>`;
// Ryder and the Mayor, standing and facing us. Their mouths open when they talk.
const person=({top,bottom,hair,dress=false,extra=''})=>`<ellipse cx="0" cy="1" rx="13" ry="3" fill="${INK}" opacity=".14"/>
 <rect x="-6.5" y="-20" width="5.5" height="18" rx="2" fill="${bottom}" ${L} stroke-width="1.6"/><rect x="1" y="-20" width="5.5" height="18" rx="2" fill="${bottom}" ${L} stroke-width="1.6"/>
 <path d="M-10 -4H-.5V0H-11Q-12 -2 -10 -4ZM10 -4H.5V0H11Q12 -2 10 -4Z" fill="#3b2b35" ${L} stroke-width="1.4"/>
 ${limb(-8,-41,-13,-25,top)}${limb(8,-41,13,-25,top)}<circle cx="-13" cy="-24" r="2.8" fill="${SKIN}" ${L} stroke-width="1.6"/><circle cx="13" cy="-24" r="2.8" fill="${SKIN}" ${L} stroke-width="1.6"/>
 ${dress?`<path d="M-8.5 -44Q-11 -30 -16 -12H16Q11 -30 8.5 -44Z" fill="${top}" ${L}/>`:`<path d="M-9 -44H9L10 -18H-10Z" fill="${top}" ${L}/>`}${extra}
 <rect x="-2.5" y="-47" width="5" height="4" fill="${SKIN}"/><circle cx="0" cy="-56" r="11.5" fill="${SKIN}" ${L}/>
 <g class="blink"><ellipse cx="-4" cy="-57" rx="1.7" ry="2.1" fill="${INK}"/><ellipse cx="4" cy="-57" rx="1.7" ry="2.1" fill="${INK}"/><circle cx="-3.4" cy="-57.8" r=".6" fill="#fff"/><circle cx="4.6" cy="-57.8" r=".6" fill="#fff"/></g>
 <circle cx="-7.4" cy="-52.5" r="2" fill="#ffb3c1" opacity=".8"/><circle cx="7.4" cy="-52.5" r="2" fill="#ffb3c1" opacity=".8"/>
 <path class="person-mouth" d="M-3 -51q3 2.6 6 0" fill="none" ${L} stroke-width="1.6"/><path class="person-talk" d="M-3 -51.4q3 5 6 0Z" fill="#c2414b" ${L} stroke-width="1.2"/>${hair}`;
const ryder=person({top:'#e2504f',bottom:'#3d4f9c',extra:`<path d="M-9 -44H9L9.4 -36H-9.4Z" fill="#fff" ${L} stroke-width="1.4"/><path d="M0 -44V-20" stroke="#fff" stroke-width="2"/><circle cx="-5" cy="-30" r="2" fill="#ffc233" ${L} stroke-width="1"/>`,
 hair:`<path d="M-12.5 -56Q-14 -71 0 -71Q14 -71 12.5 -56L10 -63 7 -59 4 -65 1 -60-2 -66-5 -60-8 -64-10 -59Z" fill="#8a5a3b" ${L}/>`});
const mayor=person({top:'#9b6ccf',bottom:'#9b6ccf',dress:true,extra:`<path d="M-6 -44 6 -26" stroke="#ffd34d" stroke-width="3"/><circle cx="0" cy="-41" r="2" fill="#fff" ${L} stroke-width="1"/>`,
 hair:`<path d="M-12.5 -52Q-16 -71 0 -71Q16 -71 12.5 -52Q10 -61 0 -62Q-10 -61 -12.5 -52Z" fill="#3b2b35" ${L}/><circle cx="0" cy="-72" r="5.5" fill="#3b2b35" ${L}/>`});
const chicken=`<ellipse cx="2" cy="0" rx="10" ry="2.4" fill="${INK}" opacity=".12"/><path d="M-4 0V-6M3 0V-6" stroke="#ff9a3c" stroke-width="2.2"/><ellipse cx="0" cy="-12" rx="11" ry="9" fill="#fffaf0" ${L}/><path d="M-5 -12q5 6 10 0" fill="none" stroke="#e3ddd5" stroke-width="1.8"/>
 <circle cx="7" cy="-21" r="6.5" fill="#fffaf0" ${L}/><path d="M4 -27q1-5 3-1q1-5 3 0q2-3 2 2" fill="#e2504f" ${L} stroke-width="1.2"/><path d="M12.5 -21l5 1.5-5 1.5z" fill="#ff9a3c" ${L} stroke-width="1"/><g class="blink"><circle cx="8.5" cy="-22" r="1.3" fill="${INK}"/></g>
 <path d="M10 -16q2 3 0 5" fill="#e2504f" ${L} stroke-width="1"/><path d="M-11 -14q-7-5-5-11q5 3 7 7" fill="#fffaf0" ${L} stroke-width="1.6"/><rect x="-14" y="-18" width="8" height="7" rx="2" fill="#ff7fb6" ${L} stroke-width="1.2"/>`;
// Vehicles: Rubble's digger, Skye's helicopter and the cars at the crossing.
const digger=`<ellipse cx="-6" cy="2" rx="30" ry="3" fill="${INK}" opacity=".14"/>
 <rect x="-32" y="-11" width="50" height="12" rx="6" fill="#3b3a4a" ${L}/>${[-26,-14,-2,10].map(x=>`<circle cx="${x}" cy="-5" r="3.4" fill="#77738b" ${L} stroke-width="1"/>`).join('')}
 <rect x="-30" y="-30" width="46" height="20" rx="4" fill="#ffc233" ${L}/><path d="M-30 -22H16" stroke="#e5a400" stroke-width="2"/>
 <path d="M-26 -30V-50H-4L0 -30Z" fill="#ffc233" ${L}/><path d="M-22 -32V-46H-8L-5 -32Z" fill="#bfe3ff" ${L} stroke-width="1.6"/>
 <g transform="translate(-14 -36) scale(.42)">${PUPS.rubble.replace(/<g class="tail">[\s\S]*?<\/g>/,'')}</g>
 <rect x="-8" y="-56" width="4" height="7" fill="#ff7a45" ${L} stroke-width="1"/>
 <g class="arm"><path d="M10 -26 30 -48 48 -28" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 -26 30 -48 48 -28" fill="none" stroke="#e5a400" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
 <path d="M41 -30h16l-3 13h-11z" fill="#77738b" ${L}/><path d="M43 -17l1 3M48 -17v3M53 -17l-1 3" ${L} stroke-width="1.4"/></g>`;
const car=(fill)=>`<ellipse cx="0" cy="1" rx="24" ry="2.6" fill="${INK}" opacity=".14"/><path d="M-25 -6V-14Q-23 -21 -14 -21L-8 -31H8L16 -21Q25 -19 25 -12V-6Z" fill="${fill}" ${L}/><path d="M-6 -29H6L12 -21H-11Z" fill="#bfe3ff" ${L} stroke-width="1.4"/><path d="M0 -29V-21" stroke="${INK}" stroke-width="1.2"/><circle cx="22" cy="-13" r="2" fill="#ffe066"/>
 <circle cx="-13" cy="-5" r="6" fill="#3b3a4a" ${L} stroke-width="1.6"/><circle cx="13" cy="-5" r="6" fill="#3b3a4a" ${L} stroke-width="1.6"/><circle cx="-13" cy="-5" r="2.2" fill="#b6b3c4"/><circle cx="13" cy="-5" r="2.2" fill="#b6b3c4"/>`;
const copter=`<path d="M10 -24H46" ${L} stroke-width="4"/><path d="M42 -33 48 -17" ${L} stroke-width="3"/>
 <path d="M-27 -18Q-29 -42 -4 -44Q17 -44 19 -24Q17 -11 -4 -11Q-25 -11 -27 -18Z" fill="#ff7fb6" ${L}/><path d="M-21 -22Q-21 -38 -6 -38Q7 -38 9 -26Z" fill="#bfe3ff" ${L} stroke-width="1.6"/><path d="M12 -30q4 4 4 10" fill="none" stroke="#e0559a" stroke-width="2"/>
 <g transform="translate(-7 -16) scale(.4)">${PUPS.skye.replace(/<g class="tail">[\s\S]*?<\/g>/,'')}</g>
 <path d="M-23 -4H13M-19 -11V-4M7 -11V-4" ${L} stroke-width="2.4"/><path d="M-6 -44V-50" ${L} stroke-width="3"/>
 <g class="rotor"><path d="M-38 -51H26" ${L} stroke-width="3.4"/></g>
 <g class="hook"><path d="M-6 -11V20" stroke="${INK}" stroke-width="1.6"/><path d="M-6 20q0 5 4 5q4 0 4-4" fill="none" ${L} stroke-width="2"/></g>`;
const phone=`<g class="phone" data-cue="phone"><rect x="-12" y="-18" width="24" height="34" rx="4" fill="#3b3a4a" ${L}/><rect x="-9" y="-14" width="18" height="24" rx="2" fill="#7cc3ff"/><path d="M-6 -6l6-5 6 5M-4 -6v8h8v-8" fill="none" stroke="#fff" stroke-width="1.4"/><circle cx="0" cy="13" r="1.8" fill="#77738b"/>
 <g class="rings" fill="none" stroke="#ff7a45" stroke-width="2" stroke-linecap="round"><path d="M-17 -12q-4 6 0 12M17 -12q4 6 0 12"/><path d="M-21 -16q-6 10 0 20M21 -16q6 10 0 20"/></g></g>`;
const gull=(x,y)=>`<g class="gull" data-fun="gull" transform="translate(${x} ${y})"><circle r="8" fill="transparent"/><path class="gull-wings" d="M-7 0q3.5-5 7 0q3.5-5 7 0" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></g>`;
const boat=(x,y)=>`<g class="boat" data-fun="boat" transform="translate(${x} ${y})"><g class="boat-body"><path d="M-14 0H14L10 7H-10Z" fill="#e2504f" ${L} stroke-width="1.4"/><path d="M0 0V-18L12 -2Z" fill="#fff" ${L} stroke-width="1.4"/></g></g>`;

// Adventure Bay: the Lookout tower on the point above the sea, with the town along the shore.
const LINEUP={chase:136,rubble:168,skye:200},PLAY={chase:226,rubble:262,skye:298};
const lookout=`<g class="town" data-cue="town" transform="translate(-4 14) scale(.86)">
 <path d="M14 136V60H44V136Z" fill="#e8eef5" ${L}/><path d="M18 70H40M18 82H40M18 94H40M18 106H40" stroke="#c3d0de" stroke-width="1.4"/>
 <path d="M44 120Q60 112 70 136" fill="none" stroke="#ff7a45" stroke-width="5" stroke-linecap="round"/><path d="M44 120Q60 112 70 136" fill="none" stroke="${INK}" stroke-width="1.4"/>
 <ellipse cx="29" cy="48" rx="24" ry="15" fill="#bfe3ff" ${L}/><path d="M7 48H51" stroke="#7cc3ff" stroke-width="2"/><path d="M12 42Q29 34 46 42" fill="none" stroke="#fff" stroke-width="2" opacity=".7"/>
 <path d="M5 54Q29 66 53 54L51 60Q29 70 7 60Z" fill="#e2504f" ${L} stroke-width="1.6"/><path d="M29 33V20" ${L} stroke-width="2"/><path d="M29 20h11l-3 3.5 3 3.5H29" fill="#e2504f" ${L} stroke-width="1.4"/>
 <path d="M78 136V112L88 104 98 112V136Z" fill="#fff6d6" ${L} stroke-width="1.6"/><rect x="85" y="122" width="6" height="14" fill="#c98b4a"/>
 <path d="M100 136V116L111 108 122 116V136Z" fill="#ffe1ef" ${L} stroke-width="1.6"/><rect x="106" y="120" width="10" height="7" fill="#bfe3ff" ${L} stroke-width="1"/></g>`;
const bayBackdrop=`${sky('paw-sky',[[0,'#8fd0ff'],[1,'#e8f7ff']])}${sky('paw-sea',[[0,'#3f97dc'],[1,'#7cc3ff']])}<rect width="320" height="200" fill="url(#paw-sky)"/>${funSun(276,30,13)}${funCloud(150,26)}${funCloud(70,18,.7)}${gull(210,44)}${gull(236,56)}
 <rect y="98" width="320" height="40" fill="url(#paw-sea)"/><path d="M150 112h16M200 124h18M250 108h12" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".7"/>${boat(180,114)}
 <path d="M0 126Q120 112 320 130V200H0Z" fill="#7cc867"/><path d="M0 160Q160 150 320 166V200H0Z" fill="#6cc24a"/>`;
const pawActors=svg=>funActors(svg,{chase:'chase',rubble:'rubble',skye:'skye',ryder:'ryder',mayor:'mayor',chicken:'chicken','car-1':'car','car-2':'car','car-3':'car'});
function lookoutScene(){
 return pawActors(scene('The lookout in Adventure Bay',`${bayBackdrop}${lookout}${[[150,180,'#ff8cc6'],[300,186,'#fff'],[60,190,'#ffd34d']].map(([x,y,c])=>funFlower(x,y,c)).join('')}
 ${actor('ryder',96,188,ryder,'ryder')}
 ${Object.entries(PUPS).map(([name,art])=>actor(name,PLAY[name],188,art,'pups '+name)).join('')}
 <g transform="translate(60 96)">${phone}</g>
 ${bubble('bubble-call',80,22,92,92,84,`<g data-cue="call"><g transform="translate(96 54) scale(.42)"><rect x="-4" y="-26" width="8" height="26" rx="2" fill="#b9743c" ${L}/><circle cx="0" cy="-40" r="18" fill="#5fbf4a" ${L}/></g><g transform="translate(96 38) scale(.7)">${chicken}</g><g transform="translate(117 58) scale(.4)">${mayor}</g></g>`)}
 ${target('phone',60,96,18,24)}${Object.keys(PUPS).map(name=>target(name,PLAY[name],164,17,22)).join('')}`));
}
// The road out of town, blocked by rocks.
const rock=(i,x,y,s)=>`<g class="rock rock-${i}" data-cue="rocks"><path d="M${x-12*s} ${y}Q${x-14*s} ${y-12*s} ${x-2*s} ${y-15*s}Q${x+12*s} ${y-14*s} ${x+12*s} ${y}Z" fill="#a9a5b4" ${L}/><path d="M${x-8*s} ${y-10*s}Q${x-2*s} ${y-13*s} ${x+4*s} ${y-11*s}" fill="none" stroke="#cfccd8" stroke-width="2" stroke-linecap="round"/><path d="M${x-4*s} ${y-6*s}l5 2" stroke="#7d7a8b" stroke-width="1.4"/></g>`;
function roadScene(){
 return pawActors(scene('Rocks on the road',`${sky('road-sky',[[0,'#8fd0ff'],[1,'#e8f7ff']])}<rect width="320" height="200" fill="url(#road-sky)"/>${funSun(40,30,12)}${funCloud(200,24)}${funCloud(110,16,.7)}
 <path d="M0 110Q100 90 200 104T320 96V200H0Z" fill="#b8e29a"/><path d="M0 128Q160 118 320 130V150H0Z" fill="#a6dc84"/>
 <g transform="translate(40 136) scale(.9)"><rect x="-4" y="-26" width="8" height="26" rx="2" fill="#b9743c" ${L}/><circle cx="0" cy="-40" r="18" fill="#5fbf4a" ${L}/><circle cx="-9" cy="-46" r="4" fill="#7fd36a"/></g>${funTree(40,100,18)}
 <g transform="translate(290 132)"><rect x="-4" y="-26" width="8" height="26" rx="2" fill="#b9743c" ${L}/><circle cx="0" cy="-40" r="18" fill="#5fbf4a" ${L}/><circle cx="-9" cy="-46" r="4" fill="#7fd36a"/></g>${funTree(290,92,20)}
 ${Array.from({length:9},(_,i)=>`<path d="M${70+i*24} 146V134" stroke="#c98b4a" stroke-width="3"/>`).join('')}<path d="M64 138H262" stroke="#c98b4a" stroke-width="2.4"/>
 <rect class="road" data-cue="road" y="146" width="320" height="38" fill="#7d7a8b"/><path d="M0 165H320" stroke="#fff" stroke-width="2.4" stroke-dasharray="14 12"/><rect y="184" width="320" height="16" fill="#7cc867"/>
 ${rock(1,186,176,1.2)}${rock(2,212,174,1)}${rock(3,236,177,1.3)}
 <g transform="translate(120 182)"><g class="digger" data-cue="digger" data-fun="digger">${digger}</g></g>
 ${actor('rubble',62,190,PUPS.rubble,'pups rubble')}
 ${target('rock-1',186,164,13,18)}${target('rock-2',212,164,13,18)}${target('rock-3',236,164,13,18)}`));
}
// The crossing: shops, cars, a zebra crossing and the traffic light Chase looks after.
const shop=(x,w,h,c,awning)=>`<rect x="${x}" y="${110-h}" width="${w}" height="${h}" fill="${c}" ${L} stroke-width="1.4"/>${Array.from({length:Math.floor((h-24)/14)},(_,r)=>Array.from({length:Math.floor((w-6)/12)},(_,k)=>`<rect x="${x+5+k*12}" y="${116-h+r*14}" width="7" height="8" fill="#bfe3ff" ${L} stroke-width=".8"/>`).join('')).join('')}<path d="M${x-2} ${96}H${x+w+2}V104H${x-2}Z" fill="${awning}" ${L} stroke-width="1.2"/>${Array.from({length:Math.floor(w/8)},(_,k)=>`<path d="M${x+k*8} 104h8v3q-4 4-8 0Z" fill="${k%2?'#fff':awning}" stroke="${INK}" stroke-width=".8"/>`).join('')}`;
function crossingScene(){
 return pawActors(scene('The traffic light at the crossing',`${sky('town-sky',[[0,'#8fd0ff'],[1,'#e8f7ff']])}<rect width="320" height="200" fill="url(#town-sky)"/>${funCloud(60,20,.8)}${funCloud(250,28)}
 ${shop(8,44,74,'#ffe1b0','#e2504f')}${shop(58,36,60,'#e8d9f5','#9b6ccf')}${shop(240,40,80,'#d8f0e2','#3fae6e')}${shop(284,34,62,'#ffe1ef','#ff7fb6')}
 <rect y="110" width="320" height="10" fill="#d9d4cc"/><rect class="street" y="120" width="320" height="42" fill="#7d7a8b"/>${[0,1,2,3,4].map(i=>`<rect x="${150+i*9}" y="122" width="5" height="38" fill="#fff"/>`).join('')}<rect y="162" width="320" height="38" fill="#d9d4cc"/><path d="M0 162H320" stroke="#b8b2a8" stroke-width="2"/>
 <g class="light" data-cue="light"><path d="M214 162V76" ${L} stroke-width="4"/><rect x="202" y="56" width="24" height="40" rx="5" fill="#3b3a4a" ${L}/>
  <g class="lamp-red" data-cue="light-red"><circle cx="214" cy="67" r="7" fill="#ff4d4d" ${L} stroke-width="1.4"/></g><g class="lamp-green" data-cue="light-green"><circle cx="214" cy="85" r="7" fill="#3ccf6e" ${L} stroke-width="1.4"/></g></g>
 <g class="cars" data-cue="cars">${actor('car-1',64,158,car('#ff7a45'),'cars')}${actor('car-2',116,158,car('#ffc233'),'cars')}${actor('car-3',-60,158,car('#7cc3ff'),'cars')}</g>
 ${actor('chase',258,196,PUPS.chase,'pups chase')}${actor('rubble',150,196,PUPS.rubble,'pups rubble')}${actor('skye',182,196,PUPS.skye,'pups skye')}
 ${target('light',214,76,20,26)}`));
}
// The park: the big tree with the chicken at the top, Skye's helicopter on the grass.
function parkScene(){
 return pawActors(scene('The park, with the chicken up the big tree',`${sky('park-sky',[[0,'#8fd0ff'],[1,'#e8f7ff']])}<rect width="320" height="200" fill="url(#park-sky)"/>${funSun(40,30,13)}${funCloud(120,20,.8)}
 <path d="M0 120Q160 104 320 122V200H0Z" fill="#8fd16e"/><path d="M0 160Q160 150 320 164V200H0Z" fill="#6cc24a"/><ellipse cx="290" cy="168" rx="26" ry="7" fill="#7cc3ff" ${L} stroke-width="1.4"/>
 <g class="tree" data-cue="tree"><path d="M226 190V80" stroke="${INK}" stroke-width="15" stroke-linecap="round"/><path d="M226 190V80" stroke="#b9743c" stroke-width="11" stroke-linecap="round"/><path d="M226 110 252 84M226 96 202 76" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M226 110 252 84M226 96 202 76" stroke="#b9743c" stroke-width="4" stroke-linecap="round"/>
  ${[[226,58,30],[196,74,20],[256,72,22],[214,40,18],[244,44,16]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#5fbf4a" ${L}/>`).join('')}${[[212,50],[240,66],[204,72],[250,40]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3" fill="#7fd36a"/>`).join('')}</g>
 ${[[20,184,'#ff8cc6'],[100,192,'#ffd34d'],[160,196,'#fff'],[310,190,'#ff8cc6']].map(([x,y,c])=>funFlower(x,y,c)).join('')}
 ${actor('chicken',230,40,chicken,'chicken')}
 ${actor('copter',74,176,copter,'copter skye')}
 ${actor('mayor',150,188,mayor,'mayor')}${actor('ryder',-40,188,ryder,'ryder')}
 ${actor('chase',-40,188,PUPS.chase,'pups chase')}${actor('rubble',-40,188,PUPS.rubble,'pups rubble')}${actor('skye',-40,188,PUPS.skye,'pups skye')}
 <g class="bones">${[1,2,3].map(i=>`<g class="bone bone-${i}" data-cue="bones">${bone}</g>`).join('')}</g>
 ${target('copter',70,150,24,32)}${target('chicken',232,28,14,20)}
 ${[['chase',172],['rubble',206],['skye',240]].map(([name,x])=>target('give-'+name,x,166,16,22)).join('')}`));
}
const pictures={
 dog:box('-24 -76 48 80',PUPS.chase),
 phone:box('-24 -22 48 42',phone),
 rock:box('-18 -20 36 22',rock(0,0,0,1.3)),
 dig:box('-36 -60 96 64',digger),
 road:box('0 0 60 30',`<rect width="60" height="30" rx="4" fill="#7d7a8b"/><path d="M4 15H56" stroke="#fff" stroke-width="2.4" stroke-dasharray="8 6"/>`),
 car:box('-28 -34 56 36',car('#ff7a45')),
 redLight:box('-14 -24 28 48',`<rect x="-12" y="-22" width="24" height="44" rx="5" fill="#3b3a4a" ${L}/><circle cx="0" cy="-10" r="7" fill="#ff4d4d" ${L} stroke-width="1.4"/><circle cx="0" cy="10" r="7" fill="#3c4a3f" ${L} stroke-width="1.4"/>`),
 greenLight:box('-14 -24 28 48',`<rect x="-12" y="-22" width="24" height="44" rx="5" fill="#3b3a4a" ${L}/><circle cx="0" cy="-10" r="7" fill="#4a3b3b" ${L} stroke-width="1.4"/><circle cx="0" cy="10" r="7" fill="#3ccf6e" ${L} stroke-width="1.4"/>`),
 stop:box('-20 -20 40 40',`<path d="M-8 -18H8L18 -8V8L8 18H-8L-18 8V-8Z" fill="#e2504f" ${L}/><rect x="-10" y="-3" width="20" height="6" rx="2" fill="#fff"/>`),
 chick:box('-16 -32 36 34',chicken),
 helicopter:box('-40 -56 92 60',copter.replace('class="hook"','class="hook" opacity="0"')),
 fly:box('-40 -60 92 66',`${copter.replace('class="hook"','class="hook" opacity="0"')}<path d="M-34 -2q10 6 20 0M0 4q10 6 20 0" fill="none" stroke="#7cc3ff" stroke-width="2.4" stroke-linecap="round"/>`),
 bone:box('-16 -12 32 18',bone),
 brave:box('-26 -80 52 84',`${PUPS.skye}${star(-20,-70,1.6)}${star(20,-72,1.3)}`)
};
const cover=()=>box('0 0 320 200',`${bayBackdrop}${lookout}
 <g transform="translate(104 190)">${ryder}</g><g transform="translate(150 190) scale(1.15)">${PUPS.chase}</g><g transform="translate(196 190) scale(1.15)">${PUPS.rubble}</g><g transform="translate(242 190) scale(1.15)">${PUPS.skye}</g><g transform="translate(286 92) scale(.6)">${copter.replace('class="hook"','class="hook" opacity="0"')}</g>`);

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
 api.ambient('music');
 await atTheLookout(t);
 api.ambient('birds');
 await clearTheRoad(t);
 await atTheCrossing(t);
 await inThePark(t);
}
// Tap anything: pups bark, Ryder and the Mayor say hello, the chicken clucks, gulls flap, boats sail, cars honk.
const BARK={chase:'barkChase',rubble:'barkRubble',skye:'barkSkye'};
function fun(name,el,storyApi){
 const a=storyApi;
 if(BARK[name]){a.replay(el,'wag');a.replay(el.querySelector('.cuebox'),'happy-hop');a.voice(BARK[name]);return true;}
 if(name==='ryder'||name==='mayor'){a.replay(el.querySelector('.cuebox'),'happy-hop');a.voice(name==='ryder'?'hiRyder':'hiMayor');return true;}
 if(name==='chicken'){a.replay(el,'flap');a.voice('cluck');return true;}
 if(name==='gull'){a.replay(el,'soar');a.effect('tweet');return true;}
 if(name==='boat'){a.replay(el,'sail');a.effect('swish');return true;}
 if(name==='car'){a.replay(el.querySelector('.cuebox'),'honk');a.effect('pop');return true;}
 if(name==='digger'){a.replay(el.querySelector('.arm'),'scoop');a.effect('boing');return true;}
}

const css=`
.story-svg .blink{transform-box:fill-box;transform-origin:center;animation:paw-blink 4.4s infinite}
.story-svg .actor-rubble .blink{animation-delay:1.2s}.story-svg .actor-skye .blink{animation-delay:2.4s}.story-svg .actor-ryder .blink{animation-delay:3.1s}
@keyframes paw-blink{0%,94%,100%{transform:none}97%{transform:scaleY(.12)}}
.story-svg .pup-talk,.story-svg .person-talk{opacity:0}
[data-talking="chase"] .actor-chase .pup-talk,[data-talking="rubble"] .actor-rubble .pup-talk,[data-talking="skye"] .actor-skye .pup-talk,[data-talking="pups"] .pup-talk,[data-talking="ryder"] .actor-ryder .person-talk,[data-talking="mayor"] .actor-mayor .person-talk{animation:paw-talk .22s steps(2) infinite}
@keyframes paw-talk{0%{opacity:1}100%{opacity:0}}
.story-svg .gull-wings{animation:paw-flap .5s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:center}
@keyframes paw-flap{to{transform:scaleY(.5)}}
.story-svg .gull.soar{animation:paw-soar 2s ease-in-out}
@keyframes paw-soar{50%{transform:translate(30px,-16px)}}
.story-svg .boat-body{animation:paw-bob 2s ease-in-out infinite alternate}
@keyframes paw-bob{to{transform:translateY(1.5px) rotate(2deg)}}
.story-svg .boat.sail .boat-body{animation:paw-sail 2.4s ease-in-out}
@keyframes paw-sail{50%{transform:translateX(-40px)}}
.story-svg .cuebox.honk{transform-box:fill-box;transform-origin:50% 100%;animation:paw-honk .4s ease-in-out}
@keyframes paw-honk{50%{transform:scale(1.08,.94)}}
.story-svg .actor-chicken.flap .cuebox{animation:story-hop .2s ease-in-out 4 alternate}

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
 play,pictures,cover,css,fun,
 avatars:{
  ryder:box('-16 -74 32 34',ryder),mayor:box('-18 -78 36 38',mayor),
  chase:box('-18 -60 36 36',PUPS.chase),rubble:box('-19 -62 38 38',PUPS.rubble),skye:box('-22 -60 44 40',PUPS.skye),
  pups:box('-42 -60 84 40',`<g transform="translate(-26 0)">${PUPS.chase}</g><g transform="translate(0 0)">${PUPS.rubble}</g><g transform="translate(26 0)">${PUPS.skye}</g>`),
  chicken:box('-12 -30 32 32',chicken)
 }
};
