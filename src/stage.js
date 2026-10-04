// Pictures for Build the sentence: scenes for the book sentences and a room for the on/under sentences.
// Backgrounds are SVG in a 160×120 box; places
// and hiding spots are positioned in percent of that box, so they line up at any size.
import {illustrations} from './illustrations.js';
const INK='#1f1b3a',line=`stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"`;
// Places a 120×96 illustration inside a background at x,y with width w (height keeps the 5:4 shape).
const place=(art,x,y,w)=>art.replace('<svg class="art"',`<svg x="${x}" y="${y}" width="${w}" height="${w*.8}"`);
const sky=(fill='#cfeaff')=>`<rect class="sky" width="160" height="120" fill="${fill}"/>`;
const clouds='<g fill="#fff" opacity=".9"><ellipse cx="34" cy="22" rx="14" ry="6"/><ellipse cx="42" cy="18" rx="9" ry="6"/><ellipse cx="118" cy="30" rx="12" ry="5"/></g>';
const hills='<path d="M0 66Q40 54 80 62T160 58V120H0Z" fill="#8fd16e"/><path d="M0 82Q50 72 100 80T160 78V120H0Z" fill="#6cc24a"/>';
const flowers=[[18,104],[52,110],[96,106],[140,112],[120,96]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.4" fill="#fff"/><circle cx="${x}" cy="${y}" r="1" fill="#ffc233"/>`).join('');
const room=(wall='#ffe9df')=>`<rect width="160" height="120" fill="${wall}"/><rect y="84" width="160" height="36" fill="#e7c9a2"/><path d="M0 84H160" stroke="#d4b48c" stroke-width="1.5"/>`;
const stars=[[20,18],[46,34],[90,14],[130,22],[150,46],[110,44]].map(([x,y])=>`<path d="M${x} ${y-3}l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" fill="#fff3b0"/>`).join('');
export const BACKGROUNDS={
 meadow:{art:sky()+clouds+hills+flowers,zones:{grassL:{x:30,y:72,w:30},grassR:{x:70,y:74,w:30},grassC:{x:50,y:72,w:34}}},
 pond:{art:sky()+clouds+hills+'<ellipse cx="80" cy="98" rx="58" ry="16" fill="#7cc8ff" stroke="#3a8ad1" stroke-width="1.5"/><path d="M40 98q6-3 12 0M96 102q6-3 12 0" fill="none" stroke="#fff" stroke-width="1.5"/>',zones:{pond:{x:50,y:76,w:32}}},
 dawn:{art:sky('#3d4a8a')+'<path d="M0 74Q40 60 80 70T160 64V120H0Z" fill="#5b8f4a"/><path d="M0 88Q50 78 100 86T160 84V120H0Z" fill="#4f7d3f"/>',zones:{sky:{x:50,y:34,w:30}}},
 night:{art:sky('#2f3270')+stars+'<path d="M0 84Q50 70 100 80T160 76V120H0Z" fill="#26304f"/>',zones:{sky:{x:66,y:28,w:28}}},
 road:{art:sky()+clouds+hills+'<path d="M20 120L70 84H96L120 120Z" fill="#efe3d3"/>'+place(illustrations.school,92,22,62),zones:{school:{x:78,y:72,w:30}}},
 table:{art:room()+place(illustrations.table,10,36,140),zones:{top:{x:50,y:62,w:22},topL:{x:30,y:62,w:20},topC:{x:50,y:62,w:20},topR:{x:70,y:62,w:20}}},
 plate:{art:'<rect width="160" height="120" fill="#ffe1ea"/><path d="M0 0h160v120H0z" fill="url(#none)"/>'+Array.from({length:8},(_,i)=>`<path d="M${i*20} 0V120" stroke="#ffc9d6" stroke-width="6"/>`).join('')+'<ellipse cx="80" cy="66" rx="70" ry="38" fill="#fff" stroke="#d9cfc4" stroke-width="2"/><ellipse cx="80" cy="66" rx="56" ry="28" fill="none" stroke="#efe6dc" stroke-width="2"/>',zones:{plate1:{x:28,y:55,w:20},plate2:{x:50,y:55,w:20},plate3:{x:72,y:55,w:20}}},
 mountain:{art:sky()+clouds+place(illustrations.mountain,10,8,140)+'<path d="M0 104H160V120H0Z" fill="#6cc24a"/>',zones:{top:{x:36,y:32,w:22},foot:{x:56,y:86,w:44}}},
 bedroom:{art:room('#e9e2ff')+place(illustrations.bed,52,30,104)+'<rect x="12" y="20" width="30" height="26" rx="3" fill="#bfe3ff" stroke="#1f1b3a" stroke-width="1.5"/>',zones:{bed:{x:64,y:56,w:30}}},
 playroom:{art:room('#e9e2ff')+'<ellipse cx="80" cy="100" rx="62" ry="14" fill="#ffd9a0"/>'+place(illustrations.blocks,64,64,32),zones:{rugL:{x:28,y:72,w:24},rugR:{x:74,y:72,w:20}}},
 livingroom:{art:room()+place(illustrations.sofa,14,28,132)+'<rect x="12" y="10" width="26" height="18" rx="2" fill="#1f1b3a"/><rect x="14" y="12" width="22" height="14" rx="1" fill="#5a78c9"/>',zones:{sofaL:{x:38,y:50,w:22},sofaR:{x:60,y:50,w:22}}},
 face:{art:'<rect width="160" height="120" fill="#fff8f0"/><circle cx="80" cy="62" r="46" fill="#ffd9b8" stroke="#1f1b3a" stroke-width="2.5"/><path d="M36 50Q42 12 80 14Q118 12 124 50Q104 30 80 32Q56 30 36 50Z" fill="#3b2b35"/><path d="M80 66v6" stroke="#1f1b3a" stroke-width="2.4" stroke-linecap="round"/><path d="M68 84q12 10 24 0" fill="none" stroke="#1f1b3a" stroke-width="2.6" stroke-linecap="round"/><circle cx="56" cy="78" r="5" fill="#ffb3c1"/><circle cx="104" cy="78" r="5" fill="#ffb3c1"/>',zones:{eyes:{x:50,y:46,w:44}}},
 boy:{art:room('#dcf5ec')+place(illustrations.brotherPerson,16,0,128),zones:{feet:{x:50,y:88,w:30}}},
 windy:{art:sky()+clouds+hills+flowers+`<g class="tree">${place(illustrations.tree,80,14,76)}</g>`,zones:{wind:{x:28,y:34,w:30}}}
};
// Book sentences that can be acted out. Each step: drag `prop` to `zone`; `chunks` are the sentence chunks
// (data/sentence-chunks.json) that the step acts out; `fx` is how the scene reacts. `spare` props are not in
// the sentence, so she has to read to choose.
export const SCENES={
 'sentence-8d1bfb2e94e9':{bg:'meadow',spare:['duck'],steps:[{prop:'horse',zone:'grassC',chunks:[2,3],fx:'eat'}]},
 'sentence-372ca5c2c867':{bg:'pond',spare:['horse'],steps:[{prop:'duck',zone:'pond',chunks:[2,3],fx:'swim'}]},
 'sentence-1491611629fd':{bg:'meadow',spare:['horse'],steps:[{prop:'cow',zone:'grassL',chunks:[1],fx:'eat'},{prop:'sheep',zone:'grassR',chunks:[2],fx:'eat'}]},
 'sentence-6030d13b2db7':{bg:'dawn',spare:['moonCrescent'],steps:[{prop:'sunRound',zone:'sky',chunks:[1,2],fx:'glow',flag:'day'}]},
 'sentence-3421211f50ab':{bg:'road',spare:['dadPerson'],steps:[{prop:'wePeople',zone:'school',chunks:[0,1,2],fx:'hop'}]},
 'sentence-0f6cf43cc91b':{bg:'night',spare:['sunRound'],steps:[{prop:'moonCrescent',zone:'sky',chunks:[1,2],fx:'glow'}]},
 'sentence-949b457a3a08':{bg:'night',spare:['moonCrescent'],steps:[{prop:'moonRound',zone:'sky',chunks:[0,1],fx:'glow'}]},
 'sentence-e70a1bb69012':{bg:'face',spare:['grapes'],steps:[{prop:'eyes',zone:'eyes',chunks:[0,1],fx:'blink'}]},
 'sentence-450dbb1d5851':{bg:'table',spare:['strawberry'],steps:[{prop:'grapes',zone:'top',chunks:[0,1],fx:'bounce'}]},
 'sentence-536b1e20801c':{bg:'plate',spare:[],steps:[{prop:'biscuitCircle',zone:'plate1',chunks:[1],fx:'bounce'},{prop:'biscuitSquare',zone:'plate2',chunks:[2],fx:'bounce'},{prop:'biscuitTriangle',zone:'plate3',chunks:[3],fx:'bounce'}]},
 'sentence-5566d373398c':{bg:'table',spare:['cake'],steps:[{prop:'vegetables',zone:'topL',chunks:[1],fx:'bounce'},{prop:'meat',zone:'topC',chunks:[2],fx:'bounce'},{prop:'rice',zone:'topR',chunks:[3],fx:'bounce'}]},
 'sentence-6619e8732930':{bg:'mountain',spare:['train'],steps:[{prop:'tree',zone:'top',chunks:[0,1],fx:'bounce'}]},
 'sentence-430b0ca32fbd':{bg:'mountain',spare:['tree'],steps:[{prop:'train',zone:'foot',chunks:[2,3],fx:'chug'}]},
 'sentence-ff05245fbe3d':{bg:'windy',spare:['sunRound'],steps:[{prop:'wind',zone:'wind',chunks:[0,1],fx:'blow',flag:'windy'}]},
 'sentence-536007f7ec4d':{bg:'meadow',spare:['duck'],steps:[{prop:'rabbit',zone:'grassC',chunks:[0,1],fx:'hop'}]},
 'sentence-d4203881fa4c':{bg:'bedroom',spare:['brotherPerson'],steps:[{prop:'sisterPerson',zone:'bed',chunks:[0,1],fx:'sleep'}]},
 'sentence-18aa9115a40e':{bg:'livingroom',spare:['brotherPerson'],steps:[{prop:'dadPerson',zone:'sofaL',chunks:[0],fx:'bounce'},{prop:'mumPerson',zone:'sofaR',chunks:[0],fx:'bounce'}]},
 'sentence-c5f3f59a5767':{bg:'playroom',spare:['dadPerson'],steps:[{prop:'mePerson',zone:'rugL',chunks:[0],fx:'hop'},{prop:'brotherPerson',zone:'rugR',chunks:[0],fx:'hop'}]},
 'sentence-6ef1db2f5367':{bg:'boy',spare:['shoes'],steps:[{prop:'socks',zone:'feet',chunks:[2],fx:'bounce'}]}
};
// The room for on/under sentences (小兔在床下): six spots, on and under the table, chair and bed.
// `tap` is the area she taps; `at` is where the animal appears; all in percent of the room.
const pct=(x,y,w,h)=>({x:x/1.6,y:y/1.2,w:w/1.6,h:h/1.2});
export const HIDE_ROOM={
 art:room()+
  // table
  '<rect x="8" y="68" width="48" height="6" rx="2" fill="#d9965a" '+line+'/><path d="M13 74V104M51 74V104" stroke="'+INK+'" stroke-width="4" stroke-linecap="round"/><path d="M13 74V104M51 74V104" stroke="#b9743c" stroke-width="2" stroke-linecap="round"/>'+
  // chair
  '<rect x="70" y="56" width="20" height="26" rx="3" fill="#e8ab70" '+line+'/><rect x="68" y="82" width="24" height="5" rx="2" fill="#d9965a" '+line+'/><path d="M71 87V104M89 87V104" stroke="'+INK+'" stroke-width="4" stroke-linecap="round"/><path d="M71 87V104M89 87V104" stroke="#b9743c" stroke-width="2" stroke-linecap="round"/>'+
  // bed
  '<rect x="150" y="56" width="7" height="48" rx="2" fill="#d9965a" '+line+'/><rect x="102" y="76" width="50" height="12" rx="4" fill="#fffdf8" '+line+'/><path d="M118 74Q120 68 134 69H148V86H118Z" fill="#7c5cff" '+line+'/><ellipse cx="141" cy="72" rx="7" ry="3.5" fill="#fff" '+line+'/><path d="M106 88V104M148 88V104" stroke="'+INK+'" stroke-width="4" stroke-linecap="round"/>',
 spots:{
  tableOn:{tap:pct(8,40,48,28),at:pct(32,52,30,0)},tableUnder:{tap:pct(15,75,34,29),at:pct(32,92,28,0)},
  chairOn:{tap:pct(66,34,28,22),at:pct(80,74,26,0)},chairUnder:{tap:pct(72,88,16,16),at:pct(80,97,22,0)},
  bedOn:{tap:pct(102,46,48,30),at:pct(126,62,30,0)},bedUnder:{tap:pct(108,89,38,15),at:pct(128,97,24,0)}
 }
};
export const backgroundSvg=art=>`<svg class="scene-bg" viewBox="0 0 160 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${art}</svg>`;
