// 动物火车 The animal train. Ira is the conductor. Three passengers (from every animal in the catalogue) each say
// where they are going (我要去海边) and which carriage they want (我要坐红色的车厢); she builds 小猴子坐红色的车厢
// from talking cards and seats them. On the way someone is hungry (我要吃香蕉) and she hands it over (给你香蕉).
// At each station (海边到了！谁在这里下车？) she taps the passenger who gets off there. Animals, colours, places and
// snacks all come from the catalogue, so every trip is different.
import {INK,L,scene,actor,box} from '../story-kit.js';
import {picture} from '../catalog-art.js';

// ---- Pictures ----
const CARS=[[20,64],[92,64],[164,64]];
const carriage=(i,hex)=>{const [x,y]=CARS[i];return `<g class="car car-${i}" data-car="${i}"><rect x="${x}" y="${y}" width="64" height="62" rx="8" fill="${hex}" ${L}/><rect x="${x+8}" y="${y+12}" width="48" height="30" rx="5" fill="#e1f0ff" ${L}/><rect x="${x-4}" y="${y+56}" width="72" height="6" rx="2" fill="#3b3a4a" ${L}/>${[x+14,x+50].map(cx=>`<g class="wheel"><circle cx="${cx}" cy="${y+68}" r="7" fill="#3b3a4a" ${L}/><path d="M${cx-6} ${y+68}h12M${cx} ${y+62}v12" stroke="#b6b3c4" stroke-width="1.4"/></g>`).join('')}</g>`;};
const engine=`<g class="engine"><rect x="236" y="70" width="70" height="56" rx="8" fill="#e2504f" ${L}/><rect x="244" y="50" width="30" height="34" rx="4" fill="#e2504f" ${L}/><rect x="250" y="56" width="18" height="16" rx="3" fill="#e1f0ff" ${L}/><rect x="286" y="52" width="12" height="20" fill="#3b3a4a" ${L}/><path d="M306 120l10 6H306Z" fill="#ffd34d" ${L} stroke-width="1.4"/>
 <g class="smoke" fill="#e3ddd5">${[[292,42,6],[300,30,8],[310,16,10]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g>${[252,290].map(cx=>`<g class="wheel"><circle cx="${cx}" cy="132" r="9" fill="#3b3a4a" ${L}/><path d="M${cx-8} 132h16M${cx} 124v16" stroke="#b6b3c4" stroke-width="1.4"/></g>`).join('')}</g>`;
const nested=(svg,w)=>svg.replace('<svg class="art"',`<svg x="${-w/2}" y="${-w*.8}" width="${w}" height="${w*.8}"`);
const animalActor=(id,x,y)=>actor('a-'+id,x,y,nested(picture('animals',id),96),'passenger a-'+id);
function trainScene(colours,animals){
 return scene('The animal train at the station',`<rect width="320" height="200" fill="#cfeaff"/><circle cx="34" cy="28" r="13" fill="#ffd34d"/>
 <g class="hills"><path d="M0 120Q60 92 120 114T240 108 360 112 480 104 640 114V140H0Z" fill="#a6dc84"/></g>
 <rect y="138" width="320" height="6" fill="#8c5428"/><path d="M0 141H320" stroke="#5a4a3a" stroke-width="1.4" stroke-dasharray="6 6"/>
 <g class="platform"><rect y="146" width="320" height="54" fill="#d9d4cc"/><path d="M0 146H320" stroke="#b8b2a8" stroke-width="3"/></g>
 <g class="sign"><path d="M38 196V168" ${L} stroke-width="3"/><rect x="6" y="144" width="64" height="30" rx="5" fill="#fff" ${L}/><g class="sign-pic"></g></g>
 <g class="train">${colours.map((c,i)=>carriage(i,c.hex)).join('')}<path d="M84 118H92M156 118H164M228 118H236" ${L} stroke-width="3"/>${engine}</g>
 <g class="badges"></g>
 ${animals.map((id,i)=>animalActor(id,380+i*40,196)).join('')}`);
}
const smallCar=hex=>box('0 0 120 96',`<rect x="14" y="20" width="92" height="56" rx="10" fill="${hex}" ${L}/><rect x="26" y="30" width="68" height="26" rx="5" fill="#e1f0ff" ${L}/>${[36,84].map(x=>`<circle cx="${x}" cy="80" r="9" fill="#3b3a4a" ${L}/>`).join('')}`);
const handOver=box('0 0 120 96',`<path d="M20 70q20-10 44-6h26q8 0 6 8H66" fill="#ffd9b8" ${L}/>`);
const cover=()=>box('0 0 320 200',`<rect width="320" height="200" fill="#cfeaff"/><circle cx="34" cy="28" r="13" fill="#ffd34d"/><path d="M0 120Q60 92 120 114T240 108 360 112V140H0Z" fill="#a6dc84"/><rect y="138" width="320" height="6" fill="#8c5428"/><rect y="146" width="320" height="54" fill="#d9d4cc"/>
 ${['#ff4d4d','#ffd34d','#3f8cff'].map((h,i)=>carriage(i,h)).join('')}${engine}${['monkey','elephant','duck'].map((id,i)=>`<g transform="translate(${52+i*72} 120) scale(.42)">${nested(picture('animals',id),96)}</g>`).join('')}<g transform="translate(270 196) scale(.6)">${nested(picture('animals','frog'),96)}</g>`);

