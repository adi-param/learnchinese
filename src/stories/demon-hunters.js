// KPop 猎魔女团救首尔 KPop Demon Hunters save Seoul. Huntrix (Rumi, Mira, Zoey, and Ira in pink) sing on a stage
// under N Seoul Tower, and their song makes a golden shield over the city. Out in the street the monsters crack the
// shield; Derpy the tiger and Sussie the bird come to help, the girls send two monsters away and the third sneezes
// and runs off. Back on stage everyone sings together, each tap mends a crack, and fireworks go off over Seoul.
// Kept gentle for a four-year-old: monsters pop into sparkles, nobody is hurt. Names stay in English. The songs
// are a plain 啦啦啦, not the film's.
// Tap anything for fun: the girls pose, Derpy rolls, Sussie chirps, monsters giggle, the crowd jumps, the tower blinks.
import {INK,L,scene,target,actor,box,star,blob,funActors} from '../story-kit.js';

// ---- Pictures ----
const SKIN='#f8d9bf',CHEEK='#ffb3c1',PINK='#ff8cc6',PURPLE='#8b5cf6',GOLD='#ffc233';
const limb=(x1,y1,x2,y2,colour,w=4.6)=>`<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${INK}" stroke-width="${w+3.4}" stroke-linecap="round"/><path d="M${x1} ${y1}L${x2} ${y2}" stroke="${colour}" stroke-width="${w}" stroke-linecap="round"/>`;
// A singer, chibi style, facing us, feet at (0,0). `back` is hair behind the head, `front` the fringe and clips,
// `prop` is held in her right hand (so it lifts when she poses).
function girl({hair,back='',front='',top,trim,bottom,legs,boots,prop=''}){
 return `<g class="girl"><ellipse cx="0" cy="1" rx="14" ry="3" fill="${INK}" opacity=".15"/>${back}
 <path d="M-7 -16-7.5 -3H-1.5L-1 -16ZM1 -16 1.5 -3H7.5L7 -16Z" fill="${legs}" ${L}/>
 <path d="M-9 -5H-.5V-1Q-.5 1 -3 1H-9.5Q-11 1 -10.5 -2Z" fill="${boots}" ${L}/><path d="M9 -5H.5V-1Q.5 1 3 1H9.5Q11 1 10.5 -2Z" fill="${boots}" ${L}/>
 <g class="arm arm-l">${limb(-8,-34,-14,-20,top)}<circle cx="-14.5" cy="-19" r="3" fill="${SKIN}" ${L}/></g>
 <g class="arm arm-r">${prop}${limb(8,-34,14,-20,top)}<circle cx="14.5" cy="-19" r="3" fill="${SKIN}" ${L}/></g>
 <path d="M-9 -37Q0 -40 9 -37L9 -22H-9Z" fill="${top}" ${L}/><path d="M-8 -27H8" stroke="${trim}" stroke-width="2.4"/>
 <path d="M-9 -23H9L12 -13Q0 -11 -12 -13Z" fill="${bottom}" ${L}/>
 <g class="girl-head"><circle cx="0" cy="-52" r="14" fill="${SKIN}" ${L}/>
  <g class="blink"><ellipse cx="-5" cy="-50" rx="1.9" ry="2.5" fill="${INK}"/><ellipse cx="5" cy="-50" rx="1.9" ry="2.5" fill="${INK}"/><circle cx="-4.3" cy="-51" r=".8" fill="#fff"/><circle cx="5.7" cy="-51" r=".8" fill="#fff"/></g>
  <ellipse cx="-8.5" cy="-45.5" rx="2.6" ry="1.6" fill="${CHEEK}" opacity=".85"/><ellipse cx="8.5" cy="-45.5" rx="2.6" ry="1.6" fill="${CHEEK}" opacity=".85"/>
  <path class="smile" d="M-3 -44.5Q0 -41.5 3 -44.5" fill="none" ${L}/><ellipse class="talk" opacity="0" cx="0" cy="-43.5" rx="2.2" ry="2" fill="#c2405a" ${L}/>
  <path d="M-14 -51Q-16 -68 0 -68Q16 -68 14 -51Q11 -58 4 -58Q1 -62 -3 -58Q-10 -60 -14 -51Z" fill="${hair}" ${L}/>${front}</g></g>`;
}
// Rumi: long purple braid, a glowing sword.
const rumi=girl({hair:'#3b2a6b',top:'#7b5cff',trim:GOLD,bottom:'#2b2550',legs:'#2b2550',boots:'#f2f2f8',
 back:`<path d="M-15 -52Q-16 -71 0 -71Q16 -71 15 -52L13 -42H-13Z" fill="#3b2a6b" ${L}/>${[0,1,2,3].map(i=>`<ellipse cx="${-15+i*.6}" cy="${-38+i*7}" rx="3.6" ry="4.4" fill="#3b2a6b" ${L}/>`).join('')}<circle cx="-13" cy="-12" r="2" fill="${GOLD}" ${L}/>`,
 front:`<path d="M6 -64l4 -3 1 5z" fill="${GOLD}" ${L}/>`,
 prop:`<path d="M15 -21 24 -48" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M15 -21 24 -48" stroke="#bfe6ff" stroke-width="2.6" stroke-linecap="round"/><path d="M11 -23l8 3" stroke="${GOLD}" stroke-width="2.4" stroke-linecap="round"/>`});
