// 蜘蛛小队救新加坡 Team Spidey saves Singapore. Ira (purple and pink) is in the team with Spider-Man, Ghost-Spider
// and Spin. At Marina Bay the team sets off; at Gardens by the Bay Green Goblin's big robot dinosaur puts out the
// Supertrees' lights, Ira swings across them, webs the dinosaur and presses the red button to put it to sleep; up
// Marina Bay Sands she catches Green Goblin, and the story ends with fireworks over the bay. Names stay in English.
import {INK,L,scene,target,actor,box,star,tree,blob} from '../story-kit.js';

// ---- Pictures ----
const limb=(x1,y1,x2,y2,colour,w=4.5)=>`<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${INK}" stroke-width="${w+3.5}" stroke-linecap="round"/><path d="M${x1} ${y1}L${x2} ${y2}" stroke="${colour}" stroke-width="${w}" stroke-linecap="round"/>`;
const badge=c=>`<ellipse cx="0" cy="-30" rx="2.2" ry="3" fill="${c}"/><path d="M-2 -31l-4-3M-2 -29l-4 1M-2 -28l-3 3M2 -31l4-3M2 -29l4 1M2 -28l3 3" stroke="${c}" stroke-width="1" stroke-linecap="round"/>`;
const webFace=c=>`<g stroke="${c}" stroke-width=".9" fill="none" opacity=".75"><path d="M0 -67V-41M-13 -54H13M-9 -63 9 -45M9 -63-9 -45"/><circle cx="0" cy="-54" r="5.5"/><circle cx="0" cy="-54" r="9.5"/></g>`;
const lenses=`<path d="M-2 -56Q-4 -62 -10.5 -60Q-11 -53 -3 -52Z" fill="#fff" ${L} stroke-width="1.6"/><path d="M2 -56Q4 -62 10.5 -60Q11 -53 3 -52Z" fill="#fff" ${L} stroke-width="1.6"/>`;
// A spider hero standing, facing us: a big masked head with web lines and white eyes, a spider on the chest.
function hero({suit,legs,arms,mask,lines,mark,boots,back='',front=''}){
 return `${back}<rect x="-7.5" y="-20" width="6.5" height="18" rx="3" fill="${legs}" ${L}/><rect x="1" y="-20" width="6.5" height="18" rx="3" fill="${legs}" ${L}/>
 <ellipse cx="-4.5" cy="-1.6" rx="5" ry="2.6" fill="${boots}" ${L} stroke-width="1.6"/><ellipse cx="4.5" cy="-1.6" rx="5" ry="2.6" fill="${boots}" ${L} stroke-width="1.6"/>
 ${limb(-8,-37,-14,-23,arms)}${limb(8,-37,14,-23,arms)}<circle cx="-14" cy="-22" r="3" fill="${arms}" ${L} stroke-width="1.6"/><circle cx="14" cy="-22" r="3" fill="${arms}" ${L} stroke-width="1.6"/>
 <rect x="-9" y="-40" width="18" height="22" rx="6" fill="${suit}" ${L}/>${badge(mark)}
 <circle cx="0" cy="-54" r="13" fill="${mask}" ${L}/>${webFace(lines)}<circle cx="0" cy="-54" r="13" fill="none" ${L}/>${lenses}${front}`;
}
const PINK='#ff8cc6',PURPLE='#8b5cf6',RED='#e23b3b',BLUE='#2b5fd9',GOLD='#ffc233';
const spiderman=hero({suit:RED,legs:BLUE,arms:RED,mask:RED,lines:INK,mark:INK,boots:RED});
const ghost=hero({suit:'#f4f4fa',legs:'#f4f4fa',arms:'#f4f4fa',mask:'#f4f4fa',lines:'#ff5fa2',mark:INK,boots:'#5ad1c8',
 back:`<path d="M-16 -52Q-17 -73 0 -73Q17 -73 16 -52Q15 -40 9 -37H-9Q-15 -40 -16 -52Z" fill="#fff" ${L}/><path d="M-13.5 -52Q-14 -69 0 -69Q14 -69 13.5 -52" fill="none" stroke="#ff5fa2" stroke-width="2.4"/>`});
