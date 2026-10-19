// 喂动物 Feed the animals. Each round a different animal comes along and the sentence says what it wants
// (小猴子要吃香蕉); she taps that food and it flies into the animal's mouth. Any animal, any food: silly pairs are
// part of the fun, and she has to listen to the whole sentence.
import {scene,box} from '../story-kit.js';
import {picture,mouthOf} from '../catalog-art.js';

const ROUNDS=8;
const meadow=`<rect width="320" height="200" fill="#cfeaff"/><circle cx="40" cy="32" r="14" fill="#ffd34d"/><g fill="#fff"><ellipse cx="236" cy="34" rx="20" ry="7"/><ellipse cx="248" cy="29" rx="12" ry="7"/></g>
 <path d="M0 120Q80 100 160 116T320 110V200H0Z" fill="#a6dc84"/><path d="M0 160Q160 146 320 162V200H0Z" fill="#8fd16e"/>`;
const eater=id=>`<g class="eater"><svg class="eater-svg" x="70" y="34" width="180" height="144" viewBox="0 0 120 96">${picture('animals',id).replace(/^<svg[^>]*>|<\/svg>$/g,'')}</svg></g>`;
const feedScene=id=>scene('An animal waiting to be fed',`${meadow}${eater(id)}`);
const avatars={animal:''};
async function play(api,t){
 const cat=api.catalog(),animals=api.shuffle(cat.animals).slice(0,ROUNDS);
 for(const [i,animal] of animals.entries()){
  api.dots(ROUNDS,i);
  const food=api.shuffle(cat.foods)[0],others=api.shuffle(cat.foods.filter(f=>f!==food)).slice(0,2);
  const stage=api.stage();stage.querySelector('.eater').outerHTML=eater(animal.id);api.replay(stage.querySelector('.eater'),'arrive');
  avatars.animal=picture('animals',animal.id);
  const el=await api.ask(t,{say:`want-${animal.id}-${food.id}`,options:[food,...others].map(f=>({id:f.id,art:picture('foods',f.id)})),answer:food.id});
  el.classList.add('chosen');
  const [mx,my]=mouthOf(animal.id);
  await api.fly(t,el,picture('foods',food.id),stage.querySelector('.eater-svg'),[mx/120,my/96]);
  api.replay(stage.querySelector('.eater'),'munch');api.chime('ding');
  await api.say('yum',t);
  await api.sayIt(t,`want-${animal.id}-${food.id}`);
 }
 api.dots(ROUNDS,ROUNDS);
 await api.say('full',t);
}
const cover=()=>box('0 0 320 200',`${meadow}<svg x="40" y="40" width="170" height="136" viewBox="0 0 120 96">${picture('animals','monkey').replace(/^<svg[^>]*>|<\/svg>$/g,'')}</svg><svg x="200" y="96" width="90" height="72" viewBox="0 0 120 96">${picture('foods','banana').replace(/^<svg[^>]*>|<\/svg>$/g,'')}</svg>`);
const css=`
.story-svg .eater{transform-box:fill-box;transform-origin:50% 100%}
.story-svg .eater.arrive{animation:story-pop .6s var(--spring)}
.story-svg .eater.munch{animation:feed-munch .3s ease-in-out 4}
@keyframes feed-munch{50%{transform:scale(1.06,.94)}}
`;
export default {scene:cat=>feedScene(cat.animals[0].id),play,cover,css,avatars};