// Mira: tall, long dark red hair, a spear with a curved blade.
const mira=`<g transform="scale(1.07)">${girl({hair:'#6b1f3a',top:'#e0405e',trim:INK,bottom:'#26262f',legs:'#26262f',boots:'#26262f',
 back:`<path d="M-15 -52Q-17 -72 0 -71Q17 -72 15 -52L17 -30Q8 -32 0 -34Q-8 -32 -17 -30Z" fill="#6b1f3a" ${L}/>`,
 front:`<path d="M-14 -51Q-12 -60 -6 -62" fill="none" stroke="#b8324f" stroke-width="1.6"/>`,
 prop:`<path d="M13 -4 19 -62" stroke="${INK}" stroke-width="4.4" stroke-linecap="round"/><path d="M13 -4 19 -62" stroke="#9a5b34" stroke-width="2" stroke-linecap="round"/><path d="M19 -62Q14 -72 21 -78Q26 -70 21 -62Z" fill="#dfe8f1" ${L}/>`})}</g>`;
// Zoey: two high buns and a fringe, a handful of stars.
const zoey=girl({hair:'#1f1b2e',top:'#3fb6d9',trim:'#fff',bottom:'#f7f7fb',legs:'#3fb6d9',boots:'#fff',
 back:`<circle cx="-11" cy="-66" r="6" fill="#1f1b2e" ${L}/><circle cx="11" cy="-66" r="6" fill="#1f1b2e" ${L}/><path d="M-15 -52Q-16 -70 0 -70Q16 -70 15 -52L14 -44H-14Z" fill="#1f1b2e" ${L}/>`,
 front:`<path d="M-8 -60V-55M-3 -61V-55M2 -61V-55M7 -60V-55" stroke="#3a3550" stroke-width="1.2"/>`,
 prop:`${star(18,-24,1.1,'#ffd34d')}${star(22,-17,.8,PINK)}`});
// Ira: pink and purple, hair puffs with pink bows, a star wand.
const ira=girl({hair:'#2a1f1a',top:PINK,trim:'#fff',bottom:PURPLE,legs:PURPLE,boots:PINK,
 back:`<circle cx="-15" cy="-58" r="6.2" fill="#2a1f1a" ${L}/><circle cx="15" cy="-58" r="6.2" fill="#2a1f1a" ${L}/><path d="M-15 -52Q-16 -70 0 -70Q16 -70 15 -52L14 -46H-14Z" fill="#2a1f1a" ${L}/>`,
 front:`<path d="M0 -67-8 -72V-62ZM0 -67 8 -72V-62Z" fill="${PINK}" ${L}/><circle cx="0" cy="-67" r="2.4" fill="${PINK}" ${L}/>`,
 prop:`<path d="M15 -20 21 -40" stroke="${INK}" stroke-width="3.6" stroke-linecap="round"/><path d="M15 -20 21 -40" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>${star(21,-43,1.4,PINK)}`});
const GIRLS={rumi,mira,zoey,ira};
// A little monster: a round blue blob with swirls, yellow eyes, a toothy grin and a black gat hat.
const demon=`<ellipse cx="0" cy="1" rx="14" ry="3" fill="${INK}" opacity=".15"/>
 <path d="M-15 -14-21 -19M15 -14 21 -19" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M-15 -14-21 -19M15 -14 21 -19" stroke="#4f7bff" stroke-width="2.6" stroke-linecap="round"/>
 <path d="M-15 0Q-19 -22 -10 -32Q0 -39 10 -32Q19 -22 15 0Q11 -5 7 0Q3 -5 0 0Q-3 -5 -7 0Q-11 -5 -15 0Z" fill="#4f7bff" ${L}/>
 <path d="M-10 -8q4-5 8 0t8 0M6 -30q4 2 4 7" fill="none" stroke="#a78bff" stroke-width="1.6" stroke-linecap="round"/>
 <g class="blink"><ellipse cx="-5" cy="-24" rx="3.6" ry="4.2" fill="#ffe066" ${L}/><ellipse cx="5" cy="-24" rx="3.6" ry="4.2" fill="#ffe066" ${L}/><circle cx="-4.4" cy="-23" r="1.7" fill="${INK}"/><circle cx="5.6" cy="-23" r="1.7" fill="${INK}"/></g>
 <path d="M-7 -16Q0 -10 7 -16Z" fill="#fff" ${L}/><path d="M-3 -15.4v2M0 -14.6v2.2M3 -15.4v2" stroke="${INK}" stroke-width=".8"/>
 <ellipse cx="0" cy="-35" rx="15" ry="3.4" fill="#2a2640" ${L}/><path d="M-6 -36V-45Q0 -47 6 -45V-36Z" fill="#2a2640" ${L}/>`;
