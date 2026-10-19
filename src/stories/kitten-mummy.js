// 小猫找妈妈 Little kitten looks for mummy. The kitten wakes up in its basket and mummy isn't there. She taps the
// kitten to walk it on (paw prints follow), and it asks the puppy, the duckling and the bunny 你是我的妈妈吗？ — each
// shakes its head: 不是，不是！ Then 喵！喵！喵！ comes from a bush, the kitten runs, and there is the big cat: a hug.
import {INK,L,scene,target,box,funSun,funCloud,funTree,funFlower,funActors} from '../story-kit.js';

// ---- Pictures ----
// A cat side on, facing right, feet at 0,0. The kitten and its mummy are the same cat, so they look like family.
const KIT={coat:'#ffb35c',stripe:'#e8862a',belly:'#fff1dc'};
const MUM={coat:'#f7a043',stripe:'#d06a1c',belly:'#fff1dc'};
const catHead=({coat,stripe})=>`<g class="cat-head">
 <path d="M2 -33 3 -45 11 -37Z" fill="${coat}" ${L} stroke-width="1.6"/><path d="M13 -37 20 -45 21 -32Z" fill="${coat}" ${L} stroke-width="1.6"/>
 <path d="M4.5 -36.5l.6-5 3.4 3.2zM14.5 -37.5l4-4 .2 5.2z" fill="#ffb3c1"/>
 <circle cx="11" cy="-28" r="11.5" fill="${coat}" ${L}/>
 <path d="M8.5 -39v3.4M11 -39.5v4M13.5 -39v3.4" stroke="${stripe}" stroke-width="1.6" stroke-linecap="round"/>
 <g class="blink"><ellipse cx="6.5" cy="-29" rx="1.8" ry="2.3" fill="${INK}"/><ellipse cx="15.5" cy="-29" rx="1.8" ry="2.3" fill="${INK}"/><circle cx="7.1" cy="-29.8" r=".6" fill="#fff"/><circle cx="16.1" cy="-29.8" r=".6" fill="#fff"/></g>
 <circle cx="3.6" cy="-24" r="2" fill="#ff8fa3" opacity=".55"/><circle cx="18.4" cy="-24" r="2" fill="#ff8fa3" opacity=".55"/>
 <path d="M9.6 -25.6h2.8l-1.4 1.7z" fill="#ff7a90" stroke="${INK}" stroke-width=".8" stroke-linejoin="round"/>
 <path class="cat-mouth" d="M8.5 -22.6q1.25 1.5 2.5 0q1.25 1.5 2.5 0" fill="none" stroke="${INK}" stroke-width="1.2" stroke-linecap="round"/>
 <ellipse class="cat-talk" cx="11" cy="-21.6" rx="1.9" ry="1.6" fill="${INK}"/>
 <path d="M2.5 -24.6h-6M2.5 -22.6l-5.5 1.6M19.5 -24.6h6M19.5 -22.6l5.5 1.6" stroke="${INK}" stroke-width=".9" stroke-linecap="round"/></g>`;
const catBody=c=>`<g class="cat-tail"><path d="M-14 -13Q-27 -14 -25 -28Q-24 -34 -19 -32" fill="none" stroke="${INK}" stroke-width="7.4" stroke-linecap="round"/><path d="M-14 -13Q-27 -14 -25 -28Q-24 -34 -19 -32" fill="none" stroke="${c.coat}" stroke-width="4.2" stroke-linecap="round"/></g>
 ${[[-12,c.stripe],[-6,c.coat],[4,c.stripe],[10,c.coat]].map(([x,f])=>`<rect x="${x}" y="-11" width="4.6" height="11" rx="2.2" fill="${f}" ${L} stroke-width="1.6"/>`).join('')}
 <ellipse cx="-1" cy="-13" rx="15" ry="9.5" fill="${c.coat}" ${L}/><ellipse cx="2" cy="-8.5" rx="7" ry="3.2" fill="${c.belly}"/>
 <path d="M-9 -21.5q2 4 0 7M-4 -22.4q2 4 0 7M-14 -18q2 3 0 5" stroke="${c.stripe}" stroke-width="2" fill="none" stroke-linecap="round"/>
 ${catHead(c)}`;
