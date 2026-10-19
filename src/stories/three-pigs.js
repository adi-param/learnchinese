// 三只小猪 The three little pigs. First each pig builds a house (straw, wood, brick) and goes inside; then the wolf
// comes to each house in turn. Straw and wood fall when he blows; the brick house stands, so he comes down the
// chimney into a pot of boiling water and runs away for good.
import {INK,L,scene,target,actor,bubble,countPop,box,star,meadow,blob,dots,funSun,funCloud,funTree,funFlower,funActors} from '../story-kit.js';

// ---- Pictures ----
const STRAW='#f4c95d',STRAW_DARK='#cf9a2e',DOOR='#c98b4a',WOLF='#9599ad',WOLF_LIGHT='#d9dbe5';
const WOOD='#d9a066',WOOD_DARK='#a8703f',ROOF_WOOD='#b5743f',BRICK='#e2704f',MORTAR='#f6c7b6',ROOF_TILE='#9c3d47';
const PIGS={red:['#ff8b84','#f0625a'],yellow:['#ffd166','#efad2f'],white:['#fffaf3','#f6c9c0']};

// A pig standing, facing us. The face alone is used in the window and on the word cards.
const pigHead=(fill,dark)=>`<path d="M-11.5 -36Q-17 -46 -12.5 -47.5Q-7 -46.5 -4 -41Z" fill="${fill}" ${L}/><path d="M11.5 -36Q17 -46 12.5 -47.5Q7 -46.5 4 -41Z" fill="${fill}" ${L}/>
<circle cx="0" cy="-31" r="12.5" fill="${fill}" ${L}/><g class="blink"><circle cx="-4.6" cy="-34" r="1.8" fill="${INK}"/><circle cx="4.6" cy="-34" r="1.8" fill="${INK}"/></g>
<path class="pig-brows" d="M-8 -39.5l4.4 1.6M8 -39.5l-4.4 1.6" ${L} stroke-width="1.4"/>
<circle cx="-8.6" cy="-27.6" r="2.4" fill="#ff9fb0" opacity=".85"/><circle cx="8.6" cy="-27.6" r="2.4" fill="#ff9fb0" opacity=".85"/>
<ellipse cx="0" cy="-27.4" rx="5.6" ry="3.9" fill="${dark}" ${L}/><ellipse cx="-2" cy="-27.4" rx=".9" ry="1.4" fill="${INK}"/><ellipse cx="2" cy="-27.4" rx=".9" ry="1.4" fill="${INK}"/>
<path class="pig-mouth" d="M-3 -21.6q3 2.2 6 0" fill="none" ${L} stroke-width="1.6"/><ellipse class="pig-talk" cx="0" cy="-21" rx="2.4" ry="2" fill="${INK}"/>`;
const pig=(colour='red')=>{const [fill,dark]=PIGS[colour];return `<path d="M12 -15q8-1 7-7q-1-4-4.5-1.5" fill="none" ${L}/>
<rect x="-9.5" y="-7" width="6.5" height="7.5" rx="2.6" fill="${dark}" ${L}/><rect x="3" y="-7" width="6.5" height="7.5" rx="2.6" fill="${dark}" ${L}/>
<ellipse cx="0" cy="-13.5" rx="13.5" ry="10.5" fill="${fill}" ${L}/>${pigHead(fill,dark)}`;};
const pigFace=(colour='red')=>pigHead(...PIGS[colour]);

