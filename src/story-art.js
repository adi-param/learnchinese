// Pictures for the stories, in the same flat style as the word pictures: ink outlines, warm fills.
// The scene is one SVG in a 320×200 box. Characters are drawn around their feet (0,0), so moving one is a
// single translate. Anything a line of the story names carries data-cue, so it can light up as it is said.
const INK='#1f1b3a';
const L=`stroke="${INK}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`;
const STRAW='#f4c95d',STRAW_DARK='#cf9a2e',DOOR='#c98b4a',WOLF='#9599ad',WOLF_LIGHT='#d9dbe5';
export const PIGS={red:['#ff8b84','#f0625a'],yellow:['#ffd166','#efad2f'],white:['#fffaf3','#f6c9c0']};

// A pig standing, facing us. `head` alone is used in the window and on the word cards.
const pigHead=(fill,dark)=>`<path d="M-11.5 -36Q-17 -46 -12.5 -47.5Q-7 -46.5 -4 -41Z" fill="${fill}" ${L}/><path d="M11.5 -36Q17 -46 12.5 -47.5Q7 -46.5 4 -41Z" fill="${fill}" ${L}/>
<circle cx="0" cy="-31" r="12.5" fill="${fill}" ${L}/><circle cx="-4.6" cy="-34" r="1.8" fill="${INK}"/><circle cx="4.6" cy="-34" r="1.8" fill="${INK}"/>
<circle cx="-8.6" cy="-27.6" r="2.4" fill="#ff9fb0" opacity=".85"/><circle cx="8.6" cy="-27.6" r="2.4" fill="#ff9fb0" opacity=".85"/>
<ellipse cx="0" cy="-27.4" rx="5.6" ry="3.9" fill="${dark}" ${L}/><ellipse cx="-2" cy="-27.4" rx=".9" ry="1.4" fill="${INK}"/><ellipse cx="2" cy="-27.4" rx=".9" ry="1.4" fill="${INK}"/>
<path d="M-3 -21.6q3 2.2 6 0" fill="none" ${L} stroke-width="1.6"/>`;
export const pig=(colour='red')=>{const [fill,dark]=PIGS[colour];return `<path d="M12 -15q8-1 7-7q-1-4-4.5-1.5" fill="none" ${L}/>
<rect x="-9.5" y="-7" width="6.5" height="7.5" rx="2.6" fill="${dark}" ${L}/><rect x="3" y="-7" width="6.5" height="7.5" rx="2.6" fill="${dark}" ${L}/>
<ellipse cx="0" cy="-13.5" rx="13.5" ry="10.5" fill="${fill}" ${L}/>${pigHead(fill,dark)}`;};
export const pigFace=(colour='red')=>pigHead(...PIGS[colour]);

