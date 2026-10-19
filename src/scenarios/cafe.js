// 小餐厅 The café: a whole visit, a little different each time. She says how many are in her party, orders food
// with the right measure word (一碗面条, 一块蛋糕), chooses a drink or says 不要，谢谢, thanks the waiter, deals with
// one thing that comes up (no spoon, too hot, spilt water…), asks the price, counts out Singapore dollars and says
// goodbye. Food, drink, party size and the thing that comes up all change every visit.
import {INK,L,scene,actor,box,bubble} from '../story-kit.js';
import {picture,coin,spoon,chopsticks} from '../catalog-art.js';

// ---- Pictures ----
const SKIN='#ffd9b8';
const limb=(x1,y1,x2,y2,c,w=4.5)=>`<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${INK}" stroke-width="${w+3.5}" stroke-linecap="round"/><path d="M${x1} ${y1}L${x2} ${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
// A person standing, facing us; `kid` draws a child (smaller head-to-body).
function person({top,bottom,hair,kid=false,apron=false,extra=''}){
 return `<rect x="-6.5" y="-20" width="5.5" height="18" rx="2" fill="${bottom}" ${L} stroke-width="1.6"/><rect x="1" y="-20" width="5.5" height="18" rx="2" fill="${bottom}" ${L} stroke-width="1.6"/>
 <ellipse cx="-4" cy="-1.6" rx="5" ry="2.6" fill="#3b2b35" ${L} stroke-width="1.6"/><ellipse cx="4" cy="-1.6" rx="5" ry="2.6" fill="#3b2b35" ${L} stroke-width="1.6"/>
 ${limb(-8,-41,-13,-25,top)}${limb(8,-41,13,-25,top)}<circle cx="-13" cy="-24" r="2.8" fill="${SKIN}" ${L} stroke-width="1.6"/><circle cx="13" cy="-24" r="2.8" fill="${SKIN}" ${L} stroke-width="1.6"/>
 <path d="M-9 -44H9L10 -18H-10Z" fill="${top}" ${L}/>${apron?`<path d="M-7 -36H7L8 -16H-8Z" fill="#fff" ${L} stroke-width="1.4"/>`:''}
 <rect x="-2.5" y="-47" width="5" height="4" fill="${SKIN}"/><circle cx="0" cy="${kid?-57:-56}" r="${kid?12:11}" fill="${SKIN}" ${L}/>
 <circle cx="-4" cy="-57" r="1.6" fill="${INK}"/><circle cx="4" cy="-57" r="1.6" fill="${INK}"/><circle cx="-7" cy="-53" r="2" fill="#ffb3c1" opacity=".8"/><circle cx="7" cy="-53" r="2" fill="#ffb3c1" opacity=".8"/><path d="M-3 -51.5q3 2.6 6 0" fill="none" ${L} stroke-width="1.6"/>${hair}${extra}`;
}
const ira=person({top:'#9b6ccf',bottom:'#ff8cc6',kid:true,hair:`<path d="M-12.5 -56Q-13 -71 0 -71Q13 -71 12.5 -56Q8 -64 0 -63Q-8 -64 -12.5 -56Z" fill="#3b2b35" ${L}/><circle cx="-14" cy="-60" r="5" fill="#3b2b35" ${L}/><circle cx="14" cy="-60" r="5" fill="#3b2b35" ${L}/><path d="M-17 -64l3 2-3 3M17 -64l-3 2 3 3" stroke="#ff8cc6" stroke-width="2.4" stroke-linecap="round"/>`});
const waiter=person({top:'#3a6fd8',bottom:'#3b3a4a',apron:true,hair:`<path d="M-11.5 -56Q-12 -69 0 -69Q12 -69 11.5 -56Q6 -62 0 -61Q-6 -62 -11.5 -56Z" fill="#6b4226" ${L}/>`,extra:`<path d="M-8 -66H8l-1 -6H-7Z" fill="#fff" ${L} stroke-width="1.4"/>`});
const family=[person({top:'#3fae6e',bottom:'#3d4f9c',hair:`<path d="M-11.5 -56Q-12 -69 0 -69Q12 -69 11.5 -56Q6 -62 0 -61Q-6 -62 -11.5 -56Z" fill="#3b2b35" ${L}/>`}),
 person({top:'#ff7a45',bottom:'#3d4f9c',hair:`<path d="M-12 -52Q-15 -70 0 -70Q15 -70 12 -52Q10 -60 0 -61Q-10 -60 -12 -52Z" fill="#8a5a3b" ${L}/>`}),
 person({top:'#ffc233',bottom:'#5fbf4a',kid:true,hair:`<path d="M-12 -56Q-12 -70 0 -70Q12 -70 12 -56Q6 -63 0 -62Q-6 -63 -12 -56Z" fill="#3b2b35" ${L}/>`})];
const room=`<rect width="320" height="200" fill="#fde3cf"/><rect y="0" width="320" height="22" fill="#ff8a8a"/>${Array.from({length:16},(_,i)=>`<path d="M${i*20} 22q10 10 20 0" fill="#ff8a8a"/>`).join('')}
 <rect x="22" y="44" width="70" height="50" rx="5" fill="#bfe3ff" ${L}/><path d="M57 44v50M22 69h70" ${L}/>
 <rect x="232" y="40" width="70" height="56" rx="6" fill="#3b3a4a" ${L}/><text x="267" y="58" text-anchor="middle" font-size="9" font-weight="700" font-family="Fredoka,sans-serif" fill="#fff">MENU</text><path d="M242 66h50M242 76h40M242 86h46" stroke="#fff" stroke-width="2" opacity=".7"/>
 <rect y="150" width="320" height="50" fill="#d9a066"/><path d="M0 150H320M0 172H320M60 150v22M180 150v22M120 172v28M240 172v28" stroke="#a8703f" stroke-width="1.6"/>`;
const table=`<rect x="96" y="126" width="128" height="8" rx="3" fill="#c98b4a" ${L}/><path d="M110 134V182M210 134V182" ${L} stroke-width="5"/><path d="M110 134V182M210 134V182" stroke="#a8703f" stroke-width="2.4"/>`;
// Over the table: the order, the extra (spoon, water…) and the coins, each shown by the script when it arrives.
function cafeScene(){
 return scene('The café',`${room}${table}
 <g class="dish" transform="translate(128 96)"></g><g class="dish-drink" transform="translate(166 96)"></g><g class="dish-extra" transform="translate(194 104)"></g>
 ${actor('ira',140,186,ira,'ira')}${family.map((art,i)=>actor('family-'+i,-60,186,art,'family')).join('')}
 ${actor('waiter',380,186,waiter,'waiter')}
 ${bubble('think',150,40,166,150,118,'<g class="think-pic" transform="translate(152 42) scale(.4)"></g>')}`);
}
const nested=(svg,w=48)=>svg.replace('<svg class="art"',`<svg width="${w}" height="${w*.8}"`);
const peopleArt=n=>box('0 0 120 96',`${Array.from({length:n},(_,i)=>`<g transform="translate(${60+(i-(n-1)/2)*24} 92) scale(${n>2?.95:1.1})">${i===0?ira:family[(i-1)%3]}</g>`).join('')}`);
const icons={
 thanks:box('0 0 120 96',`<path d="M60 84C20 60 18 30 40 24Q54 20 60 36Q66 20 80 24Q102 30 60 84Z" fill="#f0507a" ${L}/>`),
 bye:box('0 0 120 96',`<path d="M44 86V40q0-8 7-8t7 8V22q0-8 7-8t7 8v18q0-6 7-6t7 6v26q0 20-22 20Z" fill="${SKIN}" ${L}/><path d="M24 30q-6 10 0 20M16 26q-8 14 0 28" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>`),
 sorry:box('0 0 120 96',`<circle cx="60" cy="48" r="34" fill="#ffd34d" ${L}/><path d="M44 42q4 3 8 0M68 42q4 3 8 0" fill="none" ${L}/><path d="M48 64q12-8 24 0" fill="none" ${L}/><path d="M86 30q6 4 4 12" fill="none" stroke="#7cc3ff" stroke-width="3" stroke-linecap="round"/>`),
 hello:box('0 0 120 96',`<path d="M44 86V40q0-8 7-8t7 8V22q0-8 7-8t7 8v18q0-6 7-6t7 6v26q0 20-22 20Z" fill="${SKIN}" ${L}/><circle cx="96" cy="26" r="10" fill="#ffd34d"/>`),
 tasty:box('0 0 120 96',`<path d="M36 50h12v32H36ZM48 52q14-6 16-28q8 0 8 12l-2 12h20q8 0 6 9l-6 22q-2 7-10 7H48Z" fill="${SKIN}" ${L}/>`),
 no:box('0 0 120 96',`<path d="M38 18H82L76 86H44Z" fill="#eef7ff" ${L}/><path d="M28 20 92 84M92 20 28 84" stroke="#f0507a" stroke-width="6" stroke-linecap="round"/>`),
 money:box('0 0 120 96',[[40,40],[62,52],[84,40],[52,66],[74,70]].map(([x,y])=>`<g transform="translate(${x-17} ${y-17}) scale(.85)">${coin.replace(/<svg[^>]*>|<\/svg>/g,'')}</g>`).join('')),
 askPrice:box('0 0 120 96',`${[[42,52],[66,58]].map(([x,y])=>`<g transform="translate(${x-17} ${y-17}) scale(.85)">${coin.replace(/<svg[^>]*>|<\/svg>/g,'')}</g>`).join('')}<text x="92" y="62" font-size="40" font-weight="700" font-family="Fredoka,sans-serif" fill="${INK}">?</text>`),
 water:picture('drinks','water'),spoon,chopsticks
};
const cover=()=>box('0 0 320 200',`${room}${table}<g transform="translate(128 96)">${nested(picture('foods','noodles'),56)}</g><g transform="translate(140 186)">${ira}</g><g transform="translate(250 186)">${waiter}</g>`);

// ---- The visit ----
let api;
const say=(key,t)=>api.say(key,t),wait=(ms,t)=>api.wait(ms,t);
const pick=list=>list[Math.floor(Math.random()*list.length)];
const MEASURE_CHUNK={碗:'yiwan',盘:'yipan',个:'yige',块:'yikuai',杯:'yibei'};
function showIn(selector,svg,w){const g=api.stage().querySelector(selector);if(g){g.innerHTML=svg?nested(svg,w):'';api.replay(g,'arrive');}}
function think(svg){const g=api.stage().querySelector('.think-pic');g.innerHTML=svg?svg.replace('<svg class="art"','<svg width="120" height="96"'):'';api.flag('thinking',!!svg);}
async function play(storyApi,t){
 api=storyApi;
 const cat=api.catalog(),menu=cat.foods.filter(f=>api.has('order-'+f.id)),order=pick(menu),drink=Math.random()<.75?pick(cat.drinks):null;
 const party=1+Math.floor(Math.random()*4),total=order.price+(drink?drink.price:0);
 // Arriving: how many of us?
 for(let i=0;i<party-1;i++)api.move('family-'+i,92+i*24,186,0);
 api.move('ira',66,186,0);
 await wait(300,t);
 api.move('waiter',248,186,1400);await wait(1400,t);
 await say('welcome',t);
 const people=n=>({key:'people-'+n,art:peopleArt(n)});
 const options=api.shuffle([1,2,3,4].filter(n=>n!==party)).slice(0,2);
 await api.choose(t,{options:[people(party),...options.map(people)],answer:'people-'+party,prompt:'welcome'});
 await api.speak(t,'people-'+party);
 // Sitting down with the menu.
 await say('sit',t);
 api.move('ira',140,186,900);for(let i=0;i<party-1;i++)api.move('family-'+i,-60,186,700);await wait(900,t);
 // Ordering food: she builds the sentence for the food in her thought bubble.
 think(picture('foods',order.id));
 await say('whatEat',t);
 const others=api.shuffle(menu.filter(f=>f.id!==order.id)).slice(0,2);
 const measures=api.shuffle([...new Set(menu.map(f=>MEASURE_CHUNK[f.measure]))].filter(m=>m!==MEASURE_CHUNK[order.measure])).slice(0,1);
 await api.build(t,{sentence:'order-'+order.id,
  parts:[{key:'chunk-woyao'},{key:'chunk-'+MEASURE_CHUNK[order.measure]},{key:api.word('foods',order.id),art:picture('foods',order.id)}],
  extras:[...measures.map(m=>({key:'chunk-'+m})),...others.map(f=>({key:api.word('foods',f.id),art:picture('foods',f.id)}))]});
 await api.speak(t,'order-'+order.id);
 // A drink, or no thank you.
 think(drink?picture('drinks',drink.id):icons.no);
 await say('whatDrink',t);
 const otherDrink=pick(cat.drinks.filter(d=>d.id!==drink?.id));
 const drinkAnswer=drink?'drink-'+drink.id:'noDrink';
 await api.choose(t,{options:[{key:drinkAnswer,art:drink?picture('drinks',drink.id):icons.no},drink?{key:'noDrink',art:icons.no}:{key:'drink-'+otherDrink.id,art:picture('drinks',otherDrink.id)}],answer:drinkAnswer,prompt:'whatDrink'});
 await api.speak(t,drinkAnswer);
 think(null);
 await say('wait',t);
 api.move('waiter',380,186,1000);await wait(1400,t);api.move('waiter',214,186,1000);await wait(1000,t);
 // The food arrives.
 showIn('.dish',picture('foods',order.id),56);if(drink)showIn('.dish-drink',picture('drinks',drink.id),40);
 await say('here',t);
 await api.choose(t,{options:[{key:'thanks',art:icons.thanks},{key:'bye',art:icons.bye},{key:'sorry',art:icons.sorry}],answer:'thanks',prompt:'here'});
 await api.speak(t,'thanks');
 // Something comes up.
 const events=[
  async()=>{await say('noSpoon',t);await api.choose(t,{options:[{key:'askSpoon',art:spoon},{key:'askWater',art:icons.water}],answer:'askSpoon',prompt:'noSpoon'});await api.speak(t,'askSpoon');showIn('.dish-extra',spoon,40);await say('giveSpoon',t);},
  async()=>{await say('noChopsticks',t);await api.choose(t,{options:[{key:'askChopsticks',art:chopsticks},{key:'askSpoon',art:spoon}],answer:'askChopsticks',prompt:'noChopsticks'});await api.speak(t,'askChopsticks');showIn('.dish-extra',chopsticks,40);await say('giveChopsticks',t);},
  async()=>{await say('tasty',t);await api.choose(t,{options:[{key:'veryTasty',art:icons.tasty},{key:'bye',art:icons.bye}],answer:'veryTasty',prompt:'tasty'});await api.speak(t,'veryTasty');},
  async()=>{api.flag('hot');await say('tooHot',t);await api.choose(t,{options:[{key:'askWater',art:icons.water},{key:'thanks',art:icons.thanks}],answer:'askWater',prompt:'tooHot'});await api.speak(t,'askWater');showIn('.dish-extra',icons.water,40);await say('giveWater',t);api.flag('hot',false);},
  async()=>{api.flag('spilt');await say('spilt',t);await api.choose(t,{options:[{key:'sorry',art:icons.sorry},{key:'veryTasty',art:icons.tasty}],answer:'sorry',prompt:'spilt'});await api.speak(t,'sorry');await say('noProblem',t);api.flag('spilt',false);}
 ];
 await pick(events)();
 // Eating up, then paying.
 api.flag('eating');await wait(1600,t);showIn('.dish','');showIn('.dish-drink','');showIn('.dish-extra','');api.flag('eating',false);
 await say('full',t);
 await api.choose(t,{options:[{key:'howMuch',art:icons.askPrice},{key:'hello',art:icons.hello}],answer:'howMuch'});
 await api.speak(t,'howMuch');
 await say('total-'+total,t);
 await say('tapCoins',t);
 await api.pay(t,{total,coinArt:coin,countKey:n=>'count-'+n});
 await say('pay',t);
 await api.speak(t,'pay');
 // Goodbye.
 await say('comeAgain',t);
 await api.choose(t,{options:[{key:'bye',art:icons.bye},{key:'hello',art:icons.hello}],answer:'bye',prompt:'comeAgain'});
 await api.speak(t,'bye');
 api.move('ira',-60,186,1400);await wait(1400,t);
}

const css=`
.story-svg .bubble-think,.story-svg .think{opacity:0}
.thinking .think{opacity:1;transform:none}
.story-svg .dish,.story-svg .dish-drink,.story-svg .dish-extra{transform-box:fill-box;transform-origin:50% 100%}
.story-svg .arrive{animation:story-pop .6s var(--spring)}
.eating .dish{animation:story-hop .3s ease-in-out 5 alternate}
.eating .actor-ira .bob{animation:story-hop .3s ease-in-out 5 alternate}
.hot .actor-ira .bob{animation:story-shiver .1s infinite alternate}
.spilt .dish-drink{transform:rotate(-80deg);transition:transform .4s}
`;
export default {firstScene:()=>cafeScene(),play,css,cover,
 avatars:{waiter:box('-16 -76 32 34',waiter),ira:box('-18 -76 36 34',ira)}};
