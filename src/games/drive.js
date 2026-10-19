// 开车去 Drive there. The puppy is driving. Each round it says where to go (我们去公园); she taps that place, and
// the car zooms off and arrives (公园到了！) with a honk.
import {INK,L,scene,box} from '../story-kit.js';
import {picture} from '../catalog-art.js';

const ROUNDS=6;
const inner=svg=>svg.replace(/^<svg[^>]*>|<\/svg>$/g,'');
const dog=`<path d="M-8 -36q-6-10 0-16q6 4 4 12z" fill="#a8703f" stroke="${INK}" stroke-width="1.6"/><circle cx="0" cy="-30" r="12" fill="#e8b36a" stroke="${INK}" stroke-width="2"/><path d="M-8 -38q-10 4-6 16q6-2 8-10z" fill="#a8703f" stroke="${INK}" stroke-width="1.6"/><ellipse cx="9" cy="-27" rx="6" ry="4.6" fill="#fff3dd" stroke="${INK}" stroke-width="1.6"/><ellipse cx="13" cy="-28" rx="2.4" ry="2" fill="${INK}"/><circle cx="2" cy="-33" r="2" fill="${INK}"/><path d="M8 -22q3 2 6-1" fill="none" stroke="${INK}" stroke-width="1.4"/>`;
const car=`<g class="car"><path d="M-46 0V-16Q-44 -26 -30 -26L-18 -42H18L32 -26Q46 -24 46 -12V0Z" fill="#ff4d4d" ${L}/><path d="M-14 -38H14L24 -26H-24Z" fill="#bfe3ff" ${L} stroke-width="1.6"/>
 <g transform="translate(2 -10) scale(.8)">${dog}</g>
 ${[-26,26].map(x=>`<g class="wheel"><circle cx="${x}" cy="2" r="10" fill="#3b3a4a" ${L}/><path d="M${x-8} 2h16M${x} -6v16" stroke="#b6b3c4" stroke-width="1.6"/></g>`).join('')}<circle cx="44" cy="-14" r="3" fill="#ffd34d"/></g>`;
const road=`<rect width="320" height="200" fill="#cfeaff"/><circle cx="40" cy="30" r="13" fill="#ffd34d"/><g class="hills"><path d="M0 120Q60 92 120 114T240 108 360 112 480 104 640 114V150H0Z" fill="#a6dc84"/></g>
 <rect y="148" width="320" height="40" fill="#7d7a8b"/><path d="M0 168H320" stroke="#fff" stroke-width="3" stroke-dasharray="16 12" class="lines"/><rect y="188" width="320" height="12" fill="#8fd16e"/>`;
const placeAt=id=>`<svg class="dest" x="196" y="40" width="120" height="96" viewBox="0 0 120 96">${inner(picture('places',id))}</svg>`;
const driveScene=()=>scene('A puppy driving a car',`${road}<g class="destination"></g><g class="car-at" style="transform:translate(70px,172px)">${car}</g><text class="honk" x="120" y="112" font-size="16" font-weight="700" font-family="Fredoka,sans-serif" fill="#ff7a45">嘀嘀！</text>`);
async function play(api,t){
 const cat=api.catalog(),places=api.shuffle(cat.places).slice(0,ROUNDS);
 await api.say('honk',t);
 for(const [i,place] of places.entries()){
  api.dots(ROUNDS,i);
  const s=api.stage(),carAt=s.querySelector('.car-at');
  s.querySelector('.destination').innerHTML='';carAt.style.transition='none';carAt.style.transform='translate(70px,172px)';
  const others=api.shuffle(cat.places.filter(p=>p!==place)).slice(0,2),key='go-'+place.id;
  const el=await api.ask(t,{say:key,options:[place,...others].map(p=>({id:p.id,art:picture('places',p.id)})),answer:place.id});
  el.classList.add('chosen');
  api.replay(s.querySelector('.honk'),'beep');api.chime('ding');
  api.flag('driving');void carAt.getBoundingClientRect();carAt.style.transition='transform 1.6s ease-in-out';carAt.style.transform='translate(200px,172px)';
  await api.wait(800,t);s.querySelector('.destination').innerHTML=placeAt(place.id);api.replay(s.querySelector('.destination'),'arrive');
  await api.wait(800,t);api.flag('driving',false);
  await api.say('arrive-'+place.id,t);
  await api.sayIt(t,key);
 }
 api.dots(ROUNDS,ROUNDS);
}
const cover=()=>box('0 0 320 200',`${road}${placeAt('park')}<g transform="translate(110 172)">${car}</g>`);
const css=`
.story-svg .honk{opacity:0}
.story-svg .honk.beep{animation:drive-beep .9s ease-out}
@keyframes drive-beep{0%{opacity:0;transform:translateY(4px)}30%{opacity:1}100%{opacity:0;transform:translateY(-10px)}}
.driving .wheel{transform-box:fill-box;transform-origin:center;animation:story-spin .4s linear infinite}
.driving .hills{animation:drive-hills 1.6s linear}
@keyframes drive-hills{to{transform:translateX(-120px)}}
.story-svg .destination{transform-box:fill-box;transform-origin:50% 100%}
.story-svg .destination.arrive{animation:story-pop .6s var(--spring)}
`;
export default {scene:()=>driveScene(),play,cover,css,avatars:{dog:box('-16 -46 34 30',dog)}};