const spin=hero({suit:'#2a2a35',legs:'#2a2a35',arms:'#2a2a35',mask:'#2a2a35',lines:RED,mark:RED,boots:RED});
// Ira: purple and pink, with pink puffs either side of her mask so she is easy to spot.
const ira=hero({suit:PURPLE,legs:PURPLE,arms:PINK,mask:PURPLE,lines:PINK,mark:PINK,boots:PINK,
 back:`<circle cx="-14" cy="-61" r="5.5" fill="${PINK}" ${L}/><circle cx="14" cy="-61" r="5.5" fill="${PINK}" ${L}/>`,
 front:`<path d="M-5 -69l5 3 5-3v6l-5-3-5 3z" fill="${PINK}" ${L} stroke-width="1.4"/>`});
// Green Goblin on his glider, with a cheeky grin. The web wrap shows once he is caught.
const glider=`<path d="M-28 0Q-16 -7 0 -4Q16 -7 28 0Q16 5 0 2Q-16 5 -28 0Z" fill="#6f7f6a" ${L}/><circle cx="-14" cy="-1" r="2" fill="#ffd34d"/><circle cx="14" cy="-1" r="2" fill="#ffd34d"/><g class="jets"><path d="M-6 3q-2 7 0 10q2-3 0-10zM6 3q-2 7 0 10q2-3 0-10z" fill="#ff9a3c"/></g>`;
const goblinHead=`<path d="M-11 -52-19 -58-12 -46ZM11 -52 19 -58 12 -46Z" fill="#8ccf4d" ${L} stroke-width="1.6"/><circle cx="0" cy="-50" r="11" fill="#8ccf4d" ${L}/>
 <path d="M-12 -52Q-14 -68 0 -75Q14 -68 12 -52Q6 -60 0 -60Q-6 -60 -12 -52Z" fill="#7b4f9e" ${L}/>
 <path d="M-7.5 -53l5 1.5-.5 2.5-4.5-1.5zM7.5 -53l-5 1.5.5 2.5 4.5-1.5z" fill="#ffd34d" ${L} stroke-width="1"/>
 <path d="M-6 -45Q0 -40 6 -45Z" fill="#fff" ${L} stroke-width="1.4"/><path d="M-3 -44.5v1.6M0 -44v2M3 -44.5v1.6" stroke="${INK}" stroke-width=".8"/>`;
const goblin=`${glider}<rect x="-6" y="-18" width="5" height="14" rx="2" fill="#8ccf4d" ${L} stroke-width="1.6"/><rect x="1" y="-18" width="5" height="14" rx="2" fill="#8ccf4d" ${L} stroke-width="1.6"/>
 ${limb(-8,-36,-15,-24,'#8ccf4d')}${limb(8,-36,15,-24,'#8ccf4d')}<path d="M-9 -40H9L11 -16H-11Z" fill="#7b4f9e" ${L}/><rect x="-11" y="-24" width="22" height="4" fill="#3f2a55"/>${goblinHead}
 <g class="wrap"><path d="M-14 -42 14 -18M14 -42-14 -18M-14 -30H14M-12 -60 12 -36M12 -60-12 -36" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></g>`;
