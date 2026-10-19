// 穿衣服 Dress up. The rabbit wants to wear something (小兔子要穿红色的鞋子); she taps the right one, in the right
// colour, and it lands on the rabbit, who does a twirl (真漂亮！). Sometimes the weather changes: 下雨了 means the
// umbrella, 太阳好大 the sunglasses, 好冷啊 the scarf.
import {INK,L,scene,box} from '../story-kit.js';
import {clothesPicture,CLOTHES} from '../catalog-art.js';

const ROUNDS=8;
const W='#f6f2ec',PINK='#ffc2cf';
// A rabbit standing, facing us, feet at (160,186). Clothes are drawn over it in slots.
const rabbit=`<g class="rabbit">
 <ellipse cx="160" cy="188" rx="40" ry="5" fill="${INK}" opacity=".1"/>
 <ellipse cx="146" cy="180" rx="12" ry="8" fill="${W}" ${L}/><ellipse cx="174" cy="180" rx="12" ry="8" fill="${W}" ${L}/>
 <rect x="140" y="146" width="14" height="34" rx="6" fill="${W}" ${L}/><rect x="166" y="146" width="14" height="34" rx="6" fill="${W}" ${L}/>
 <path d="M134 108 120 140M186 108 200 140" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><path d="M134 108 120 140M186 108 200 140" stroke="${W}" stroke-width="9" stroke-linecap="round"/>
 <ellipse cx="160" cy="124" rx="28" ry="34" fill="${W}" ${L}/><ellipse cx="160" cy="130" rx="16" ry="20" fill="#fff"/>
 <ellipse cx="146" cy="38" rx="9" ry="28" fill="${W}" ${L} transform="rotate(-10 146 38)"/><ellipse cx="174" cy="38" rx="9" ry="28" fill="${W}" ${L} transform="rotate(10 174 38)"/>
 <ellipse cx="146" cy="38" rx="4" ry="20" fill="${PINK}" transform="rotate(-10 146 38)"/><ellipse cx="174" cy="38" rx="4" ry="20" fill="${PINK}" transform="rotate(10 174 38)"/>
 <circle cx="160" cy="76" r="26" fill="${W}" ${L}/><circle cx="150" cy="72" r="3" fill="${INK}"/><circle cx="170" cy="72" r="3" fill="${INK}"/>
 <ellipse cx="160" cy="80" rx="3.4" ry="2.4" fill="#ff8fa3"/><path d="M154 86q6 5 12 0" fill="none" ${L} stroke-width="1.8"/><circle cx="143" cy="82" r="3.4" fill="${PINK}"/><circle cx="177" cy="82" r="3.4" fill="${PINK}"/></g>`;
// Where each piece of clothing goes on the rabbit: x, y, width (the picture keeps its 5:4 shape).
const SLOTS={hat:[126,22,68],shirt:[122,90,76],coat:[118,88,84],dress:[118,90,84],trousers:[130,128,60],shoes:[124,150,72],socks:[128,138,64],
 umbrella:[178,20,110],sunglasses:[136,56,48],scarf:[130,90,60]};
const slotOf={shirt:'top',coat:'top',dress:'top',trousers:'legs',shoes:'feet',socks:'feet',hat:'head',umbrella:'umbrella',sunglasses:'eyes',scarf:'neck'};
const EXTRAS={
 umbrella:`<path d="M60 40V86q0 6-6 6" fill="none" ${L} stroke-width="3"/><path d="M14 44Q14 8 60 8Q106 8 106 44Q94 36 83 44Q72 36 60 44Q48 36 37 44Q26 36 14 44Z" fill="#9b6ccf" ${L}/>`,
 sunglasses:`<path d="M10 40H110" ${L} stroke-width="4"/><ellipse cx="36" cy="50" rx="22" ry="16" fill="#3b3a4a" ${L}/><ellipse cx="84" cy="50" rx="22" ry="16" fill="#3b3a4a" ${L}/><path d="M24 44q6-4 12-2M72 44q6-4 12-2" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/>`,
 scarf:`<path d="M14 30Q60 50 106 30L104 46Q60 64 16 46Z" fill="#ff4d4d" ${L}/><path d="M76 50 70 92H86L90 50Z" fill="#ff4d4d" ${L}/><path d="M26 38v8M44 44v8M62 46v8M80 44v8M72 82h12" stroke="#fff" stroke-width="3"/>`
};
const art=body=>`<svg class="art" viewBox="0 0 120 96" aria-hidden="true">${body}</svg>`;
const extraPicture=id=>art(EXTRAS[id]);
const worn=(id,body)=>{const [x,y,w]=SLOTS[id];return `<svg x="${x}" y="${y}" width="${w}" height="${w*.8}" viewBox="0 0 120 96">${body}</svg>`;};
const sky=`<rect width="320" height="200" fill="#ffe7f0"/><rect y="150" width="320" height="50" fill="#e8d1f5"/><path d="M0 150H320" stroke="#d5b6ea" stroke-width="2"/>
 <rect x="20" y="30" width="60" height="70" rx="6" fill="#fffaf0" ${L}/><path d="M24 34h52v62H24z" fill="#cfeaff"/><g class="weather"></g>`;
