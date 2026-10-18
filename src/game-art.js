// Pictures for the topic games, in the same flat style as the word pictures: ink outlines, warm fills.
// The panda acts out every action and routine; animals and foods use the 120×96 word-picture box (facing right,
// so food can fly into their mouths); I spy scenes are 320×200 with one slot per thing to find.
import {illustrations} from './illustrations.js';

const INK='#1f1b3a',BLACK='#2a2733',WHITE='#fffdf8',BLUSH='#ffb3c1',ORANGE='#ff7a45',GLOW='#fff0a0';
const L=`stroke="${INK}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`;
const art=(viewBox,body)=>`<svg class="art" viewBox="${viewBox}" aria-hidden="true">${body}</svg>`;
const limb=(x1,y1,x2,y2,colour=BLACK,w=5.5)=>`<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${INK}" stroke-width="${w+3}" stroke-linecap="round"/><path d="M${x1} ${y1}L${x2} ${y2}" stroke="${colour}" stroke-width="${w}" stroke-linecap="round"/>`;
const notes=(x,y)=>`<g fill="${INK}"><circle cx="${x}" cy="${y}" r="2.4"/><path d="M${x+2} ${y}V${y-9}l5 1.6" fill="none" stroke="${INK}" stroke-width="1.6"/><circle cx="${x+9}" cy="${y-6}" r="2" /><path d="M${x+10.6} ${y-6}V${y-14}" stroke="${INK}" stroke-width="1.4"/></g>`;
const zzz=(x,y)=>`<g fill="#7c5cff" font-family="Fredoka,sans-serif" font-weight="700"><text x="${x}" y="${y}" font-size="8">z</text><text x="${x+6}" y="${y-7}" font-size="10">z</text><text x="${x+13}" y="${y-16}" font-size="13">Z</text></g>`;
const drop=(x,y,c='#7cc3ff')=>`<path d="M${x} ${y}q-2.4 4 0 5.6q2.4-1.6 0-5.6z" fill="${c}" stroke="${INK}" stroke-width=".8"/>`;

