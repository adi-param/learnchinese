// 熊猫在做什么？ What's the panda doing? She hears what the panda is doing (熊猫在跳舞) and taps that panda out of
// three; then the big panda in the picture does it, with a bounce. Fifteen everyday actions.
import {L,scene,box} from '../story-kit.js';
import {panda,pandaPicture} from '../game-art.js';

const ROUNDS=8;
const park=`<rect width="320" height="200" fill="#cfeaff"/><circle cx="276" cy="30" r="14" fill="#ffd34d"/><path d="M0 120Q160 100 320 122V200H0Z" fill="#a6dc84"/><path d="M0 164Q160 152 320 166V200H0Z" fill="#8fd16e"/>`;
const big=pose=>`<g class="big-panda"><g transform="translate(160 190) scale(2.2)">${panda(pose)}</g></g>`;
const saysScene=()=>scene('A panda in the park',`${park}${big('stand')}<text class="wonder" x="214" y="70" font-size="40" font-weight="700" font-family="Fredoka,sans-serif" fill="#ff7a45">?</text>`);
async function play(api,t){
 const cat=api.catalog(),actions=api.shuffle(cat.actions).slice(0,ROUNDS);
 for(const [i,action] of actions.entries()){
  api.dots(ROUNDS,i);
  const s=api.stage();s.querySelector('.big-panda').outerHTML=big('stand');api.flag('wondering');
  const others=api.shuffle(cat.actions.filter(a=>a!==action)).slice(0,2),key='doing-'+action.id;
  const el=await api.ask(t,{say:key,options:[action,...others].map(a=>({id:a.id,art:pandaPicture(a.id)})),answer:action.id});
  el.classList.add('chosen');api.flag('wondering',false);
  s.querySelector('.big-panda').outerHTML=big(action.id);api.replay(s.querySelector('.big-panda'),'act');api.chime('yay');
  await api.wait(900,t);
  await api.sayIt(t,key);
 }
 api.dots(ROUNDS,ROUNDS);
}
const cover=()=>box('0 0 320 200',`${park}<g transform="translate(90 186) scale(1.7)">${panda('dance')}</g><g transform="translate(230 186) scale(1.7)">${panda('jump')}</g>`);
const css=`
.story-svg .big-panda{transform-box:fill-box;transform-origin:50% 100%}
.story-svg .big-panda.act{animation:story-hop .35s ease-in-out 4 alternate}
.story-svg .wonder{opacity:0;transition:opacity .3s}
.wondering .wonder{opacity:1}
`;
export default {scene:()=>saysScene(),play,cover,css};