// The big cat faces left, towards her kitten.
const mumCat=`<g transform="scale(-1.5 1.5)">${catBody(MUM)}</g>`;
// The puppy, the duckling and the bunny sit facing her; each has a `kit-head` that shakes for 不是，不是！
const puppy=`<path class="pup-tail" d="M10 -7q11-2 12-13" fill="none" stroke="${INK}" stroke-width="6.4" stroke-linecap="round"/><path class="pup-tail" d="M10 -7q11-2 12-13" fill="none" stroke="#e9c48f" stroke-width="3.4" stroke-linecap="round"/>
 <path d="M-12 0Q-15 -23 0 -25Q15 -23 12 0Z" fill="#f2d7a8" ${L}/><ellipse cx="0" cy="-12" rx="5" ry="7.5" fill="#fff6e6"/>
 <ellipse cx="-6" cy="-1" rx="4.6" ry="3" fill="#f2d7a8" ${L} stroke-width="1.6"/><ellipse cx="6" cy="-1" rx="4.6" ry="3" fill="#f2d7a8" ${L} stroke-width="1.6"/>
 <path d="M-8 -23q8 4 16 0" fill="none" stroke="#e8505b" stroke-width="3.2" stroke-linecap="round"/><circle cx="0" cy="-20" r="2" fill="#ffd34d" ${L} stroke-width="1"/>
 <g class="kit-head"><path d="M-10 -45Q-22 -43 -19 -28Q-15 -25 -11 -33Z" fill="#a8743f" ${L} stroke-width="1.6"/><path d="M10 -45Q22 -43 19 -28Q15 -25 11 -33Z" fill="#a8743f" ${L} stroke-width="1.6"/>
 <circle cx="0" cy="-35" r="12.5" fill="#f2d7a8" ${L}/><ellipse cx="5" cy="-38.5" rx="4.6" ry="4" fill="#d9a86a"/>
 <g class="blink"><circle cx="-4.6" cy="-37" r="1.9" fill="${INK}"/><circle cx="4.6" cy="-37" r="1.9" fill="${INK}"/></g>
 <ellipse cx="0" cy="-29.5" rx="6.2" ry="4.6" fill="#fff6e6"/><ellipse cx="0" cy="-32" rx="2.5" ry="1.8" fill="${INK}"/>
 <path class="pup-mouth" d="M-3 -28q1.5 1.5 3 0q1.5 1.5 3 0" fill="none" stroke="${INK}" stroke-width="1.2" stroke-linecap="round"/>
 <ellipse class="pup-talk" cx="0" cy="-27" rx="2.3" ry="1.9" fill="#e8586a" stroke="${INK}" stroke-width=".8"/></g>`;
const duckling=`<ellipse cx="-5" cy="-1" rx="4.4" ry="1.8" fill="#ff9a3c" ${L} stroke-width="1.2"/><ellipse cx="5" cy="-1" rx="4.4" ry="1.8" fill="#ff9a3c" ${L} stroke-width="1.2"/>
 <path d="M10 -15l7-5-2 7z" fill="#ffe14d" ${L} stroke-width="1.4"/>
 <ellipse cx="0" cy="-11" rx="12.5" ry="10" fill="#ffe14d" ${L}/><path d="M2 -14q9 0 7 8q-7 1-7-8z" fill="#ffd21f" ${L} stroke-width="1.4"/>
 <g class="kit-head"><path d="M-2 -36q0-6 4-5q-2 1-1 5" fill="#ffe14d" ${L} stroke-width="1.2"/><circle cx="-2" cy="-27" r="9.5" fill="#ffe14d" ${L}/>
 <g class="blink"><circle cx="-6" cy="-28.5" r="1.7" fill="${INK}"/><circle cx="2" cy="-28.5" r="1.7" fill="${INK}"/></g>
 <circle cx="-8.5" cy="-24.5" r="1.6" fill="#ff8fa3" opacity=".55"/><circle cx="4.5" cy="-24.5" r="1.6" fill="#ff8fa3" opacity=".55"/>
 <path d="M-7.5 -24q-1-3 3-3h3q4 0 3 3q-1 2-4.5 2t-4.5-2z" fill="#ff9a3c" ${L} stroke-width="1.3"/>
 <ellipse class="duck-talk" cx="-3" cy="-22.6" rx="3" ry="1.5" fill="#c4581b"/></g>`;