// ---- The panda ----
// Front on, feet at (0,0), about 64 tall. A pose sets where the paws and feet are, how the face looks, and adds
// props; the arms and legs are drawn from the shoulders and hips to those points.
function face({eyes='open',mouth='smile'}={}){
 const eyeShapes={
  open:`<circle cx="-5" cy="-46" r="1.9" fill="#fff"/><circle cx="5" cy="-46" r="1.9" fill="#fff"/><circle cx="-4.6" cy="-45.6" r="1" fill="${INK}"/><circle cx="5.4" cy="-45.6" r="1" fill="${INK}"/>`,
  closed:`<path d="M-7 -46q2 1.6 4 0M3 -46q2 1.6 4 0" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/>`,
  happy:`<path d="M-7 -45q2-2 4 0M3 -45q2-2 4 0" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/>`,
  sad:`<path d="M-7 -47q2 1.4 4 1M3 -46q2 .4 4-1" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/>`
 };
 const mouths={
  smile:`<path d="M-3 -36.5q3 2.6 6 0" fill="none" ${L} stroke-width="1.5"/>`,
  open:`<ellipse cx="0" cy="-35.5" rx="3" ry="2.6" fill="${INK}"/><ellipse cx="0" cy="-34.4" rx="1.8" ry="1" fill="#ff8a8a"/>`,
  o:`<circle cx="0" cy="-35.5" r="2" fill="${INK}"/>`,
  sad:`<path d="M-3 -34.5q3-2.4 6 0" fill="none" ${L} stroke-width="1.5"/>`,
  laugh:`<path d="M-5 -37.5Q0 -30 5 -37.5Z" fill="${INK}"/><path d="M-2.6 -33.6q2.6 1.4 5.2 0" stroke="#ff8a8a" stroke-width="1.6" fill="none"/>`,
  yawn:`<ellipse cx="0" cy="-35" rx="3" ry="3.6" fill="${INK}"/>`
 };
 return `<circle cx="-11" cy="-56" r="5.5" fill="${BLACK}" ${L}/><circle cx="11" cy="-56" r="5.5" fill="${BLACK}" ${L}/>
 <circle cx="0" cy="-44" r="14" fill="${WHITE}" ${L}/>
 <ellipse cx="-5.4" cy="-45" rx="3.8" ry="5" fill="${BLACK}" transform="rotate(-25 -5.4 -45)"/><ellipse cx="5.4" cy="-45" rx="3.8" ry="5" fill="${BLACK}" transform="rotate(25 5.4 -45)"/>
 ${eyeShapes[eyes]}<ellipse cx="0" cy="-39.6" rx="2.3" ry="1.6" fill="${BLACK}"/>${mouths[mouth]}
 <circle cx="-9" cy="-38" r="2" fill="${BLUSH}" opacity=".8"/><circle cx="9" cy="-38" r="2" fill="${BLUSH}" opacity=".8"/>`;
}
function body({arms=[[-16,-13],[16,-13]],legs=[[-7,0],[7,0]],top='',shirt=null}){
 const [[lx,ly],[rx,ry]]=arms,[[fx,fy],[gx,gy]]=legs;
 return `${limb(-6,-8,fx,fy-2)}${limb(6,-8,gx,gy-2)}<ellipse cx="${fx}" cy="${fy-1.6}" rx="4.6" ry="2.6" fill="${BLACK}" ${L} stroke-width="1.4"/><ellipse cx="${gx}" cy="${gy-1.6}" rx="4.6" ry="2.6" fill="${BLACK}" ${L} stroke-width="1.4"/>
 <ellipse cx="0" cy="-19" rx="12.5" ry="13" fill="${shirt||WHITE}" ${L}/>${top}
 ${limb(-10,-27,lx,ly,shirt||BLACK)}${limb(10,-27,rx,ry,shirt||BLACK)}<circle cx="${lx}" cy="${ly}" r="3.2" fill="${BLACK}" ${L} stroke-width="1.4"/><circle cx="${rx}" cy="${ry}" r="3.2" fill="${BLACK}" ${L} stroke-width="1.4"/>`;
}
const bed=`<rect x="-34" y="-16" width="70" height="14" rx="3" fill="#c98b4a" ${L}/><rect x="-36" y="-30" width="8" height="30" rx="2" fill="#a8703f" ${L}/><path d="M-30 -2V2M32 -2V2" ${L} stroke-width="3"/>`;
const blanket=(y=-22)=>`<path d="M-24 ${y}Q8 ${y-6} 34 ${y}V-14H-24Z" fill="#7cc3ff" ${L}/><path d="M-12 ${y-2}l4 6M4 ${y-3}l4 6M20 ${y-2}l4 6" stroke="#bfe3ff" stroke-width="2"/>`;
const POSES={
 stand:{},
 run:{arms:[[-17,-34],[16,-14]],legs:[[-13,-1],[10,-5]],tilt:8,after:`<path d="M-34 -30h-10M-32 -20h-14M-34 -10h-9" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`},
 jump:{arms:[[-17,-46],[17,-46]],legs:[[-9,-3],[9,-3]],dy:-12,mouth:'open',before:`<ellipse cx="0" cy="0" rx="12" ry="2.4" fill="${INK}" opacity=".15"/>`,after:`<path d="M-10 4l-2 4M0 5v4M10 4l2 4" stroke="${INK}" stroke-width="1.6" stroke-linecap="round" transform="translate(0 -10)"/>`},
 walk:{arms:[[-17,-30],[16,-12]],legs:[[-12,0],[9,-6]],tilt:4,after:`<path d="M-26 -6h-8M-28 2h-6" stroke="${INK}" stroke-width="1.8" stroke-linecap="round"/><ellipse cx="-24" cy="8" rx="3" ry="1.6" fill="${INK}" opacity=".25"/><ellipse cx="-34" cy="6" rx="3" ry="1.6" fill="${INK}" opacity=".18"/>`},
 sit:{arms:[[-13,-12],[13,-12]],legs:[[-16,-4],[16,-4]],dy:6,before:`<rect x="-14" y="-6" width="28" height="6" rx="2" fill="#c98b4a" ${L}/>`},
 clap:{arms:[[-2,-31],[2,-31]],mouth:'open',after:`<path d="M-9 -38l-4-3M-9 -32h-5M9 -38l4-3M9 -32h5" stroke="${ORANGE}" stroke-width="2" stroke-linecap="round"/>`},
 sleep:{lying:true,eyes:'closed',mouth:'smile',after:zzz(14,-26)},
 eat:{arms:[[-7,-30],[7,-30]],mouth:'open',after:`<path d="M-11 -30Q0 -20 11 -30Z" fill="#fffaf0" ${L} stroke-width="1.6"/><path d="M-8 -30q8-4 16 0" fill="#fff" stroke="${INK}" stroke-width="1"/><path d="M6 -40 13 -28M9 -41 15 -29" stroke="#a8703f" stroke-width="1.6"/>`},
 drink:{arms:[[-5,-35],[15,-14]],after:`<path d="M-11 -42h10l-1.4 12h-7.2z" fill="#bfe3ff" ${L} stroke-width="1.6"/><path d="M-10.4 -38h8.8" stroke="#7cc3ff" stroke-width="3"/>`},
 laugh:{arms:[[-8,-17],[8,-17]],eyes:'happy',mouth:'laugh',after:`<text x="12" y="-52" font-size="9" font-weight="700" font-family="Fredoka,sans-serif" fill="${ORANGE}">哈</text><text x="-22" y="-54" font-size="8" font-weight="700" font-family="Fredoka,sans-serif" fill="${ORANGE}">哈</text>`},
 cry:{arms:[[-9,-41],[9,-41]],eyes:'sad',mouth:'open',after:`${drop(-9,-41)}${drop(-11,-34)}${drop(9,-41)}${drop(11,-34)}`},
 sing:{arms:[[-5,-34],[16,-15]],mouth:'o',after:`<rect x="-7.5" y="-40" width="5" height="10" rx="2" fill="#77738b" ${L} stroke-width="1.2"/><circle cx="-5" cy="-41" r="3.2" fill="#3b3a4a" ${L} stroke-width="1.2"/>${notes(14,-48)}`},
 dance:{arms:[[-18,-44],[14,-22]],legs:[[-7,0],[13,-12]],tilt:-8,mouth:'open',after:notes(-30,-40)},
 // Daily routine
 getup:{inBed:true,arms:[[-14,-56],[14,-56]],mouth:'yawn',after:`<g transform="translate(30 -36)"><circle r="7" fill="#ff7a45" ${L} stroke-width="1.6"/><circle r="4.6" fill="#fff"/><path d="M0 0V-3M0 0h2.4" stroke="${INK}" stroke-width="1.2"/><path d="M-9 -6l-3-3M9 -6l3-3" stroke="${INK}" stroke-width="1.4"/></g>`},
 brush:{arms:[[-3,-36],[16,-14]],mouth:'smile',after:`<path d="M-3 -36-16 -42" stroke="#5ad1c8" stroke-width="3.4" stroke-linecap="round"/><rect x="-6" y="-38" width="5" height="3" fill="#fff" ${L} stroke-width=".8"/><circle cx="4" cy="-33" r="1.6" fill="#fff" ${L} stroke-width=".6"/><circle cx="7" cy="-35" r="1.2" fill="#fff" ${L} stroke-width=".6"/>`},
 washface:{arms:[[-9,-42],[9,-42]],eyes:'closed',after:`${drop(-14,-50)}${drop(14,-48)}${drop(0,-62)}<path d="M-16 -14Q0 -2 16 -14Z" fill="#bfe3ff" ${L} stroke-width="1.6"/><path d="M-18 -14H18" ${L} stroke-width="2.4"/>`},
 washhands:{arms:[[-5,-17],[5,-17]],after:`<rect x="-22" y="-14" width="44" height="6" rx="2" fill="#e8eef5" ${L}/><path d="M14 -14V-26H4" fill="none" ${L} stroke-width="3"/>${drop(4,-24)}<circle cx="-3" cy="-20" r="2.4" fill="#fff" ${L} stroke-width=".8"/><circle cx="3" cy="-21" r="2" fill="#fff" ${L} stroke-width=".8"/><circle cx="0" cy="-24" r="1.6" fill="#fff" ${L} stroke-width=".8"/>`},
 dress:{arms:[[-12,-58],[12,-58]],shirt:'#ff7fb6',top:`<path d="M-12 -14H12" stroke="#fff" stroke-width="2"/>`},
 breakfast:{arms:[[-6,-34],[14,-16]],mouth:'open',after:`<rect x="-24" y="-16" width="48" height="5" rx="2" fill="#c98b4a" ${L}/><path d="M-20 -11V0M20 -11V0" ${L} stroke-width="2.4"/><path d="M-12 -38q6-6 12 0v6h-12z" fill="#e8b36a" ${L} stroke-width="1.4"/><rect x="10" y="-26" width="8" height="10" rx="1.5" fill="#fff" ${L} stroke-width="1.4"/>`},
 school:{arms:[[-15,-16],[16,-46]],legs:[[-9,0],[5,-1]],before:`<rect x="-15" y="-38" width="30" height="24" rx="5" fill="#e2504f" ${L}/>`,top:`<path d="M-8 -30V-12M8 -30V-12" stroke="#b23a3a" stroke-width="3"/>`},
 bath:{inTub:true,arms:[[-22,-24],[22,-24]],eyes:'happy',mouth:'open',after:`<path d="M-30 -24H30L26 -2H-26Z" fill="#fff" ${L}/><path d="M-26 0V3M26 0V3" ${L} stroke-width="3"/>${[[-22,-26],[-14,-29],[-6,-26],[4,-28],[14,-27],[22,-29]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="4" fill="#fff" stroke="#7cc3ff" stroke-width="1.2"/>`).join('')}<g transform="translate(18 -30)"><ellipse cx="0" cy="0" rx="6" ry="4" fill="#ffd34d" ${L} stroke-width="1.2"/><circle cx="4" cy="-4" r="3" fill="#ffd34d" ${L} stroke-width="1.2"/><path d="M7 -4l3 1-3 1z" fill="${ORANGE}"/></g>`},
 read:{arms:[[-9,-25],[9,-25]],legs:[[-16,-4],[16,-4]],dy:6,eyes:'happy',before:`<rect x="-14" y="-6" width="28" height="6" rx="2" fill="#c98b4a" ${L}/>`,after:`<g transform="translate(0 -24)"><path d="M0 -8Q-8 -10 -16 -8V6Q-8 4 0 6Q8 4 16 6V-8Q8 -10 0 -8Z" fill="#fff" ${L} stroke-width="1.6"/><path d="M0 -8V6" stroke="${INK}" stroke-width="1.2"/><path d="M-12 -3h8M-12 1h8M4 -3h8M4 1h8" stroke="#b6b3c4" stroke-width="1.2"/></g>`},
 bedtime:{lying:true,inBed:true,eyes:'closed',after:`${blanket(-20)}${zzz(16,-34)}<path d="M28 -44a6 6 0 1 1-6-7a5 5 0 0 0 6 7z" fill="#ffd34d" ${L} stroke-width="1.2"/>`}
};
export function panda(name='stand'){
 const p=POSES[name];
 const parts=`${face({eyes:p.eyes,mouth:p.mouth})}`;
 if(p.lying){
  // Lying on her side: the whole panda turned on its back, head on a pillow.
  const lying=`<g transform="translate(24 ${p.inBed?-20:-14}) rotate(-90)">${body({arms:[[-14,-12],[14,-12]],legs:[[-6,0],[6,0]]})}${parts}</g>`;
  return `${p.inBed?bed:''}<ellipse cx="-22" cy="${p.inBed?-20:-12}" rx="11" ry="5" fill="#fffaf0" ${L} stroke-width="1.6"/>${lying}${p.after||''}`;
 }
 const figure=`${body({arms:p.arms,legs:p.legs,top:p.top||'',shirt:p.shirt})}${parts}`;
 if(p.inBed)return `${bed}<g transform="translate(-6 -6)">${figure}</g>${blanket(-16)}${p.after||''}`;
 if(p.inTub)return `<g transform="translate(0 6)">${figure}</g>${p.after||''}`;
 return `${p.before||''}<g transform="translate(0 ${p.dy||0}) rotate(${p.tilt||0})">${figure}${p.after||''}</g>`;
}
export const pandaPicture=pose=>art('-42 -68 84 76',panda(pose));

// ---- Things for the routine (she hands the panda what it needs) ----
const THINGS={
 clock:`<circle cx="0" cy="0" r="16" fill="#ff7a45" ${L}/><circle cx="0" cy="0" r="11" fill="#fff" ${L} stroke-width="1.4"/><path d="M0 0V-7M0 0h5" ${L} stroke-width="1.8"/><circle cx="-11" cy="-15" r="4" fill="#ffd34d" ${L} stroke-width="1.4"/><circle cx="11" cy="-15" r="4" fill="#ffd34d" ${L} stroke-width="1.4"/><path d="M-10 15l-3 4M10 15l3 4" ${L} stroke-width="2"/>`,
 toothbrush:`<path d="M-20 10 12 -8" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M-20 10 12 -8" stroke="#5ad1c8" stroke-width="4" stroke-linecap="round"/><rect x="8" y="-16" width="14" height="7" rx="2" fill="#fff" ${L} stroke-width="1.4" transform="rotate(-30 15 -12)"/>`,
 towel:`<rect x="-16" y="-16" width="32" height="32" rx="4" fill="#ff7fb6" ${L}/><path d="M-16 8H16M-16 12H16" stroke="#fff" stroke-width="2"/>`,
 soap:`<rect x="-16" y="-8" width="32" height="18" rx="7" fill="#c9f0ff" ${L}/><circle cx="12" cy="-12" r="4" fill="#fff" ${L} stroke-width="1"/><circle cx="4" cy="-16" r="3" fill="#fff" ${L} stroke-width="1"/>`,
 clothes:`<path d="M-8 -16-20 -8-15 0-10 -3V16H10V-3L15 0 20 -8 8 -16Q0 -10 -8 -16Z" fill="#ff7fb6" ${L}/>`,
 bread:`<path d="M-16 12V-4Q-20 -16 -8 -16H8Q20 -16 16 -4V12Z" fill="#e8b36a" ${L}/><path d="M-12 12V-2Q-14 -11 -6 -11H6Q14 -11 12 -2V12" fill="#fff4dc"/>`,
 schoolbag:`<path d="M-8 -14q8-8 16 0" fill="none" ${L} stroke-width="3"/><rect x="-16" y="-12" width="32" height="28" rx="6" fill="#e2504f" ${L}/><rect x="-10" y="2" width="20" height="10" rx="3" fill="#ff8a8a" ${L} stroke-width="1.4"/>`,
 duckToy:`<ellipse cx="-2" cy="4" rx="16" ry="10" fill="#ffd34d" ${L}/><circle cx="8" cy="-8" r="8" fill="#ffd34d" ${L}/><path d="M15 -8l7 2-7 3z" fill="${ORANGE}" ${L} stroke-width="1.2"/><circle cx="10" cy="-10" r="1.4" fill="${INK}"/>`,
 book:`<path d="M0 -10Q-9 -13 -18 -10V12Q-9 9 0 12Q9 9 18 12V-10Q9 -13 0 -10Z" fill="#fff" ${L}/><path d="M0 -10V12" ${L} stroke-width="1.4"/><path d="M-14 -4h9M-14 1h9M5 -4h9M5 1h9" stroke="#b6b3c4" stroke-width="1.4"/>`,
 pillow:`<path d="M-20 -8Q0 -14 20 -8Q24 0 20 8Q0 14 -20 8Q-24 0 -20 -8Z" fill="#fffaf0" ${L}/><path d="M-12 -2q12 4 24 0" fill="none" stroke="#d9d4cc" stroke-width="1.6"/>`
};
export const thingPicture=id=>art('-24 -24 48 48',THINGS[id]);

