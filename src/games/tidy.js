// 收玩具 Tidy up. Toys are all over the floor. Each round she hears where one goes (把球放进箱子里): she taps the
// toy, then the place, and it hops there (in the box, on the bed, on the table, under the table, on the chair).
import {INK,L,scene,box} from '../story-kit.js';
import {picture} from '../catalog-art.js';

const ROUNDS=6;
// Where each place is in the room (for the tap area) and where a toy lands there.
const SPOTS={box:{hit:[262,150,30,24],at:[262,150]},bed:{hit:[70,104,52,20],at:[70,106]},table:{hit:[176,96,36,10],at:[176,92]},under:{hit:[176,138,30,18],at:[176,148]},chair:{hit:[262,92,20,22],at:[262,90]}};
const FLOOR=[[40,186],[104,190],[150,186],[214,190]];
const room=`<rect width="320" height="200" fill="#fde3cf"/><rect y="150" width="320" height="50" fill="#d9a066"/><path d="M0 150H320M0 172H320" stroke="#a8703f" stroke-width="1.6"/>
 <rect x="134" y="24" width="56" height="40" rx="4" fill="#bfe3ff" ${L}/><path d="M162 24v40M134 44h56" ${L}/>
 <g class="bed"><rect x="14" y="110" width="112" height="22" rx="6" fill="#7cc3ff" ${L}/><rect x="10" y="84" width="12" height="60" rx="4" fill="#c98b4a" ${L}/><rect x="22" y="100" width="30" height="14" rx="6" fill="#fff" ${L}/><path d="M118 132v12M24 132v12" ${L} stroke-width="3"/></g>
 <g class="table"><rect x="136" y="96" width="80" height="8" rx="2" fill="#c98b4a" ${L}/><path d="M144 104V150M208 104V150" ${L} stroke-width="5"/><path d="M144 104V150M208 104V150" stroke="#a8703f" stroke-width="2.4"/></g>
 <g class="chair"><path d="M248 60V130M276 60V130" ${L} stroke-width="4"/><rect x="244" y="92" width="36" height="8" rx="2" fill="#ff7fb6" ${L}/><rect x="246" y="58" width="32" height="16" rx="3" fill="#ff7fb6" ${L}/></g>
 <g class="box"><path d="M232 150H292L288 180H236Z" fill="#e8b36a" ${L}/><path d="M232 150 222 140H302L292 150" fill="#d9a066" ${L}/></g>`;
const hits=Object.entries(SPOTS).map(([id,{hit:[x,y,w,h]}])=>`<rect class="spot" data-spot="${id}" x="${x-w}" y="${y-h}" width="${w*2}" height="${h*2}" rx="8" fill="transparent"/>`).join('');
const toyAt=(id,[x,y])=>`<g class="toy" data-toy="${id}" style="transform:translate(${x}px,${y}px)"><svg x="-26" y="-42" width="52" height="42" viewBox="0 0 120 96">${picture('toys',id).replace(/^<svg[^>]*>|<\/svg>$/g,'')}</svg></g>`;
const tidyScene=toys=>scene('A messy room with toys on the floor',`${room}<g class="toys">${toys.map((id,i)=>toyAt(id,FLOOR[i%4])).join('')}</g>${hits}`);
async function play(api,t){
 const cat=api.catalog(),toys=api.shuffle(cat.toys).slice(0,ROUNDS),stage=api.stage();
 // Four toys on the floor at a time; as one is put away the next one takes its place.
 const onFloor=toys.slice(0,4),waiting=toys.slice(4);
 stage.querySelector('.story-svg').outerHTML=tidyScene(onFloor.map(x=>x.id));
 const spots=api.shuffle([...cat.spots,...cat.spots]).slice(0,ROUNDS);
 for(let i=0;i<ROUNDS;i++){
  api.dots(ROUNDS,i);
  const toy=toys[i],spot=spots[i],key=`put-${toy.id}-${spot.id}`,s=api.stage();
  const toyEl=await api.askIn(t,{say:key,selector:'.toy:not(.away)',isRight:el=>el.dataset.toy===toy.id,hint:()=>s.querySelector(`.toy[data-toy="${toy.id}"]`)?.classList.add('hint')});
  toyEl.classList.add('picked');
  await api.askIn(t,{say:key,quiet:true,selector:'.spot',isRight:el=>el.dataset.spot===spot.id,hint:()=>s.querySelector(`.spot[data-spot="${spot.id}"]`)?.classList.add('hint')});
  const [x,y]=SPOTS[spot.id].at;toyEl.classList.remove('picked');toyEl.classList.add('away');toyEl.style.transform=`translate(${x}px,${y}px) scale(${spot.id==='box'?.7:.8})`;
  s.querySelectorAll('.hint').forEach(e=>e.classList.remove('hint'));
  api.chime('ding');await api.wait(700,t);
  const next=waiting.shift();if(next){const free=FLOOR.find(([fx])=>![...s.querySelectorAll('.toy:not(.away)')].some(el=>el.style.transform.includes(`translate(${fx}px`)));s.querySelector('.toys').insertAdjacentHTML('beforeend',toyAt(next.id,free||FLOOR[0]));}
  await api.sayIt(t,key);
 }
 api.dots(ROUNDS,ROUNDS);
 await api.say('tidy',t);
}
const cover=()=>box('0 0 320 200',`${room}${['ball','robot','drum','duck'].map((id,i)=>toyAt(id,FLOOR[i]).replace(/class="toy"[^>]*style="transform:translate\(([\d.]+)px,([\d.]+)px\)"/,'transform="translate($1 $2)"')).join('')}`);
const css=`
.story-svg .toy{transition:transform .7s cubic-bezier(.3,1.4,.6,1);cursor:pointer}
.story-svg .toy.picked svg{animation:story-hop .3s ease-in-out infinite alternate}
.story-svg .toy.nope svg{animation:story-no .3s ease-in-out 2}
.story-svg .toy.hint svg{filter:drop-shadow(0 0 6px #ffc233)}
.story-svg .toy.away{pointer-events:none}
.story-svg .spot{cursor:pointer}
.story-svg .spot.hint{fill:#ffc23344;stroke:#ff7a45;stroke-width:2}
`;
export default {scene:cat=>tidyScene(cat.toys.slice(0,4).map(x=>x.id)),play,cover,css};