const carrot=`<g class="carrot" transform="translate(10 -13) rotate(35)"><path d="M0 -3.4L14 0 0 3.4Z" fill="#ff8a2a" ${L} stroke-width="1.3"/><path d="M4 -1.6v3M8 -1v2" stroke="#d9661a" stroke-width="1"/><path d="M0 -1.5-5 -5M0 0h-6M0 1.5-5 4.5" stroke="#4fb33f" stroke-width="2" stroke-linecap="round"/></g>`;
const bunny=`<ellipse cx="0" cy="-12" rx="11" ry="12" fill="#fff" ${L}/><ellipse cx="0" cy="-10" rx="5.5" ry="6.5" fill="#fdeef2"/>
 <ellipse cx="-6" cy="-1" rx="5" ry="2.6" fill="#fff" ${L} stroke-width="1.6"/><ellipse cx="6" cy="-1" rx="5" ry="2.6" fill="#fff" ${L} stroke-width="1.6"/>
 ${carrot}<circle cx="8" cy="-13" r="3" fill="#fff" ${L} stroke-width="1.4"/>
 <g class="kit-head"><g class="bun-ears"><ellipse cx="-5" cy="-46" rx="4" ry="11" transform="rotate(-8 -5 -46)" fill="#fff" ${L}/><ellipse cx="-5" cy="-45" rx="1.8" ry="7" transform="rotate(-8 -5 -45)" fill="#ffb3c1"/>
 <ellipse cx="5" cy="-46" rx="4" ry="11" transform="rotate(10 5 -46)" fill="#fff" ${L}/><ellipse cx="5" cy="-45" rx="1.8" ry="7" transform="rotate(10 5 -45)" fill="#ffb3c1"/></g>
 <circle cx="0" cy="-31" r="11" fill="#fff" ${L}/>
 <g class="blink"><circle cx="-4" cy="-32.5" r="1.8" fill="${INK}"/><circle cx="4" cy="-32.5" r="1.8" fill="${INK}"/></g>
 <circle cx="-6.5" cy="-27.5" r="1.8" fill="#ff8fa3" opacity=".6"/><circle cx="6.5" cy="-27.5" r="1.8" fill="#ff8fa3" opacity=".6"/>
 <path d="M-1.6 -28.6h3.2L0 -27z" fill="#ff7a90" stroke="${INK}" stroke-width=".8" stroke-linejoin="round"/>
 <path class="bun-mouth" d="M-2.6 -25.4q1.3 1.4 2.6 0q1.3 1.4 2.6 0" fill="none" stroke="${INK}" stroke-width="1.1" stroke-linecap="round"/>
 <ellipse class="bun-talk" cx="0" cy="-24.6" rx="1.8" ry="1.5" fill="${INK}"/></g>`;
const paw=`<g fill="#b98a5e" opacity=".55"><ellipse rx="2.1" ry="2.5"/><circle cx="-2.5" cy="-3.3" r=".9"/><circle cx="0" cy="-4.2" r=".9"/><circle cx="2.5" cy="-3.3" r=".9"/></g>`;
const heart=(x,y,s=1)=>`<path transform="translate(${x} ${y}) scale(${s})" d="M0 3C-6 -1 -6 -7 -2.5 -7Q-1 -7 0 -5Q1 -7 2.5 -7C6 -7 6 -1 0 3Z" fill="#f0507a" stroke="${INK}" stroke-width="1"/>`;

// ---- Scenes ----
const Y=176;
// The kitten that walks: the tap target travels with it, so she always taps the kitten itself.
const kittenActor=(x,extra='')=>`<g class="actor actor-kitten" style="transform:translate(${x}px,${Y}px)"><g class="bob"><g class="cuebox" data-cue="kitten">${catBody(KIT)}</g></g>
 <text class="kit-q" x="18" y="-50" text-anchor="middle">?</text>${extra}${target('kitten',2,-22,22,28)}</g>`;
const friend=(name,x,body)=>`<g class="actor actor-${name}" style="transform:translate(${x}px,${Y}px)"><g class="bob"><g class="cuebox" data-cue="${name} friend">${body}</g></g></g>`;
const kittenFun=svg=>funActors(svg,{kitten:'kitten',dog:'dog',duck:'duck',rabbit:'rabbit',mum:'mum'});
// The meadow every scene is set in, with a sandy path the kitten walks along.
const land=(sky='#cfeaff')=>`<rect width="320" height="200" fill="${sky}"/>${funSun(276,34,14)}${funCloud(70,30)}${funCloud(176,22,.8)}
 <path d="M0 120Q80 100 160 114T320 108V200H0Z" fill="#a6dc84"/><path d="M0 146Q100 136 200 144T320 142V200H0Z" fill="#8fd16e"/>
 <path d="M-10 184Q80 170 160 178T330 174" fill="none" stroke="#efdcb2" stroke-width="18" stroke-linecap="round"/>`;