// ---- Animals and foods not in the word pictures yet (120×96, facing right) ----
const eye=(x,y,r=2.2)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}"/><circle cx="${x+.7}" cy="${y-.7}" r="${r*.35}" fill="#fff"/>`;
const shadow=(x,y,rx)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="2.6" fill="${INK}" opacity=".1"/>`;
const leg=(x,y,h,c)=>`<rect x="${x}" y="${y}" width="7" height="${h}" rx="3" fill="${c}" ${L}/>`;
const ANIMALS={
 panda:`${shadow(60,88,26)}<g transform="translate(60 88) scale(1.18)">${panda('sit')}</g>`,
 monkey:`${shadow(58,88,24)}<path d="M38 70Q20 70 22 50Q26 40 32 46" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M38 70Q20 70 22 50Q26 40 32 46" fill="none" stroke="#a8703f" stroke-width="3.6" stroke-linecap="round"/>
  ${leg(46,72,14,'#a8703f')}${leg(62,72,14,'#a8703f')}<ellipse cx="58" cy="64" rx="18" ry="16" fill="#a8703f" ${L}/><ellipse cx="60" cy="66" rx="10" ry="10" fill="#f2d7b0"/>
  <circle cx="64" cy="20" r="7" fill="#a8703f" ${L}/><circle cx="96" cy="26" r="7" fill="#a8703f" ${L}/><circle cx="80" cy="34" r="17" fill="#a8703f" ${L}/><path d="M68 38Q68 24 80 26Q92 24 92 38Q90 50 80 50Q70 50 68 38Z" fill="#f2d7b0" ${L} stroke-width="1.6"/>${eye(75,34)}${eye(86,34)}<path d="M78 44q4 3 8 0" fill="none" ${L} stroke-width="1.6"/>`,
 dog:`${shadow(58,88,30)}<path d="M30 52q-10-6-8-16" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M30 52q-10-6-8-16" fill="none" stroke="#e8b36a" stroke-width="3.6" stroke-linecap="round"/>
  ${leg(36,62,22,'#e8b36a')}${leg(46,62,22,'#e8b36a')}${leg(66,62,22,'#e8b36a')}${leg(76,62,22,'#e8b36a')}<ellipse cx="56" cy="58" rx="26" ry="14" fill="#e8b36a" ${L}/>
  <ellipse cx="88" cy="36" rx="15" ry="14" fill="#e8b36a" ${L}/><path d="M80 26Q72 26 72 44Q78 42 82 34Z" fill="#a8703f" ${L} stroke-width="1.6"/><ellipse cx="100" cy="42" rx="8" ry="6" fill="#fff3dd" ${L} stroke-width="1.6"/><ellipse cx="106" cy="39" rx="3" ry="2.4" fill="${INK}"/>${eye(92,32)}<path d="M100 47q3 2 6-1" fill="none" ${L} stroke-width="1.4"/>`,
 cat:`${shadow(58,88,28)}<path d="M32 70Q14 64 22 40" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M32 70Q14 64 22 40" fill="none" stroke="#9b98a8" stroke-width="3.6" stroke-linecap="round"/>
  <ellipse cx="54" cy="70" rx="22" ry="15" fill="#9b98a8" ${L}/><ellipse cx="44" cy="84" rx="8" ry="4" fill="#9b98a8" ${L}/><ellipse cx="66" cy="84" rx="8" ry="4" fill="#9b98a8" ${L}/>
  <path d="M70 32 72 14 84 26ZM96 26 106 14 104 34Z" fill="#9b98a8" ${L}/><circle cx="88" cy="40" r="17" fill="#9b98a8" ${L}/>${eye(82,38)}${eye(96,38)}<path d="M88 44l-2 2h4z" fill="#ff8fa3"/><path d="M84 48q4 3 8 0M100 44h10M100 47l10 2M76 44H66M76 47l-10 2" fill="none" stroke="${INK}" stroke-width="1.2"/>`,
 mouse:`${shadow(58,88,24)}<path d="M36 80Q14 82 14 64" fill="none" stroke="#ff8fa3" stroke-width="2.6" stroke-linecap="round"/><ellipse cx="56" cy="74" rx="22" ry="13" fill="#b6b3c4" ${L}/>
  <circle cx="74" cy="44" r="10" fill="#b6b3c4" ${L}/><circle cx="74" cy="44" r="6" fill="#f3c6d2"/><path d="M70 56Q80 50 96 62Q86 72 74 70Z" fill="#b6b3c4" ${L}/><circle cx="96" cy="62" r="2.4" fill="#ff8fa3"/>${eye(84,58,2)}`,
 bird:`${shadow(60,88,20)}<path d="M54 76v10M62 76v10" stroke="${ORANGE}" stroke-width="2.4"/><path d="M34 54 18 48 28 62Z" fill="#59b6ff" ${L}/><ellipse cx="56" cy="60" rx="22" ry="18" fill="#59b6ff" ${L}/><path d="M44 58q10 12 22 0" fill="#bfe3ff" ${L} stroke-width="1.6"/>
  <circle cx="76" cy="40" r="13" fill="#59b6ff" ${L}/><path d="M88 38l12 3-12 4z" fill="#ffc233" ${L} stroke-width="1.6"/>${eye(80,36)}`,
 pig:`${shadow(58,88,30)}<path d="M28 56q-8-2-6-10q4 0 4 4" fill="none" stroke="${INK}" stroke-width="2"/>${leg(38,66,18,'#ff9fb0')}${leg(50,66,18,'#ff9fb0')}${leg(66,66,18,'#ff9fb0')}${leg(78,66,18,'#ff9fb0')}<ellipse cx="58" cy="60" rx="30" ry="18" fill="#ffb3c1" ${L}/>
  <path d="M82 28 86 18 92 30ZM98 28 104 18 106 32Z" fill="#ffb3c1" ${L}/><circle cx="94" cy="44" r="15" fill="#ffb3c1" ${L}/><ellipse cx="104" cy="48" rx="7" ry="5.5" fill="#ff8fa3" ${L}/><ellipse cx="102" cy="48" rx="1" ry="1.6" fill="${INK}"/><ellipse cx="106" cy="48" rx="1" ry="1.6" fill="${INK}"/>${eye(92,40)}`
};
// Where each animal's mouth is in its 120×96 picture, so food can fly into it.
export const MOUTHS={horse:[106,32],duck:[103,40],cow:[98,48],sheep:[93,48],rabbit:[94,46],panda:[60,46],monkey:[82,44],dog:[104,44],cat:[88,46],mouse:[94,62],bird:[94,42],pig:[104,50]};
const FOODS={
 carrot:`<path d="M30 30 88 74Q96 78 92 70L48 18Q36 18 30 30Z" fill="${ORANGE}" ${L}/><path d="M44 30l8 6M56 44l8 6M68 58l6 5" stroke="#e5602c" stroke-width="2"/><path d="M36 22Q26 6 34 4Q38 14 40 18M40 18Q40 2 48 4Q46 14 44 20" fill="#5fbf4a" ${L} stroke-width="1.6"/>`,
 banana:`<path d="M22 40Q30 78 72 80Q96 78 102 64Q76 70 56 58Q38 46 34 30Z" fill="#ffd34d" ${L}/><path d="M34 30l-4-8 8 2z" fill="#8c5428" ${L} stroke-width="1.4"/><path d="M40 48Q56 64 84 68" fill="none" stroke="#e5a400" stroke-width="1.6"/>`,
 apple:`<path d="M60 28Q40 16 30 34Q22 54 36 74Q46 88 60 80Q74 88 84 74Q98 54 90 34Q80 16 60 28Z" fill="#ff4d4d" ${L}/><path d="M60 28q0-10 6-16" fill="none" stroke="#8c5428" stroke-width="3" stroke-linecap="round"/><path d="M64 20q10-8 18-2q-8 8-18 2z" fill="#5fbf4a" ${L} stroke-width="1.4"/><ellipse cx="42" cy="44" rx="4" ry="8" fill="#fff" opacity=".5" transform="rotate(20 42 44)"/>`,
 fish:`<path d="M24 48Q48 22 80 40L100 26V70L80 56Q48 74 24 48Z" fill="#59b6ff" ${L}/><circle cx="38" cy="44" r="3.4" fill="#fff" ${L} stroke-width="1"/><circle cx="38" cy="44" r="1.4" fill="${INK}"/><path d="M54 36q6 12 0 24M64 38q6 10 0 20" fill="none" stroke="#2b8ef0" stroke-width="1.6"/>`,
 bone:`<path d="M30 40a8 8 0 1 1 6-12L84 28a8 8 0 1 1 6 12a8 8 0 1 1-6 12H36a8 8 0 1 1-6-12z" fill="#fffaf0" ${L}/>`,
 cheese:`<path d="M20 70 96 70 96 40 20 62Z" fill="#ffd34d" ${L}/><path d="M20 62 76 26 96 40Z" fill="#ffe58a" ${L}/><circle cx="42" cy="64" r="4" fill="#e5a400"/><circle cx="70" cy="56" r="5" fill="#e5a400"/><circle cx="86" cy="62" r="3" fill="#e5a400"/>`,
 bamboo:`${[[44,0],[66,6]].map(([x,dy])=>`<rect x="${x}" y="${12+dy}" width="12" height="${74-dy}" rx="4" fill="#7fd36a" ${L}/><path d="M${x} ${34+dy}h12M${x} ${58+dy}h12" ${L} stroke-width="1.6"/>`).join('')}<path d="M56 30q14-12 26-6q-12 10-26 6zM44 50q-14-10-24-2q12 8 24 2z" fill="#5fbf4a" ${L} stroke-width="1.4"/>`,
 corn:`<path d="M60 14Q78 26 76 56Q72 84 60 88Q48 84 44 56Q42 26 60 14Z" fill="#ffd34d" ${L}/>${[0,1,2,3,4,5].map(i=>`<path d="M48 ${30+i*9}h24" stroke="#e5a400" stroke-width="1.4"/>`).join('')}<path d="M56 18v66M64 18v66" stroke="#e5a400" stroke-width="1.2"/><path d="M60 88Q36 80 32 50Q48 64 56 84ZM60 88Q84 80 88 50Q72 64 64 84Z" fill="#5fbf4a" ${L} stroke-width="1.6"/>`
};
const wordArt=(set,id)=>set[id]?art('0 0 120 96',set[id]):illustrations[id];
export const animalPicture=id=>wordArt(ANIMALS,id);
export const foodPicture=id=>wordArt(FOODS,id);

// ---- The body, on a big panda ----
// Where each part is on the standing panda (feet at 0,0), for the hit areas, the glow and the plasters.
export const BODY_SPOTS={head:[-10,-52,6],hair:[0,-60,4],eyes:[[-5,-46],[5,-46],3.6],ears:[[-11,-56],[11,-56],5],nose:[0,-40,3],mouth:[0,-35.5,3.2],hand:[[-16,-13],[16,-13],4.6],foot:[[-7,-1.6],[7,-1.6],4.6],tummy:[0,-18,7]};
const tuft=`<path d="M-3 -57q1-6 3-3q1-5 3 0" fill="none" ${L} stroke-width="1.6"/>`;
export const bodyPanda=()=>`${panda('stand')}${tuft}`;
const spotsOf=id=>{const s=BODY_SPOTS[id];return Array.isArray(s[0])?[s[0],s[1]].map(([x,y])=>[x,y,s[2]]):[s];};
// Parts of the head zoom in on the face, so even a nose is easy to see on a small card.
const ON_HEAD=['head','hair','eyes','ears','nose','mouth'];
export const bodyPicture=id=>art(ON_HEAD.includes(id)?'-22 -66 44 36':'-30 -68 60 74',`${spotsOf(id).map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r+3}" fill="${GLOW}"/>`).join('')}${bodyPanda()}${spotsOf(id).map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r+2}" fill="none" stroke="${ORANGE}" stroke-width="${ON_HEAD.includes(id)?1.4:2.2}"/>`).join('')}`);
export const bodySpots=spotsOf;
export const plaster=(x,y)=>`<g class="plaster" transform="translate(${x} ${y}) rotate(-25)"><rect x="-6" y="-2.4" width="12" height="4.8" rx="2.4" fill="#ffd9b8" ${L} stroke-width=".8"/><rect x="-2" y="-2.4" width="4" height="4.8" fill="#f5c4a0"/></g>`;