// The wolf, side on and facing left. The cheek puffs and the mouth rounds when he blows.
const wolfHead=`<path d="M-2 -70 0 -85 8 -72Z" fill="${WOLF}" ${L}/><path d="M7 -69 14 -82 17 -67Z" fill="${WOLF}" ${L}/>
<circle cx="3" cy="-60" r="13.5" fill="${WOLF}" ${L}/>
<path d="M-6 -67Q-26 -66 -31 -58Q-29 -50 -6 -50Z" fill="${WOLF}" ${L}/><path d="M-8 -53Q-22 -52.5 -28 -55" fill="none" stroke="${WOLF_LIGHT}" stroke-width="3" stroke-linecap="round"/>
<circle cx="-30" cy="-59" r="3.4" fill="${INK}"/>
<g class="wolf-eye blink"><ellipse cx="-2" cy="-63" rx="3.2" ry="3.6" fill="#fff" ${L} stroke-width="1.6"/><circle cx="-3.2" cy="-62.4" r="1.7" fill="${INK}"/></g>
<path class="wolf-brow" d="M-8 -70 2 -67" ${L} stroke-width="2.6"/>
<path class="wolf-grin" d="M-27 -53Q-17 -48 -7 -52" fill="none" ${L} stroke-width="1.8"/><path class="wolf-talk" d="M-27 -53Q-17 -42 -7 -52Z" fill="${INK}"/>
<g class="wolf-o" opacity="0"><circle cx="-24" cy="-53" r="3" fill="${INK}"/></g>
<g class="wolf-cheek" data-cue="cheeks"><circle cx="-12" cy="-54" r="5" fill="#b4b8c9" ${L} stroke-width="1.6"/></g>`;
const wind=`<g class="wind" fill="none" stroke="#7cc3ff" stroke-width="3" stroke-linecap="round"><path d="M-38 -62q-10-5-22 0"/><path d="M-38 -54q-14 3-30-2"/><path d="M-38 -46q-10 5-22 2"/></g>`;
const wolf=`<path d="M13 -26Q36 -26 40 -50Q30 -38 13 -36Z" fill="${WOLF}" ${L}/>
<rect x="-8" y="-20" width="8" height="20" rx="3.5" fill="${WOLF}" ${L}/><rect x="5" y="-20" width="8" height="20" rx="3.5" fill="${WOLF}" ${L}/>
<ellipse cx="-6" cy="0" rx="7" ry="3" fill="${WOLF}" ${L}/><ellipse cx="7" cy="0" rx="7" ry="3" fill="${WOLF}" ${L}/>
<ellipse cx="3" cy="-33" rx="15.5" ry="19" fill="${WOLF}" ${L}/><ellipse cx="-2" cy="-31" rx="8.5" ry="13" fill="${WOLF_LIGHT}"/>
<g class="wolf-arm"><path d="M-2 -42-15 -33" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M-2 -42-15 -33" fill="none" stroke="${WOLF}" stroke-width="5" stroke-linecap="round"/><circle cx="-16" cy="-32.5" r="4" fill="${WOLF_LIGHT}" ${L} stroke-width="1.8"/></g>
<g class="wolf-head">${wolfHead}${wind}</g>`;