// The big robot dinosaur, side on and facing left. Three buttons on its back; webs wrap its legs and tail.
const METAL='#7d9b8a',METAL_DARK='#5c7768';
const button=(name,x,y,fill)=>`<g class="button btn-${name}" data-cue="btn-${name}"><circle cx="${x}" cy="${y}" r="5.5" fill="${fill}" ${L} stroke-width="1.6"/><circle cx="${x-1.6}" cy="${y-1.8}" r="1.6" fill="#fff" opacity=".7"/></g>`;
const wrap=(name,x,y,w,h)=>`<g class="wrap wrap-${name}"><path d="M${x} ${y}l${w} ${h/2}M${x+w} ${y}l${-w} ${h/2}M${x} ${y+h/2}l${w} ${h/2}M${x+w} ${y+h/2}l${-w} ${h/2}" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></g>`;
const dinosaur=`<path d="M38 -58Q70 -50 92 -28Q66 -34 38 -38Z" fill="${METAL}" ${L}/>
 <rect x="10" y="-38" width="15" height="36" rx="5" fill="${METAL_DARK}" ${L}/><path d="M6 -2h24v3H4z" fill="${METAL_DARK}" ${L} stroke-width="1.6"/>
 <rect x="-26" y="-38" width="15" height="36" rx="5" fill="${METAL_DARK}" ${L}/><path d="M-30 -2h24v3h-26z" fill="${METAL_DARK}" ${L} stroke-width="1.6"/>
 <path d="M-30 -84l6-12 6 12zM-16 -86l6-13 6 13zM-2 -86l6-13 6 13zM12 -84l6-12 6 12zM26 -78l6-10 6 10z" fill="#c0cfc5" ${L} stroke-width="1.6"/>
 <ellipse cx="2" cy="-58" rx="42" ry="27" fill="${METAL}" ${L}/>
 <path d="M-30 -52-40 -42" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M-30 -52-40 -42" stroke="${METAL_DARK}" stroke-width="3.5" stroke-linecap="round"/>
 <path d="M-34 -72Q-42 -100 -66 -98Q-84 -96 -84 -84V-72H-50Q-40 -72 -34 -62Z" fill="${METAL}" ${L}/>
 <path class="jaw" d="M-84 -72H-50Q-44 -66 -48 -62H-80Q-86 -64 -84 -72Z" fill="${METAL_DARK}" ${L}/>
 <path d="M-82 -72l3 4 3-4 3 4 3-4 3 4 3-4 3 4 3-4" fill="#fff" stroke="${INK}" stroke-width="1"/>
 <g class="dino-eye"><circle cx="-62" cy="-87" r="5" fill="#ff4d4d" ${L} stroke-width="1.6"/><circle cx="-63" cy="-88" r="1.6" fill="#fff"/></g>
 <path class="dino-shut" d="M-67 -87q5 3 10 0" fill="none" ${L} stroke-width="2"/>
 ${[[-20,-60],[0,-48],[20,-62],[-8,-70],[14,-44]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.6" fill="${METAL_DARK}"/>`).join('')}
 ${button('red',-6,-80,RED)}${button('blue',9,-81,BLUE)}${button('yellow',23,-77,'#ffd34d')}
 ${wrap('leg1',-27,-30,17,24)}${wrap('leg2',9,-30,17,24)}${wrap('tail',52,-50,26,18)}
 <g class="zzz" fill="${INK}" font-family="Fredoka,sans-serif" font-weight="700"><text x="-50" y="-104" font-size="10">z</text><text x="-40" y="-114" font-size="13">z</text><text x="-28" y="-126" font-size="16">Z</text></g>`;

// Singapore by day or night: the Merlion, the skyline and Marina Bay Sands across the water.
const merlion=`<g class="merlion" data-cue="merlion"><rect x="34" y="138" width="34" height="22" fill="#d9d4cc" ${L}/>
 <path d="M42 122Q28 116 30 96Q34 104 39 101Q37 112 45 116Z" fill="#f4f4f0" ${L}/>
 <path d="M44 138Q38 122 46 110Q52 102 62 104Q58 120 62 138Z" fill="#f4f4f0" ${L}/><path d="M48 132q4-3 8 0M47 124q4-3 8 0M49 116q4-3 8 0" fill="none" stroke="#c9c6bd" stroke-width="1.2"/>
 <circle cx="56" cy="100" r="11" fill="#f4f4f0" ${L}/>${[0,1,2,3,4,5,6].map(i=>{const a=-Math.PI*.9+i*Math.PI*.3;return `<circle cx="${56+Math.cos(a)*11}" cy="${100+Math.sin(a)*11}" r="3.6" fill="#f4f4f0" ${L} stroke-width="1.4"/>`;}).join('')}
 <circle cx="56" cy="100" r="9" fill="#f4f4f0"/><circle cx="58" cy="97" r="1.4" fill="${INK}"/><path d="M61 103h4" ${L} stroke-width="1.6"/>
 <path class="spout" d="M66 103Q90 94 104 124" fill="none" stroke="#9fd8ff" stroke-width="4" stroke-linecap="round"/></g>`;
const mbsSmall=`<g class="mbs" data-cue="mbs city">${[200,228,256].map(x=>`<path d="M${x} 120 ${x+2} 54H${x+14}L${x+16} 120Z" fill="#e8eef5" ${L} stroke-width="1.6"/><path d="M${x+5} 60v56M${x+11} 60v56" stroke="#b8c6d6" stroke-width="1"/>`).join('')}
 <path d="M188 52H282Q292 50 296 46L294 54H190Z" fill="#dfe8f1" ${L} stroke-width="1.6"/>${[200,215,232,250,266].map(x=>`<circle cx="${x}" cy="49" r="2.2" fill="#5fbf4a"/>`).join('')}</g>`;
const skyline=night=>`<g class="skyline" data-cue="city" fill="${night?'#3a4a80':'#c8d6e6'}">${[[96,78,16],[114,64,14],[130,84,20],[152,70,12],[166,88,22],[284,74,18],[302,86,18]].map(([x,y,w])=>`<rect x="${x}" y="${y}" width="${w}" height="${120-y}"/>`).join('')}</g>${night?`<g fill="#ffe9a0">${[[100,84],[118,72],[136,92],[156,80],[172,96],[288,82],[306,94],[118,90],[136,104]].map(([x,y])=>`<rect x="${x}" y="${y}" width="3" height="3"/>`).join('')}</g>`:''}`;
const burst=(name,x,y,colour)=>`<g transform="translate(${x} ${y})"><g class="fw fw-${name}" data-cue="fw-${name}">${Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;return `<path d="M${Math.cos(a)*6} ${Math.sin(a)*6}L${Math.cos(a)*24} ${Math.sin(a)*24}" stroke="${colour}" stroke-width="3" stroke-linecap="round"/><circle cx="${Math.cos(a)*27}" cy="${Math.sin(a)*27}" r="2" fill="${colour}"/>`;}).join('')}<circle r="4" fill="#fff"/></g></g>`;
const team=(y=192)=>`${actor('spiderman',124,y,spiderman,'team spiderman')}${actor('ghost',162,y,ghost,'team ghost')}${actor('spin',200,y,spin,'team spin')}${actor('ira',238,y,ira,'team ira')}`;
function marinaScene(night=false){
 return scene(night?'Fireworks over Marina Bay at night':'Team Spidey at Marina Bay, Singapore',`<rect width="320" height="200" fill="${night?'#1e2a5a':'#cdeefc'}"/>
 ${night?[[20,20],[60,40],[150,14],[300,24],[240,60],[90,70]].map(([x,y])=>star(x,y,.8,'#fff3a0')).join(''):`<circle cx="40" cy="34" r="14" fill="#ffd34d"/><g fill="#fff"><ellipse cx="130" cy="30" rx="18" ry="6"/><ellipse cx="140" cy="26" rx="10" ry="6"/></g>`}
 ${skyline(night)}${mbsSmall}
 <rect y="118" width="320" height="44" fill="${night?'#26407a':'#4fa3e0'}"/><path d="M10 132q8-4 16 0M120 142q8-4 16 0M220 130q8-4 16 0M260 150q8-4 16 0" fill="none" stroke="#fff" stroke-width="1.6" opacity=".6"/>
 ${merlion}<rect y="160" width="320" height="40" fill="#d9d4cc"/><path d="M0 160H320" stroke="#b8b2a8" stroke-width="2"/>
 ${night?`${burst('red',110,40,'#ff4d4d')}${burst('blue',196,30,'#59b6ff')}${burst('yellow',272,60,'#ffd34d')}<g class="sky" data-cue="sky"><rect width="320" height="1" fill="none"/></g>`:''}
 ${team()}
 ${night?target('sky',190,48,26,70):target('team',182,160,40,56)}`);
}
// Gardens by the Bay: three Supertrees with their lights, the glass domes behind.
const TREES=[[60,52],[120,38],[180,58]];
const supertree=(i,x,top)=>`<g class="supertree supertree-${i}"><path d="M${x-5} 186 ${x-3} ${top+30} ${x-26} ${top}H${x+26}L${x+3} ${top+30} ${x+5} 186Z" fill="#7a4aa0" ${L}/>
 <path d="M${x-4} ${top+60}H${x+4}M${x-4} ${top+90}H${x+4}M${x-3.5} ${top+120}H${x+3.5}M${x-14} ${top+14}H${x+14}" stroke="#b07fe0" stroke-width="1.6"/>
 <ellipse cx="${x}" cy="${top}" rx="27" ry="6" fill="#9b6ccf" ${L}/>
 <g class="lights lights-${i}">${[-20,-10,0,10,20].map((dx,j)=>`<circle cx="${x+dx}" cy="${top+(j%2?1:-1)}" r="2.4" fill="${['#ffd34d','#ff8cc6','#5ad1c8'][j%3]}"/>`).join('')}${[30,60,90].map((dy,j)=>`<circle cx="${x}" cy="${top+dy}" r="2" fill="${['#ff8cc6','#5ad1c8','#ffd34d'][j]}"/>`).join('')}</g></g>`;
const webLine=(cls,x1,y1,x2,y2)=>`<path class="web ${cls}" d="M${x1} ${y1}L${x2} ${y2}" pathLength="1" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>`;
function gardensScene(){
 return scene('Gardens by the Bay, with the Supertrees',`<rect width="320" height="200" fill="#cdeefc"/>
 <g fill="#dff3fb" ${L} stroke-width="1.6"><path d="M206 128Q232 92 262 128Z"/><path d="M246 128Q272 100 304 128Z"/></g><path d="M220 128q12-26 30-14M258 128q12-20 30-10" fill="none" stroke="#a9d6e8" stroke-width="1.2"/>
 <rect y="128" width="320" height="72" fill="#7cc867"/><path d="M0 160Q160 150 320 164V200H0Z" fill="#6cc24a"/>
 <g class="trees" data-cue="supertrees">${TREES.map(([x,top],i)=>supertree(i+1,x,top)).join('')}</g>
 ${webLine('web-1',54,166,60,54)}${webLine('web-2',98,166,120,40)}${webLine('web-3',158,166,180,60)}
 ${webLine('web-leg1',214,166,234,168)}${webLine('web-leg2',214,166,270,168)}${webLine('web-tail',214,166,318,152)}
 ${actor('dino',380,188,dinosaur,'dino')}
 ${actor('goblin',380,40,goblin,'goblin')}
 ${actor('spiderman',22,192,spiderman,'team spiderman')}${actor('ira',42,192,ira,'team ira')}
 ${TREES.map(([x,top],i)=>target('tree-'+(i+1),x,top+4,18,24)).join('')}
 ${target('leg1',234,168,14,18)}${target('leg2',270,168,14,18)}${target('tail',314,150,16,20)}
 ${target('btn-red',249,108,9,12)}${target('btn-blue',264,107,9,12)}${target('btn-yellow',278,111,9,12)}`);
}
// Marina Bay Sands up close at sunset: three towers and the SkyPark on top.
function mbsScene(){
 return scene('Marina Bay Sands at sunset',`<defs><linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7d6fd6"/><stop offset=".6" stop-color="#f59ab0"/><stop offset="1" stop-color="#ffc98a"/></linearGradient></defs>
 <rect width="320" height="200" fill="url(#dusk)"/><circle cx="290" cy="150" r="20" fill="#ffd34d" opacity=".9"/>
 <g class="tower" data-cue="tower mbs">${[70,140,210].map(x=>`<path d="M${x-4} 190 ${x} 66H${x+40}L${x+44} 190Z" fill="#e8eef5" ${L}/>${[1,2,3,4,5].map(k=>`<path d="M${x+k*7} 70V188" stroke="#b8c6d6" stroke-width="1"/>`).join('')}`).join('')}</g>
 <g class="skypark" data-cue="skypark"><path d="M50 52H276Q292 50 298 42L294 62H52Z" fill="#dfe8f1" ${L}/>${[66,90,120,150,180,210,240,262].map(x=>`<circle cx="${x}" cy="48" r="3.4" fill="#5fbf4a" ${L} stroke-width="1"/>`).join('')}</g>
 <rect y="182" width="320" height="18" fill="#4f7fc0"/>
 ${webLine('web-goblin',104,56,232,26)}
 ${actor('goblin',380,20,goblin,'goblin')}
 ${actor('spiderman',62,192,spiderman,'team spiderman')}${actor('ira',96,192,ira,'team ira')}
 ${target('tower',92,120,22,30)}${target('goblin',238,24,22,28)}`);
}
const pictures={
 singapore:box('30 40 270 130',`${mbsSmall}<rect x="30" y="118" width="270" height="44" fill="#4fa3e0"/>${merlion.replace('class="spout"','class="spout-pic"')}`),
 spider:box('-16 -16 32 30',`<ellipse cx="0" cy="2" rx="6" ry="8" fill="${INK}"/><circle cx="0" cy="-7" r="4.5" fill="${INK}"/>${[-1,1].map(s=>`<path d="M${s*5} -2l${s*9}-8M${s*5} 1l${s*10}-1M${s*5} 4l${s*9}6M${s*4} 7l${s*6}9" stroke="${INK}" stroke-width="1.8" stroke-linecap="round" fill="none"/>`).join('')}`),
 dinosaur:box('-90 -132 186 136',dinosaur.replace('class="zzz"','class="zzz" opacity="0"').replace(/class="wrap /g,'opacity="0" class="wrap ').replace('class="dino-shut"','class="dino-shut" opacity="0"')),
 light:box('-16 -26 32 32',`<path d="M-9 -12a9 9 0 1 1 18 0q0 6-5 9v4h-8v-4q-5-3-5-9z" fill="#ffe066" ${L}/><rect x="-4" y="1" width="8" height="5" rx="1" fill="#b6b3c4" ${L} stroke-width="1.4"/><path d="M-14 -20l-3-3M14 -20l3-3M0 -25v-3" stroke="${GOLD}" stroke-width="2" stroke-linecap="round"/>`),
 tree:box('-22 -62 44 64',tree(0,0,1)),
 web:box('-22 -22 44 44',`<g stroke="${INK}" stroke-width="1.4" fill="none"><path d="M0 -20V20M-20 0H20M-14 -14 14 14M14 -14-14 14"/><circle r="6"/><circle r="12"/><circle r="18"/></g>`),
 button:box('-16 -16 32 32',`<rect x="-14" y="-6" width="28" height="12" rx="3" fill="#b6b3c4" ${L}/><circle cx="0" cy="-4" r="8" fill="${RED}" ${L}/><circle cx="-2.4" cy="-6.6" r="2.2" fill="#fff" opacity=".7"/>`),
 red:box('-28 -30 56 44',blob('#ff4d4d')),
 climb:box('-20 -76 44 80',`<rect x="4" y="-76" width="18" height="80" fill="#e8eef5" ${L}/>${ira}`),
 building:box('40 36 270 160',`<g>${[70,140,210].map(x=>`<path d="M${x-4} 190 ${x} 66H${x+40}L${x+44} 190Z" fill="#e8eef5" ${L}/>`).join('')}</g><path d="M50 52H276Q292 50 298 42L294 62H52Z" fill="#dfe8f1" ${L}/>`),
 sky:box('0 0 60 40',`<rect width="60" height="40" rx="6" fill="#cdeefc"/><circle cx="14" cy="13" r="7" fill="#ffd34d"/><g fill="#fff"><ellipse cx="38" cy="20" rx="12" ry="5"/><ellipse cx="44" cy="16" rx="7" ry="5"/></g>`),
 fireworks:box('-32 -32 64 64',`<rect x="-32" y="-32" width="64" height="64" rx="8" fill="#1e2a5a"/>${burst('pic',0,0,'#ff8cc6').replace('class="fw fw-pic" ','').replace('data-cue="fw-pic"','')}`),
 safe:box('-20 -24 40 46',`<path d="M0 -22 16 -16V-2Q16 12 0 20Q-16 12 -16 -2V-16Z" fill="${PURPLE}" ${L}/><path d="M-7 -1 -1 5 9 -7" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>`)
};
const cover=()=>box('0 0 320 200',`<defs><linearGradient id="dusk-cover" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7d6fd6"/><stop offset=".7" stop-color="#f59ab0"/><stop offset="1" stop-color="#ffc98a"/></linearGradient></defs><rect width="320" height="200" fill="url(#dusk-cover)"/>${mbsSmall}<rect y="118" width="320" height="44" fill="#4f7fc0"/>${merlion}<rect y="160" width="320" height="40" fill="#d9d4cc"/>
 <g transform="translate(118 192)">${spiderman}</g><g transform="translate(152 192)">${ghost}</g><g transform="translate(186 192)">${spin}</g><g transform="translate(222 190) scale(1.1)">${ira}</g><g transform="translate(286 92) scale(.8)">${goblin.replace('class="wrap"','class="wrap" opacity="0"')}</g>`);

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
 // Ira swings from Supertree to Supertree, and each one lights up again.
 await say('tapTree',t);
 for(let i=1;i<=3;i++){
  await api.tap('tree-'+i,t,'tapTree');
  await shoot(t,'web-'+i);
  const [x,top]=TREES[i-1];move('ira',x,top+90,380);await wait(380,t);flag('lit-'+i);move('ira',x+24,192,450);await wait(450,t);
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
 for(const y of [150,110,74]){await api.tap('tower',t,'tapClimb');api.sounds.thwip();move('ira',96,y,700);move('spiderman',66,y+16,800);await wait(800,t);}
 await say('tapGoblin',t);
 await api.tap('goblin',t,'tapGoblin');
 await say('web',t);await shoot(t,'web-goblin');
 flag('caught');await say('caught',t);
 await say('oops',t);await wait(400,t);
}
async function fireworks(t){
 await api.changeScene(t,marinaScene(true));
 await say('safe',t);
 await say('tapSky',t);
 for(const colour of ['red','blue','yellow']){await api.tap('sky',t,'tapSky');api.sounds.boom();api.replay(api.stage().querySelector('.fw-'+colour),'boom');await say(colour,t);}
 flag('dance');await say('bravo',t);await wait(900,t);
}
async function play(storyApi,t){
 api=storyApi;
 await atMarinaBay(t);
 await atTheGardens(t);
 await upMarinaBaySands(t);
 await fireworks(t);
}

const css=`
.cheer .actor-spiderman .bob,.cheer .actor-ghost .bob,.cheer .actor-spin .bob,.cheer .actor-ira .bob,.dance .actor-spiderman .bob,.dance .actor-ghost .bob,.dance .actor-spin .bob,.dance .actor-ira .bob{animation:story-hop .35s ease-in-out infinite alternate}
.cheer .actor-ghost .bob,.dance .actor-ghost .bob{animation-delay:.1s}.cheer .actor-spin .bob,.dance .actor-spin .bob{animation-delay:.2s}.cheer .actor-ira .bob,.dance .actor-ira .bob{animation-delay:.3s}
.story-svg .spout{stroke-dasharray:4 5;animation:spidey-spout .6s linear infinite}
@keyframes spidey-spout{to{stroke-dashoffset:-9}}
.story-svg .actor-goblin .jets{animation:story-flicker .2s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:50% 0}
.story-svg .actor-goblin .bob{animation:spidey-hover 1s ease-in-out infinite alternate}
@keyframes spidey-hover{to{transform:translateY(-4px)}}
.stomping .actor-dino .bob{animation:spidey-stomp .35s ease-in-out infinite alternate}
@keyframes spidey-stomp{to{transform:translateY(-3px) rotate(-1.5deg)}}
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
 play,pictures,cover,css,
 avatars:{
  team:box('-44 -70 88 40',`<g transform="translate(-30 0)">${spiderman}</g><g transform="translate(-10 0)">${ghost}</g><g transform="translate(10 0)">${spin}</g><g transform="translate(30 0)">${ira}</g>`),
  ira:box('-20 -74 40 40',ira),
  goblin:box('-20 -78 40 40',goblinHead)
 }
};