// ---- What a word looks like, by topic ----
export function picture(topic,item){
 if(topic==='actions')return pandaPicture(item.id);
 if(topic==='routine')return pandaPicture(item.id);
 if(topic==='body')return bodyPicture(item.id);
 if(topic==='animals')return animalPicture(item.id);
 return foodPicture(item.id);
}
// The small picture on a topic's tile.
export const topicIcon={actions:pandaPicture('jump'),routine:pandaPicture('brush'),body:bodyPicture('nose'),animals:animalPicture('monkey'),food:foodPicture('banana')};

// ---- I spy scenes: six slots, each with one thing to find ----
const nested=(svg,x,y,w,h=w*.8)=>svg.replace('<svg class="art"',`<svg x="${x}" y="${y}" width="${w}" height="${h}"`);
const meadow=`<rect width="320" height="200" fill="#cfeaff"/><circle cx="40" cy="30" r="13" fill="#ffd34d"/><path d="M0 92Q160 74 320 94V200H0Z" fill="#a6dc84"/><path d="M0 150Q160 138 320 152V200H0Z" fill="#8fd16e"/>`;
const SLOTS=[[56,96],[160,92],[264,96],[56,186],[160,182],[264,186]];
export const SPY_SLOTS=SLOTS;
export function spyScene(topic,items){
 const slot=(item,[x,y],i)=>{
  if(topic==='actions')return `<g class="spy-thing" data-spy="${item.id}" transform="translate(${x} ${y}) scale(1.05)">${panda(item.id)}</g>`;
  if(topic==='routine')return `<g class="spy-thing" data-spy="${item.id}" transform="translate(${x} ${y}) scale(1)">${panda(item.id)}</g>`;
  const pic=topic==='animals'?animalPicture(item.id):foodPicture(item.id),w=topic==='animals'?92:70;
  return `<g class="spy-thing" data-spy="${item.id}">${nested(pic,x-w/2,y-w*.8,w)}</g>`;
 };
 const backdrop={
  actions:meadow,
  animals:`${meadow}${Array.from({length:17},(_,i)=>`<path d="M${i*20+4} 112V96l6-6 6 6V112Z" fill="#f3e9d8" ${L} stroke-width="1.2"/>`).join('')}<path d="M0 100H320M0 108H320" stroke="#d9c9ab" stroke-width="2.4"/>`,
  routine:`<rect width="320" height="200" fill="#f3e2cc"/>${[0,1,2].map(c=>[0,1].map(r=>`<rect x="${c*106+2}" y="${r*94+4}" width="104" height="90" rx="6" fill="${['#fde3cf','#e9e2ff','#dcf5ec','#ffe1ef','#e1f0ff','#fff2cc'][c+r*3]}" ${L} stroke-width="1.6"/><rect x="${c*106+2}" y="${r*94+72}" width="104" height="22" fill="#e7c9a2" opacity=".8"/>`).join('')).join('')}`,
  food:`<rect width="320" height="200" fill="#fff4e6"/><path d="M0 0H320V40Q300 52 280 40T240 40 200 40 160 40 120 40 80 40 40 40 0 40Z" fill="#ff8a8a"/><rect x="8" y="98" width="304" height="10" rx="3" fill="#c98b4a" ${L}/><rect x="8" y="188" width="304" height="10" rx="3" fill="#c98b4a" ${L}/>`
 }[topic];
 return `<svg class="spy-svg" viewBox="0 0 320 200" role="img" aria-label="Find it">${backdrop}${items.map((item,i)=>slot(item,SLOTS[i],i)).join('')}
 ${items.map((item,i)=>{const [x,y]=SLOTS[i];return `<rect class="spy-hit" fill="transparent" data-spy="${item.id}" x="${x-50}" y="${y-88}" width="100" height="90" rx="10"/>`;}).join('')}</svg>`;
}
// The big panda for the body games, with a tap area on every part (small parts on top of big ones).
export function bodyScene(){
 const order=['head','tummy','hair','ears','eyes','nose','mouth','hand','foot'];
 return `<svg class="spy-svg body-svg" viewBox="-70 -72 140 80" role="img" aria-label="The panda">
 <rect x="-70" y="-72" width="140" height="80" fill="#e1f0ff"/><ellipse cx="0" cy="2" rx="30" ry="4" fill="${INK}" opacity=".1"/>
 <g class="body-panda">${bodyPanda()}</g><g class="plasters"></g>
 ${order.map(id=>spotsOf(id).map(([x,y,r])=>`<circle class="spy-hit" fill="transparent" data-spy="${id}" cx="${x}" cy="${y}" r="${id==='head'?13:id==='tummy'?11:r+2}"/>`).join('')).join('')}</svg>`;
}
