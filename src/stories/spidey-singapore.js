// 蜘蛛小队救新加坡 Team Spidey saves Singapore. Spider-Man, Ghost-Spider and Spin set off from Marina Bay; at
// Gardens by the Bay Green Goblin's big robot dinosaur puts out the Supertrees' lights, Spider-Man swings across
// them, webs the dinosaur and presses the red button to put it to sleep; up Marina Bay Sands he catches Green
// Goblin, and the story ends with fireworks over the bay. Names stay in English.
// Tap anything for fun: the Merlion sprays, boats sail, Supertrees twinkle, heroes pose, the Goblin cackles.
import {INK,L,scene,target,actor,box,star,blob,funSun,funCloud,funFlower,funActors} from '../story-kit.js';

// ---- Pictures ----
const RED='#e23b3b',RED_DARK='#b8262b',BLUE='#2b5fd9',BLUE_DARK='#1d45a8',GOLD='#ffc233';
const limb=(x1,y1,x2,y2,colour,w=5)=>`<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${INK}" stroke-width="${w+3.4}" stroke-linecap="round"/><path d="M${x1} ${y1}L${x2} ${y2}" stroke="${colour}" stroke-width="${w}" stroke-linecap="round"/>`;
// The web pattern on a mask: lines out from the middle and rings round it, kept inside the head.
const maskWeb=c=>`<g stroke="${c}" stroke-width=".8" fill="none" opacity=".8">${Array.from({length:8},(_,i)=>{const a=i*Math.PI/4;return `<path d="M0 -56L${(Math.cos(a)*13.4).toFixed(1)} ${(-56+Math.sin(a)*13.4).toFixed(1)}"/>`;}).join('')}<circle cx="0" cy="-56" r="4.5"/><circle cx="0" cy="-56" r="8.5"/><circle cx="0" cy="-56" r="12"/></g>`;
const bodyWeb=c=>`<g stroke="${c}" stroke-width=".7" fill="none" opacity=".7"><path d="M0 -42V-22M-8 -40l8 6 8-6M-9 -32l9 4 9-4M-8 -25l8 3 8-3"/></g>`;
const emblem=c=>`<ellipse cx="0" cy="-34" rx="2.2" ry="3.2" fill="${c}"/><circle cx="0" cy="-38" r="1.6" fill="${c}"/><path d="M-1.6 -35-6.5 -39M-1.6 -33.5-7 -33M-1.6 -32-6 -28M1.6 -35 6.5 -39M1.6 -33.5 7 -33M1.6 -32 6 -28" stroke="${c}" stroke-width="1" stroke-linecap="round"/>`;
// A spider hero, chibi style, facing us, feet at (0,0). Arms are separate so poses can lift them.
function hero({suit,side,legs,boots,mask,web,eyeRing='#1f1b3a',back='',front=''}){
 return `<ellipse cx="0" cy="1" rx="15" ry="3" fill="${INK}" opacity=".15"/>${back}
 <path d="M-8 -22L-8.5 -4H-1.5L-1 -22ZM1 -22 1.5 -4H8.5L8 -22Z" fill="${legs}" ${L}/>
 <path d="M-9.5 -6H-.5V-1Q-.5 1 -3 1H-10Q-12 1 -11.5 -2Z" fill="${boots}" ${L} stroke-width="1.6"/><path d="M9.5 -6H.5V-1Q.5 1 3 1H10Q12 1 11.5 -2Z" fill="${boots}" ${L} stroke-width="1.6"/>
 <g class="arm arm-l">${limb(-9,-40,-15,-24,suit)}<circle cx="-15.5" cy="-23" r="3.4" fill="${suit}" ${L} stroke-width="1.6"/></g>
 <g class="arm arm-r">${limb(9,-40,15,-24,suit)}<circle cx="15.5" cy="-23" r="3.4" fill="${suit}" ${L} stroke-width="1.6"/></g>
 <path d="M-10 -43Q0 -46 10 -43L9 -22Q0 -19 -9 -22Z" fill="${suit}" ${L}/>
 ${side?`<path d="M-10 -36 -9 -22Q-6 -21 -5 -21L-6.5 -34ZM10 -36 9 -22Q6 -21 5 -21L6.5 -34Z" fill="${side}"/>`:''}${bodyWeb(web)}${emblem(web===INK?INK:web)}
 <g class="hero-head"><circle cx="0" cy="-56" r="14" fill="${mask}" ${L}/>${maskWeb(web)}<circle cx="0" cy="-56" r="14" fill="none" ${L}/>
 <g class="lenses"><path d="M-1.5 -57Q-3.5 -65 -11.5 -62Q-12 -53 -3 -52Z" fill="#fff" stroke="${eyeRing}" stroke-width="2.2" stroke-linejoin="round"/><path d="M1.5 -57Q3.5 -65 11.5 -62Q12 -53 3 -52Z" fill="#fff" stroke="${eyeRing}" stroke-width="2.2" stroke-linejoin="round"/><ellipse cx="-7" cy="-60" rx="1.6" ry="1" fill="#dff3ff"/><ellipse cx="7" cy="-60" rx="1.6" ry="1" fill="#dff3ff"/></g>
 ${front}</g>`;
}
const spiderman=hero({suit:RED,side:BLUE,legs:BLUE,boots:RED,mask:RED,web:INK});
const ghost=hero({suit:'#f7f7fb',side:'#24242e',legs:'#f7f7fb',boots:'#5ad1c8',mask:'#f7f7fb',web:'#ff5fa2',
 back:`<path d="M-17 -54Q-18 -76 0 -76Q18 -76 17 -54Q16 -40 10 -37H-10Q-16 -40 -17 -54Z" fill="#fff" ${L}/><path d="M-14.5 -54Q-15 -72 0 -72Q15 -72 14.5 -54Q13 -44 9 -41" fill="none" stroke="#ff5fa2" stroke-width="3"/>`});