// ---- The trip ----
let api;
const say=(key,t)=>api.say(key,t),wait=(ms,t)=>api.wait(ms,t);
const scenes={colours:[],animals:[]};
const windowAt=i=>[CARS[i][0]+32,CARS[i][1]+54];
function setSign(place){const g=api.stage().querySelector('.sign-pic');g.innerHTML=place?`<svg x="8" y="146" width="34" height="27" viewBox="0 0 120 96">${picture('places',place.id).replace(/^<svg[^>]*>|<\/svg>$/g,'')}</svg><text x="54" y="164" text-anchor="middle" font-size="9" font-weight="700" font-family="Kaiti SC,KaiTi,serif" fill="${INK}">${place.hanzi}</text>`:'';api.replay(g,'arrive');}
function badge(i,place){const [x,y]=CARS[i];api.stage().querySelector('.badges').insertAdjacentHTML('beforeend',`<g class="badge badge-${i}"><circle cx="${x+56}" cy="${y+4}" r="11" fill="#fff" ${L} stroke-width="1.6"/><svg x="${x+47}" y="${y-3}" width="18" height="14" viewBox="0 0 120 96">${picture('places',place.id).replace(/^<svg[^>]*>|<\/svg>$/g,'')}</svg></g>`);}
async function play(storyApi,t){
 api=storyApi;
 const cat=api.catalog();
 const animals=api.shuffle(cat.animals).slice(0,3),colours=api.shuffle(cat.colours).slice(0,3),places=api.shuffle(cat.places).slice(0,3);
 const riders=animals.map((a,i)=>({animal:a,colour:colours[i],place:places[i],car:i}));
 await api.changeScene(t,trainScene(colours,animals.map(a=>a.id)),()=>{});
 api.stage().querySelector('.train').style.transform='translateX(340px)';await wait(50,t);
 api.flag('rolling');api.stage().querySelector('.train').style.transform='';await wait(1600,t);api.flag('rolling',false);
 await say('here',t);
 await say('conductor',t);
 // Boarding: each passenger says where it is going and which carriage it wants; she seats it.
 for(const r of riders){
  const id=r.animal.id;
  api.move('a-'+id,250,196,1100);await wait(1100,t);
  scenes.avatars.passenger=picture('animals',id);
  await say('go-'+r.place.id,t);
  await say('seat-'+r.colour.id,t);
  const otherAnimal=api.shuffle(cat.animals.filter(a=>!animals.includes(a)))[0],otherColour=api.shuffle(cat.colours.filter(c=>c!==r.colour))[0];
  await api.build(t,{sentence:`sit-${id}-${r.colour.id}`,
   parts:[{key:api.word('animals',id),art:picture('animals',id)},{key:'chunk-zuo'},{key:'carriage-'+r.colour.id,art:smallCar(r.colour.hex)}],
   extras:[{key:api.word('animals',otherAnimal.id),art:picture('animals',otherAnimal.id)},{key:'carriage-'+otherColour.id,art:smallCar(otherColour.hex)}]});
  await api.speak(t,`sit-${id}-${r.colour.id}`);
  const [wx,wy]=windowAt(r.car);api.move('a-'+id,wx,wy,900,.42);await wait(900,t);badge(r.car,r.place);
 }
 await say('aboard',t);
 await api.speak(t,'aboard');
 // Off we go.
 setSign(null);api.flag('moving');await say('off',t);await wait(1200,t);
 // Someone is hungry.
 const hungry=api.shuffle(riders)[0],snacks=cat.foods.filter(f=>api.has('eat-'+f.id)),snack=api.shuffle(snacks)[0];
 scenes.avatars.passenger=picture('animals',hungry.animal.id);api.replay(api.stage().querySelector('.actor-a-'+hungry.animal.id+' .cuebox'),'arrive');
 await say('hungry',t);
 await say('eat-'+snack.id,t);
 const otherSnacks=api.shuffle(snacks.filter(f=>f!==snack)).slice(0,2);
 await api.choose(t,{options:[snack,...otherSnacks].map(f=>({key:'give-'+f.id,art:picture('foods',f.id)})),answer:'give-'+snack.id,prompt:'eat-'+snack.id});
 await api.speak(t,'give-'+snack.id);
 await say('thanks',t);
 // The stations, in order: who gets off here?
 for(const r of api.shuffle(riders)){
  api.flag('moving');await wait(1400,t);api.flag('moving',false);
  setSign(r.place);
  await say('arrive-'+r.place.id,t);
  // Taps count from the moment she is asked, even while the question is still being said.
  const answer=api.tapIn(t,'.actor-a-'+riders.map(x=>x.animal.id).join(',.actor-a-'),el=>el.classList.contains('actor-a-'+r.animal.id));
  await say('who',t);await answer;
  api.chime('ding');api.move('a-'+r.animal.id,CARS[r.car][0]+32,196,900,.62);await wait(900,t);
  api.stage().querySelector('.badge-'+r.car)?.remove();
  await say('getsOff-'+r.animal.id,t);
  await api.speak(t,'getsOff-'+r.animal.id);
  scenes.avatars.passenger=picture('animals',r.animal.id);
  await say('bye',t);
  api.move('a-'+r.animal.id,-60,196,1200,.62);await wait(600,t);
 }
 await say('allThere',t);await wait(600,t);
}
const css=`
.story-svg .train{transition:transform 1.6s ease-out}
.rolling .wheel,.moving .wheel{transform-box:fill-box;transform-origin:center;animation:story-spin .5s linear infinite}
.moving .hills{animation:train-hills 3s linear infinite}
@keyframes train-hills{to{transform:translateX(-240px)}}
.moving .platform,.moving .sign{opacity:0;transition:opacity .4s}
.moving .smoke circle{animation:story-steam 1.2s ease-out infinite}
.story-svg .sign-pic.arrive{animation:story-pop .6s var(--spring)}
.story-svg .actor[class*="actor-a-"]{cursor:pointer}
.story-svg .actor.nope .bob{animation:story-no .3s ease-in-out 2}
.story-svg .cuebox.arrive{animation:story-pop .6s var(--spring)}
`;
const scenes_avatars={ira:box('-18 -76 36 34',`<circle cx="0" cy="-57" r="12" fill="#ffd9b8" ${L}/><path d="M-12.5 -56Q-13 -71 0 -71Q13 -71 12.5 -56Q8 -64 0 -63Q-8 -64 -12.5 -56Z" fill="#3b2b35" ${L}/><path d="M-11 -66H11l-2 -6H-9Z" fill="#3a6fd8" ${L} stroke-width="1.4"/><circle cx="-4" cy="-57" r="1.6" fill="${INK}"/><circle cx="4" cy="-57" r="1.6" fill="${INK}"/><path d="M-3 -51.5q3 2.6 6 0" fill="none" ${L} stroke-width="1.6"/>`),passenger:''};
scenes.avatars=scenes_avatars;
export default {firstScene:()=>trainScene([{hex:'#ff4d4d'},{hex:'#ffd34d'},{hex:'#3f8cff'}],[]),play,css,cover,avatars:scenes_avatars,handOver};