// The wolf, side on and facing left. The cheek puffs and the mouth rounds when he blows.
const wolfHead=`<path d="M-2 -70 0 -85 8 -72Z" fill="${WOLF}" ${L}/><path d="M7 -69 14 -82 17 -67Z" fill="${WOLF}" ${L}/>
<circle cx="3" cy="-60" r="13.5" fill="${WOLF}" ${L}/>
<path d="M-6 -67Q-26 -66 -31 -58Q-29 -50 -6 -50Z" fill="${WOLF}" ${L}/><path d="M-8 -53Q-22 -52.5 -28 -55" fill="none" stroke="${WOLF_LIGHT}" stroke-width="3" stroke-linecap="round"/>
<circle cx="-30" cy="-59" r="3.4" fill="${INK}"/>
<g class="wolf-eye"><ellipse cx="-2" cy="-63" rx="3.2" ry="3.6" fill="#fff" ${L} stroke-width="1.6"/><circle cx="-3.2" cy="-62.4" r="1.7" fill="${INK}"/></g><path class="wolf-shut" opacity="0" d="M-5.5 -63q3.5 3 7 0" fill="none" ${L} stroke-width="1.8"/>
<path d="M-8 -70 2 -67" ${L} stroke-width="2.6"/>
<path class="wolf-grin" d="M-27 -53Q-17 -48 -7 -52" fill="none" ${L} stroke-width="1.8"/>
<g class="wolf-o" opacity="0"><circle cx="-24" cy="-53" r="3" fill="${INK}"/></g>
<g class="wolf-cheek" data-cue="cheeks"><circle cx="-12" cy="-54" r="5" fill="#b4b8c9" ${L} stroke-width="1.6"/></g>`;
const star=(x,y)=>`<path d="M${x} ${y-4}l1.2 2.6 2.8.4-2 2 .5 2.8-2.5-1.3-2.5 1.3.5-2.8-2-2 2.8-.4z" fill="#ffc233" stroke="${INK}" stroke-width="1"/>`;
const stars=`<g class="wolf-stars">${star(-12,-92)}${star(4,-97)}${star(18,-88)}</g>`;
const wind=`<g class="wind" fill="none" stroke="#7cc3ff" stroke-width="3" stroke-linecap="round"><path d="M-38 -62q-10-5-22 0"/><path d="M-38 -54q-14 3-30-2"/><path d="M-38 -46q-10 5-22 2"/></g>`;
export const wolf=`<path d="M13 -26Q36 -26 40 -50Q30 -38 13 -36Z" fill="${WOLF}" ${L}/>
<rect x="-8" y="-20" width="8" height="20" rx="3.5" fill="${WOLF}" ${L}/><rect x="5" y="-20" width="8" height="20" rx="3.5" fill="${WOLF}" ${L}/>
<ellipse cx="-6" cy="0" rx="7" ry="3" fill="${WOLF}" ${L}/><ellipse cx="7" cy="0" rx="7" ry="3" fill="${WOLF}" ${L}/>
<ellipse cx="3" cy="-33" rx="15.5" ry="19" fill="${WOLF}" ${L}/><ellipse cx="-2" cy="-31" rx="8.5" ry="13" fill="${WOLF_LIGHT}"/>
<g class="wolf-arm"><path d="M-2 -42-15 -33" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M-2 -42-15 -33" fill="none" stroke="${WOLF}" stroke-width="5" stroke-linecap="round"/><circle cx="-16" cy="-32.5" r="4" fill="${WOLF_LIGHT}" ${L} stroke-width="1.8"/></g>
<g class="wolf-head">${wolfHead}${wind}${stars}</g>`;

// What each house is built from: the pieces in the pile (one flies over per tap), the walls, roof, the heap
// left when it falls (brick never falls). Every house has the same shape, so the door, window and tap targets
// stay in one place across the story.
const WOOD='#d9a066',WOOD_DARK='#a8703f',ROOF_WOOD='#b5743f',BRICK='#e2704f',MORTAR='#f6c7b6',ROOF_TILE='#9c3d47';
const sheaf=`<path d="M-7 0-3.5 -16 -8 -27H8L3.5 -16 7 0Z" fill="${STRAW}" ${L}/><path d="M-3 -2-1 -15M2.5 -2 1 -15M-4 -25-1 -18M3.5 -25 1 -18" stroke="${STRAW_DARK}" stroke-width="1.4" stroke-linecap="round"/><rect x="-5" y="-17.5" width="10" height="3.6" rx="1.4" fill="#b9743c" ${L} stroke-width="1.4"/>`;
const log=`<rect x="-13" y="-9" width="26" height="9" rx="4.5" fill="${WOOD}" ${L}/><ellipse cx="-9" cy="-4.5" rx="3.6" ry="4.5" fill="#f1c99a" ${L} stroke-width="1.6"/><circle cx="-9" cy="-4.5" r="1.4" fill="none" stroke="${WOOD_DARK}" stroke-width="1"/><path d="M-2 -6.5h11" stroke="${WOOD_DARK}" stroke-width="1.2" stroke-linecap="round"/>`;
const brick=`<rect x="-7.5" y="-7" width="15" height="7" rx="1.2" fill="${BRICK}" ${L} stroke-width="1.7"/><path d="M-4.5 -4.5h4" stroke="#f59c80" stroke-width="1.2" stroke-linecap="round"/>`;
const stalks=(x0,x1,y0,y1,step=6)=>{let d='';for(let x=x0;x<=x1;x+=step)d+=`M${x} ${y0}V${y1}`;return `<path d="${d}" stroke="${STRAW_DARK}" stroke-width="1.3" stroke-linecap="round"/>`;};
const planks=(y0,y1)=>{let d='';for(let y=y0+6;y<y1;y+=6)d+=`M110 ${y}H190`;return `<path d="${d}" stroke="${WOOD_DARK}" stroke-width="1.3" stroke-linecap="round"/><path d="M125 ${y0+2}v3M160 ${y0+8}v3M140 ${y0+14}v3M178 ${y0+2}v3" stroke="${WOOD_DARK}" stroke-width="1.2" stroke-linecap="round"/>`;};
const courses=(y0,y1,x0=108,x1=192)=>{let d='';for(let y=y0,row=0;y<y1;y+=6,row++){if(y>y0)d+=`M${x0+1} ${y}H${x1-1}`;for(let x=x0+(row%2?7:14);x<x1;x+=14)d+=`M${x} ${y}V${Math.min(y+6,y1)}`;}return `<path d="${d}" stroke="${MORTAR}" stroke-width="1.4"/>`;};
const wall=(y,h,fill,texture)=>`<rect x="108" y="${y}" width="84" height="${h}" fill="${fill}" ${L}/>${texture}<rect x="108" y="${y}" width="84" height="${h}" fill="none" ${L}/>`;
// The window shows the face of every pig inside, in the order they arrived.
const faceSpots={1:[[133,140,.72]],2:[[124,135.6,.6],[142,135.6,.6]],3:[[120,132.5,.5],[133,132.5,.5],[146,132.5,.5]]};
const windowAndDoor=faces=>`<rect x="113" y="105" width="40" height="22" rx="3" fill="#bfe3ff" ${L}/>
 <g class="pig-window" data-cue="pig-window">${faces.map((colour,i)=>{const [x,y,s]=faceSpots[faces.length][i];return `<g class="face face-${colour}"><g transform="translate(${x} ${y}) scale(${s})">${pigFace(colour)}</g></g>`;}).join('')}</g>
 <rect x="113" y="105" width="40" height="22" rx="3" fill="none" ${L}/>
 <g class="door" data-cue="door"><path d="M163 150V125a9 9 0 0 1 18 0V150Z" fill="#5a4a3a" ${L}/><g class="door-leaf"><path d="M163 150V125a9 9 0 0 1 18 0V150Z" fill="${DOOR}" ${L}/><path d="M168 130v16M176 130v16" stroke="#a96f37" stroke-width="1.4" stroke-linecap="round"/><circle cx="177.5" cy="139" r="1.6" fill="${INK}"/></g></g>`;