// Derpy, the big blue tiger with the goofy grin, sitting.
const TIGER='#5c8fe6',STRIPE='#2c4d9a',CREAM='#e4edff';
const derpy=`<ellipse cx="0" cy="1" rx="22" ry="4" fill="${INK}" opacity=".15"/>
 <g class="tail"><path d="M14 -6Q32 -8 29 -25Q27 -33 21 -29" fill="none" stroke="${INK}" stroke-width="7.4" stroke-linecap="round"/><path d="M14 -6Q32 -8 29 -25Q27 -33 21 -29" fill="none" stroke="${TIGER}" stroke-width="4" stroke-linecap="round"/></g>
 <path d="M-16 0Q-20 -26 -10 -32H10Q20 -26 16 0Z" fill="${TIGER}" ${L}/><ellipse cx="0" cy="-13" rx="7" ry="9" fill="${CREAM}"/>
 <path d="M-13 -20l5 2M13 -20l-5 2M-15 -11l5 1M15 -11l-5 1" stroke="${STRIPE}" stroke-width="2" stroke-linecap="round"/>
 <ellipse cx="-8" cy="-1.5" rx="6" ry="3.4" fill="${TIGER}" ${L}/><ellipse cx="8" cy="-1.5" rx="6" ry="3.4" fill="${TIGER}" ${L}/>
 <circle cx="-13" cy="-50" r="5" fill="${TIGER}" ${L}/><circle cx="13" cy="-50" r="5" fill="${TIGER}" ${L}/><circle cx="-13" cy="-50" r="2.2" fill="${CREAM}"/><circle cx="13" cy="-50" r="2.2" fill="${CREAM}"/>
 <ellipse cx="0" cy="-40" rx="17" ry="14" fill="${TIGER}" ${L}/>
 <path d="M-4 -53l4 5 4-5M-17 -42l5 1M-17 -36h5M17 -42l-5 1M17 -36h-5" fill="none" stroke="${STRIPE}" stroke-width="2" stroke-linecap="round"/>
 <ellipse cx="0" cy="-34" rx="8.5" ry="6" fill="${CREAM}"/>
 <g class="blink"><circle cx="-6" cy="-43" r="4" fill="#fff" ${L}/><circle cx="6.5" cy="-44" r="4.8" fill="#fff" ${L}/><circle cx="-5" cy="-42" r="1.8" fill="${INK}"/><circle cx="7.5" cy="-43" r="2" fill="${INK}"/></g>
 <path d="M-2.4 -38h4.8l-2.4 2.4z" fill="${INK}"/><path d="M-6 -34Q0 -27 6 -34Z" fill="#fff" ${L}/><path d="M1 -31q2.2 5 4.4 0" fill="#ff8ca8" stroke="${INK}" stroke-width="1"/>`;
// Sussie, the magpie in a little gat hat, facing left.
const sussie=`<path d="M8 -9 19 -4 17 -11Z" fill="${INK}"/><ellipse cx="0" cy="-9" rx="10" ry="8" fill="#fff" ${L}/>
 <path d="M-2 -16Q8 -18 10 -8Q6 -4 0 -6Z" fill="#2b5fd9" ${L}/><circle cx="-6" cy="-18" r="6.5" fill="#2a2640" ${L}/>
 <circle class="blink" cx="-8" cy="-19" r="1.6" fill="#fff"/><path d="M-12 -18.5l-5 1.5 5 1.5z" fill="#ffc233" ${L}/>
 <ellipse cx="-6" cy="-24" rx="7" ry="1.6" fill="#2a2640" ${L}/><path d="M-9 -24V-30H-3V-24" fill="#2a2640" ${L}/>
 <path d="M-2 -2v2M2 -2v2" stroke="#ffc233" stroke-width="1.6" stroke-linecap="round"/>`;