const flowers=spots=>spots.map(([x,y,c])=>funFlower(x,y,c)).join('');
const paws=`<g class="kit-paws"></g>`;
// Home: the kitten asleep in its basket, and mummy's cushion beside it, empty.
function homeScene(){
 const basketBack=`<ellipse cx="0" cy="-12" rx="30" ry="9" fill="#a8642c" ${L}/><ellipse cx="0" cy="-12" rx="25" ry="6" fill="#8fc8f0"/>`;
 const basketFront=`<g style="pointer-events:none"><path d="M-30 -12Q-28 4 0 4Q28 4 30 -12Q28 -4 0 -3Q-28 -4 -30 -12Z" fill="#c98b4a" ${L}/><path d="M-22 -6l-2 8M-12 -3.4l-1 7M0 -3v7M12 -3.4l1 7M22 -6l2 8" stroke="#8c5428" stroke-width="1.4"/></g>`;
 const zzz=`<g class="kit-zzz" font-family="sans-serif" font-weight="700" fill="#6b7fd7"><text x="24" y="-44" font-size="9">z</text><text x="31" y="-53" font-size="11">z</text><text x="40" y="-64" font-size="13">Z</text></g>`;
 return kittenFun(scene('The kitten asleep in its basket',`<g class="kit-home">${land()}
 <path d="M0 64H86V176H0Z" fill="#ffe2c2" ${L}/><path d="M-6 66 43 30 92 66Z" fill="#e8605a" ${L}/><rect x="46" y="112" width="26" height="64" rx="3" fill="#b9743c" ${L}/><circle cx="66" cy="146" r="2" fill="${INK}"/>
 <rect x="12" y="84" width="22" height="22" rx="2" fill="#bfe6ff" ${L}/><path d="M23 84v22M12 95h22" stroke="${INK}" stroke-width="1.6"/>
 ${funTree(292,96,22)}<g transform="translate(292 150)"><rect x="-5" y="-30" width="10" height="30" rx="2" fill="#b9743c" ${L}/><circle cx="0" cy="-48" r="22" fill="#5fbf4a" ${L}/><circle cx="-9" cy="-55" r="5" fill="#7fd36a"/></g>
 <g transform="translate(206 ${Y})"><ellipse cx="0" cy="-5" rx="26" ry="8" fill="#c58bdc" ${L}/><ellipse cx="0" cy="-8" rx="18" ry="4" fill="#d9aee9"/><path d="M-26 -5q-4-1-6 2M26 -5q4-1 6 2" stroke="${INK}" stroke-width="1.6" fill="none"/></g>
 ${flowers([[100,166,'#ff8cc6'],[250,160,'#ffd34d'],[268,186,'#fff'],[24,190,'#ff8cc6']])}
 <g transform="translate(130 ${Y})">${basketBack}</g>${paws}
 ${kittenActor(130,zzz)}
 <g transform="translate(130 ${Y})">${basketFront}</g>
 <g class="kit-hearts"></g></g>`));
}
// Where the kitten meets each animal: the puppy by its kennel, the duckling by the pond, the bunny in the carrots.
const MEET={
 dog:{label:'The kitten meets a puppy',back:()=>`<g transform="translate(276 ${Y-2})"><path d="M-26 0V-34H26V0Z" fill="#e8605a" ${L}/><path d="M-32 -32 0 -56 32 -32Z" fill="#7a5ad8" ${L}/><path d="M-11 0V-18Q0 -30 11 -18V0Z" fill="${INK}"/></g>
  <g transform="translate(250 ${Y+4}) rotate(-10)"><path d="M-8 0h16" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M-8 0h16" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/><circle cx="-9" cy="-2" r="2.6" fill="#fff" ${L} stroke-width="1.2"/><circle cx="-9" cy="2" r="2.6" fill="#fff" ${L} stroke-width="1.2"/><circle cx="9" cy="-2" r="2.6" fill="#fff" ${L} stroke-width="1.2"/><circle cx="9" cy="2" r="2.6" fill="#fff" ${L} stroke-width="1.2"/></g>
  ${funTree(30,96,20)}<g transform="translate(30 146)"><rect x="-5" y="-26" width="10" height="26" rx="2" fill="#b9743c" ${L}/><circle cx="0" cy="-44" r="20" fill="#5fbf4a" ${L}/></g>
  ${flowers([[120,158,'#ff8cc6'],[196,154,'#ffd34d'],[300,190,'#fff'],[60,192,'#ffd34d']])}`,
  body:puppy,x:222},
 duck:{label:'The kitten meets a duckling by the pond',back:()=>`<g data-fun="pond" class="kit-pond"><ellipse cx="282" cy="168" rx="70" ry="22" fill="#5bb4ea" ${L}/><path d="M244 166q8-4 16 0M282 178q8-4 16 0M300 160q8-4 16 0" fill="none" stroke="#fff" stroke-width="1.8" opacity=".75"/>
  <g class="kit-ripples">${[0,1,2].map(i=>`<ellipse class="kit-ripple" style="--d:${i*.2}s" cx="290" cy="170" rx="${8+i*7}" ry="${3+i*2}" fill="none" stroke="#fff" stroke-width="1.8"/>`).join('')}</g>
  <ellipse cx="306" cy="176" rx="11" ry="4" fill="#4fb33f" ${L} stroke-width="1.4"/><circle cx="262" cy="160" r="3.2" fill="#ff8cc6" ${L} stroke-width="1"/><ellipse cx="262" cy="163" rx="9" ry="3" fill="#4fb33f" ${L} stroke-width="1.4"/></g>
  <g stroke="#3f8f3a" stroke-width="2.4" stroke-linecap="round">${[[214,150],[220,146],[226,152]].map(([x,y])=>`<path d="M${x} ${y}v-26"/>`).join('')}</g>${[[214,124],[220,120],[226,126]].map(([x,y])=>`<rect x="${x-2.4}" y="${y-8}" width="4.8" height="10" rx="2.4" fill="#9b6a3a" ${L} stroke-width="1"/>`).join('')}
  ${funTree(30,96,20)}<g transform="translate(30 146)"><rect x="-5" y="-26" width="10" height="26" rx="2" fill="#b9743c" ${L}/><circle cx="0" cy="-44" r="20" fill="#5fbf4a" ${L}/></g>
  ${flowers([[120,158,'#fff'],[180,152,'#ff8cc6'],[60,192,'#ffd34d']])}`,
  body:duckling,x:224},
 rabbit:{label:'The kitten meets a bunny in the carrot patch',back:()=>`<path d="M196 150H320" stroke="#c98b4a" stroke-width="3"/><path d="M196 140H320" stroke="#c98b4a" stroke-width="3"/>${[200,224,248,272,296,318].map(x=>`<rect x="${x-3}" y="132" width="6" height="24" rx="2" fill="#e0a86a" ${L} stroke-width="1.4"/>`).join('')}
  ${[[256,166],[278,170],[300,164],[290,186],[312,180],[266,190]].map(([x,y])=>`<path d="M${x} ${y}q-6-10-2-12q2 6 2 12q0-8 4-12q2 6-4 12" fill="#4fb33f" ${L} stroke-width="1.2"/><path d="M${x-3} ${y}h6l-3 3z" fill="#ff8a2a" ${L} stroke-width="1"/>`).join('')}
  ${funTree(30,96,20)}<g transform="translate(30 146)"><rect x="-5" y="-26" width="10" height="26" rx="2" fill="#b9743c" ${L}/><circle cx="0" cy="-44" r="20" fill="#5fbf4a" ${L}/></g>
  ${flowers([[120,158,'#ffd34d'],[176,150,'#fff'],[60,192,'#ff8cc6']])}`,
  body:bunny,x:220}
};
const meetScene=who=>kittenFun(scene(MEET[who].label,`${land()}${MEET[who].back()}${paws}${friend(who,MEET[who].x,MEET[who].body)}${kittenActor(-30)}`));
// The bush the meow comes from, with mummy hiding behind it.
const bush=`<g class="kit-bush" data-cue="bush" data-fun="bush">${[[246,170,22],[300,170,26],[270,150,28],[302,134,22],[244,146,18],[284,118,20]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#4fae46" ${L}/>`).join('')}
 <path d="M226 200V176H320V200Z" fill="#4fae46"/>${[[256,146],[288,126],[300,162],[266,176]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3" fill="#ff8cc6"/>`).join('')}</g>`;
function searchScene(){
 return kittenFun(scene('A meow from the bush',`${land()}${funTree(30,96,20)}<g transform="translate(30 146)"><rect x="-5" y="-26" width="10" height="26" rx="2" fill="#b9743c" ${L}/><circle cx="0" cy="-44" r="20" fill="#5fbf4a" ${L}/></g>
 ${flowers([[110,160,'#ff8cc6'],[160,152,'#ffd34d'],[60,192,'#fff'],[200,190,'#ff8cc6']])}
 <g class="actor actor-mum" style="transform:translate(286px,222px)"><g class="bob"><g class="cuebox" data-cue="mum">${mumCat}</g></g></g>
 ${bush}${paws}${kittenActor(-30)}
 <g class="kit-hearts">${[[196,120,1.4,0],[212,108,1.1,.25],[182,104,1,.5],[204,94,.9,.75]].map(([x,y,s,d])=>`<g class="kit-heart" style="--d:${d}s">${heart(x,y,s)}</g>`).join('')}</g>`));
}

const pictures={
 kitten:box('-30 -48 56 52',catBody(KIT)),
 mummy:box('-70 -76 120 80',`${mumCat}<g transform="translate(-46 0) scale(.85)">${catBody(KIT)}</g>${heart(-18,-62,1.4)}`),
 puppy:box('-24 -50 48 54',puppy),
 duckling:box('-18 -42 38 46',duckling),
 bunny:box('-20 -60 42 64',bunny),
 find:box('-30 -56 70 60',`${catBody(KIT)}<text x="34" y="-36" font-size="22" font-weight="700" font-family="sans-serif" fill="#ff7a45" stroke="${INK}" stroke-width="1">?</text>`),
 walk:box('-56 -48 84 52',`<g transform="translate(-30 3) rotate(90)">${paw}</g><g transform="translate(-44 -2) rotate(90)">${paw}</g><g transform="translate(-58 3) rotate(90)">${paw}</g>${catBody(KIT)}`),
 run:box('-48 -50 80 54',`<path d="M-44 -24h12M-46 -16h16M-42 -8h10" stroke="#ff7a45" stroke-width="2.6" stroke-linecap="round"/><g transform="rotate(-6)">${catBody(KIT)}</g>`)
};
const cover=()=>box('0 0 320 200',`<rect width="320" height="200" fill="#cfeaff"/><circle cx="276" cy="34" r="14" fill="#ffd34d"/>
 <path d="M0 120Q80 100 160 114T320 108V200H0Z" fill="#a6dc84"/><path d="M0 146Q100 136 200 144T320 142V200H0Z" fill="#8fd16e"/>
 <path d="M-10 184Q80 170 160 178T330 174" fill="none" stroke="#efdcb2" stroke-width="18" stroke-linecap="round"/>
 <g transform="translate(176 ${Y})">${puppy}</g><g transform="translate(220 ${Y})">${duckling}</g><g transform="translate(260 ${Y})">${bunny}</g>
 <g transform="translate(70 ${Y}) scale(1.5)">${catBody(KIT)}</g><text x="104" y="92" font-size="26" font-weight="700" font-family="sans-serif" fill="#ff7a45" stroke="${INK}" stroke-width="1.2">?</text>
 ${heart(296,60,1.6)}`);

// ---- The story ----
let api;
const say=(key,t)=>api.say(key,t),wait=(ms,t)=>api.wait(ms,t),flag=(name,on)=>api.flag(name,on),move=(...args)=>api.move(...args);
const $=sel=>api.stage().querySelector(sel);
let at=0;
// One step along the path: paw prints stay behind where the kitten walked.
const prints=x=>$('.kit-paws')?.insertAdjacentHTML('beforeend',`<g transform="translate(${x} ${Y+4}) rotate(90)">${paw}</g><g transform="translate(${x+9} ${Y}) rotate(90)">${paw}</g>`);
async function walkTo(t,x,ms=750){
 const from=at;at=x;move('kitten',x,Y,ms);
 for(let k=1;k<=3;k++){await wait(ms/3,t);prints(from+(x-from)*k/3-10);}
}
async function home(t){
 await wait(600,t);
 await say('wake',t);
 flag('awake');api.replay($('.actor-kitten .cuebox'),'kit-stretch');api.voice('mew');await wait(900,t);
 await say('callMum',t);
 api.replay($('.actor-kitten .cat-head'),'kit-look');await say('where',t);
 await say('walk',t);
 await say('tapKitten',t);
 await api.tap('kitten',t,'tapKitten');
 at=130;move('kitten',150,Y-14,350);await wait(350,t);move('kitten',172,Y,350);at=172;await wait(350,t);
 await walkTo(t,250,800);move('kitten',360,Y,900);await wait(900,t);
}
const FRIENDS=[['dog','seeDog','noDog','woof'],['duck','seeDuck','noDuck','quack'],['rabbit','seeRabbit','noRabbit','giggle']];
async function meet(t,[who,see,no,sound]){
 at=-30;await api.changeScene(t,meetScene(who));
 await walkTo(t,40,900);
 await say('walk',t);
 for(const x of [95,150]){await api.tap('kitten',t,'tapKitten');await walkTo(t,x);}
 api.replay($(`.actor-${who} .cuebox`),'happy-hop');api.voice(sound);
 await say(see,t);
 flag('asking');await say('ask',t);flag('asking',false);
 api.replay($(`.actor-${who} .kit-head`),'kit-no');await say(no,t);
 flag('sad');await wait(900,t);
 move('kitten',360,Y,1800);await wait(1300,t);flag('sad',false);
}
async function reunion(t){
 at=-30;await api.changeScene(t,searchScene());
 await walkTo(t,60,900);
 api.replay($('.actor-kitten .cat-head'),'kit-look');await say('search',t);
 flag('sad');await say('whereKitten',t);flag('sad',false);
 api.replay($('.kit-bush'),'kit-rustle');await say('hear',t);
 move('mum',268,176,500);api.replay($('.kit-bush'),'kit-rustle');await say('meow',t);
 flag('wonder');await say('who',t);
 move('mum',286,222,400);
 api.ambient('music');
 await say('run',t);
 await api.tap('kitten',t,'tapKitten');
 flag('wonder',false);flag('running');await walkTo(t,170,700);flag('running',false);
 $('.kit-bush').after($('.actor-mum'));move('mum',232,Y,900);await wait(900,t);
 await say('seeCat',t);
 await say('baby',t);
 flag('hug');move('kitten',184,Y,500);await wait(500,t);api.voice('purr');api.chime('yay');
 await say('hug',t);
 await say('found',t);await wait(1200,t);
}
async function play(storyApi,t){
 api=storyApi;
 api.ambient('birds');
 await home(t);
 for(const f of FRIENDS)await meet(t,f);
 await reunion(t);
}
const SOUND={kitten:'mew',dog:'woof',duck:'quack',rabbit:'giggle',mum:'purr'};
function fun(name,el,a){
 if(SOUND[name]){a.replay(el.querySelector('.cuebox'),'happy-hop');if(name==='dog')a.replay(el.querySelector('.cuebox'),'kit-wag');a.voice(SOUND[name]);return true;}
 if(name==='pond'){a.replay(a.stage().querySelector('.kit-ripples'),'kit-splash');a.effect('pop');return true;}
 if(name==='bush'){a.replay(el,'kit-rustle');a.effect('swish');return true;}
}

const css=`
.story-svg .blink{transform-box:fill-box;transform-origin:center;animation:kit-blink 4.2s infinite}
.story-svg .actor-dog .blink{animation-delay:1.1s}.story-svg .actor-duck .blink{animation-delay:2.2s}.story-svg .actor-rabbit .blink{animation-delay:3s}.story-svg .actor-mum .blink{animation-delay:.7s}
@keyframes kit-blink{0%,94%,100%{transform:none}97%{transform:scaleY(.1)}}
.story-stage:not(.awake) .kit-home .actor-kitten .blink{animation:none;transform:scaleY(.12)}
.story-svg .kit-zzz{opacity:0}
.story-stage:not(.awake) .kit-home .kit-zzz{opacity:1;animation:kit-zzz 2s ease-in-out infinite}
@keyframes kit-zzz{50%{transform:translateY(-3px)}}
.story-svg .cat-talk,.story-svg .pup-talk,.story-svg .duck-talk,.story-svg .bun-talk{opacity:0}
[data-talking="kitten"] .actor-kitten .cat-talk,[data-talking="mum"] .actor-mum .cat-talk,[data-talking="dog"] .pup-talk,[data-talking="duck"] .duck-talk,[data-talking="rabbit"] .bun-talk{animation:kit-talk .22s steps(2) infinite}
[data-talking="kitten"] .actor-kitten .cat-mouth,[data-talking="mum"] .actor-mum .cat-mouth,[data-talking="dog"] .pup-mouth,[data-talking="rabbit"] .bun-mouth{opacity:0}
@keyframes kit-talk{0%{opacity:1}100%{opacity:0}}
.story-svg .cat-head,.story-svg .kit-head{transform-box:fill-box;transform-origin:50% 90%;transition:transform .5s}
.story-svg .cat-head.kit-look{animation:kit-look 1.6s ease-in-out}
@keyframes kit-look{25%{transform:rotate(-14deg)}75%{transform:rotate(12deg)}}
.story-svg .kit-head.kit-no{animation:kit-no .32s ease-in-out 4}
@keyframes kit-no{25%{transform:rotate(-13deg)}75%{transform:rotate(13deg)}}
.sad .actor-kitten .cat-head{transform:rotate(16deg) translateY(2px)}
.sad .actor-kitten .cat-tail{transform:rotate(-40deg) translate(-3px,6px)}
.asking .actor-kitten .cat-head{transform:rotate(-8deg)}
.story-svg .cat-tail{transform-box:fill-box;transform-origin:100% 100%;transition:transform .5s;animation:kit-tail 2.6s ease-in-out infinite}
@keyframes kit-tail{50%{transform:rotate(-10deg)}}
.story-svg .cuebox.kit-stretch{animation:kit-stretch .9s ease-in-out}
@keyframes kit-stretch{40%{transform:scale(1.12,.86)}70%{transform:scale(.94,1.1) translateY(-4px)}}
.running .actor-kitten.walking .bob{animation-duration:.14s}
.story-svg .pup-tail{transform-box:fill-box;transform-origin:0 100%;animation:kit-wagging 1.2s ease-in-out infinite}
.story-svg .cuebox.kit-wag .pup-tail{animation:kit-wagging .14s ease-in-out 8}
@keyframes kit-wagging{50%{transform:rotate(-18deg)}}
.story-svg .bun-ears{transform-box:fill-box;transform-origin:50% 100%;animation:kit-ears 3.4s ease-in-out infinite}
@keyframes kit-ears{0%,80%,100%{transform:none}90%{transform:rotate(-8deg)}}
.story-svg .kit-q{opacity:0;font:700 18px sans-serif;fill:#ff7a45;stroke:${INK};stroke-width:1px;transition:opacity .3s}
.wonder .kit-q{opacity:1;animation:kit-zzz .8s ease-in-out infinite}
.story-svg .kit-bush{transform-box:fill-box;transform-origin:50% 100%}
.story-svg .kit-bush.kit-rustle{animation:kit-rustle .14s ease-in-out 6}
@keyframes kit-rustle{50%{transform:rotate(1.6deg) translateX(1px)}}
.story-svg .actor-mum{transition:transform .9s ease-out}
.story-svg .kit-ripple{opacity:0;transform-box:fill-box;transform-origin:center}
.kit-splash .kit-ripple{animation:kit-ripple 1.2s var(--d) ease-out}
@keyframes kit-ripple{0%{opacity:1;transform:scale(.3)}100%{opacity:0;transform:scale(1.5)}}
.story-svg .kit-heart{opacity:0;transform-box:fill-box;transform-origin:center}
.hug .kit-heart{animation:kit-heart 1.8s var(--d) ease-out infinite}
@keyframes kit-heart{0%{opacity:0;transform:translateY(8px) scale(.4)}25%{opacity:1;transform:scale(1.1)}100%{opacity:0;transform:translateY(-22px) scale(.9)}}
.hug .actor-kitten .bob,.hug .actor-mum .bob{animation:story-hop .45s ease-in-out infinite alternate}
.hug .actor-mum .bob{animation-delay:.2s}
`;

export default {
 firstScene:()=>homeScene(),
 scenes:()=>[homeScene(),meetScene('dog'),meetScene('duck'),meetScene('rabbit'),searchScene()],
 play,pictures,cover,css,fun,
 avatars:{
  kitten:box('-2 -47 26 30',catHead(KIT)),
  mum:box('-2 -47 26 30',catHead(MUM)),
  dog:box('-21 -50 42 34',puppy),
  duck:box('-13 -39 22 22',duckling),
  rabbit:box('-16 -58 32 40',bunny)
 }
};