const fringe=fill=>`<path d="M98 104l5 6 5-6 5 6 5-6 5 6 5-6 5 6 5-6 5 6 5-6 5 6 5-6 5 6 5-6 5 6 5-6 5 6 5-6 5 6 5-6" fill="${fill}" ${L} stroke-width="1.6"/>`;
const roof=(fill,texture)=>`<path d="M98 104 150 62 202 104Z" fill="${fill}" ${L}/>${texture}`;
export const MATERIALS={
 straw:{piece:sheaf,pile:[[30,156],[44,158],[58,156]],
  layers:faces=>[wall(126,24,STRAW,stalks(113,187,129,147)),wall(100,28,STRAW,stalks(113,187,103,124))+windowAndDoor(faces),
   roof(STRAW,`<path d="M118 92q8 3 16 0t16 0 16 0 16 0M130 82q7 3 14 0t14 0 12 0M140 72q5 2 10 0t10 0" fill="none" stroke="${STRAW_DARK}" stroke-width="1.4" stroke-linecap="round"/>`)+fringe(STRAW)],
  bits:[STRAW,STRAW_DARK],heap:`<path d="M100 151Q112 136 132 138Q150 128 170 138Q190 136 200 151Z" fill="${STRAW}" ${L}/>${stalks(116,184,142,149,8)}`},
 wood:{piece:log,pile:[[34,158],[56,158],[45,149]],
  layers:faces=>[wall(126,24,WOOD,planks(126,150)),wall(100,28,WOOD,planks(100,128))+windowAndDoor(faces),
   roof(ROOF_WOOD,`<path d="M112 96H188M124 86H176M136 76H164" stroke="#8c5428" stroke-width="1.5" stroke-linecap="round"/><path d="M124 96v-8M150 96v-8M176 96v-8M136 86v-8M162 86v-8M150 76v-6" stroke="#8c5428" stroke-width="1.2"/>`)+`<path d="M96 105H204" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M96 105H204" stroke="${ROOF_WOOD}" stroke-width="2.6" stroke-linecap="round"/>`],
  bits:[WOOD,WOOD_DARK],heap:`<g ${L}><rect x="104" y="140" width="56" height="8" rx="2" fill="${WOOD}" transform="rotate(-8 132 144)"/><rect x="138" y="138" width="58" height="8" rx="2" fill="${ROOF_WOOD}" transform="rotate(10 167 142)"/><rect x="118" y="143" width="64" height="8" rx="2" fill="${WOOD}"/></g>`},
 brick:{piece:brick,pile:[[30,158],[45,158],[60,158],[37.5,151],[52.5,151]],
  layers:faces=>[wall(134,16,BRICK,courses(134,150)),wall(117,18,BRICK,courses(117,135)),wall(100,18,BRICK,courses(100,118))+windowAndDoor(faces),
   roof(ROOF_TILE,`<path d="M114 94q4 4 8 0t8 0 8 0 8 0 8 0 8 0 8 0 8 0 8 0M126 84q4 4 8 0t8 0 8 0 8 0 8 0 8 0M138 74q4 4 8 0t8 0 8 0" fill="none" stroke="#c75b63" stroke-width="1.5" stroke-linecap="round"/>`),
   `<g class="chimney" data-cue="chimney"><rect x="166" y="66" width="14" height="22" fill="${BRICK}" ${L}/><path d="M166 73H180M166 80H180M173 66v7M170 73v7M177 80v8" stroke="${MORTAR}" stroke-width="1.2"/><rect x="164" y="62" width="18" height="5" rx="1" fill="#8e8a9e" ${L}/></g>`],
  bits:[],heap:''}
};
export const house=(material='straw',faces=['red'])=>MATERIALS[material].layers(faces).map((layer,i)=>`<g class="layer layer-${i+1}">${layer}</g>`).join('');
const ghost=`<path d="M108 150V104H98L150 62 202 104H192V150Z" fill="#fff" fill-opacity=".35" stroke="${INK}" stroke-width="1.6" stroke-dasharray="5 5" opacity=".45"/>`;
// Bits that fly off as he blows, a few more with every puff.
const debris=colours=>colours.length?Array.from({length:24},(_,i)=>{const x=110+(i*37)%82,y=66+(i*23)%82,r=(i*47)%180;
 return `<path class="bit" style="--dx:${-60-(i*29)%120}px;--dy:${-30+(i*41)%70}px;--r:${r+200}deg;--d:${(i%5)*.05}s" d="M${x} ${y}l9 -2" stroke="${colours[i%3?0:1]}" stroke-width="3" stroke-linecap="round"/>`;}).join(''):'';

