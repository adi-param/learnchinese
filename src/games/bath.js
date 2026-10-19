// 洗澡 Bath time. A muddy piglet sits in the bath. Each round she hears which part to wash (洗洗小猪的脚) and taps
// that part of the piglet: bubbles foam up, the mud there is gone, and sometimes the piglet giggles (好痒！).
import {INK,L,scene,box} from '../story-kit.js';

const PINK='#ffb3c1',DARK='#f28aa0',MUD='#8b6a4a';
// The piglet, facing us, in a tub. Each part has a mud spot and a tap area.
const PARTS={head:[160,40,18],ears:[[132,40],[188,40],12],eyes:[[150,62],[170,62],8],nose:[160,76,10],mouth:[160,92,8],hands:[[112,122],[208,122],12],tummy:[160,128,20],feet:[[140,178],[180,178],12]};
const spots=id=>{const s=PARTS[id];return Array.isArray(s[0])?[[...s[0],s[2]],[...s[1],s[2]]]:[s];};
const pig=`<g class="piglet">
 <ellipse cx="140" cy="178" rx="13" ry="8" fill="${DARK}" ${L}/><ellipse cx="180" cy="178" rx="13" ry="8" fill="${DARK}" ${L}/>
 <path d="M128 108 112 122M192 108 208 122" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M128 108 112 122M192 108 208 122" stroke="${PINK}" stroke-width="12" stroke-linecap="round"/>
 <ellipse cx="112" cy="122" rx="9" ry="8" fill="${DARK}" ${L}/><ellipse cx="208" cy="122" rx="9" ry="8" fill="${DARK}" ${L}/>
 <ellipse cx="160" cy="132" rx="38" ry="44" fill="${PINK}" ${L}/>
 <path d="M134 42 126 22 148 34Z" fill="${PINK}" ${L}/><path d="M186 42 194 22 172 34Z" fill="${PINK}" ${L}/>
 <circle cx="160" cy="66" r="34" fill="${PINK}" ${L}/>
 <circle cx="150" cy="60" r="4" fill="${INK}"/><circle cx="170" cy="60" r="4" fill="${INK}"/><circle cx="151.4" cy="58.6" r="1.4" fill="#fff"/><circle cx="171.4" cy="58.6" r="1.4" fill="#fff"/>
 <ellipse cx="160" cy="77" rx="13" ry="9" fill="${DARK}" ${L}/><ellipse cx="155" cy="77" rx="2" ry="3" fill="${INK}"/><ellipse cx="165" cy="77" rx="2" ry="3" fill="${INK}"/>
 <path class="smile" d="M152 92q8 6 16 0" fill="none" ${L}/><circle cx="138" cy="80" r="5" fill="#ff8fa3" opacity=".8"/><circle cx="182" cy="80" r="5" fill="#ff8fa3" opacity=".8"/></g>`;
const tub=`<path d="M70 150H250L238 196H82Z" fill="#fff" ${L}/><path d="M64 150H256" ${L} stroke-width="5"/>${[[96,148],[122,144],[200,146],[226,148],[110,152],[214,152]].map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="${8+i%3*2}" fill="#fff" stroke="#9fd3ff" stroke-width="1.6"/>`).join('')}`;
const mud=Object.keys(PARTS).map(id=>`<g class="mud mud-${id}">${spots(id).map(([x,y,r])=>`<ellipse cx="${x+2}" cy="${y+2}" rx="${r*.55}" ry="${r*.4}" fill="${MUD}" opacity=".75"/>`).join('')}</g>`).join('');
const bubbles=Object.keys(PARTS).map(id=>`<g class="foam foam-${id}">${spots(id).flatMap(([x,y,r])=>[[-6,-4],[5,-7],[8,4],[-5,6],[0,0]].map(([dx,dy],i)=>`<circle cx="${x+dx}" cy="${y+dy}" r="${r*.35+i}" fill="#fff" stroke="#9fd3ff" stroke-width="1.4"/>`)).join('')}</g>`).join('');
// Small parts on top, so a tap on the nose is the nose and not the head.
const ORDER=['tummy','head','ears','hands','feet','eyes','mouth','nose'];
const hits=ORDER.map(id=>spots(id).map(([x,y,r])=>`<circle class="part" data-part="${id}" cx="${x}" cy="${y}" r="${id==='head'?22:id==='tummy'?30:r+6}" fill="transparent"/>`).join('')).join('');
const room=`<rect width="320" height="200" fill="#dff3fb"/>${Array.from({length:8},(_,i)=>`<rect x="${i*40}" y="0" width="40" height="40" fill="none" stroke="#c3e6f3" stroke-width="2"/>`).join('')}${Array.from({length:8},(_,i)=>`<rect x="${i*40}" y="40" width="40" height="40" fill="none" stroke="#c3e6f3" stroke-width="2"/>`).join('')}`;
const bathScene=()=>scene('A muddy piglet in the bath',`${room}${pig}${mud}${bubbles}${tub}${hits}`);
async function play(api,t){
 const cat=api.catalog(),parts=api.shuffle(cat.body);
 for(const [i,part] of parts.entries()){
  api.dots(parts.length,i);
  const key='wash-'+part.id;
  await api.askIn(t,{say:key,selector:'.part',isRight:el=>el.dataset.part===part.id,hint:()=>api.stage().querySelectorAll(`.part[data-part="${part.id}"]`).forEach(e=>e.classList.add('glow'))});
  const stage=api.stage();stage.querySelectorAll('.glow').forEach(e=>e.classList.remove('glow'));
  api.replay(stage.querySelector('.foam-'+part.id),'scrub');api.chime('ding');
  stage.querySelector('.mud-'+part.id).classList.add('clean');
  if(i%3===1){api.replay(stage.querySelector('.piglet'),'giggle');await api.say('tickle',t);}
  await api.sayIt(t,key);
 }
 api.dots(parts.length,parts.length);
 api.replay(api.stage().querySelector('.piglet'),'giggle');
 await api.say('clean',t);
}
const cover=()=>box('0 0 320 200',`${room}${pig}${mud}${tub}`);
const css=`
.story-svg .foam{opacity:0;pointer-events:none}
.story-svg .mud,.story-svg .piglet{pointer-events:none}
.story-svg .foam.scrub{animation:bath-foam 1.4s ease-out}
@keyframes bath-foam{0%{opacity:0;transform:scale(.4)}25%{opacity:1;transform:scale(1.1)}70%{opacity:1}100%{opacity:0;transform:translateY(-10px)}}
.story-svg .foam{transform-box:fill-box;transform-origin:center}
.story-svg .mud{transition:opacity .6s}
.story-svg .mud.clean{opacity:0}
.story-svg .part{cursor:pointer}
.story-svg .part.glow{fill:#ffc23355;stroke:#ff7a45;stroke-width:2}
.story-svg .piglet{transform-box:fill-box;transform-origin:50% 100%}
.story-svg .piglet.giggle{animation:story-no .2s ease-in-out 4}
`;
export default {scene:()=>bathScene(),play,cover,css,avatars:{pig:box('120 20 80 70',pig)}};