const spin=hero({suit:'#26262f',legs:'#26262f',boots:RED,mask:'#26262f',web:RED,eyeRing:RED});
// Green Goblin on his bat-winged glider, grinning. The web wrap shows once he is caught.
const glider=`<path d="M-34 0Q-26 -8 -14 -5Q-8 -9 0 -6Q8 -9 14 -5Q26 -8 34 0Q24 -2 18 4Q10 0 0 3Q-10 0 -18 4Q-24 -2 -34 0Z" fill="#5d6b58" ${L}/><path d="M-20 -1h40" stroke="#8b9a86" stroke-width="1.4"/><circle cx="-16" cy="-1" r="2.2" fill="#ffd34d"/><circle cx="16" cy="-1" r="2.2" fill="#ffd34d"/>
 <g class="jets"><path d="M-7 3q-3 9 0 13q3-4 0-13zM7 3q-3 9 0 13q3-4 0-13z" fill="#ff9a3c"/><path d="M-7 5q-1.4 5 0 7q1.4-2 0-7zM7 5q-1.4 5 0 7q1.4-2 0-7z" fill="#ffe066"/></g>`;
const goblinHead=`<path d="M-11 -54-21 -60-13 -47ZM11 -54 21 -60 13 -47Z" fill="#8ccf4d" ${L} stroke-width="1.6"/><circle cx="0" cy="-51" r="12" fill="#8ccf4d" ${L}/>
 <path d="M-13 -53Q-15 -70 2 -79Q4 -72 13 -66Q14 -60 13 -53Q7 -61 0 -61Q-7 -61 -13 -53Z" fill="#7b4f9e" ${L}/><path d="M2 -79Q8 -82 10 -76" fill="none" stroke="#7b4f9e" stroke-width="2.4" stroke-linecap="round"/>
 <g class="blink"><path d="M-8.5 -54l5.5 1.6-.6 2.8-5-1.6zM8.5 -54l-5.5 1.6.6 2.8 5-1.6z" fill="#ffd34d" ${L} stroke-width="1"/></g>
 <path d="M-9 -58l6 2M9 -58l-6 2" ${L} stroke-width="2"/>
 <path class="goblin-mouth" d="M-7 -45Q0 -39 7 -45Z" fill="#fff" ${L} stroke-width="1.4"/><path d="M-3.5 -44.6v1.8M0 -44v2.2M3.5 -44.6v1.8" stroke="${INK}" stroke-width=".8"/>
 <path class="goblin-talk" d="M-7 -45Q0 -35 7 -45Z" fill="${INK}"/>`;
const goblin=`${glider}<path d="M-6 -18-6.5 -4H-1.5L-1 -18ZM1 -18 1.5 -4H6.5L6 -18Z" fill="#8ccf4d" ${L} stroke-width="1.6"/>
 ${limb(-9,-37,-16,-24,'#8ccf4d')}${limb(9,-37,16,-24,'#8ccf4d')}<path d="M-10 -41Q0 -44 10 -41L11 -16H-11Z" fill="#7b4f9e" ${L}/><path d="M-11 -24H11" stroke="#3f2a55" stroke-width="3.4"/><circle cx="-5" cy="-32" r="1.6" fill="#ffd34d"/><circle cx="5" cy="-32" r="1.6" fill="#ffd34d"/>${goblinHead}
 <g class="wrap"><path d="M-15 -44 15 -18M15 -44-15 -18M-15 -31H15M-13 -62 13 -38M13 -62-13 -38" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></g>`;