const dressScene=()=>scene('The rabbit getting dressed',`${sky}${rabbit}<g class="wearing"></g><g class="sparkles"></g>`);
const WEATHER=[{line:'rain',item:'umbrella',sky:`<path d="M30 50l-4 8M44 44l-4 8M58 52l-4 8M38 70l-4 8M54 72l-4 8" stroke="#3f8cff" stroke-width="2.4" stroke-linecap="round"/>`},
 {line:'sun',item:'sunglasses',sky:`<circle cx="50" cy="64" r="16" fill="#ffd34d"/>`},
 {line:'cold',item:'scarf',sky:`${[[34,50],[52,62],[40,80],[62,84],[60,46]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3" fill="#fff" stroke="#b6b3c4" stroke-width="1"/>`).join('')}`}];
function put(api,id,body){
 const g=api.stage().querySelector('.wearing'),slot=slotOf[id];
 g.querySelector(`[data-slot="${slot}"]`)?.remove();
 if(slot==='top')g.querySelector('[data-slot="neck"]')?.remove();
 g.insertAdjacentHTML('beforeend',`<g data-slot="${slot}" class="worn">${worn(id,body)}</g>`);
}
async function play(api,t){
 const cat=api.catalog();
 const weatherRounds=new Set(api.shuffle([2,3,4,5,6,7]).slice(0,2));let w=api.shuffle(WEATHER);
 for(let i=0;i<ROUNDS;i++){
  api.dots(ROUNDS,i);
  const stage=api.stage();
  if(weatherRounds.has(i)){
   const weather=w.pop();stage.querySelector('.weather').innerHTML=weather.sky;
   const items=api.shuffle(WEATHER.map(x=>x.item));
   const el=await api.ask(t,{say:weather.line,options:items.map(id=>({id,art:extraPicture(id)})),answer:weather.item});
   el.classList.add('chosen');
   await api.fly(t,el,extraPicture(weather.item),stage.querySelector('.rabbit'),[.5,.4]);
   put(api,weather.item,EXTRAS[weather.item]);
   api.replay(stage.querySelector('.rabbit'),'twirl');api.chime('yay');
   await api.say('pretty',t);await api.sayIt(t,weather.line);
   continue;
  }
  stage.querySelector('.weather').innerHTML='';
  const item=api.shuffle(cat.clothes)[0],colour=api.shuffle(cat.colours)[0];
  const otherColour=api.shuffle(cat.colours.filter(c=>c!==colour))[0],otherItem=api.shuffle(cat.clothes.filter(c=>c!==item))[0];
  const opts=[[item,colour],[item,otherColour],[otherItem,colour]].map(([c,col])=>({id:`${c.id}-${col.id}`,art:clothesPicture(c.id,col.hex)}));
  const key=`wear-${item.id}-${colour.id}`;
  const el=await api.ask(t,{say:key,options:opts,answer:`${item.id}-${colour.id}`});
  el.classList.add('chosen');
  await api.fly(t,el,clothesPicture(item.id,colour.hex),stage.querySelector('.rabbit'),[.5,.6]);
  put(api,item.id,CLOTHES[item.id](colour.hex));
  api.replay(stage.querySelector('.rabbit'),'twirl');api.chime('yay');
  await api.say('pretty',t);
  await api.sayIt(t,key);
 }
 api.dots(ROUNDS,ROUNDS);
}
const cover=()=>box('0 0 320 200',`${sky}${rabbit}${worn('hat',CLOTHES.hat('#ff4d4d'))}${worn('shirt',CLOTHES.shirt('#3f8cff'))}${worn('shoes',CLOTHES.shoes('#ffd34d'))}`);
const css=`
.story-svg .rabbit{transform-box:fill-box;transform-origin:50% 100%}
.story-svg .rabbit.twirl{animation:dress-twirl .8s ease-in-out}
@keyframes dress-twirl{30%{transform:scaleX(-1)}60%{transform:scaleX(1) translateY(-8px)}}
.story-svg .worn{animation:story-pop .5s var(--spring);transform-box:fill-box;transform-origin:center}
`;
export default {scene:()=>dressScene(),play,cover,css,avatars:{rabbit:box('120 40 80 70',rabbit)}};