// Seoul at night: stars, N Seoul Tower on its hill, lit-up buildings, and the golden shield over everything.
const sky=(id,stops)=>`<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${stops.map(([o,c])=>`<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient></defs>`;
const night=id=>`${sky(id,[[0,'#17123d'],[1,'#4a2c7a']])}<rect width="320" height="200" fill="url(#${id})"/>
 ${[[20,18],[70,40],[118,12],[196,26],[230,8],[300,30],[150,60],[40,70]].map(([x,y],i)=>`<g class="twinkle" style="--d:${i*.3}s">${star(x,y,.7,'#fff3a0')}</g>`).join('')}`;
const tower=(x,base)=>`<g class="tower" data-cue="tower" data-fun="tower"><path d="M${x-3} ${base}L${x-2} ${base-58}H${x+2}L${x+3} ${base}Z" fill="#e8eef5" ${L}/>
 <path d="M${x-10} ${base-58}H${x+10}L${x+7} ${base-50}H${x-7}Z" fill="#cfd8e8" ${L}/><rect x="${x-7}" y="${base-65}" width="14" height="7" rx="2" fill="#e8eef5" ${L}/>
 <path class="tower-ring" d="M${x-6} ${base-54}H${x+6}" stroke="#ff8cc6" stroke-width="2"/>
 <path d="M${x} ${base-65}V${base-86}" stroke="${INK}" stroke-width="3"/><path d="M${x} ${base-65}V${base-86}" stroke="#e8eef5" stroke-width="1.2"/>
 <circle class="tower-light" cx="${x}" cy="${base-87}" r="2.4" fill="#ff5f8f"/></g>`;
const windows=(x,y,w,h)=>{let out='';for(let yy=y+5;yy<y+h-4;yy+=7)for(let xx=x+3;xx<x+w-3;xx+=6)out+=`<rect x="${xx}" y="${yy}" width="3" height="3.4" fill="${(xx*7+yy*3)%5<3?'#ffe9a0':'#3b4a80'}"/>`;return out;};
const skyline=(ground,list)=>`<g class="skyline" data-cue="city">${list.map(([x,top,w])=>`<rect x="${x}" y="${top}" width="${w}" height="${ground-top}" fill="#34407a" stroke="#202a55" stroke-width="1"/>${windows(x,top,w,ground-top)}`).join('')}</g>`;
// The shield is a golden arch from edge to edge; three cracks sit on it, a quarter, half and three quarters along.
function shield(edge,peak){
 const at=t=>[(1-t)**2*-10+2*(1-t)*t*160+t*t*330,(1-t)**2*edge+2*(1-t)*t*peak+t*t*edge];
 const arch=`M-10 ${edge}Q160 ${peak} 330 ${edge}`;
 return `<g class="shield" data-cue="shield"><path d="${arch}V200H-10Z" fill="#ffd34d" opacity=".1"/><path class="shield-line" d="${arch}" fill="none" stroke="#ffd34d" stroke-width="4.5" stroke-linecap="round"/><path d="${arch}" fill="none" stroke="#fff3a0" stroke-width="1.4" opacity=".8"/></g>
 ${[.25,.5,.75].map((t,i)=>{const [x,y]=at(t).map(v=>+v.toFixed(1));return `<g class="crack crack-${i+1}" data-cue="crack" opacity="0"><circle cx="${x}" cy="${y}" r="7" fill="#7b3cff" opacity=".35"/><path d="M${x-5} ${y-10}l5 7-4 3 6 9" fill="none" stroke="#2a1660" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g>
  <g transform="translate(${x} ${y})"><g class="mend mend-${i+1}" opacity="0">${[0,1,2,3,4,5].map(k=>{const a=k*Math.PI/3;return `<path d="M${(Math.cos(a)*4).toFixed(1)} ${(Math.sin(a)*4).toFixed(1)}L${(Math.cos(a)*12).toFixed(1)} ${(Math.sin(a)*12).toFixed(1)}" stroke="#fff3a0" stroke-width="2.4" stroke-linecap="round"/>`;}).join('')}</g></g>`;}).join('')}`;
}
const burst=(name,x,y,colour)=>`<g transform="translate(${x} ${y})"><g class="fw fw-${name}" data-cue="fw-${name}">${Array.from({length:14},(_,i)=>{const a=i*Math.PI/7;return `<path d="M${(Math.cos(a)*6).toFixed(1)} ${(Math.sin(a)*6).toFixed(1)}L${(Math.cos(a)*24).toFixed(1)} ${(Math.sin(a)*24).toFixed(1)}" stroke="${colour}" stroke-width="3" stroke-linecap="round"/><circle cx="${(Math.cos(a)*27).toFixed(1)}" cy="${(Math.sin(a)*27).toFixed(1)}" r="2.2" fill="${colour}"/>`;}).join('')}<circle r="4" fill="#fff"/></g></g>`;
const stage=`<g class="stage" data-cue="stage"><path d="M40 148H280L292 160H28Z" fill="#6a55c8" ${L}/><rect x="28" y="160" width="264" height="14" fill="#3a2f6e" ${L}/>
 ${[50,90,130,190,230,270].map((x,i)=>`<circle class="footlight" style="--d:${i*.2}s" cx="${x}" cy="167" r="2.6" fill="${i%2?PINK:'#ffd34d'}"/>`).join('')}
 <circle cx="160" cy="167" r="5" fill="#ffd34d" ${L}/>${star(160,167,.9,'#fff')}
 <rect x="30" y="118" width="18" height="30" rx="2" fill="#2a2640" ${L}/><circle cx="39" cy="128" r="5" fill="#4a4470"/><circle cx="39" cy="141" r="3.4" fill="#4a4470"/>
 <rect x="272" y="118" width="18" height="30" rx="2" fill="#2a2640" ${L}/><circle cx="281" cy="128" r="5" fill="#4a4470"/><circle cx="281" cy="141" r="3.4" fill="#4a4470"/></g>`;
const beams=`<g opacity=".22"><path class="beam beam-l" d="M70 0 40 150H110Z" fill="#ff8cc6"/><path class="beam beam-r" d="M250 0 210 150H280Z" fill="#8fd0ff"/><path class="beam beam-m" d="M160 0 125 150H195Z" fill="#fff3a0"/></g>`;
const crowd=`<g class="crowd" data-fun="crowd">${Array.from({length:12},(_,i)=>{const x=8+i*27.5,y=190+(i%2)*5,c=[PINK,PURPLE,'#ffd34d','#5ad1c8'][i%4];return `<g class="stick" style="--d:${(i%4)*.15}s"><path d="M${x+7} ${y-4}l5 -16" stroke="${INK}" stroke-width="4.4" stroke-linecap="round"/><path d="M${x+7} ${y-4}l5 -16" stroke="${c}" stroke-width="2.6" stroke-linecap="round"/></g><circle cx="${x}" cy="${y}" r="9" fill="#2a2640"/><path d="M${x-13} 200Q${x} ${y+6} ${x+13} 200Z" fill="#2a2640"/>`;}).join('')}</g>`;
const notes=`<g class="notes" fill="#fff3a0" stroke="${INK}" stroke-width="1">${[[118,88],[150,80],[184,90],[214,84]].map(([x,y],i)=>`<g class="note" style="--d:${i*.25}s"><ellipse cx="${x}" cy="${y}" rx="3.4" ry="2.6"/><path d="M${x+3} ${y}V${y-11}l5 2" fill="none" stroke="#fff3a0" stroke-width="1.6"/></g>`).join('')}</g>`;
const girlActors=(xs,y,s=1)=>Object.entries(GIRLS).map(([name,body],i)=>actor(name,xs[i],y,s===1?body:`<g transform="scale(${s})">${body}</g>`,'team '+name)).join('');
const lively=svg=>funActors(svg,{rumi:'girl',mira:'girl',zoey:'girl',ira:'girl',derpy:'derpy',sussie:'sussie',demon1:'demon',demon2:'demon',demon3:'demon'});
const STAGE_SKYLINE=[[0,96,22],[24,84,18],[60,100,24],[88,90,16],[108,104,20],[176,98,18],[198,88,22],[224,102,18],[292,92,28]];
// The concert: the city behind, the stage with its lights, the girls, and the crowd's glow sticks. At the end the
// cracks are there to mend, and fireworks wait in the sky.
function stageScene(finale=false){
 return lively(scene(finale?'Huntrix singing on stage under the golden shield':'Huntrix on stage in Seoul at night',`${night('k-night')}
 <circle cx="44" cy="30" r="11" fill="#fff3c4"/><circle cx="49" cy="27" r="9" fill="#1b1542"/>
 <path d="M190 122Q262 72 334 112V130H190Z" fill="#2d3b6e"/>${tower(262,94)}
 ${skyline(132,STAGE_SKYLINE)}
 ${shield(132,-30)}
 ${beams}${stage}
 ${girlActors([112,144,176,208],156)}
 ${finale?`${actor('derpy',254,156,`<g transform="scale(.8)">${derpy}</g>`)}${actor('sussie',38,118,sussie)}`:''}
 ${notes}${crowd}
 ${finale?`${burst('pink',84,40,PINK)}${burst('purple',236,34,'#a78bff')}${burst('gold',160,26,'#ffd34d')}<g class="sky" data-cue="sky"><rect width="1" height="1" fill="none"/></g>`:''}
 ${finale?`${target('stage',160,167,11,22)}${target('sky',160,34,24,60)}`:target('team',160,118,46,58)}`));
}
// A street in the city: shops with glowing signs, lanterns, the cracked shield high above.
const zapLine=(cls,x1,y1,x2,y2,colour)=>`<path class="zap ${cls}" d="M${x1} ${y1}L${x2} ${y2}" pathLength="1" stroke="${colour}" stroke-width="3" stroke-linecap="round"/>`;
const sparkles=(name,x,y)=>`<g transform="translate(${x} ${y})"><g class="pop pop-${name}">${[0,1,2,3,4,5,6,7].map(k=>{const a=k*Math.PI/4;return star(+(Math.cos(a)*14).toFixed(1),+(Math.sin(a)*14).toFixed(1),.8,k%2?PINK:'#ffd34d');}).join('')}</g></g>`;
const DEMONS=[[210,188],[250,188],[292,188]];
function streetScene(){
 return lively(scene('A street in Seoul at night',`${night('k-street')}
 <path d="M-10 96Q40 66 100 92V110H-10Z" fill="#2d3b6e"/>${tower(44,84).replace('class="tower"','class="tower" transform="translate(44 84) scale(.6) translate(-44 -84)"')}
 ${shield(92,-30)}
 <g class="shops">${[[0,84,64,'#ff8cc6'],[64,96,56,'#5ad1c8'],[120,78,70,'#ffd34d'],[190,92,60,'#a78bff'],[250,82,70,'#ff8cc6']].map(([x,top,w,sign])=>`<rect x="${x}" y="${top}" width="${w}" height="${160-top}" fill="#3a3f78" stroke="#202a55" stroke-width="1.4"/>${windows(x,top,w,128-top)}<rect x="${x+8}" y="128" width="${w-16}" height="10" rx="3" fill="${sign}" ${L}/><rect x="${x+10}" y="142" width="${w-20}" height="18" fill="#ffe9a0" opacity=".7"/>`).join('')}</g>
 <path d="M0 118Q80 128 160 118T320 118" fill="none" stroke="${INK}" stroke-width="1"/>${[20,60,100,140,180,220,260,300].map((x,i)=>`<circle class="lantern" style="--d:${i*.2}s" cx="${x}" cy="${121+Math.sin(x/26)*3}" r="3.4" fill="${i%2?'#ff5f5f':'#ffd34d'}" ${L}/>`).join('')}
 <rect y="160" width="320" height="40" fill="#3a3550"/><path d="M0 160H320" stroke="#5a5478" stroke-width="2"/>${[0,1,2,3,4].map(i=>`<rect x="${40+i*20}" y="176" width="10" height="20" fill="#5a5478"/>`).join('')}
 ${girlActors([26,56,86,116],186)}
 <g class="demons" data-cue="demons">${DEMONS.map(([x,y],i)=>actor('demon'+(i+1),x,y,`<g class="demon">${demon}</g>`,'demon'+(i+1))).join('')}</g>
 ${actor('derpy',160,-80,derpy)}${actor('sussie',360,40,sussie)}
 ${zapLine('zap-1',121,146,206,168,PINK)}${zapLine('zap-2',50,140,246,168,'#bfe6ff')}
 ${sparkles(1,210,168)}${sparkles(2,250,168)}
 ${target('derpy',160,164,22)}${DEMONS.map(([x,y],i)=>target('demon-'+(i+1),x,y-20,16)).join('')}`));
}
const mic=`<rect x="-3" y="-4" width="6" height="22" rx="3" fill="#4a4470" ${L}/><circle cx="0" cy="-10" r="8" fill="#dfe8f1" ${L}/><path d="M-6 -12h12M-6 -8h12" stroke="#a9b6c8" stroke-width="1.2"/>`;
const pictures={
 seoul:box('170 0 150 140',`${night('p-seoul')}<path d="M190 122Q262 72 334 112V130H190Z" fill="#2d3b6e"/>${tower(262,94)}${skyline(134,STAGE_SKYLINE)}`),
 tower:box('236 0 52 98',`<rect x="236" y="0" width="52" height="98" fill="#2a2a66"/>${tower(262,96)}`),
 sing:box('-20 -22 40 44',`${mic}${star(12,-14,1,'#ffd34d')}`),
 gold:box('-28 -30 56 44',blob('#ffc233')),
 monster:box('-24 -50 48 54',demon),
 tiger:box('-34 -60 68 64',derpy),
 bird:box('-20 -32 42 34',sussie),
 stage:box('24 70 272 108',`<rect x="24" y="70" width="272" height="108" fill="#2a2266"/>${beams}${stage}<g transform="translate(160 148) scale(2.2)">${mic}</g>`),
 together:box('-62 -78 124 82',Object.values(GIRLS).map((g,i)=>`<g transform="translate(${-42+i*28} 0)">${g}</g>`).join('')),
 pink:box('-28 -30 56 44',blob(PINK)),
 purple:box('-28 -30 56 44',blob(PURPLE))
};
const cover=()=>box('0 0 320 200',`${night('c-night')}<path d="M190 122Q262 72 334 112V130H190Z" fill="#2d3b6e"/>${tower(262,94)}${skyline(132,STAGE_SKYLINE)}${shield(132,-30)}${beams}${stage}
 ${burst('c1',70,40,PINK).replace('class="fw fw-c1" ','').replace(' data-cue="fw-c1"','')}${burst('c2',228,30,'#ffd34d').replace('class="fw fw-c2" ','').replace(' data-cue="fw-c2"','')}
 ${Object.values(GIRLS).map((g,i)=>`<g transform="translate(${100+i*38} 156) scale(1.25)">${g}</g>`).join('')}
 <g transform="translate(262 156) scale(.75)">${derpy}</g><g transform="translate(40 118)">${sussie}</g>${crowd}`);

// ---- The story ----
let api;
const say=(key,t)=>api.say(key,t),wait=(ms,t)=>api.wait(ms,t),flag=(name,on)=>api.flag(name,on),move=(...args)=>api.move(...args);
const find=selector=>api.stage().querySelector(selector);

async function onStage(t){
 await wait(400,t);
 await say('here',t);
 await say('tower',t);
 await say('team',t);
 await say('hunters',t);
 await say('singers',t);
 await say('shield',t);
 // Each song makes the shield shine brighter.
 await say('tapSing',t);
 for(let i=1;i<=3;i++){await api.tap('team',t,'tapSing');flag('singing');api.chime('ding');flag('glow-'+i);await say('lala',t);flag('singing',false);}
 flag('cheer');api.effect('twinkle');await say('sparkle',t);await wait(500,t);flag('cheer',false);
}
async function inTheStreet(t){
 await api.changeScene(t,streetScene());api.ambient(null);
 flag('monsters');api.voice('giggle');await wait(900,t);
 await say('oh',t);
 api.sounds.crash();flag('cracked');await say('crack',t);
 // Derpy jumps down from the rooftops and Sussie flies in to sit on his head.
 move('derpy',160,188,700);await wait(700,t);api.sounds.knock();
 move('sussie',165,135,1200);await wait(1200,t);api.voice('chirp');
 await say('helpers',t);
 await say('tapDerpy',t);
 await api.tap('derpy',t,'tapDerpy');
 api.replay(find('.actor-derpy .cuebox'),'roll');api.voice('roar');await wait(800,t);
 await say('there',t);
 // Two monsters pop into sparkles; the third sneezes and runs away.
 await say('tapDemon',t);
 for(const i of [1,2]){
  await api.tap('demon-'+i,t,'tapDemon');
  api.sounds.magic();api.replay(find('.zap-'+i),'shot');await wait(400,t);
  flag('poof-'+i);api.replay(find('.pop-'+i),'boom');api.effect('pop');
  await say('goAway',t);
 }
 await api.tap('demon-3',t,'tapDemon');
 api.replay(find('.actor-demon3 .cuebox'),'sneeze');api.voice('giggle');await wait(700,t);
 move('demon3',380,188,1000);await say('silly',t);
}
async function backOnStage(t){
 await api.changeScene(t,stageScene(true),s=>s.classList.add('cracked'));api.ambient('music');
 await say('stage',t);
 await say('together',t);
 // Each song mends one crack.
 await say('tapStage',t);
 for(let i=1;i<=3;i++){await api.tap('stage',t,'tapStage');flag('singing');flag('fix-'+i);api.chime('ding');await say('lala',t);flag('singing',false);}
 flag('glow-3');api.effect('twinkle');await say('fixed',t);
 await say('tapSky',t);
 for(const colour of ['pink','purple','gold']){await api.tap('sky',t,'tapSky');api.sounds.boom();api.replay(find('.fw-'+colour),'boom');await say(colour,t);}
 flag('dance');await say('bravo',t);await wait(900,t);
}
async function play(storyApi,t){
 api=storyApi;
 api.ambient('music');
 await onStage(t);
 await inTheStreet(t);
 await backOnStage(t);
}
// Tap anything: the girls strike a pose, Derpy rolls, Sussie chirps, monsters giggle, the crowd jumps, the tower blinks.
function fun(name,el,storyApi){
 const a=storyApi;
 if(name==='girl'){a.replay(el.querySelector('.cuebox'),'pose');a.effect('twinkle');return true;}
 if(name==='derpy'){a.replay(el.querySelector('.cuebox'),'roll');a.voice('roar');return true;}
 if(name==='sussie'){a.replay(el.querySelector('.cuebox'),'happy-hop');a.voice('chirp');return true;}
 if(name==='demon'){a.replay(el.querySelector('.cuebox'),'sneeze');a.voice('giggle');return true;}
 if(name==='crowd'){a.replay(el,'jump');a.effect('pop');return true;}
 if(name==='tower'){a.replay(el,'flash');a.effect('twinkle');return true;}
}

const each=(names,rule)=>names.map(rule).join(',');
const NAMES=Object.keys(GIRLS);
const css=`
.story-svg .arm{transform-box:fill-box;transition:transform .25s var(--spring)}
.story-svg .arm-l{transform-origin:100% 0}.story-svg .arm-r{transform-origin:0 0}
.cheer .arm-l,.dance .arm-l,.singing .arm-l,.cuebox.pose .arm-l{transform:rotate(120deg)}
.cheer .arm-r,.dance .arm-r,.singing .arm-r,.cuebox.pose .arm-r{transform:rotate(-120deg)}
.story-svg .cuebox.pose{animation:story-hop .25s ease-in-out 4 alternate}
.story-svg .blink{transform-box:fill-box;transform-origin:center;animation:kdh-blink 4.4s infinite}
.story-svg .actor-mira .blink{animation-delay:1.1s}.story-svg .actor-zoey .blink{animation-delay:2.2s}.story-svg .actor-ira .blink{animation-delay:3.3s}.story-svg .actor-derpy .blink{animation-delay:.6s}
@keyframes kdh-blink{0%,94%,100%{transform:none}97%{transform:scaleY(.15)}}
.story-svg .talk{opacity:0;transform-box:fill-box;transform-origin:center}
[data-talking="team"] .girl .talk,[data-talking="rumi"] .actor-rumi .talk,[data-talking="ira"] .actor-ira .talk{opacity:1;animation:kdh-talk .2s ease-in-out infinite alternate}
[data-talking="team"] .girl .smile,[data-talking="rumi"] .actor-rumi .smile,[data-talking="ira"] .actor-ira .smile{opacity:0}
@keyframes kdh-talk{to{transform:scaleY(.35)}}
${each(NAMES,n=>`.singing .actor-${n} .bob,.cheer .actor-${n} .bob,.dance .actor-${n} .bob`)}{animation:story-hop .35s ease-in-out infinite alternate}
${NAMES.map((n,i)=>`.story-svg .actor-${n} .bob{animation-delay:${(i*.12).toFixed(2)}s}`).join('')}
.dance .actor-derpy .bob,.dance .actor-sussie .bob{animation:story-hop .4s ease-in-out infinite alternate}
.story-svg .note{opacity:0;transform-box:fill-box}
.singing .note{animation:kdh-note 1.3s var(--d) ease-out infinite}
@keyframes kdh-note{0%{opacity:0;transform:none}20%{opacity:1}100%{opacity:0;transform:translateY(-34px) rotate(14deg)}}
.story-svg .twinkle{animation:kdh-twinkle 2s var(--d) ease-in-out infinite}
.story-svg .footlight,.story-svg .lantern{animation:kdh-twinkle 1.6s var(--d) ease-in-out infinite}
@keyframes kdh-twinkle{50%{opacity:.3}}
.story-svg .beam{transform-box:fill-box;transform-origin:50% 0;animation:kdh-beam 3s ease-in-out infinite alternate}
.story-svg .beam-r{animation-delay:-1.5s}.story-svg .beam-m{animation-duration:4s}
@keyframes kdh-beam{from{transform:rotate(-8deg)}to{transform:rotate(8deg)}}
.story-svg .stick{transform-box:fill-box;transform-origin:0 100%;animation:kdh-sway 1.1s var(--d) ease-in-out infinite alternate}
@keyframes kdh-sway{from{transform:rotate(-14deg)}to{transform:rotate(14deg)}}
.story-svg .crowd.jump{animation:kdh-jump .25s ease-in-out 4 alternate}
@keyframes kdh-jump{to{transform:translateY(-4px)}}
.story-svg .tower-light{animation:kdh-twinkle 1.2s ease-in-out infinite}
.story-svg .tower.flash .tower-ring{animation:kdh-flash .2s ease-in-out 6 alternate}
@keyframes kdh-flash{to{stroke:#fff3a0;opacity:.3}}
.story-svg .shield{opacity:.35;transition:opacity .6s}
.glow-1 .shield{opacity:.55}.glow-2 .shield{opacity:.8}
.story-svg .crack{opacity:0;transition:opacity .3s}
.cracked .shield{opacity:.45}
.cracked .crack{opacity:1;animation:kdh-crack .8s ease-in-out infinite alternate}
@keyframes kdh-crack{to{opacity:.55}}
.fix-1 .crack-1,.fix-2 .crack-2,.fix-3 .crack-3{visibility:hidden}
.glow-3 .shield,.cracked.glow-3 .shield{opacity:1}
.glow-3 .shield-line{animation:kdh-shimmer 1.4s ease-in-out infinite alternate}
@keyframes kdh-shimmer{to{stroke:#fff3a0}}
.story-svg .mend{opacity:0;transform-box:fill-box;transform-origin:center}
.fix-1 .mend-1,.fix-2 .mend-2,.fix-3 .mend-3{animation:kdh-mend 1s ease-out}
@keyframes kdh-mend{0%{opacity:1;transform:scale(.3)}100%{opacity:0;transform:scale(1.6)}}
.story-svg .demon{opacity:0;transition:opacity .5s;transform-box:fill-box;transform-origin:50% 100%}
.monsters .demon{opacity:1;animation:kdh-wobble .9s ease-in-out infinite alternate}
.actor-demon2 .demon{animation-delay:.3s}.actor-demon3 .demon{animation-delay:.6s}
@keyframes kdh-wobble{from{transform:rotate(-4deg)}to{transform:rotate(4deg) scaleY(1.04)}}
.poof-1 .actor-demon1 .demon,.poof-2 .actor-demon2 .demon{opacity:0;transition:opacity .25s}
.story-svg .zap{opacity:0;stroke-dasharray:1;stroke-dashoffset:1}
.story-svg .zap.shot{animation:kdh-zap .8s ease-out forwards}
@keyframes kdh-zap{0%{opacity:1;stroke-dashoffset:1}40%{opacity:1;stroke-dashoffset:0}80%{opacity:1;stroke-dashoffset:0}100%{opacity:0;stroke-dashoffset:0}}
.story-svg .pop{opacity:0;transform-box:fill-box;transform-origin:center}
.story-svg .pop.boom{animation:kdh-pop .9s ease-out}
@keyframes kdh-pop{0%{opacity:1;transform:scale(.2) rotate(0)}100%{opacity:0;transform:scale(1.5) rotate(40deg)}}
.story-svg .tail{transform-box:fill-box;transform-origin:0 100%;animation:kdh-wag 1s ease-in-out infinite alternate}
@keyframes kdh-wag{to{transform:rotate(10deg)}}
.story-svg .cuebox.roll{transform-box:fill-box;transform-origin:50% 100%;animation:kdh-roll .8s ease-in-out}
@keyframes kdh-roll{30%{transform:rotate(-14deg) translateY(-6px)}60%{transform:rotate(10deg)}}
.story-svg .fw{opacity:0;transform-box:fill-box;transform-origin:center}
.story-svg .fw.boom{animation:kdh-boom 1.6s ease-out forwards}
@keyframes kdh-boom{0%{opacity:1;transform:scale(.1)}30%{opacity:1;transform:scale(1)}100%{opacity:.85;transform:scale(1.1)}}
`;

export default {
 firstScene:()=>stageScene(),
 scenes:()=>[stageScene(),streetScene(),stageScene(true)],
 play,pictures,cover,css,fun,
 avatars:{
  team:box('-63 -78 126 48',Object.values(GIRLS).map((g,i)=>`<g transform="translate(${-42+i*28} 0)">${g}</g>`).join('')),
  rumi:box('-20 -74 40 40',rumi),
  ira:box('-22 -76 44 42',ira),
  demon:box('-20 -48 40 40',demon),
  derpy:box('-20 -58 40 40',derpy),
  sussie:box('-19 -33 40 36',sussie)
 }
};