// The big robot dinosaur, side on, facing left: armour panels, rivets, a glowing eye, three buttons on its back.
const METAL='#7fa08e',METAL_DARK='#56746a',METAL_LIGHT='#a9c4b5';
const button=(name,x,y,fill)=>`<g class="button btn-${name}" data-cue="btn-${name}"><circle cx="${x}" cy="${y+1}" r="6" fill="${INK}"/><circle cx="${x}" cy="${y}" r="5.5" fill="${fill}" ${L} stroke-width="1.6"/><circle cx="${x-1.6}" cy="${y-1.8}" r="1.6" fill="#fff" opacity=".75"/></g>`;
const wrap=(name,x,y,w,h)=>`<g class="wrap wrap-${name}"><path d="M${x} ${y}l${w} ${h/2}M${x+w} ${y}l${-w} ${h/2}M${x} ${y+h/2}l${w} ${h/2}M${x+w} ${y+h/2}l${-w} ${h/2}" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></g>`;
const dinosaur=`<ellipse cx="0" cy="2" rx="52" ry="5" fill="${INK}" opacity=".15"/>
 <path d="M38 -60Q74 -52 96 -26Q86 -26 78 -30Q60 -36 38 -38Z" fill="${METAL}" ${L}/><path d="M50 -50l8 4M64 -42l8 5M78 -34l6 4" stroke="${METAL_DARK}" stroke-width="1.6"/>
 <g class="dino-leg"><path d="M10 -40H26L28 -6H8Z" fill="${METAL_DARK}" ${L}/><path d="M4 -6H32L34 1H2Z" fill="#3b4a44" ${L} stroke-width="1.6"/></g>
 <g class="dino-leg back"><path d="M-26 -40H-10L-8 -6H-28Z" fill="${METAL_DARK}" ${L}/><path d="M-32 -6H-4L-2 1H-34Z" fill="#3b4a44" ${L} stroke-width="1.6"/></g>
 <path d="M-30 -84l6-13 6 13zM-16 -87l6-14 6 14zM-2 -87l6-14 6 14zM12 -85l6-13 6 13zM26 -79l6-11 6 11z" fill="${METAL_LIGHT}" ${L} stroke-width="1.6"/>
 <ellipse cx="2" cy="-58" rx="43" ry="28" fill="${METAL}" ${L}/><path d="M-30 -66Q2 -82 34 -66" fill="none" stroke="${METAL_LIGHT}" stroke-width="3" stroke-linecap="round"/>
 <path d="M-22 -48Q2 -38 28 -48" fill="none" stroke="${METAL_DARK}" stroke-width="1.8"/><path d="M-8 -70v24M14 -70v24" stroke="${METAL_DARK}" stroke-width="1.4"/>
 ${[[-20,-60],[0,-50],[22,-62],[-12,-72],[12,-46],[-26,-50],[30,-54]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.7" fill="${METAL_DARK}"/>`).join('')}
 <path d="M-30 -52-42 -42" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M-30 -52-42 -42" stroke="${METAL_DARK}" stroke-width="4.5" stroke-linecap="round"/><path d="M-44 -40l-4 2M-43 -38l-2 4" ${L} stroke-width="1.6"/>
 <path d="M-34 -72Q-42 -102 -68 -100Q-88 -98 -88 -84V-72H-52Q-42 -72 -34 -62Z" fill="${METAL}" ${L}/><path d="M-80 -92Q-66 -98 -50 -92" fill="none" stroke="${METAL_LIGHT}" stroke-width="2.6" stroke-linecap="round"/>
 <g class="jaw"><path d="M-88 -72H-52Q-46 -66 -50 -62H-84Q-90 -64 -88 -72Z" fill="${METAL_DARK}" ${L}/><path d="M-86 -72l3 4 3-4 3 4 3-4 3 4 3-4 3 4 3-4 3 4" fill="#fff" stroke="${INK}" stroke-width="1"/></g>
 <g class="dino-eye"><circle cx="-64" cy="-88" r="6" fill="#ff4d4d" ${L} stroke-width="1.6"/><circle cx="-64" cy="-88" r="2.6" fill="#ffe066"/><circle cx="-66" cy="-90" r="1.2" fill="#fff"/></g>
 <path class="dino-shut" d="M-70 -88q6 3 12 0" fill="none" ${L} stroke-width="2"/>
 ${button('red',-6,-81,RED)}${button('blue',9,-82,BLUE)}${button('yellow',23,-78,'#ffd34d')}
 ${wrap('leg1',-28,-32,19,26)}${wrap('leg2',8,-32,19,26)}${wrap('tail',54,-52,28,20)}
 <g class="zzz" fill="${INK}" font-family="Fredoka,sans-serif" font-weight="700"><text x="-52" y="-106" font-size="10">z</text><text x="-42" y="-116" font-size="13">z</text><text x="-30" y="-128" font-size="16">Z</text></g>`;

// Marina Bay: the skyline, Marina Bay Sands and its SkyPark, the Merlion, boats on the water.
const sky=(id,stops)=>`<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${stops.map(([o,c])=>`<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient></defs>`;
const windows=(x,y,w,h,lit)=>{let out='';for(let yy=y+5;yy<y+h-4;yy+=7)for(let xx=x+3;xx<x+w-3;xx+=6)out+=`<rect x="${xx}" y="${yy}" width="3" height="3.4" fill="${lit&&((xx*7+yy*3)%5<3)?'#ffe9a0':lit?'#3b4a80':'#ffffff88'}"/>`;return out;};
const SKYLINE=[[92,74,16],[110,58,14],[126,80,20],[148,66,13],[163,84,20],[284,70,16],[302,82,18]];
const skyline=night=>`<g class="skyline" data-cue="city">${[[96,92,14],[120,88,16],[140,94,12],[296,90,12]].map(([x,y,w])=>`<rect x="${x}" y="${y}" width="${w}" height="${120-y}" fill="${night?'#2a3566':'#dbe5f0'}"/>`).join('')}
 ${SKYLINE.map(([x,y,w])=>`<rect x="${x}" y="${y}" width="${w}" height="${120-y}" fill="${night?'#34407a':'#c3d2e4'}" stroke="${night?'#202a55':'#a9bbd1'}" stroke-width="1"/>${windows(x,y,w,120-y,night)}`).join('')}</g>`;
// Marina Bay Sands: three towers that lean in, with the long SkyPark boat across the top.
const mbs=(ox,oy,s,night)=>`<g class="mbs" data-cue="mbs city" transform="translate(${ox} ${oy}) scale(${s})">${[0,30,60].map(x=>`<path d="M${x} 72 ${x+2} 6H${x+18}L${x+20} 72Z" fill="${night?'#5b6aa8':'#eef3f8'}" stroke="${INK}" stroke-width="1.6"/><path d="M${x+5} 10V70M${x+10} 10V70M${x+15} 10V70" stroke="${night?'#ffe9a0':'#b8c6d6'}" stroke-width="${night?.8:1}" opacity="${night?.8:1}"/>`).join('')}
 <path d="M-12 5H86Q98 3 104 -3L102 8H-10Z" fill="${night?'#7480bd':'#dfe8f1'}" stroke="${INK}" stroke-width="1.6"/><path d="M0 4H84" stroke="#59b6ff" stroke-width="1.6"/>${[4,18,34,48,64,78].map(x=>`<circle cx="${x}" cy="1" r="2.4" fill="#5fbf4a"/>`).join('')}</g>`;
const merlion=`<g class="merlion" data-cue="merlion" data-fun="merlion"><rect x="30" y="138" width="40" height="22" rx="2" fill="#d9d4cc" ${L}/><path d="M30 144H70" stroke="#bdb6aa" stroke-width="1.4"/>
 <path d="M42 122Q28 116 30 96Q34 104 39 101Q37 112 45 116Z" fill="#f6f5f0" ${L}/>
 <path d="M44 138Q38 122 46 110Q52 102 62 104Q58 120 62 138Z" fill="#f6f5f0" ${L}/><path d="M48 132q4-3 8 0M47 124q4-3 8 0M49 116q4-3 8 0" fill="none" stroke="#c9c6bd" stroke-width="1.2"/>
 ${[0,1,2,3,4,5,6].map(i=>{const a=-Math.PI*.9+i*Math.PI*.3;return `<circle cx="${(56+Math.cos(a)*11).toFixed(1)}" cy="${(100+Math.sin(a)*11).toFixed(1)}" r="3.8" fill="#f6f5f0" ${L} stroke-width="1.4"/>`;}).join('')}
 <circle cx="56" cy="100" r="10" fill="#f6f5f0"/><circle cx="58" cy="97" r="1.5" fill="${INK}"/><path d="M61 103q3 1 5 0" ${L} stroke-width="1.6"/>
 <path class="spout" d="M66 103Q90 94 104 124" fill="none" stroke="#9fd8ff" stroke-width="4" stroke-linecap="round"/><path class="spout-big" d="M66 103Q104 84 128 128" fill="none" stroke="#9fd8ff" stroke-width="6" stroke-linecap="round"/></g>`;
const boat=(x,y)=>`<g class="boat" data-fun="boat" transform="translate(${x} ${y})"><g class="boat-body"><path d="M-14 0H14L10 7H-10Z" fill="#ff7a45" ${L} stroke-width="1.4"/><path d="M0 0V-18L12 -2Z" fill="#fff" ${L} stroke-width="1.4"/><path d="M-1 -16-10 -2H-1Z" fill="#ffd34d" ${L} stroke-width="1.2"/></g></g>`;
const water=night=>`<rect y="118" width="320" height="44" fill="url(#${night?'sea-night':'sea-day'})"/><g class="sparkles" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity="${night?.4:.7}">${[[10,130],[120,142],[220,128],[262,150],[170,152],[70,154]].map(([x,y],i)=>`<path class="spark" style="--d:${i*.35}s" d="M${x} ${y}h14"/>`).join('')}</g>`;
const promenade=`<rect y="160" width="320" height="40" fill="#d9d4cc"/><path d="M0 160H320" stroke="#b8b2a8" stroke-width="2"/>${Array.from({length:9},(_,i)=>`<path d="M${i*40} 160V200" stroke="#c9c3b8" stroke-width="1.2"/>`).join('')}<path d="M0 180H320" stroke="#c9c3b8" stroke-width="1.2"/>`;
const burst=(name,x,y,colour)=>`<g transform="translate(${x} ${y})"><g class="fw fw-${name}" data-cue="fw-${name}">${Array.from({length:14},(_,i)=>{const a=i*Math.PI/7;return `<path d="M${(Math.cos(a)*6).toFixed(1)} ${(Math.sin(a)*6).toFixed(1)}L${(Math.cos(a)*24).toFixed(1)} ${(Math.sin(a)*24).toFixed(1)}" stroke="${colour}" stroke-width="3" stroke-linecap="round"/><circle cx="${(Math.cos(a)*27).toFixed(1)}" cy="${(Math.sin(a)*27).toFixed(1)}" r="2.2" fill="${colour}"/>`;}).join('')}<circle r="4" fill="#fff"/></g></g>`;
const team=(y=192)=>`${actor('spiderman',134,y,spiderman,'team spiderman')}${actor('ghost',176,y,ghost,'team ghost')}${actor('spin',218,y,spin,'team spin')}`;
const heroActors=svg=>funActors(svg,{spiderman:'hero',ghost:'hero',spin:'hero',goblin:'goblin',dino:'dino'});
function marinaScene(night=false){
 return heroActors(scene(night?'Fireworks over Marina Bay at night':'Team Spidey at Marina Bay, Singapore',`${sky('sky-day',[[0,'#8fd0ff'],[1,'#e3f6ff']])}${sky('sky-night',[[0,'#141d4a'],[1,'#3a2f6e']])}${sky('sea-day',[[0,'#3f97dc'],[1,'#5bb4ea']])}${sky('sea-night',[[0,'#1d3366'],[1,'#2b4a86']])}
 <rect width="320" height="200" fill="url(#${night?'sky-night':'sky-day'})"/>
 ${night?`${[[20,20],[60,40],[150,14],[300,24],[240,60],[90,70],[200,40],[270,12]].map(([x,y],i)=>`<g class="twinkle" style="--d:${i*.3}s">${star(x,y,.8,'#fff3a0')}</g>`).join('')}<circle cx="44" cy="34" r="12" fill="#fff3c4"/><circle cx="49" cy="31" r="10" fill="#1d2550"/>`:`${funSun(40,34,13)}${funCloud(130,28)}${funCloud(260,22,.8)}`}
 ${skyline(night)}${mbs(194,48,1,night)}
 ${water(night)}${boat(150,140)}${boat(250,152)}
 ${merlion}${promenade}
 ${night?`${burst('red',110,40,'#ff4d4d')}${burst('blue',196,30,'#59b6ff')}${burst('yellow',272,60,'#ffd34d')}<g class="sky" data-cue="sky"><rect width="320" height="1" fill="none"/></g>`:''}
 ${team()}
 ${night?target('sky',190,48,26,70):target('team',176,160,44,58)}`));
}
// Gardens by the Bay: Supertrees (lattice trunks, glowing canopies, the skyway between them) and the glass domes.
const TREES=[[60,52],[124,36],[188,56]];
const supertree=(i,x,top)=>`<g class="supertree supertree-${i}" data-fun="supertree">
 <path d="M${x-6} 188 ${x-3} ${top+30} ${x-28} ${top}H${x+28}L${x+3} ${top+30} ${x+6} 188Z" fill="#8b5bb5" ${L}/>
 <path d="M${x-5} ${top+40}L${x+4} ${top+70}M${x+5} ${top+40}L${x-4} ${top+70}M${x-5} ${top+80}L${x+5} ${top+110}M${x+5} ${top+80}L${x-5} ${top+110}M${x-6} ${top+120}L${x+6} ${top+150}M${x+6} ${top+120}L${x-6} ${top+150}" stroke="#c08ae6" stroke-width="1.3"/>
 <path d="M${x-22} ${top+4}L${x} ${top+28}L${x+22} ${top+4}M${x-11} ${top+4}L${x} ${top+28}L${x+11} ${top+4}" stroke="#c08ae6" stroke-width="1.2" fill="none"/>
 <ellipse cx="${x}" cy="${top}" rx="29" ry="6.5" fill="#a679d6" ${L}/>
 <g class="lights lights-${i}">${[-22,-11,0,11,22].map((dx,j)=>`<circle class="bulb" style="--d:${(j*.2).toFixed(1)}s" cx="${x+dx}" cy="${top+(j%2?1:-1)}" r="2.6" fill="${['#ffd34d','#ff8cc6','#5ad1c8'][j%3]}"/>`).join('')}${[40,80,120].map((dy,j)=>`<circle class="bulb" style="--d:${(j*.3).toFixed(1)}s" cx="${x}" cy="${top+dy}" r="2.2" fill="${['#ff8cc6','#5ad1c8','#ffd34d'][j]}"/>`).join('')}</g></g>`;
const webLine=(cls,x1,y1,x2,y2)=>`<path class="web ${cls}" d="M${x1} ${y1}L${x2} ${y2}" pathLength="1" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>`;
function gardensScene(){
 return heroActors(scene('Gardens by the Bay, with the Supertrees',`${sky('g-sky',[[0,'#8fd0ff'],[1,'#e8f7ff']])}<rect width="320" height="200" fill="url(#g-sky)"/>${funSun(290,26,11)}${funCloud(40,24,.8)}${funCloud(150,16,.7)}
 <g class="domes"><path d="M206 132Q232 88 266 132Z" fill="#dff3fb" ${L} stroke-width="1.6"/><path d="M246 132Q278 96 316 132Z" fill="#dff3fb" ${L} stroke-width="1.6"/>
  <path d="M216 132Q228 100 250 104M226 132Q236 110 258 116M256 132Q268 110 292 112M266 132Q276 118 302 122" fill="none" stroke="#a9d6e8" stroke-width="1.2"/></g>
 <rect y="130" width="320" height="70" fill="#7cc867"/><path d="M0 162Q160 150 320 166V200H0Z" fill="#6cc24a"/>
 <path d="M${TREES[0][0]} ${TREES[0][1]+56}Q${TREES[1][0]} ${TREES[1][1]+66} ${TREES[2][0]} ${TREES[2][1]+56}" fill="none" stroke="${INK}" stroke-width="4"/><path d="M${TREES[0][0]} ${TREES[0][1]+56}Q${TREES[1][0]} ${TREES[1][1]+66} ${TREES[2][0]} ${TREES[2][1]+56}" fill="none" stroke="#e8eef5" stroke-width="2"/>
 <g class="trees" data-cue="supertrees">${TREES.map(([x,top],i)=>supertree(i+1,x,top)).join('')}</g>
 ${[[16,186,'#ff8cc6'],[100,192,'#ffd34d'],[150,190,'#fff'],[240,194,'#ff8cc6'],[300,188,'#ffd34d']].map(([x,y,c])=>funFlower(x,y,c)).join('')}
 ${webLine('web-1',54,166,60,54)}${webLine('web-2',98,166,124,38)}${webLine('web-3',158,166,188,58)}
 ${webLine('web-leg1',214,166,234,168)}${webLine('web-leg2',214,166,270,168)}${webLine('web-tail',214,166,318,152)}
 ${actor('dino',380,188,dinosaur,'dino')}
 ${actor('goblin',380,40,goblin,'goblin')}
 ${actor('spiderman',30,192,spiderman,'team spiderman')}
 ${TREES.map(([x,top],i)=>target('tree-'+(i+1),x,top+4,18,24)).join('')}
 ${target('leg1',234,168,14,18)}${target('leg2',270,168,14,18)}${target('tail',314,150,16,20)}
 ${target('btn-red',249,107,9,12)}${target('btn-blue',264,106,9,12)}${target('btn-yellow',278,110,9,12)}`));
}
// Marina Bay Sands up close at sunset.
function mbsScene(){
 return heroActors(scene('Marina Bay Sands at sunset',`${sky('dusk',[[0,'#6c5fd0'],[.55,'#f59ab0'],[1,'#ffc98a']])}<rect width="320" height="200" fill="url(#dusk)"/><circle cx="290" cy="150" r="22" fill="#ffd34d" opacity=".9"/>
 ${funCloud(40,40,.9).replace(/#fff/g,'#ffd8e4')}${funCloud(200,26,.7).replace(/#fff/g,'#ffd8e4')}
 <g class="tower" data-cue="tower mbs">${[70,140,210].map(x=>`<path d="M${x-4} 190 ${x} 66H${x+40}L${x+44} 190Z" fill="#eef3f8" ${L}/>${[1,2,3,4,5].map(k=>`<path d="M${x+k*7} 70V188" stroke="#b8c6d6" stroke-width="1"/>`).join('')}${[90,110,130,150,170].map(y=>`<path d="M${x} ${y}H${x+40}" stroke="#d3dde8" stroke-width="1"/>`).join('')}`).join('')}</g>
 <g class="skypark" data-cue="skypark"><path d="M48 54H278Q294 52 302 42L298 64H50Z" fill="#dfe8f1" ${L}/><path d="M60 54H270" stroke="#59b6ff" stroke-width="3"/>${[66,90,120,150,180,210,240,262].map(x=>`<circle cx="${x}" cy="48" r="3.6" fill="#5fbf4a" ${L} stroke-width="1"/>`).join('')}</g>
 <rect y="182" width="320" height="18" fill="#4f7fc0"/><path d="M20 190h20M120 194h24M240 188h18" stroke="#fff" stroke-width="1.6" opacity=".6"/>
 ${webLine('web-goblin',104,56,232,26)}
 ${actor('goblin',380,20,goblin,'goblin')}
 ${actor('spiderman',62,192,spiderman,'team spiderman')}
 ${target('tower',92,120,22,30)}${target('goblin',238,24,22,28)}`));
}
const pictures={
 singapore:box('10 30 300 140',`<rect x="10" y="30" width="300" height="140" fill="#cdeefc"/>${skyline(false)}${mbs(194,48,1,false)}<rect x="10" y="118" width="300" height="44" fill="#4fa3e0"/>${merlion.replace(/class="spout(-big)?"/g,'class="spout-pic"')}`),
 spider:box('-16 -16 32 30',`<ellipse cx="0" cy="2" rx="6" ry="8" fill="${INK}"/><circle cx="0" cy="-7" r="4.5" fill="${INK}"/>${[-1,1].map(s=>`<path d="M${s*5} -2l${s*9}-8M${s*5} 1l${s*10}-1M${s*5} 4l${s*9}6M${s*4} 7l${s*6}9" stroke="${INK}" stroke-width="1.8" stroke-linecap="round" fill="none"/>`).join('')}`),
 dinosaur:box('-94 -134 194 140',dinosaur.replace('class="zzz"','class="zzz" opacity="0"').replace(/class="wrap /g,'opacity="0" class="wrap ').replace('class="dino-shut"','class="dino-shut" opacity="0"')),
 light:box('-16 -26 32 32',`<path d="M-9 -12a9 9 0 1 1 18 0q0 6-5 9v4h-8v-4q-5-3-5-9z" fill="#ffe066" ${L}/><rect x="-4" y="1" width="8" height="5" rx="1" fill="#b6b3c4" ${L} stroke-width="1.4"/><path d="M-14 -20l-3-3M14 -20l3-3M0 -25v-3" stroke="${GOLD}" stroke-width="2" stroke-linecap="round"/>`),
 tree:box('26 30 68 162',supertree(9,60,52)),
 web:box('-22 -22 44 44',`<g stroke="${INK}" stroke-width="1.4" fill="none"><path d="M0 -20V20M-20 0H20M-14 -14 14 14M14 -14-14 14"/><circle r="6"/><circle r="12"/><circle r="18"/></g>`),
 button:box('-16 -16 32 32',`<rect x="-14" y="-6" width="28" height="12" rx="3" fill="#b6b3c4" ${L}/><circle cx="0" cy="-4" r="8" fill="${RED}" ${L}/><circle cx="-2.4" cy="-6.6" r="2.2" fill="#fff" opacity=".7"/>`),
 red:box('-28 -30 56 44',blob('#ff4d4d')),
 climb:box('-22 -78 50 82',`<rect x="6" y="-78" width="20" height="82" fill="#eef3f8" ${L}/>${spiderman}`),
 building:box('40 36 270 160',`<g>${[70,140,210].map(x=>`<path d="M${x-4} 190 ${x} 66H${x+40}L${x+44} 190Z" fill="#eef3f8" ${L}/>`).join('')}</g><path d="M48 54H278Q294 52 302 42L298 64H50Z" fill="#dfe8f1" ${L}/>`),
 sky:box('0 0 60 40',`<rect width="60" height="40" rx="6" fill="#cdeefc"/><circle cx="14" cy="13" r="7" fill="#ffd34d"/><g fill="#fff"><ellipse cx="38" cy="20" rx="12" ry="5"/><ellipse cx="44" cy="16" rx="7" ry="5"/></g>`),
 fireworks:box('-32 -32 64 64',`<rect x="-32" y="-32" width="64" height="64" rx="8" fill="#1e2a5a"/>${burst('pic',0,0,'#ff8cc6').replace('class="fw fw-pic" ','').replace('data-cue="fw-pic"','')}`),
 safe:box('-20 -24 40 46',`<path d="M0 -22 16 -16V-2Q16 12 0 20Q-16 12 -16 -2V-16Z" fill="${RED}" ${L}/><path d="M-7 -1 -1 5 9 -7" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>`)
};
const cover=()=>box('0 0 320 200',`${sky('c-dusk',[[0,'#6c5fd0'],[.6,'#f59ab0'],[1,'#ffc98a']])}<rect width="320" height="200" fill="url(#c-dusk)"/>${skyline(false)}${mbs(194,48,1,false)}<rect y="118" width="320" height="44" fill="#4f7fc0"/>${merlion}${promenade}
 <g transform="translate(130 192) scale(1.1)">${spiderman}</g><g transform="translate(174 192) scale(1.1)">${ghost}</g><g transform="translate(218 192) scale(1.1)">${spin}</g><g transform="translate(286 92) scale(.8)">${goblin.replace('class="wrap"','class="wrap" opacity="0"')}</g>`);

// ---- The story ----
let api;
const say=(key,t)=>api.say(key,t),wait=(ms,t)=>api.wait(ms,t),flag=(name,on)=>api.flag(name,on),move=(...args)=>api.move(...args);
const shoot=async(t,cls)=>{api.sounds.thwip();api.replay(api.stage().querySelector('.'+cls),'shot');await wait(350,t);};

async function atMarinaBay(t){
 await wait(400,t);
 await say('here',t);
 await say('mbs',t);
 await say('merlion',t);
 await say('team',t);
 await say('squad',t);
 await say('tapTeam',t);
 await api.tap('team',t,'tapTeam');
 flag('cheer');api.chime('yay');await say('go',t);await wait(600,t);flag('cheer',false);
}
async function atTheGardens(t){
 await api.changeScene(t,gardensScene());
 await say('gardens',t);
 // Green Goblin flies in, and his dinosaur stomps after him.
 move('goblin',212,84,1600,.7);await wait(800,t);
 await say('goblinCame',t);
 move('dino',254,188,2200);flag('stomping');for(let i=0;i<3;i++){api.sounds.knock();await wait(700,t);}flag('stomping',false);
 await say('dino',t);
 flag('stomping');api.sounds.crash();await say('stomp',t);flag('stomping',false);
 flag('dark');await say('laugh',t);
 await say('dark',t);
 // Spider-Man swings from Supertree to Supertree, and each one lights up again.
 await say('tapTree',t);
 for(let i=1;i<=3;i++){
  await api.tap('tree-'+i,t,'tapTree');
  await shoot(t,'web-'+i);
  const [x,top]=TREES[i-1];move('spiderman',x,top+90,380);await wait(380,t);flag('lit-'+i);move('spiderman',x+24,192,450);await wait(450,t);
  await say('swing',t);
 }
 await say('lightsOn',t);
 // Webs round the dinosaur's legs and tail.
 await say('tapLegs',t);
 for(const part of ['leg1','leg2','tail']){await api.tap(part,t,'tapLegs');await shoot(t,'web-'+part);flag('wrap-'+part);await say('web',t);}
 await say('tied',t);
 // The red button puts it to sleep; another colour just buzzes.
 await say('pressRed',t);
 await api.waitFor(t,done=>{
  const s=api.stage(),names=['red','blue','yellow'];names.forEach(n=>api.hint('btn-'+n,true));
  const handlers=names.map(n=>{const hit=s.querySelector('.hit-btn-'+n),on=()=>{if(n==='red'){done();return;}api.sounds.beep();api.replay(s.querySelector('.btn-'+n),'nope');if(api.quiet())say('wrong',t).catch(()=>{});};hit.addEventListener('click',on);return [hit,on];});
  const nudge=setInterval(()=>{if(api.quiet())say('pressRed',t).catch(()=>{});},9000);
  return ()=>{clearInterval(nudge);handlers.forEach(([hit,on])=>hit.removeEventListener('click',on));names.forEach(n=>api.hint('btn-'+n,false));};
 });
 api.replay(api.stage().querySelector('.btn-red'),'pressed');api.chime('ding');
 flag('asleep');await say('asleep',t);
 // Green Goblin makes off.
 move('goblin',380,-40,1400,.7);await wait(1000,t);
}
async function upMarinaBaySands(t){
 await api.changeScene(t,mbsScene());
 move('goblin',238,52,1600,.7);await wait(1700,t);
 await say('flyUp',t);
 await say('tapClimb',t);
 for(const y of [150,110,74]){await api.tap('tower',t,'tapClimb');api.sounds.thwip();move('spiderman',92,y,700);await wait(800,t);}
 await say('tapGoblin',t);
 await api.tap('goblin',t,'tapGoblin');
 await say('web',t);await shoot(t,'web-goblin');
 flag('caught');await say('caught',t);
 await say('oops',t);await wait(400,t);
}
async function fireworks(t){
 await api.changeScene(t,marinaScene(true));api.ambient('music');
 await say('safe',t);
 await say('tapSky',t);
 for(const colour of ['red','blue','yellow']){await api.tap('sky',t,'tapSky');api.sounds.boom();api.replay(api.stage().querySelector('.fw-'+colour),'boom');await say(colour,t);}
 flag('dance');await say('bravo',t);await wait(900,t);
}
async function play(storyApi,t){
 api=storyApi;
 api.ambient('music');
 await atMarinaBay(t);
 api.ambient('birds');
 await atTheGardens(t);
 await upMarinaBaySands(t);
 await fireworks(t);
}
// Tap anything: the Merlion sprays, boats sail, Supertrees twinkle, heroes strike a pose, the villains answer back.
function fun(name,el,storyApi){
 const a=storyApi;
 if(name==='merlion'){a.replay(el,'splash');a.sounds.whoosh(.5);return true;}
 if(name==='boat'){a.replay(el,'sail');a.effect('swish');return true;}
 if(name==='supertree'){a.replay(el,'twinkle-now');a.effect('twinkle');return true;}
 if(name==='hero'){a.replay(el.querySelector('.cuebox'),'pose');a.sounds.thwip();return true;}
 if(name==='goblin'){a.replay(el.querySelector('.cuebox'),'sneeze');a.voice('cackle');return true;}
 if(name==='dino'){a.replay(el.querySelector('.cuebox'),'roar');a.voice('roar');return true;}
}

const css=`
.story-svg .hero-head,.story-svg .arm{transform-box:fill-box}
.story-svg .arm-l{transform-origin:100% 0}.story-svg .arm-r{transform-origin:0 0}
.story-svg .lenses{transform-box:fill-box;transform-origin:center;animation:spidey-blink 4.6s infinite}
.story-svg .actor-ghost .lenses{animation-delay:1.5s}.story-svg .actor-spin .lenses{animation-delay:3s}
.story-svg .blink{transform-box:fill-box;transform-origin:center;animation:spidey-blink 5s .8s infinite}
@keyframes spidey-blink{0%,94%,100%{transform:none}97%{transform:scaleY(.15)}}
.cheer .arm-l,.dance .arm-l,.cuebox.pose .arm-l{transform:rotate(130deg)}
.cheer .arm-r,.dance .arm-r,.cuebox.pose .arm-r{transform:rotate(-130deg)}
.story-svg .arm{transition:transform .25s var(--spring)}
.story-svg .cuebox.pose{animation:story-hop .25s ease-in-out 4 alternate}
[data-talking="spidey"] .actor-spiderman .hero-head,[data-talking="team"] .hero-head{transform-origin:50% 100%;animation:spidey-nod .26s ease-in-out infinite alternate}
@keyframes spidey-nod{to{transform:rotate(4deg) translateY(-1px)}}
.story-svg .goblin-talk{opacity:0}
[data-talking="goblin"] .goblin-talk{animation:spidey-talk .22s steps(2) infinite}
[data-talking="goblin"] .goblin-mouth{opacity:0}
@keyframes spidey-talk{0%{opacity:1}100%{opacity:0}}
.cheer .actor-spiderman .bob,.cheer .actor-ghost .bob,.cheer .actor-spin .bob,.dance .actor-spiderman .bob,.dance .actor-ghost .bob,.dance .actor-spin .bob{animation:story-hop .35s ease-in-out infinite alternate}
.cheer .actor-ghost .bob,.dance .actor-ghost .bob{animation-delay:.12s}.cheer .actor-spin .bob,.dance .actor-spin .bob{animation-delay:.24s}
.story-svg .spout{stroke-dasharray:4 5;animation:spidey-spout .6s linear infinite}
.story-svg .spout-big{opacity:0;stroke-dasharray:5 6}
.story-svg .merlion.splash .spout-big{animation:spidey-big-spout 1.4s linear}
@keyframes spidey-big-spout{0%,100%{opacity:0}10%,85%{opacity:1;stroke-dashoffset:-30}}
@keyframes spidey-spout{to{stroke-dashoffset:-9}}
.story-svg .spark{animation:spidey-spark 2.4s var(--d) ease-in-out infinite}
@keyframes spidey-spark{50%{opacity:.2;transform:translateX(4px)}}
.story-svg .boat-body{animation:spidey-bob-boat 2s ease-in-out infinite alternate}
@keyframes spidey-bob-boat{to{transform:translateY(1.5px) rotate(2deg)}}
.story-svg .boat.sail .boat-body{animation:spidey-sail 2.4s ease-in-out}
@keyframes spidey-sail{50%{transform:translateX(-40px)}}
.story-svg .twinkle{animation:spidey-twinkle 2s var(--d) ease-in-out infinite}
@keyframes spidey-twinkle{50%{opacity:.3}}
.story-svg .bulb{animation:spidey-twinkle 1.8s var(--d) ease-in-out infinite}
.story-svg .supertree.twinkle-now .bulb{animation:spidey-flash .25s ease-in-out 6 alternate}
@keyframes spidey-flash{to{opacity:.1}}
.story-svg .actor-goblin .jets{animation:story-flicker .2s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:50% 0}
.story-svg .actor-goblin .bob{animation:spidey-hover 1s ease-in-out infinite alternate}
@keyframes spidey-hover{to{transform:translateY(-4px)}}
.stomping .actor-dino .bob{animation:spidey-stomp .35s ease-in-out infinite alternate}
@keyframes spidey-stomp{to{transform:translateY(-3px) rotate(-1.5deg)}}
.story-svg .cuebox.roar{transform-box:fill-box;transform-origin:50% 100%;animation:spidey-roar .7s ease-in-out}
@keyframes spidey-roar{30%{transform:rotate(-3deg) scale(1.03)}60%{transform:rotate(2deg)}}
.story-svg .jaw{transform-box:fill-box;transform-origin:100% 0}
.story-svg .cuebox.roar .jaw{animation:spidey-jaw .7s ease-in-out}
@keyframes spidey-jaw{30%,60%{transform:rotate(-14deg)}}
.stomping .trees{animation:story-no .3s ease-in-out 2}
.story-svg .lights{transition:opacity .4s}
.dark .lights{opacity:.12}
.dark.lit-1 .lights-1,.dark.lit-2 .lights-2,.dark.lit-3 .lights-3{opacity:1}
.story-svg .web{opacity:0;stroke-dasharray:1;stroke-dashoffset:1}
.story-svg .web.shot{animation:spidey-web .9s ease-out forwards}
@keyframes spidey-web{0%{opacity:1;stroke-dashoffset:1}35%{opacity:1;stroke-dashoffset:0}80%{opacity:1;stroke-dashoffset:0}100%{opacity:0;stroke-dashoffset:0}}
.story-svg .wrap{opacity:0;transition:opacity .3s}
.wrap-leg1 .wrap-leg1,.wrap-leg2 .wrap-leg2,.wrap-tail .wrap-tail,.caught .actor-goblin .wrap{opacity:1}
.story-svg .button{transform-box:fill-box;transform-origin:center}
.story-svg .button.nope{animation:story-no .3s ease-in-out 2}
.story-svg .button.pressed{animation:spidey-press .4s}
@keyframes spidey-press{50%{transform:scale(.7)}}
.story-svg .dino-shut,.story-svg .zzz{opacity:0}
.asleep .dino-eye{opacity:0}
.asleep .dino-shut{opacity:1}
.asleep .zzz{opacity:1;animation:spidey-zzz 1.6s ease-in-out infinite}
@keyframes spidey-zzz{50%{transform:translateY(-4px)}}
.asleep .actor-dino .cuebox{transform-box:fill-box;transform-origin:50% 100%;transform:rotate(4deg) translateY(4px);transition:transform .8s}
.caught .actor-goblin .bob{animation:story-shiver .12s infinite alternate}
.story-svg .fw{opacity:0;transform-box:fill-box;transform-origin:center}
.story-svg .fw.boom{animation:spidey-boom 1.6s ease-out forwards}
@keyframes spidey-boom{0%{opacity:1;transform:scale(.1)}30%{opacity:1;transform:scale(1)}100%{opacity:.85;transform:scale(1.1)}}
`;

export default {
 firstScene:()=>marinaScene(),
 scenes:()=>[marinaScene(),gardensScene(),mbsScene(),marinaScene(true)],
 play,pictures,cover,css,fun,
 avatars:{
  team:box('-46 -72 92 42',`<g transform="translate(-26 0)">${spiderman}</g><g transform="translate(0 0)">${ghost}</g><g transform="translate(26 0)">${spin}</g>`),
  spidey:box('-18 -74 36 36',spiderman),
  goblin:box('-22 -82 44 44',goblinHead),
  dino:box('-94 -106 50 48',dinosaur)
 }
};
