// 做饭 The silly kitchen. The cat chef is making soup and says what goes in next (放三个鸡蛋); she taps the plate
// with that many of that food, and they plop into the pot, which bubbles and puffs. Counting and food together:
// one plate has the right food but the wrong number, another the right number of something else.
import {INK,L,scene,box} from '../story-kit.js';
import {picture} from '../catalog-art.js';

const ROUNDS=6;
const inner=svg=>svg.replace(/^<svg[^>]*>|<\/svg>$/g,'');
// A plate with n of a food on it.
const SPOTS={1:[[60,44]],2:[[38,44],[82,44]],3:[[34,52],[60,32],[86,52]],4:[[38,30],[82,30],[38,60],[82,60]],5:[[30,30],[90,30],[60,46],[30,62],[90,62]]};
const plate=(food,n)=>`<svg class="art" viewBox="0 0 120 96" aria-hidden="true"><ellipse cx="60" cy="52" rx="56" ry="38" fill="#cfe9ff" ${L}/><ellipse cx="60" cy="52" rx="44" ry="28" fill="none" stroke="#a9d4f5" stroke-width="2"/>${SPOTS[n].map(([x,y])=>`<svg x="${x-17}" y="${y-14}" width="34" height="27" viewBox="0 0 120 96">${inner(picture('foods',food))}</svg>`).join('')}</svg>`;
const cat=`<g class="chef"><path d="M44 110q-16-6-12-26" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M44 110q-16-6-12-26" fill="none" stroke="#f2b950" stroke-width="3.6" stroke-linecap="round"/>
 <ellipse cx="60" cy="150" rx="22" ry="30" fill="#f2b950" ${L}/><path d="M44 140h32v30H44z" fill="#fff" ${L} stroke-width="1.6"/>
 <path d="M44 84 46 64 58 76ZM76 84 74 64 62 76Z" fill="#f2b950" ${L}/><circle cx="60" cy="96" r="20" fill="#f2b950" ${L}/>
 <circle cx="52" cy="94" r="2.6" fill="${INK}"/><circle cx="68" cy="94" r="2.6" fill="${INK}"/><path d="M60 100l-3 3h6z" fill="#ff8fa3"/><path d="M56 106q4 3 8 0M72 100h12M72 104l12 2M48 100H36M48 104l-12 2" fill="none" stroke="${INK}" stroke-width="1.4"/>
 <path d="M44 74Q40 52 56 56Q60 44 70 52Q84 50 78 74Z" fill="#fff" ${L}/><path d="M44 74H78" ${L} stroke-width="3"/>
 <path d="M80 140 112 116" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M80 140 112 116" stroke="#f2b950" stroke-width="5" stroke-linecap="round"/><path d="M110 118 140 92" stroke="#a8703f" stroke-width="4" stroke-linecap="round"/></g>`;
const pot=`<g class="pot"><ellipse cx="200" cy="120" rx="58" ry="12" fill="#2e2a3a" ${L}/><ellipse class="soup" cx="200" cy="121" rx="52" ry="9" fill="#ffb347"/>
 <path d="M142 120Q142 182 200 184Q258 182 258 120" fill="#e2504f" ${L}/><path d="M140 124h-12M260 124h12" ${L} stroke-width="6"/>
 <g class="bubbles">${[[180,118],[198,121],[214,117],[226,121]].map(([x,y],i)=>`<circle class="bub" style="--d:${i*.18}s" cx="${x}" cy="${y}" r="3.6" fill="#fff4dc" stroke="#e5782a" stroke-width="1"/>`).join('')}</g>
 <g class="puff">${[[184,92,16],[204,78,20],[226,94,14],[200,58,14]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="#d9d4cc" stroke-width="2"/>`).join('')}</g></g>`;
const kitchen=`<rect width="320" height="200" fill="#fff4e6"/>${Array.from({length:16},(_,i)=>`<rect x="${i*20}" y="0" width="20" height="20" fill="${i%2?'#ffe1d0':'#fff4e6'}"/>`).join('')}<rect y="184" width="320" height="16" fill="#c98b4a"/>
 <rect x="128" y="182" width="144" height="10" rx="3" fill="#77738b" ${L}/>`;
const kitchenScene=()=>scene('The cat chef and a pot of soup',`${kitchen}${pot}${cat}`);
async function play(api,t){
 const c=api.catalog(),foods=c.foods.filter(f=>api.has(`add-1-${f.id}`)),nums=[1,2,3,4,5];
 for(let i=0;i<ROUNDS;i++){
  api.dots(ROUNDS,i);
  const food=api.shuffle(foods)[0],n=api.shuffle(nums)[0];
  const wrongN=api.shuffle(nums.filter(x=>x!==n))[0],other=api.shuffle(foods.filter(f=>f!==food))[0];
  const key=`add-${n}-${food.id}`;
  const el=await api.ask(t,{say:key,options:[[food,n],[food,wrongN],[other,n]].map(([f,k])=>({id:`${f.id}-${k}`,art:plate(f.id,k)})),answer:`${food.id}-${n}`});
  el.classList.add('chosen');
  await api.fly(t,el,plate(food.id,n),api.stage().querySelector('.pot'),[.5,.25]);
  const s=api.stage();api.replay(s.querySelector('.pot'),'plop');api.replay(s.querySelector('.puff'),'show');api.chime('ding');
  await api.wait(600,t);
  await api.sayIt(t,key);
 }
 api.dots(ROUNDS,ROUNDS);
 api.replay(api.stage().querySelector('.chef'),'happy');
 await api.say('done',t);
}
const cover=()=>box('0 0 320 200',`${kitchen}${pot}${cat}`);
const css=`
.story-svg .pot{transform-box:fill-box;transform-origin:50% 100%}
.story-svg .pot.plop{animation:kitchen-plop .5s var(--spring)}
@keyframes kitchen-plop{40%{transform:scale(1.05,.94)}}
.story-svg .bub{animation:kitchen-bub 1s var(--d) ease-out infinite}
@keyframes kitchen-bub{0%{opacity:0}40%{opacity:1}100%{opacity:0;transform:translateY(-8px)}}
.story-svg .puff{opacity:0;transform-box:fill-box;transform-origin:50% 100%}
.story-svg .puff.show{animation:kitchen-puff 1.4s ease-out}
@keyframes kitchen-puff{0%{opacity:0;transform:scale(.3)}30%{opacity:1;transform:scale(1.1)}100%{opacity:0;transform:translateY(-30px) scale(1.3)}}
.story-svg .chef{transform-box:fill-box;transform-origin:50% 100%}
.story-svg .chef.happy{animation:story-hop .35s ease-in-out 6 alternate}
`;
export default {scene:()=>kitchenScene(),play,cover,css,avatars:{cat:box('34 50 52 64',cat)}};