const tree=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><rect x="-4" y="-26" width="8" height="26" rx="2" fill="#b9743c" ${L}/><circle cx="0" cy="-40" r="18" fill="#5fbf4a" ${L}/><circle cx="-9" cy="-46" r="4" fill="#7fd36a"/></g>`;
const backdrop=`<rect width="320" height="200" fill="#cfeaff"/>
<circle cx="44" cy="38" r="15" fill="#ffd34d"/><g fill="#fff" opacity=".95"><ellipse cx="110" cy="30" rx="18" ry="7"/><ellipse cx="121" cy="25" rx="11" ry="7"/><ellipse cx="236" cy="42" rx="16" ry="6"/><ellipse cx="246" cy="38" rx="9" ry="6"/></g>
<path d="M0 118Q70 96 160 112T320 104V200H0Z" fill="#a6dc84"/><path d="M0 140Q90 124 180 136T320 132V200H0Z" fill="#8fd16e"/>
${tree(286,148,1.05)}${tree(22,140,.8)}
<path d="M0 162Q90 150 160 158T320 156V200H0Z" fill="#6cc24a"/>
<g fill="#fff">${[[40,182],[96,190],[210,186],[270,192],[150,196]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.6"/>`).join('')}</g>`;
// Glow for whatever is being said, and a pulsing ring wherever she should tap.
const defs=`<defs><filter id="story-glow" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#fff3a0"/><feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#ffc233" flood-opacity=".9"/></filter></defs>`;
const hint=(name,x,y,r)=>`<g class="hint hint-${name}" transform="translate(${x} ${y})"><circle r="${r}" fill="none" stroke="#ff7a45" stroke-width="3.5"/><circle class="hint-echo" r="${r}" fill="none" stroke="#ff7a45" stroke-width="2.5"/></g>`;
const actor=(name,x,y,body,cue=name,extra='')=>`<g class="actor actor-${name}" style="transform:translate(${x}px,${y}px)"${extra}><g class="bob"><g class="cuebox" data-cue="${cue}">${body}</g></g></g>`;

// Speech bubbles that say it in pictures: an open door from the wolf, a crossed-out door from the pig.
const miniDoor=(x,y)=>`<path d="M${x} ${y+22}V${y+6}a7 7 0 0 1 14 0V${y+22}Z" fill="${DOOR}" ${L} stroke-width="1.6"/><circle cx="${x+10.5}" cy="${y+14}" r="1.2" fill="${INK}"/>`;
// A 52×36 bubble at x,y; its tail leaves the bottom edge at `base` and points at tailX,tailY.
const bubble=(cls,x,y,base,tailX,tailY,body)=>`<g class="bubble ${cls}"><rect x="${x}" y="${y}" width="52" height="36" rx="8" fill="#fff" ${L}/><path d="M${base} ${y+35}L${tailX} ${tailY}L${base+11} ${y+35}" fill="#fff" ${L}/><path d="M${base+1.5} ${y+36}H${base+9.5}" stroke="#fff" stroke-width="3"/>${body}</g>`;
const bubbles=bubble('bubble-wolf',216,10,228,236,62,`<path d="M227 32V16a7 7 0 0 1 14 0V32Z" fill="#5a4a3a" ${L} stroke-width="1.4"/><path d="M227 32V16l8-3v22Z" fill="${DOOR}" ${L} stroke-width="1.4"/><path d="M246 24h10m-4-4 4 4-4 4" fill="none" stroke="#12a879" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`)
 +bubble('bubble-pig',72,52,108,120,104,`${miniDoor(80,58)}<path d="M98 62 112 80M112 62 98 80" stroke="#f0507a" stroke-width="3.6" stroke-linecap="round"/>`);

// One scene per part: the house being built (from `material`), with `faces` for whoever will end up in the window.
export function houseScene(material,faces){
 const m=MATERIALS[material];
 return `<svg class="story-svg" viewBox="0 0 320 200" role="img" aria-label="The three little pigs and a ${material} house">${defs}${backdrop}
 <g class="ghost" data-cue="ghost">${ghost}</g>
 <g class="house" data-cue="house">${house(material,faces)}</g>
 <g class="ruins" data-cue="ruins">${m.heap}</g>
 <g class="debris">${debris(m.bits)}</g>
 <g class="pile" data-cue="pile">${m.pile.map(([x,y],i)=>`<g class="piece piece-${i+1}" style="transform:translate(${x}px,${y}px)">${m.piece}</g>`).join('')}</g>
 <g class="flying">${m.pile.map(([x,y],i)=>`<g class="fly fly-${i+1}" style="--x:${x}px;--y:${y}px;transform:translate(${x}px,${y}px)">${m.piece}</g>`).join('')}</g>
 ${actor('pig-yellow',-60,168,pig('yellow'),'pigs pig-yellow')}${actor('pig-white',-60,168,pig('white'),'pigs pig-white')}${actor('pig-red',-60,168,pig('red'),'pigs pig-red')}
 ${actor('wolf',370,160,wolf,'wolf')}
 ${bubbles}
 <text class="count-pop" x="150" y="58" text-anchor="middle" lang="zh-Hans"></text>
 ${hint('pile',44,144,24)}${hint('door',172,137,18)}${hint('pig-window',133,116,23)}${hint('wolf',240,112,30)}
 ${[['pile',44,142,32],['door',174,136,24],['pig-window',130,114,25],['wolf',238,112,44]].map(([name,x,y,r])=>`<circle class="hit hit-${name}" cx="${x}" cy="${y}" r="${r}"/>`).join('')}
 </svg>`;
}
// Inside the brick house: the fireplace with a pot on the fire, and the chimney the wolf comes down.
const flames=`<path d="M146 170Q140 156 148 146Q150 156 155 152Q152 140 160 130Q166 142 164 150Q170 146 170 138Q180 152 174 170Z" fill="#ff7a45" ${L} stroke-width="1.6"/><path d="M152 170Q150 160 156 154Q158 160 161 158Q160 150 164 146Q170 156 166 170Z" fill="#ffd34d"/>`;
const pot={back:`<ellipse cx="160" cy="124" rx="27" ry="6.5" fill="#2e2a3a" ${L}/><ellipse class="water" cx="160" cy="124.5" rx="23" ry="4.6" fill="#8fd0ff"/>`,
 front:`<path d="M133 124Q133 152 160 152Q187 152 187 124" fill="#57536a" ${L}/><path d="M133 124h-6M187 124h6" ${L} stroke-width="4"/><path d="M140 132q20 6 40 0" fill="none" stroke="#77738b" stroke-width="2" stroke-linecap="round"/>`};
const steam=`<g class="steam" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".9"><path d="M148 116q-5-7 0-14t0-14"/><path d="M160 114q-5-7 0-14t0-14"/><path d="M172 116q-5-7 0-14t0-14"/></g>`;
const boilBubbles=[[150,123],[158,125],[166,122],[172,125],[154,126]].map(([x,y],i)=>`<circle class="boil-dot" style="--d:${i*.17}s" cx="${x}" cy="${y}" r="2" fill="#fff"/>`).join('');
const drops=[[-26,-30],[-14,-40],[0,-46],[14,-40],[26,-30],[-34,-14],[34,-14]].map(([dx,dy])=>`<circle class="drop" style="--dx:${dx}px;--dy:${dy}px" cx="160" cy="122" r="3" fill="#8fd0ff" stroke="${INK}" stroke-width="1"/>`).join('');
export function interiorScene(){
 return `<svg class="story-svg" viewBox="0 0 320 200" role="img" aria-label="Inside the brick house: a pot on the fire">${defs}
 <rect width="320" height="172" fill="#fde3cf"/><g fill="#f8cfb4">${Array.from({length:40},(_,i)=>`<circle cx="${12+(i%10)*33}" cy="${14+Math.floor(i/10)*40+(i%2)*18}" r="2.5"/>`).join('')}</g>
 <rect x="22" y="36" width="54" height="44" rx="4" fill="#bfe3ff" ${L}/><path d="M49 36v44M22 58h54" ${L}/><circle cx="36" cy="48" r="5" fill="#ffd34d"/>
 <rect y="170" width="320" height="30" fill="#d9a066"/><path d="M0 170H320M0 184H320M70 170v14M190 170v14M130 184v16M260 184v16" stroke="#a8703f" stroke-width="1.6"/>
 <g class="flue" data-cue="chimney"><rect x="138" y="-4" width="44" height="70" fill="${BRICK}" ${L}/>${courses(0,66,138,182)}</g>
 <rect x="104" y="68" width="112" height="102" fill="${BRICK}" ${L}/>${courses(70,170,104,216)}
 <rect x="96" y="62" width="128" height="9" rx="2" fill="#8c5428" ${L}/>
 <path d="M126 170V114a34 22 0 0 1 68 0V170Z" fill="#3a2a33" ${L}/>
 <g transform="translate(160 172)"><g transform="rotate(-12)">${log}</g><g transform="rotate(12) scale(-1 1)">${log}</g></g>
 <g class="fire" data-cue="fire">${flames}</g>
 ${pot.back}<g class="boil">${boilBubbles}</g>
 ${actor('wolf',160,-40,wolf,'wolf')}
 <g class="pot" data-cue="pot">${pot.front}</g>${steam}<g class="splash">${drops}</g>
 ${actor('pig-red',58,188,pig('red'),'pigs pig-red')}${actor('pig-yellow',250,188,pig('yellow'),'pigs pig-yellow')}${actor('pig-white',286,188,pig('white'),'pigs pig-white')}
 ${hint('fire',160,162,22)}<circle class="hit hit-fire" cx="160" cy="160" r="32"/>
 </svg>`;
}
// Halfway: all three houses built, each pig at its window.
export function overviewScene(){
 return `<svg class="story-svg" viewBox="0 0 320 200" role="img" aria-label="Three houses, each with a pig at the window">${defs}${backdrop}${[['straw','red',-38],['wood','yellow',62],['brick','white',162]].map(([m,colour,x])=>`<g class="in-${colour} built-1 built-2 built-3 built-4 built-5" transform="translate(${x} 62) scale(.62)"><g data-cue="houses pigs">${house(m,[colour])}</g></g>`).join('')}</svg>`;
}
// Small pictures for the words met in the story.
const box=(viewBox,body)=>`<svg class="art" viewBox="${viewBox}" aria-hidden="true">${body}</svg>`;
const blob=colour=>`<path d="M-20 -2Q-24 -18 -8 -22Q4 -30 16 -20Q26 -10 18 2Q10 12 -4 8Q-18 10 -20 -2Z" fill="${colour}" ${L}/>`;
const dots=n=>[[-14,-20],[14,-20],[-14,4],[14,4],[0,-8]].slice(0,n).map(([x,y])=>`<circle cx="${x}" cy="${y}" r="6.5" fill="#ff7a45" ${L}/>`).join('');
export const storyPictures={
 pig:box('-26 -50 52 54',pig('red')),
 wolf:box('-36 -88 56 50',wolfHead),
 straw:box('-26 -32 52 36',`<g transform="translate(-12 0)">${sheaf}</g><g transform="translate(12 0)">${sheaf}</g>`),
 house:box('94 58 112 96',house('straw')),
 door:box('156 113 32 40',`<path d="M163 150V125a9 9 0 0 1 18 0V150Z" fill="${DOOR}" ${L}/><circle cx="177.5" cy="139" r="1.6" fill="${INK}"/>`),
 blow:box('-72 -88 92 50',`${wolfHead.replace('class="wolf-grin"','class="wolf-grin" opacity="0"').replace('class="wolf-o" opacity="0"','class="wolf-o"').replace('r="5" fill="#b4b8c9"','r="8" fill="#b4b8c9"')}<g fill="none" stroke="#7cc3ff" stroke-width="3" stroke-linecap="round"><path d="M-38 -62q-10-5-22 0"/><path d="M-38 -54q-14 3-30-2"/><path d="M-38 -46q-10 5-22 2"/></g>`),
 wood:box('-28 -24 56 28',`<g transform="translate(-12 0)">${log}</g><g transform="translate(14 0)">${log}</g><g transform="translate(1 -9)">${log}</g>`),
 yellow:box('-28 -30 56 44',blob('#ffc233')),
 fall:box('70 50 150 104',`<g transform="rotate(-24 150 150)">${house('wood',[])}</g><path d="M200 70q8 10 4 22M210 84q6 8 2 18" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>`),
 run:box('-46 -52 76 56',`${pig('red')}<path d="M-20 -30h-18M-22 -20h-22M-20 -10h-16" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>`),
 two:box('-44 -52 88 56',`<g transform="translate(-18 0)">${pig('red')}</g><g transform="translate(18 0)">${pig('yellow')}</g>`),
 brick:box('-26 -26 52 30',`<g transform="translate(-8 0)">${brick}</g><g transform="translate(8 0)">${brick}</g><g transform="translate(0 -7)">${brick}</g><g transform="translate(-8 -14)">${brick}</g><g transform="translate(8 -14)">${brick}</g>`),
 white:box('-28 -30 56 44',blob('#ffffff')),
 four:box('-26 -32 52 42',dots(4)),
 five:box('-26 -32 52 42',dots(5)),
 chimney:box('140 54 66 54',`<path d="M140 108 170 82 206 108Z" fill="${ROOF_TILE}" ${L}/><rect x="166" y="66" width="14" height="22" fill="${BRICK}" ${L}/><rect x="164" y="62" width="18" height="5" rx="1" fill="#8e8a9e" ${L}/><path d="M176 58q-4-4 0-8t0-8" fill="none" stroke="#b6b3c4" stroke-width="2.4" stroke-linecap="round"/>`),
 fire:box('130 124 60 52',`<g transform="translate(160 172)"><g transform="rotate(-12)">${log}</g><g transform="rotate(12) scale(-1 1)">${log}</g></g>${flames}`),
 hot:box('118 84 84 72',`${pot.back}${pot.front}${steam}<path d="M124 102q-4-6 0-12M196 102q4-6 0-12" fill="none" stroke="#f0507a" stroke-width="2.6" stroke-linecap="round"/>`),
 happy:box('-34 -56 68 60',`${pig('white').replace('M-3 -21.6q3 2.2 6 0','M-4 -22.5q4 4 8 0')}<path d="M-26 -44c-3-4-9 0-4 5l4 3 4-3c5-5-1-9-4-5zM26 -44c-3-4-9 0-4 5l4 3 4-3c5-5-1-9-4-5z" fill="#f0507a"/>`)
};
export const avatars={wolf:box('-36 -88 56 50',wolfHead),pig:box('-16 -50 32 32',pigFace('red'))};
// The story's cover: the three houses in a row, each with the pig who built it.
export const cover=()=>`<svg class="art" viewBox="0 0 320 200" aria-hidden="true">${backdrop}${[['straw','red',-38],['wood','yellow',62],['brick','white',162]].map(([m,colour,x])=>`<g transform="translate(${x} 58) scale(.62)">${house(m,[])}</g><g transform="translate(${x+80} 180) scale(.7)">${pig(colour)}</g>`).join('')}</svg>`;