// What each house is built from: the pieces in the pile (one flies over per tap), the walls, roof, and the heap
// left when it falls (brick never falls). Every house has the same shape, so the door, window and tap targets
// stay in one place across the story.
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
const MATERIALS={
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
const house=(material='straw',faces=['red'])=>MATERIALS[material].layers(faces).map((layer,i)=>`<g class="layer layer-${i+1}">${layer}</g>`).join('');
const ghost=`<path d="M108 150V104H98L150 62 202 104H192V150Z" fill="#fff" fill-opacity=".35" stroke="${INK}" stroke-width="1.6" stroke-dasharray="5 5" opacity=".45"/>`;
// Bits that fly off as he blows, a few more with every puff.
const debris=colours=>colours.length?Array.from({length:24},(_,i)=>{const x=110+(i*37)%82,y=66+(i*23)%82,r=(i*47)%180;
 return `<path class="bit" style="--dx:${-60-(i*29)%120}px;--dy:${-30+(i*41)%70}px;--r:${r+200}deg;--d:${(i%5)*.05}s" d="M${x} ${y}l9 -2" stroke="${colours[i%3?0:1]}" stroke-width="3" stroke-linecap="round"/>`;}).join(''):'';
// Speech bubbles that say it in pictures: an open door from the wolf, a crossed-out door from the pig.
const miniDoor=(x,y)=>`<path d="M${x} ${y+22}V${y+6}a7 7 0 0 1 14 0V${y+22}Z" fill="${DOOR}" ${L} stroke-width="1.6"/><circle cx="${x+10.5}" cy="${y+14}" r="1.2" fill="${INK}"/>`;
const bubbles=bubble('bubble-wolf',216,10,228,236,62,`<path d="M227 32V16a7 7 0 0 1 14 0V32Z" fill="#5a4a3a" ${L} stroke-width="1.4"/><path d="M227 32V16l8-3v22Z" fill="${DOOR}" ${L} stroke-width="1.4"/><path d="M246 24h10m-4-4 4 4-4 4" fill="none" stroke="#12a879" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`)
 +bubble('bubble-pig',72,52,108,120,104,`${miniDoor(80,58)}<path d="M98 62 112 80M112 62 98 80" stroke="#f0507a" stroke-width="3.6" stroke-linecap="round"/>`);

// Things to tap for fun in the meadow (they never move the story on).
const meadowFun=`${funSun(44,38)}${funCloud(110,30)}${funCloud(236,42,.9)}${funTree(286,106,22)}${funTree(22,108,16)}${[[40,182],[96,190],[210,186],[270,192],[150,196]].map(([x,y])=>funFlower(x,y)).join('')}`;
const pigActors=svg=>funActors(svg,{'pig-red':'pig','pig-yellow':'pig','pig-white':'pig',wolf:'wolf'});
// One scene per house: the house being built (from `material`), with `faces` for whoever will end up in the window.
function houseScene(material,faces){
 const m=MATERIALS[material];
 return pigActors(scene(`The three little pigs and a ${material} house`,`${meadow}${meadowFun}
 <g class="ghost" data-cue="ghost">${ghost}</g>
 <g class="house" data-cue="house">${house(material,faces)}</g>
 <g class="ruins" data-cue="ruins">${m.heap}</g>
 <g class="debris">${debris(m.bits)}</g>
 <g class="pile" data-cue="pile">${m.pile.map(([x,y],i)=>`<g class="piece piece-${i+1}" style="transform:translate(${x}px,${y}px)">${m.piece}</g>`).join('')}</g>
 <g class="flying">${m.pile.map(([x,y],i)=>`<g class="fly fly-${i+1}" style="--x:${x}px;--y:${y}px;transform:translate(${x}px,${y}px)">${m.piece}</g>`).join('')}</g>
 ${actor('pig-yellow',-60,168,pig('yellow'),'pigs pig-yellow')}${actor('pig-white',-60,168,pig('white'),'pigs pig-white')}${actor('pig-red',-60,168,pig('red'),'pigs pig-red')}
 ${actor('wolf',370,160,wolf,'wolf')}
 ${bubbles}${countPop()}
 ${target('pile',44,144,24,32)}${target('door',172,137,18,24)}${target('pig-window',133,116,23,25)}${target('wolf',240,112,30,44)}`).replace('class="pig-window"','data-fun="window" class="pig-window"'));
}
// Inside the brick house: the fireplace with a pot on the fire, and the chimney the wolf comes down.
const flames=`<path d="M146 170Q140 156 148 146Q150 156 155 152Q152 140 160 130Q166 142 164 150Q170 146 170 138Q180 152 174 170Z" fill="#ff7a45" ${L} stroke-width="1.6"/><path d="M152 170Q150 160 156 154Q158 160 161 158Q160 150 164 146Q170 156 166 170Z" fill="#ffd34d"/>`;
const pot={back:`<ellipse cx="160" cy="124" rx="27" ry="6.5" fill="#2e2a3a" ${L}/><ellipse class="water" cx="160" cy="124.5" rx="23" ry="4.6" fill="#8fd0ff"/>`,
 front:`<path d="M133 124Q133 152 160 152Q187 152 187 124" fill="#57536a" ${L}/><path d="M133 124h-6M187 124h6" ${L} stroke-width="4"/><path d="M140 132q20 6 40 0" fill="none" stroke="#77738b" stroke-width="2" stroke-linecap="round"/>`};
const steam=`<g class="steam" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".9"><path d="M148 116q-5-7 0-14t0-14"/><path d="M160 114q-5-7 0-14t0-14"/><path d="M172 116q-5-7 0-14t0-14"/></g>`;
const boilBubbles=[[150,123],[158,125],[166,122],[172,125],[154,126]].map(([x,y],i)=>`<circle class="boil-dot" style="--d:${i*.17}s" cx="${x}" cy="${y}" r="2" fill="#fff"/>`).join('');
const drops=[[-26,-30],[-14,-40],[0,-46],[14,-40],[26,-30],[-34,-14],[34,-14]].map(([dx,dy])=>`<circle class="drop" style="--dx:${dx}px;--dy:${dy}px" cx="160" cy="122" r="3" fill="#8fd0ff" stroke="${INK}" stroke-width="1"/>`).join('');
const logs=`<g transform="translate(160 172)"><g transform="rotate(-12)">${log}</g><g transform="rotate(12) scale(-1 1)">${log}</g></g>`;
function interiorScene(){
 return pigActors(scene('Inside the brick house: a pot on the fire',`
 <rect width="320" height="172" fill="#fde3cf"/><g fill="#f8cfb4">${Array.from({length:40},(_,i)=>`<circle cx="${12+(i%10)*33}" cy="${14+Math.floor(i/10)*40+(i%2)*18}" r="2.5"/>`).join('')}</g>
 <rect x="22" y="36" width="54" height="44" rx="4" fill="#bfe3ff" ${L}/><path d="M49 36v44M22 58h54" ${L}/><circle cx="36" cy="48" r="5" fill="#ffd34d"/>
 <rect y="170" width="320" height="30" fill="#d9a066"/><path d="M0 170H320M0 184H320M70 170v14M190 170v14M130 184v16M260 184v16" stroke="#a8703f" stroke-width="1.6"/>
 <g class="flue" data-cue="chimney"><rect x="138" y="-4" width="44" height="70" fill="${BRICK}" ${L}/>${courses(0,66,138,182)}</g>
 <rect x="104" y="68" width="112" height="102" fill="${BRICK}" ${L}/>${courses(70,170,104,216)}
 <rect x="96" y="62" width="128" height="9" rx="2" fill="#8c5428" ${L}/>
 <path d="M126 170V114a34 22 0 0 1 68 0V170Z" fill="#3a2a33" ${L}/>
 ${logs}<g class="fire" data-cue="fire">${flames}</g>
 ${pot.back}<g class="boil">${boilBubbles}</g>
 ${actor('wolf',160,-40,wolf,'wolf')}
 <g class="pot" data-cue="pot">${pot.front}</g>${steam}<g class="splash">${drops}</g>
 ${actor('pig-red',58,188,pig('red'),'pigs pig-red')}${actor('pig-yellow',250,188,pig('yellow'),'pigs pig-yellow')}${actor('pig-white',286,188,pig('white'),'pigs pig-white')}
 ${target('fire',160,162,22,32)}`).replace('<g class="pot" data-cue="pot">','<g class="pot" data-cue="pot" data-fun="pot">'));
}
// Halfway: all three houses built, each pig at its window.
function overviewScene(){
 return scene('Three houses, each with a pig at the window',`${meadow}${[['straw','red',-38],['wood','yellow',62],['brick','white',162]].map(([m,colour,x])=>`<g class="in-${colour} built-1 built-2 built-3 built-4 built-5" transform="translate(${x} 62) scale(.62)"><g data-cue="houses pigs">${house(m,[colour])}</g></g>`).join('')}`);
}
const pictures={
 pig:box('-26 -50 52 54',pig('red')),
 wolf:box('-36 -88 56 50',wolfHead),
 straw:box('-26 -32 52 36',`<g transform="translate(-12 0)">${sheaf}</g><g transform="translate(12 0)">${sheaf}</g>`),
 house:box('94 58 112 96',house('straw')),
 door:box('156 113 32 40',`<path d="M163 150V125a9 9 0 0 1 18 0V150Z" fill="${DOOR}" ${L}/><circle cx="177.5" cy="139" r="1.6" fill="${INK}"/>`),
 blow:box('-72 -88 92 50',`${wolfHead.replace('class="wolf-grin"','class="wolf-grin" opacity="0"').replace('class="wolf-o" opacity="0"','class="wolf-o"').replace('r="5" fill="#b4b8c9"','r="8" fill="#b4b8c9"')}${wind.replace('class="wind"','')}`),
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
 fire:box('130 124 60 52',`${logs}${flames}`),
 hot:box('118 84 84 72',`${pot.back}${pot.front}${steam}<path d="M124 102q-4-6 0-12M196 102q4-6 0-12" fill="none" stroke="#f0507a" stroke-width="2.6" stroke-linecap="round"/>`),
 happy:box('-34 -56 68 60',`${pig('white').replace('class="pig-mouth" d="M-3 -21.6q3 2.2 6 0"','class="pig-mouth" d="M-4 -22.5q4 4 8 0"')}<path d="M-26 -44c-3-4-9 0-4 5l4 3 4-3c5-5-1-9-4-5zM26 -44c-3-4-9 0-4 5l4 3 4-3c5-5-1-9-4-5z" fill="#f0507a"/>`)
};
// The cover: the three houses in a row, each with the pig who built it.
const cover=()=>box('0 0 320 200',`${meadow}${[['straw','red',-38],['wood','yellow',62],['brick','white',162]].map(([m,colour,x])=>`<g transform="translate(${x} 58) scale(.62)">${house(m,[])}</g><g transform="translate(${x+80} 180) scale(.7)">${pig(colour)}</g>`).join('')}`);

// ---- The story ----
// Each house: what it is made of, who ends up in its window (in the order they get there), and who builds it.
const HOUSES=[
 {material:'straw',faces:['red'],builder:'red'},
 {material:'wood',faces:['yellow','red'],builder:'yellow'},
 {material:'brick',faces:['white','red','yellow'],builder:'white'}
];
let api,bitsGone=0;
const say=(key,t)=>api.say(key,t),wait=(ms,t)=>api.wait(ms,t),flag=(name,on)=>api.flag(name,on),move=(...args)=>api.move(...args);
const place=(name,x,y=168)=>move(name,x,y,0);
const toHouse=(t,index,built=false)=>{const h=HOUSES[index];api.chapter(index);bitsGone=0;return api.changeScene(t,houseScene(h.material,h.faces),s=>{
 if(!built)return;s.querySelectorAll('.layer').forEach((_,i)=>s.classList.add('built-'+(i+1)));s.classList.add('in-'+h.builder);});};

const NUMBERS=[['one','一'],['two','二'],['three','三'],['four','四'],['five','五']];
async function build(t,line,prompt){
 const s=api.stage(),pieces=s.querySelectorAll('.piece').length;
 flag('show-ghost');flag('show-pile');
 await say(line,t);
 for(let n=1;n<=pieces;n++){
  if(n===1)await say(prompt,t);
  await api.tap('pile',t,prompt);
  s.querySelector('.piece-'+n).classList.add('taken');api.replay(s.querySelector('.fly-'+n),'go');
  await wait(550,t);
  flag('built-'+n);api.count(NUMBERS[n-1][1]);
  await say(NUMBERS[n-1][0],t);
 }
 flag('show-ghost',false);flag('show-pile',false);api.chime('yay');
}
// Walks a pig to the door and in; its face then shows at the window.
async function goIn(t,colour,ms=1100){move('pig-'+colour,172,166,ms);await wait(ms,t);flag('in-'+colour);}
// Pigs running from the last house ask to be let in: she opens the door for them.
async function letIn(t,colours,line){
 colours.forEach((c,i)=>{place('pig-'+c,-40-i*34);});flag('scared');
 colours.forEach((c,i)=>move('pig-'+c,96-i*30,168,1500));await wait(1500,t);
 await say(line,t);
 await say('quick',t);
 await api.tap('door',t,'quick');
 flag('door-open');flag('scared',false);
 for(const c of colours)await goIn(t,c,700);
 flag('door-open',false);await wait(500,t);
}
async function wolfKnocks(t){
 const s=api.stage();
 move('wolf',238,160,2400);await wait(1200,t);
 await say('wolf',t);await wait(500,t);
 await say('tapDoor',t);
 for(let i=0;i<3;i++){await api.tap('door',t,'tapDoor');api.sounds.knock();api.replay(s.querySelector('.door'),'knocked');api.replay(s.querySelector('.actor-wolf'),'knock');await say('dong',t);}
 await wait(300,t);
 flag('say-open');await say('open',t);await wait(400,t);flag('say-open',false);
 await say('tapPig',t);
 await api.tap('pig-window',t,'tapPig');
 flag('say-no');flag('pig-no');await say('no',t);await wait(400,t);flag('say-no',false);flag('pig-no',false);
 await wait(300,t);
 flag('zoom-wolf');await say('blow',t);
 await say('blowNow',t);flag('zoom-wolf',false);await wait(500,t);
}
// Puffs at the house, by microphone or by tapping the wolf: each one the wolf says 吹, the house wobbles by the
// next amount in `wobbles` (degrees) and a few bits fly off. Resolves after the last puff.
function blowPuffs(t,wobbles,bitsEach=0){
 const s=api.stage(),house=s.querySelector('.house'),bits=[...s.querySelectorAll('.bit')];let puffs=0;
 return api.waitFor(t,done=>{
  const puff=()=>{
   if(puffs>=wobbles.length)return;const w=wobbles[puffs++];
   api.replay(s,'blowing');setTimeout(()=>s.classList.remove('blowing'),900);api.sounds.whoosh(Math.min(3,1+w/3));
   house.style.setProperty('--w',w);api.replay(house,'wobble');
   bits.slice(bitsGone,bitsGone+=bitsEach).forEach(b=>b.classList.add('off'));
   say('chui',t).catch(()=>{});
   if(puffs===wobbles.length)setTimeout(done,700);
  };
  const hit=s.querySelector('.hit-wolf');api.hint('wolf',true);hit.addEventListener('click',puff);
  const stopMic=api.mic(puff);
  const nudge=setInterval(()=>{if(api.quiet()&&!api.listening())say('blowNow',t).catch(()=>{});},9000);
  return ()=>{clearInterval(nudge);hit.removeEventListener('click',puff);api.hint('wolf',false);stopMic();};
 });
}
// The house falls; the pigs inside pop out of the heap and run, with the wolf close behind.
async function fallAndRun(t,fell,run,colours){
 flag('fallen');api.sounds.crash();
 await wait(1300,t);
 await say(fell,t);
 colours.forEach((c,i)=>{place('pig-'+c,150-(colours.length-1)*16+i*32);flag('in-'+c,false);});flag('scared');
 await say(run,t);
 colours.forEach((c,i)=>move('pig-'+c,-60-i*30,170,1800));await wait(500,t);move('wolf',-110,162,2600);
 await wait(2400,t);
}

// Building. The story opens on the three pigs; two go off to build their own houses, and the red one builds with straw.
async function buildStraw(t){
 place('pig-red',140);place('pig-yellow',180);place('pig-white',220);
 await wait(400,t);
 await say('once',t);
 await wait(300,t);
 move('pig-yellow',380,168,2400);move('pig-white',420,168,2400);move('pig-red',84,168,1400);
 await wait(1500,t);
 await build(t,'build','tapStraw');
 await say('done',t);
 await goIn(t,'red');await wait(600,t);
}
async function buildWood(t){
 place('pig-yellow',-40);move('pig-yellow',84,168,1300);await wait(1400,t);
 await build(t,'w_build','tapWood');
 await say('w_done',t);
 await goIn(t,'yellow');await wait(600,t);
}
async function buildBrick(t){
 place('pig-white',-40);move('pig-white',84,168,1300);await wait(1400,t);
 await build(t,'b_build','tapBrick');
 await say('b_done',t);
 await goIn(t,'white');await wait(600,t);
}
// The wolf comes. Straw falls after three puffs.
async function wolfAtStraw(t){
 await wolfKnocks(t);
 await blowPuffs(t,[2,5,8],5);
 await fallAndRun(t,'fell','run',['red']);
 await wait(300,t);
}
// The red pig runs to the yellow pig's wooden house. Wood takes more blowing.
async function wolfAtWood(t){
 await letIn(t,['red'],'redComes');
 await wolfKnocks(t);
 await blowPuffs(t,[1.5,3,4.5],3);
 await say('again',t);
 await blowPuffs(t,[6,9],4);
 await fallAndRun(t,'w_fell','twoRun',['yellow','red']);
 await wait(300,t);
}
// Both run to the white pig's brick house. However hard he blows, it stays up, so the wolf climbs onto the roof
// and comes down the chimney, straight into the pot of water the pigs have boiled. Off he runs, for good.
async function wolfAtBrick(t){
 await letIn(t,['red','yellow'],'twoCome');
 await wolfKnocks(t);
 await blowPuffs(t,[.4,.5,.6]);
 await say('strong',t);
 await say('again',t);
 await blowPuffs(t,[.6,.7]);
 await say('strong',t);
 await say('chimneyPlan',t);
 move('wolf',214,134,900,.85);await wait(900,t);move('wolf',192,98,900,.65);await wait(900,t);move('wolf',173,64,800,.5);await wait(1000,t);
 flag('wolf-down');move('wolf',173,100,700,.5);await wait(700,t);
 await api.changeScene(t,interiorScene());api.ambient('fire');
 await say('boil',t);
 await say('tapFire',t);
 await api.tap('fire',t,'tapFire');
 flag('fire-lit');api.sounds.whoosh(1);await wait(1400,t);
 flag('boiling');await say('boiling',t);await wait(400,t);
 // Down the chimney he comes.
 move('wolf',160,150,700);await wait(700,t);
 api.sounds.crash();api.replay(api.stage(),'splashed');await say('splash',t);
 flag('ouch');await say('hot',t);
 move('wolf',160,-150,650);await wait(700,t);flag('ouch',false);
 await say('wolfRan',t);
 flag('dance');api.ambient('music');
 await say('happy',t);
 await wait(800,t);
}
let oinks=0,sneezes=0;
function fun(name,el,storyApi){
 const a=storyApi;
 if(name==='pig'||name==='window'){a.replay(el.querySelector('.cuebox')||el,'happy-hop');a.voice(oinks++%2?'giggle':'oink');return true;}
 if(name==='wolf'){a.replay(el.querySelector('.cuebox'),'sneeze');a.voice(sneezes++%3===2?'howl':'achoo');return true;}
 if(name==='pot'){a.replay(el,'bubble');a.effect('pop');return true;}
}
const BUILD=[buildStraw,buildWood,buildBrick],WOLF_AT=[wolfAtStraw,wolfAtWood,wolfAtBrick];
// First every pig builds a house; then the wolf comes to each house in turn.
async function play(storyApi,t){
 api=storyApi;bitsGone=0;
 api.ambient('music');
 for(let i=0;i<HOUSES.length;i++){if(i)await toHouse(t,i);await BUILD[i](t);}
 api.chapter(-1);await api.changeScene(t,overviewScene());await wait(300,t);
 await say('allBuilt',t);await wait(600,t);
 api.ambient('birds');
 for(let i=0;i<HOUSES.length;i++){await toHouse(t,i,true);await WOLF_AT[i](t);}
}

const css=`
.story-svg .blink{transform-box:fill-box;transform-origin:center;animation:pigs-blink 4.2s infinite}
.story-svg .actor-pig-yellow .blink,.story-svg .face-yellow .blink{animation-delay:1.3s}.story-svg .actor-pig-white .blink,.story-svg .face-white .blink{animation-delay:2.6s}.story-svg .wolf-eye.blink{animation-delay:.7s;animation-duration:5s}
@keyframes pigs-blink{0%,94%,100%{transform:none}97%{transform:scaleY(.1)}}
.story-svg .pig-talk,.story-svg .wolf-talk,.story-svg .pig-brows{opacity:0}
[data-talking="pig"] .pig-window .pig-talk{animation:pigs-talk .22s steps(2) infinite}
[data-talking="pig"] .pig-window .pig-mouth{opacity:0}
[data-talking="wolf"] .wolf-talk{animation:pigs-talk .24s steps(2) infinite}
[data-talking="wolf"] .wolf-grin{opacity:0}
@keyframes pigs-talk{0%{opacity:1}100%{opacity:0}}
.scared .pig-brows,[data-talking="wolf"] .pig-brows,.say-no .pig-brows{opacity:1}
.story-svg .wolf-brow{transform-box:fill-box;transform-origin:100% 50%;transition:transform .3s}
.blowing .wolf-brow,.zoom-wolf .wolf-brow{transform:rotate(18deg)}
.zoom-wolf .story-svg{transform:scale(1.6);transition:transform .9s ease-in-out}
.story-svg .pot.bubble{transform-box:fill-box;transform-origin:50% 100%;animation:story-pop .5s var(--spring)}
.story-svg .house,.story-svg .ruins,.story-svg .door,.story-svg .pile,.story-svg .ghost,.story-svg .pig-window,.story-svg .bit{transform-box:fill-box;transform-origin:50% 100%}
.story-svg .wolf-cheek{transform-box:fill-box;transform-origin:center;transition:transform .12s}
.story-svg .wolf-cheek.cue{animation:none;transform:scale(1.5)}
.story-svg .wolf-cheek.lit{filter:none}
.story-svg .ghost,.story-svg .pile,.story-svg .ruins,.story-svg .face,.story-svg .wolf-o,.story-svg .wind{opacity:0;transition:opacity .4s}
.show-ghost .ghost,.show-pile .pile{opacity:1}
.in-red .face-red,.in-yellow .face-yellow,.in-white .face-white{opacity:1}
.in-red .actor-pig-red,.in-yellow .actor-pig-yellow,.in-white .actor-pig-white{opacity:0}
.story-svg .door-leaf{transform-box:fill-box;transform-origin:0 50%;transition:transform .35s var(--spring)}
.door-open .door-leaf{transform:scaleX(.2)}
.story-svg .piece{transition:opacity .15s}
.story-svg .piece.taken{opacity:0}
.story-svg .fly{opacity:0;pointer-events:none}
.story-svg .fly.go{animation:pigs-fly .6s ease-in forwards}
@keyframes pigs-fly{0%{opacity:1;transform:translate(var(--x),var(--y))}85%{opacity:1;transform:translate(150px,124px) scale(1.5) rotate(20deg)}100%{opacity:0;transform:translate(150px,124px) scale(1.5)}}
.story-svg .layer{opacity:0;transform:translateY(-16px);transition:opacity .3s,transform .5s var(--spring)}
.built-1 .layer-1,.built-2 .layer-2,.built-3 .layer-3,.built-4 .layer-4,.built-5 .layer-5{opacity:1;transform:none}
.say-open .bubble-wolf,.say-no .bubble-pig{opacity:1;transform:none}
.pig-no .pig-window{animation:story-no .35s ease-in-out 3}
.story-svg .door.knocked{animation:pigs-door .28s}
@keyframes pigs-door{30%{transform:translateX(-1.5px) scaleY(.97)}70%{transform:translateX(1.5px)}}
.story-svg .wolf-arm{transform-box:fill-box;transform-origin:100% 0}
.story-svg .knock .wolf-arm{animation:pigs-knock .28s}
@keyframes pigs-knock{50%{transform:rotate(28deg)}}
.blowing .wolf-o,.blowing .wind{opacity:1}
.blowing .wolf-grin{opacity:0}
.blowing .wolf-cheek{transform:scale(1.6)}
.blowing .wind{animation:pigs-wind .9s ease-out}
@keyframes pigs-wind{from{transform:translateX(6px)}to{transform:translateX(-46px)}}
.story-svg .house.wobble{animation:pigs-wobble .4s ease-in-out 3}
@keyframes pigs-wobble{25%{transform:rotate(calc(var(--w,1)*-1deg)) translateX(calc(var(--w,1)*-.5px))}75%{transform:rotate(calc(var(--w,1)*.6deg))}}
.fallen .layer-3{animation:pigs-roof 1s ease-in forwards}
.fallen .layer-2{animation:pigs-wall .9s .08s ease-in forwards}
.fallen .layer-1{animation:pigs-base .7s .15s ease-in forwards}
@keyframes pigs-roof{to{opacity:0;transform:translate(-110px,50px) rotate(-70deg)}}
@keyframes pigs-wall{to{opacity:0;transform:translate(-60px,40px) rotate(-30deg)}}
@keyframes pigs-base{to{opacity:0;transform:translate(-20px,10px) scaleY(.2)}}
.fallen .ruins{opacity:1;transition-delay:.6s}
.story-svg .bit{opacity:0;transform-origin:center}
.story-svg .bit.off,.fallen .bit{animation:pigs-bit 1.3s var(--d) ease-out forwards}
@keyframes pigs-bit{0%{opacity:1;transform:none}100%{opacity:0;transform:translate(var(--dx),var(--dy)) rotate(var(--r))}}
.scared .actor-pig-red .bob,.scared .actor-pig-yellow .bob,.scared .actor-pig-white .bob{animation:story-shiver .1s infinite alternate}
.dance .actor-pig-red .bob,.dance .actor-pig-yellow .bob,.dance .actor-pig-white .bob{animation:story-hop .38s ease-in-out infinite alternate}
.dance .actor-pig-yellow .bob{animation-delay:.12s}.dance .actor-pig-white .bob{animation-delay:.24s}
.wolf-down .actor-wolf{opacity:0}
.story-svg .fire,.story-svg .steam,.story-svg .boil-dot,.story-svg .drop{opacity:0}
.fire-lit .fire{opacity:1;transition:opacity .4s}
.story-svg .fire path{transform-box:fill-box;transform-origin:50% 100%}
.fire-lit .fire path{animation:story-flicker .35s ease-in-out infinite alternate}
.fire-lit .fire path+path{animation-duration:.27s}
.boiling .steam{opacity:.9}
.story-svg .steam path{transform-box:fill-box;transform-origin:50% 100%}
.boiling .steam path{animation:story-steam 1.4s ease-in-out infinite}
.boiling .steam path:nth-child(2){animation-delay:.45s}.boiling .steam path:nth-child(3){animation-delay:.9s}
.boiling .boil-dot{animation:pigs-boil .7s var(--d) ease-out infinite}
@keyframes pigs-boil{0%{opacity:0;transform:none}40%{opacity:1}100%{opacity:0;transform:translateY(-6px)}}
.boiling .water{fill:#c9ecff}
.story-svg .drop{transform-box:fill-box;transform-origin:center}
.splashed .drop{animation:pigs-drop .8s ease-out forwards}
@keyframes pigs-drop{0%{opacity:1;transform:none}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(.6)}}
.ouch .actor-wolf .bob{animation:story-shiver .07s infinite alternate}
`;

export default {
 firstScene:()=>houseScene(HOUSES[0].material,HOUSES[0].faces),
 scenes:()=>[...HOUSES.map(h=>houseScene(h.material,h.faces)),overviewScene(),interiorScene()],
 play,pictures,cover,css,fun,
 avatars:{wolf:box('-36 -88 56 50',wolfHead),pig:box('-16 -50 32 32',pigFace('red'))}
};
