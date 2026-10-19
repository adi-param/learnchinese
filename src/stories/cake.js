// 谁拿走了我的蛋糕？ Who took my cake? Little Bear bakes four cakes, a circle, a square, a triangle and a rectangle,
// and she taps each one to hear its shape. While Bear fetches the milk the round cake vanishes, leaving a trail of
// crumbs. In the garden she finds the bunny, the kitten and the puppy (没有！没有！), then the little mouse in
// the log, who says sorry. Back at the table she hands every friend a cake, and everyone shares.
import {INK,L,scene,target,actor,box,countPop,funSun,funCloud,funTree,funFlower,funActors,tree} from '../story-kit.js';

// ---- Pictures ----
// One way to draw all five friends: a round body and head facing her, and what makes each one itself.
const eyes=`<g class="blink"><circle cx="-6" cy="-42" r="2.1" fill="${INK}"/><circle cx="6" cy="-42" r="2.1" fill="${INK}"/><circle cx="-5.3" cy="-42.8" r=".7" fill="#fff"/><circle cx="6.7" cy="-42.8" r=".7" fill="#fff"/></g>`;
const cheeks=`<ellipse cx="-10.5" cy="-35.5" rx="3" ry="1.8" fill="#ff8fa8" opacity=".55"/><ellipse cx="10.5" cy="-35.5" rx="3" ry="1.8" fill="#ff8fa8" opacity=".55"/>`;
const mouth=`<path class="mouth" d="M-3 -32.5q3 3 6 0" fill="none" stroke="${INK}" stroke-width="1.5" stroke-linecap="round"/><ellipse class="talk" opacity="0" cx="0" cy="-31.5" rx="2.6" ry="2.3" fill="#c94a5a" stroke="${INK}" stroke-width="1.2"/>`;
const whiskers=`<path d="M-9 -35h-8M-9 -33l-7 2M9 -35h8M9 -33l7 2" stroke="${INK}" stroke-width=".9" stroke-linecap="round"/>`;
const critter=({fur,dark,belly,back='',ears='',over='',nose,extra=''})=>`${back}
 <ellipse cx="-7" cy="-2.5" rx="6" ry="3.6" fill="${dark}" ${L} stroke-width="1.6"/><ellipse cx="7" cy="-2.5" rx="6" ry="3.6" fill="${dark}" ${L} stroke-width="1.6"/>
 <ellipse cx="0" cy="-15" rx="13" ry="14" fill="${fur}" ${L}/><ellipse cx="0" cy="-13" rx="8" ry="9" fill="${belly}"/>
 <ellipse cx="-13" cy="-17" rx="4" ry="7" transform="rotate(25 -13 -17)" fill="${fur}" ${L} stroke-width="1.6"/><ellipse cx="13" cy="-17" rx="4" ry="7" transform="rotate(-25 13 -17)" fill="${fur}" ${L} stroke-width="1.6"/>
 ${extra}<g class="head">${ears}<circle cx="0" cy="-40" r="16" fill="${fur}" ${L}/>${over}${eyes}${cheeks}${nose}${mouth}</g>`;
const BODIES={
 bear:critter({fur:'#c98a52',dark:'#8f5a2e',belly:'#f1d2a8',
  ears:`<circle cx="-12" cy="-53" r="6.5" fill="#c98a52" ${L}/><circle cx="12" cy="-53" r="6.5" fill="#c98a52" ${L}/><circle cx="-12" cy="-53" r="3" fill="#f1d2a8"/><circle cx="12" cy="-53" r="3" fill="#f1d2a8"/>`,
  nose:`<ellipse cx="0" cy="-34.5" rx="7.5" ry="5.5" fill="#f1d2a8"/><ellipse cx="0" cy="-37" rx="2.8" ry="1.9" fill="${INK}"/>`,
  extra:`<g class="held-milk" transform="translate(17 -13) scale(.75)" data-cue="milk">${''}</g>`}),
 rabbit:critter({fur:'#fdfbf7',dark:'#e6d9cc',belly:'#ffe3ea',
  ears:`<ellipse cx="-7" cy="-63" rx="5.5" ry="15" transform="rotate(-10 -7 -63)" fill="#fdfbf7" ${L}/><ellipse cx="7" cy="-63" rx="5.5" ry="15" transform="rotate(10 7 -63)" fill="#fdfbf7" ${L}/><ellipse cx="-7" cy="-63" rx="2.4" ry="10" transform="rotate(-10 -7 -63)" fill="#ffc2d1"/><ellipse cx="7" cy="-63" rx="2.4" ry="10" transform="rotate(10 7 -63)" fill="#ffc2d1"/>`,
  nose:`<path d="M-2 -37.5h4l-2 2.2z" fill="#ff8fa8" stroke="${INK}" stroke-width=".9" stroke-linejoin="round"/><path d="M-1.6 -30.6h3.2v2.4h-3.2z" fill="#fff" stroke="${INK}" stroke-width=".8"/>`}),
 cat:critter({fur:'#f6a54a',dark:'#d07a22',belly:'#fff1dc',
  back:`<path d="M10 -6q16 2 14-16q-1-6 4-7" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M10 -6q16 2 14-16q-1-6 4-7" fill="none" stroke="#f6a54a" stroke-width="4" stroke-linecap="round"/>`,
  ears:`<path d="M-15 -46L-13 -61L-3 -54Z" fill="#f6a54a" ${L}/><path d="M15 -46L13 -61L3 -54Z" fill="#f6a54a" ${L}/><path d="M-12.5 -50L-12 -57L-6.5 -53Z" fill="#ffc2d1"/><path d="M12.5 -50L12 -57L6.5 -53Z" fill="#ffc2d1"/>`,
  over:`<path d="M0 -56v5M-5 -55l1.5 4.5M5 -55l-1.5 4.5" stroke="#d07a22" stroke-width="1.8" stroke-linecap="round"/>`,
  nose:`<path d="M-2 -37.5h4l-2 2.2z" fill="#ff8fa8" stroke="${INK}" stroke-width=".9" stroke-linejoin="round"/>${whiskers}`}),
 dog:critter({fur:'#f2dcb6',dark:'#a8723f',belly:'#fff6e6',
  over:`<ellipse cx="6.5" cy="-43" rx="5.5" ry="4.5" fill="#a8723f" opacity=".75"/><ellipse cx="-15" cy="-40" rx="5" ry="11" transform="rotate(18 -15 -40)" fill="#a8723f" ${L}/><ellipse cx="15" cy="-40" rx="5" ry="11" transform="rotate(-18 15 -40)" fill="#a8723f" ${L}/>`,
  nose:`<ellipse cx="0" cy="-34.5" rx="7.5" ry="5.5" fill="#fff6e6"/><ellipse cx="0" cy="-37.5" rx="3.4" ry="2.4" fill="${INK}"/>`,
  back:`<path class="wag" d="M11 -8q9-4 10-14" fill="none" stroke="${INK}" stroke-width="6.5" stroke-linecap="round"/><path class="wag" d="M11 -8q9-4 10-14" fill="none" stroke="#f2dcb6" stroke-width="3.6" stroke-linecap="round"/>`}),
 mouse:critter({fur:'#b9b6c8',dark:'#8e8aa3',belly:'#eeeaf5',
  back:`<path d="M9 -5q18 4 20-10q2-9 9-6" fill="none" stroke="#ff9fb4" stroke-width="2.4" stroke-linecap="round"/>`,
  ears:`<circle cx="-13" cy="-52" r="9.5" fill="#b9b6c8" ${L}/><circle cx="13" cy="-52" r="9.5" fill="#b9b6c8" ${L}/><circle cx="-13" cy="-52" r="5.6" fill="#ffc2d1"/><circle cx="13" cy="-52" r="5.6" fill="#ffc2d1"/>`,
  nose:`<circle cx="0" cy="-36.5" r="2.4" fill="#ff8fa8" stroke="${INK}" stroke-width=".9"/>${whiskers}<g class="crumbs" fill="#e0a95c"><circle cx="-8" cy="-30" r="1.2"/><circle cx="6" cy="-29" r="1"/><circle cx="9" cy="-32" r=".9"/><circle cx="-4" cy="-27.5" r=".9"/></g>`})
};
const milkBottle=`<path d="M-4 -19h8v4l3.5 4.5V0h-15v-10.5l3.5-4.5z" fill="#fff" ${L} stroke-width="1.6"/><rect x="-4.5" y="-22" width="9" height="3.5" rx="1" fill="#5aa9e6" ${L} stroke-width="1.2"/><rect x="-7.5" y="-8" width="15" height="4.5" fill="#bfe2ff"/>`;
BODIES.bear=BODIES.bear.replace(`data-cue="milk">`,`data-cue="milk">${milkBottle}`);
const SCALE={bear:1.08,rabbit:.95,cat:.92,dog:.98,mouse:.62};
const friend=who=>`<g transform="scale(${SCALE[who]})">${BODIES[who]}</g>`;

// The cakes, each its own shape, so the shape is the first thing she sees. Drawn standing on a plate at 0,0.
const sprinkles=pts=>pts.map(([x,y],i)=>`<rect x="${x}" y="${y}" width="3.4" height="1.4" rx=".7" fill="${['#ff6b8b','#4fb3ff','#ffd34d','#7cd36a'][i%4]}" transform="rotate(${i*47} ${x+1.7} ${y+.7})"/>`).join('');
const cherry=y=>`<path d="M0 ${y-3}q2-5 6-6" fill="none" stroke="#3d8b37" stroke-width="1.4" stroke-linecap="round"/><circle cx="0" cy="${y}" r="3.6" fill="#e8344e" ${L} stroke-width="1.4"/><circle cx="-1.2" cy="${y-1.2}" r="1" fill="#fff" opacity=".8"/>`;
const CAKES={
 round:`<circle cx="0" cy="-18" r="17" fill="#ffb3c7" ${L}/><path d="M-16.4 -18H16.4" stroke="#fff" stroke-width="3.4"/><path d="M-16.4 -18H16.4" stroke="#ff8fab" stroke-width="1" transform="translate(0 2.5)"/><path d="M-12 -30q4 5 6 0q3 6 6 0q3 6 6 0q3 5 6 0" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>${sprinkles([[-9,-11],[3,-9],[-2,-25],[8,-14]])}${cherry(-37)}`,
 square:`<rect x="-16" y="-33" width="32" height="32" rx="2.5" fill="#ffe08a" ${L}/><path d="M-15 -17H15" stroke="#fff" stroke-width="3.4"/><path d="M-15 -30H15" stroke="#fff" stroke-width="3" stroke-linecap="round"/>${sprinkles([[-10,-9],[4,-8],[-6,-25],[7,-24]])}${cherry(-36.5)}`,
 triangle:`<path d="M0 -36L19 -1H-19Z" fill="#b8e8c8" ${L}/><path d="M-11.5 -14.5H11.5" stroke="#fff" stroke-width="3.4"/>${sprinkles([[-8,-7],[3,-7],[-2,-22]])}${cherry(-39.5)}`,
 oblong:`<rect x="-25" y="-22" width="50" height="21" rx="2.5" fill="#ffc18a" ${L}/><path d="M-24 -11H24" stroke="#fff" stroke-width="3.4"/>${sprinkles([[-19,-18],[-6,-7],[8,-18],[16,-7]])}<g transform="translate(-10 0)">${cherry(-25.5)}</g><g transform="translate(10 0)">${cherry(-25.5)}</g>`,
 choc:`<rect x="-15" y="-26" width="30" height="25" rx="2" fill="#8a5a3b" ${L}/><path d="M-15 -26h30v5q-3 4-5 0q-3 6-6 0q-3 5-6 0q-3 6-6 0q-3 4-7 0z" fill="#5b3622" ${L} stroke-width="1.4"/><rect x="-9" y="-36" width="8" height="11" rx="1" transform="rotate(-12 -5 -30)" fill="#6b3f26" ${L} stroke-width="1.4"/><rect x="2" y="-35" width="8" height="10" rx="1" transform="rotate(14 6 -30)" fill="#6b3f26" ${L} stroke-width="1.4"/><path d="M-12 -12h4M-2 -14h4M7 -10h4" stroke="#c48b62" stroke-width="1.6" stroke-linecap="round"/>`
};
const plate=`<ellipse cx="0" cy="0" rx="22" ry="3.6" fill="#fff" ${L} stroke-width="1.6"/>`;
const cake=kind=>`<g class="cake">${plate}${CAKES[kind]}</g>`;

// Little Bear's kitchen: a window, a shelf, the table with four cakes, the pantry door, and a mouse hole.
const KITCHEN=[['round',82],['square',124],['triangle',166],['oblong',214]];
const crumbs=[[72,131],[62,137],[56,146],[48,151],[39,149],[30,146]];
function kitchenScene(){
 return funActors(scene('Little Bear’s kitchen with four cakes',`<rect width="320" height="200" fill="#fff1dc"/>
 <g fill="#ffe1bf">${Array.from({length:30},(_,i)=>`<circle cx="${12+(i%10)*32+(Math.floor(i/10)%2)*16}" cy="${14+Math.floor(i/10)*40}" r="3"/>`).join('')}</g>
 <rect y="140" width="320" height="60" fill="#e9c79b"/><path d="M0 140H320" ${L}/>${[40,100,160,220,280].map(x=>`<path d="M${x} 140l-12 60" stroke="#d4ab78" stroke-width="1.5"/>`).join('')}
 <rect x="22" y="22" width="62" height="54" rx="4" fill="#cfeaff" ${L}/>${funSun(66,40,8)}${funCloud(38,52,.7)}<path d="M53 22v54M22 49h62" ${L} stroke-width="3"/>
 <path d="M16 78h74" stroke="#c98a52" stroke-width="5" stroke-linecap="round"/>
 <path d="M104 64h138" stroke="#b9743c" stroke-width="5" stroke-linecap="round"/>
 <g transform="translate(118 62)"><rect x="-7" y="-16" width="14" height="16" rx="3" fill="#ffd34d" ${L} stroke-width="1.6"/><rect x="-8" y="-19" width="16" height="4" rx="1.5" fill="#ff7a45" ${L} stroke-width="1.4"/></g>
 <g transform="translate(142 62)"><rect x="-6" y="-20" width="12" height="20" rx="3" fill="#b8e8c8" ${L} stroke-width="1.6"/><rect x="-7" y="-23" width="14" height="4" rx="1.5" fill="#ff7a45" ${L} stroke-width="1.4"/></g>
 <g transform="translate(176 62)"><path d="M-12 0q0-14 12-14t12 14z" fill="#fff" ${L} stroke-width="1.6"/><path d="M-6 -9h12" stroke="#ff8fab" stroke-width="2"/></g>
 <g transform="translate(220 62)"><circle cx="0" cy="-10" r="10" fill="#7cc867" ${L} stroke-width="1.6"/><rect x="-6" y="-6" width="12" height="6" rx="1" fill="#ff9a5c" ${L} stroke-width="1.4"/></g>
 <path d="M12 141V130a10 10 0 0 1 20 0V141Z" fill="#3a2614" ${L}/>
 <g class="peek-tail"><path d="M30 139q9 3 14-3q4-5 8-1" fill="none" stroke="#ff9fb4" stroke-width="2.6" stroke-linecap="round"/></g>
 <g class="crumbs-trail" fill="#e0a95c">${crumbs.map(([x,y],i)=>`<circle class="crumb" style="--d:${(crumbs.length-i)*.12}s" cx="${x}" cy="${y}" r="${1.8-i*.1}"/>`).join('')}</g>
 <rect x="266" y="50" width="48" height="92" fill="#c99b6a" ${L}/><path d="M272 92h36" stroke="#8f5a2e" stroke-width="3"/><g class="shelf-milk" transform="translate(290 91)" data-cue="milk">${milkBottle}</g><g transform="translate(278 91)"><rect x="-5" y="-12" width="10" height="12" rx="2" fill="#ffd34d" ${L} stroke-width="1.4"/></g>
 <path d="M266 50l-14 6v80l14 6" fill="#ff9a5c" ${L} data-fun="door"/><circle cx="257" cy="100" r="2" fill="${INK}"/>
 <rect x="54" y="126" width="188" height="8" rx="3" fill="#ffb3c7" ${L}/><path d="M60 134V172M236 134V172" ${L} stroke-width="5"/><path d="M60 134V172M236 134V172" stroke="#c98a52" stroke-width="2.4"/>
 <path d="M58 134q8 10 16 0t16 0 16 0 16 0 16 0 16 0 16 0 16 0 16 0 16 0 16 0 16 0" fill="#fff" ${L} stroke-width="1.4"/>
 <g class="cakes-all">${KITCHEN.map(([kind,x])=>actor('cake-'+kind,x,127,cake(kind),'cakes cake-'+kind)).join('')}</g>
 ${actor('bear',236,196,friend('bear'))}
 ${countPop(160,52)}
 ${KITCHEN.map(([kind,x])=>target('cake-'+kind,x,108,kind==='oblong'?22:19)).join('')}`)
 ,{bear:'bear',...Object.fromEntries(KITCHEN.map(([kind])=>['cake-'+kind,'cake']))});
}

// The garden, where everyone might be hiding: a bush, a basket, a kennel and a hollow log.
const bush=(x,y)=>{const puffs=[[-15,4,14],[0,-4,17],[16,4,14],[-6,8,13],[8,8,13]];return `<g class="bush" data-fun="bush">${puffs.map(([dx,dy,r])=>`<circle cx="${x+dx}" cy="${y+dy}" r="${r}" fill="#4fae47" ${L}/>`).join('')}${puffs.map(([dx,dy,r])=>`<circle cx="${x+dx}" cy="${y+dy}" r="${r-1.2}" fill="#4fae47"/>`).join('')}<circle cx="${x-4}" cy="${y-6}" r="2.6" fill="#ff8cc6"/><circle cx="${x+12}" cy="${y+2}" r="2.6" fill="#ffd34d"/><circle cx="${x-14}" cy="${y+6}" r="2.6" fill="#fff"/></g>`;};
const basket=x=>`<g class="basket" data-fun="basket"><path d="M${x-26} 160H${x+26}L${x+19} 190H${x-19}Z" fill="#d9a35f" ${L}/>${[-14,-4,6,16].map(d=>`<path d="M${x+d-1} 162l-2 26" stroke="#b07a3a" stroke-width="1.6"/>`).join('')}<path d="M${x-23} 172H${x+23}M${x-21} 181H${x+21}" stroke="#b07a3a" stroke-width="1.6"/><rect x="${x-28}" y="156" width="56" height="7" rx="3.5" fill="#e7b877" ${L}/></g>`;
const kennel=x=>`<g class="kennel" data-fun="kennel"><rect x="${x-24}" y="144" width="48" height="44" fill="#e26d5a" ${L}/><path d="M${x-31} 148L${x} 120L${x+31} 148Z" fill="#8a5a3b" ${L}/><path d="M${x-11} 188V170a11 11 0 0 1 22 0V188Z" fill="#4a2a1c" ${L}/><rect x="${x-9}" y="149" width="18" height="7" rx="2" fill="#fff4d6" ${L} stroke-width="1.2"/><path d="M${x-4} 152.5h8" stroke="#a8723f" stroke-width="1.4"/></g>`;
const log=x=>`<g class="log" data-fun="log"><rect x="${x}" y="160" width="60" height="30" rx="6" fill="#b9743c" ${L}/><path d="M${x+18} 168h22M${x+28} 180h20" stroke="#8f5a2e" stroke-width="1.8" stroke-linecap="round"/><ellipse cx="${x}" cy="175" rx="9" ry="15" fill="#e0b07a" ${L}/><ellipse cx="${x}" cy="176" rx="5" ry="9" fill="#3a2614"/></g>`;
// Where each friend hides and where they pop up to. Bear stays at the side, so nobody is hidden behind him.
const HIDE={rabbit:{spot:'bush',from:[94,200],to:[94,170]},cat:{spot:'basket',from:[160,200],to:[160,178]},dog:{spot:'kennel',from:[226,186],to:[226,197]}};
const LOG=278;
const away=(svg,names)=>names.reduce((out,name)=>out.replace(`class="actor actor-${name}"`,`class="actor actor-${name} away"`),svg);
function gardenScene(){
 return away(funActors(scene('The garden: a bush, a basket, a kennel and a log',`<rect width="320" height="200" fill="#cfeaff"/>${funSun(40,34,14)}${funCloud(120,28)}${funCloud(220,40,.8)}
 <path d="M0 112Q80 92 170 106T320 98V200H0Z" fill="#a6dc84"/>${tree(300,132,.8)}${funTree(300,100,16)}${tree(150,118,.6)}${funTree(150,94,12)}
 <g fill="#fffaf0" ${L} stroke-width="1.4">${Array.from({length:21},(_,i)=>`<path d="M${i*16-3} 150v-18l3-4 3 4v18z"/>`).join('')}</g><path d="M0 136H320M0 145H320" stroke="#fffaf0" stroke-width="2.4"/>
 <path d="M0 150Q90 140 180 148T320 146V200H0Z" fill="#7cc867"/>
 ${[[18,186,'#ff8cc6'],[120,194,'#fff'],[190,190,'#ffd34d'],[250,196,'#ff8cc6']].map(([x,y,c])=>funFlower(x,y,c)).join('')}
 ${actor('rabbit',...HIDE.rabbit.from,friend('rabbit'))}${bush(94,172)}
 ${actor('cat',...HIDE.cat.from,friend('cat'))}${basket(160)}
 ${kennel(226)}${actor('dog',...HIDE.dog.from,friend('dog'))}
 ${log(LOG)}${actor('mouse',LOG-8,194,friend('mouse'))}
 ${actor('bear',32,198,friend('bear'))}
 ${target('bush',94,166,20)}${target('basket',160,170,20)}${target('kennel',226,170,18)}${target('log',LOG,175,16,22)}`),
 {bear:'bear',rabbit:'rabbit',cat:'cat',dog:'dog',mouse:'mouse'}),['rabbit','cat','dog','mouse']);
}

// The party: everyone behind the table, the cakes on a tray in front for her to hand out.
const SEATS={rabbit:46,cat:102,dog:158,bear:214};
const SERVE=[['triangle','rabbit','eatRabbit',46,84],['square','cat','eatCat',102,132],['oblong','dog','eatDog',158,184],['choc','bear','eatBear',246,240]];
const confetti=Array.from({length:22},(_,i)=>`<rect x="${8+i*14.3}" y="-8" width="4" height="7" rx="1" fill="${['#ff6b8b','#4fb3ff','#ffd34d','#7cd36a','#b98cff'][i%5]}" style="--d:${(i*.37)%2.2}s"/>`).join('');
function partyScene(){
 const tray=SERVE.map(([kind,,,,x])=>actor('cake-'+kind,x,188,kind==='choc'?`<g class="treat">${cake(kind)}</g>`:cake(kind),'cakes cake-'+kind).replace(`translate(${x}px,188px)"`,`translate(${x}px,188px) scale(.8)"`)).join('');
 return funActors(scene('Everyone at the table, sharing the cakes',`<rect width="320" height="200" fill="#fff1dc"/>
 <g fill="#ffe1bf">${Array.from({length:30},(_,i)=>`<circle cx="${12+(i%10)*32+(Math.floor(i/10)%2)*16}" cy="${14+Math.floor(i/10)*40}" r="3"/>`).join('')}</g>
 <path d="M10 18Q60 34 110 18T210 18 310 18" fill="none" stroke="#c98a52" stroke-width="1.4"/>${[30,60,90,130,160,190,230,260,290].map((x,i)=>`<path d="M${x-6} ${20+Math.sin(x/16)*4}l6 10 6-10z" fill="${['#ff8fab','#ffd34d','#7cc5ff'][i%3]}" ${L} stroke-width="1.2"/>`).join('')}
 <rect y="160" width="320" height="40" fill="#e9c79b"/>
 <g class="friends" data-cue="friends">${['rabbit','cat','dog','bear'].map(who=>actor(who,SEATS[who],138,friend(who))).join('')}</g>
 <rect x="10" y="128" width="300" height="9" rx="3" fill="#ffb3c7" ${L}/><path d="M14 137q8 10 16 0${'t16 0'.repeat(17)}" fill="#fff" ${L} stroke-width="1.4"/>
 <path d="M24 137V162M296 137V162" ${L} stroke-width="5"/><path d="M24 137V162M296 137V162" stroke="#c98a52" stroke-width="2.4"/>
 <g data-cue="friends">${actor('mouse',272,129,friend('mouse'))}</g>
 <g class="treat" transform="translate(298 129) scale(.8)" data-cue="milk">${milkBottle}</g>
 <ellipse cx="162" cy="190" rx="112" ry="7" fill="#c0c7d6" ${L}/><ellipse cx="162" cy="188" rx="104" ry="4" fill="#dfe4ee"/>
 ${tray}
 <g class="confetti">${confetti}</g>
 ${SERVE.map(([kind,,,,x])=>target('serve-'+kind,x,170,17,20)).join('')}`),
 {rabbit:'rabbit',cat:'cat',dog:'dog',bear:'bear',mouse:'mouse','cake-triangle':'cake','cake-square':'cake','cake-oblong':'cake','cake-choc':'cake'}).replace(`class="actor actor-cake-choc"`,`class="actor actor-cake-choc" data-cue="choc"`);
}

// Pictures for the word cards.
const pictures={
 cake:box('-46 -44 92 48',`<g transform="translate(-22 0) scale(.85)">${cake('square')}</g><g transform="translate(22 0) scale(.85)">${cake('triangle')}</g><g transform="translate(0 2)">${cake('choc')}</g>`),
 circle:box('-24 -44 48 48',cake('round')),
 square:box('-24 -44 48 48',cake('square')),
 triangle:box('-24 -46 48 50',cake('triangle')),
 rectangle:box('-30 -36 60 40',cake('oblong')),
 chocolate:box('-24 -42 48 46',cake('choc')),
 milk:box('-14 -26 28 30',milkBottle),
 sweet:box('-26 -54 52 58',`${cake('square')}<path d="M-14 -40q-4-4 0-8t0-8M0 -42q-4-4 0-8t0-8M14 -40q-4-4 0-8t0-8" fill="none" stroke="#c9b8d8" stroke-width="2" stroke-linecap="round"/><path d="M18 -18c-2-3-7 0-3 4l3 2.5 3-2.5c4-4-1-7-3-4z" fill="#f0507a"/>`)
};
const cover=()=>box('0 0 320 200',`<rect width="320" height="200" fill="#fff1dc"/><rect y="140" width="320" height="60" fill="#e9c79b"/><path d="M0 140H320" ${L}/>
 <rect x="22" y="22" width="62" height="54" rx="4" fill="#cfeaff" ${L}/><circle cx="66" cy="40" r="8" fill="#ffd34d"/><path d="M53 22v54M22 49h62" ${L} stroke-width="3"/>
 <path d="M12 141V130a10 10 0 0 1 20 0V141Z" fill="#3a2614" ${L}/><g transform="translate(26 148) scale(.62)">${BODIES.mouse}</g>
 <g fill="#e0a95c">${crumbs.map(([x,y])=>`<circle cx="${x+14}" cy="${y}" r="1.7"/>`).join('')}</g>
 <rect x="54" y="126" width="188" height="8" rx="3" fill="#ffb3c7" ${L}/><path d="M60 134V172M236 134V172" ${L} stroke-width="5"/>
 <g transform="translate(82 127)">${plate}</g>${KITCHEN.slice(1).map(([kind,x])=>`<g transform="translate(${x} 127)">${cake(kind)}</g>`).join('')}
 <g transform="translate(262 196) scale(1.08)">${BODIES.bear}</g>
 <text x="96" y="92" font-size="44" font-weight="700" fill="#ff7a45" stroke="#fff" stroke-width="4" paint-order="stroke" font-family="sans-serif">?</text><text x="282" y="110" font-size="30" font-weight="700" fill="#ff7a45" stroke="#fff" stroke-width="4" paint-order="stroke" font-family="sans-serif">?</text>`);

// ---- The story ----
let api;
const say=(key,t)=>api.say(key,t),wait=(ms,t)=>api.wait(ms,t),flag=(name,on)=>api.flag(name,on),move=(...args)=>api.move(...args);
const el=selector=>api.stage().querySelector(selector);
const SHAPES={round:'圆形',square:'正方形',triangle:'三角形',oblong:'长方形'};
async function inTheKitchen(t){
 await wait(400,t);
 await say('made',t);
 await say('tapCake',t);
 for(const [kind] of KITCHEN){
  await api.tap('cake-'+kind,t,'tapCake');
  api.replay(el(`.actor-cake-${kind} .cuebox`),'wobble');api.effect('twinkle');api.count(SHAPES[kind]);
  await say(kind,t);
 }
 flag('yum');await say('yummy',t);flag('yum',false);
 // Off for the milk, and while Bear's back is turned…
 await say('milk',t);
 move('bear',290,198,1500);await wait(1500,t);
 flag('has-milk');api.effect('pop');await wait(400,t);
 flag('sneak');api.effect('swish');el('.actor-cake-round').classList.add('gone');await wait(1900,t);
 move('bear',236,196,1300);await wait(1300,t);
 await say('back',t);
 flag('shock');api.sounds.beep();await say('gone',t);flag('shock',false);
 await say('where',t);
}
async function inTheGarden(t){
 await api.changeScene(t,gardenScene());
 for(const [who,see,ask,no,sound] of [['rabbit','seeRabbit','askRabbit','noRabbit','giggle'],['cat','seeCat','askCat','noCat','mew'],['dog','seeDog','askDog','noDog','woof']]){
  const {spot,to}=HIDE[who];
  await api.tap(spot,t,'where');
  api.replay(el('.'+spot),'rustle');api.effect('boing');
  el('.actor-'+who).classList.remove('away');move(who,...to,600);await wait(650,t);api.voice(sound);await wait(500,t);
  await say(see,t);
  await say(ask,t);
  flag('no-'+who);await say(no,t);flag('no-'+who,false);
 }
 flag('point');await say('sawMouse',t);
 await say('tapFind',t);
 await api.tap('log',t,'tapFind');
 api.replay(el('.log'),'rustle');el('.actor-mouse').classList.remove('away');move('mouse',LOG-20,196,600);await wait(650,t);api.voice('squeak');flag('point',false);await wait(500,t);
 await say('found',t);
 await say('askMouse',t);
 await say('me',t);
 flag('sorry');await say('sorry',t);
 await say('ask',t);flag('sorry',false);
 api.replay(el('.actor-mouse .cuebox'),'happy-hop');await say('ok',t);
}
async function atTheTable(t){
 await api.changeScene(t,partyScene());
 flag('treats');api.effect('twinkle');await say('share',t);
 await say('together',t);
 await say('tapServe',t);
 for(const [kind,who,line,x] of SERVE){
  await api.tap('serve-'+kind,t,'tapServe');
  api.effect('swish');move('cake-'+kind,x,141,700,.62);await wait(750,t);
  api.replay(el(`.actor-${who} .cuebox`),'happy-hop');if(who==='bear')api.replay(el('.actor-mouse .cuebox'),'happy-hop');
  await say(line,t);
  el('.actor-cake-'+kind).classList.add('eaten');api.effect('pop');await wait(400,t);
 }
 flag('party');api.chime('yay');
 await say('tasty',t);
 await say('happy',t);await wait(1200,t);
}
async function play(storyApi,t){
 api=storyApi;
 api.ambient('music');
 await inTheKitchen(t);
 await inTheGarden(t);
 await atTheTable(t);
}
const VOICES={bear:'hmm',rabbit:'giggle',cat:'mew',dog:'woof',mouse:'squeak'};
function fun(name,target,storyApi){
 const a=storyApi;
 if(VOICES[name]){if(target.classList.contains('away'))return true;a.replay(target.querySelector('.cuebox'),'happy-hop');a.voice(VOICES[name]);return true;}
 if(name==='cake'){if(target.classList.contains('gone')||target.classList.contains('eaten'))return true;a.replay(target.querySelector('.cuebox'),'wobble');a.effect('boing');return true;}
 if(name==='door'){a.replay(target,'swing');a.sounds.knock();return true;}
 if(['bush','basket','kennel','log'].includes(name)){a.replay(target,'rustle');a.effect('swish');return true;}
}

const css=`
.story-svg .blink{transform-box:fill-box;transform-origin:center;animation:cake-blink 4.2s infinite}
.story-svg .actor-rabbit .blink{animation-delay:.8s}.story-svg .actor-cat .blink{animation-delay:1.7s}.story-svg .actor-dog .blink{animation-delay:2.5s}.story-svg .actor-mouse .blink{animation-delay:3.1s;animation-duration:3.6s}
@keyframes cake-blink{0%,94%,100%{transform:none}97%{transform:scaleY(.1)}}
.story-svg .talk{opacity:0}
${['bear','rabbit','cat','dog','mouse'].map(w=>`[data-talking="${w}"] .actor-${w} .talk,[data-talking="all"] .actor-${w} .talk`).join(',')}{animation:cake-talk .22s steps(2) infinite}
${['bear','rabbit','cat','dog','mouse'].map(w=>`[data-talking="${w}"] .actor-${w} .mouth,[data-talking="all"] .actor-${w} .mouth`).join(',')}{opacity:0}
@keyframes cake-talk{0%{opacity:1}100%{opacity:0}}
.story-svg .actor.away{opacity:0}
.story-svg .head{transform-box:fill-box;transform-origin:50% 90%}
.no-rabbit .actor-rabbit .head,.no-cat .actor-cat .head,.no-dog .actor-dog .head{animation:cake-no .4s ease-in-out 4}
@keyframes cake-no{25%{transform:rotate(-12deg)}75%{transform:rotate(12deg)}}
.story-svg .wag{transform-box:fill-box;transform-origin:0 100%;animation:cake-wag .35s ease-in-out infinite alternate}
@keyframes cake-wag{to{transform:rotate(-24deg)}}
.point .actor-dog .bob{animation:story-hop .3s ease-in-out infinite alternate}
.story-svg .cuebox.wobble{animation:cake-wobble .6s ease-in-out}
@keyframes cake-wobble{20%{transform:scale(1.15,.88)}45%{transform:scale(.92,1.12) rotate(-4deg)}70%{transform:scale(1.04,.97) rotate(3deg)}}
.yum .actor-cake-round .cuebox,.yum .actor-cake-square .cuebox,.yum .actor-cake-triangle .cuebox,.yum .actor-cake-oblong .cuebox{animation:story-hop .3s ease-in-out 4 alternate}
.yum .actor-cake-square .cuebox{animation-delay:.1s}.yum .actor-cake-triangle .cuebox{animation-delay:.2s}.yum .actor-cake-oblong .cuebox{animation-delay:.3s}
.story-svg .held-milk{opacity:0;transition:opacity .3s}
.has-milk .held-milk{opacity:1}.has-milk .shelf-milk{opacity:0}
.story-svg .actor-cake-round .cuebox{transition:transform .9s ease-in,opacity .9s ease-in}
.story-svg .actor-cake-round.gone .cuebox{transform:translate(-30px,20px) scale(.1);opacity:0}
.story-svg .crumb{opacity:0}
.sneak .crumb{animation:cake-crumb .3s var(--d) forwards}
@keyframes cake-crumb{from{opacity:0;transform:translateY(-4px)}to{opacity:1}}
.story-svg .peek-tail{opacity:0}
.sneak .peek-tail{animation:cake-tail 1.9s ease-in-out}
@keyframes cake-tail{0%{opacity:0;transform:translateX(4px)}15%,60%{opacity:1;transform:none}30%{transform:translateY(-2px)}45%{transform:translateY(1px)}100%{opacity:1;transform:translateX(-22px)}}
.shock .actor-bear .bob{animation:story-shiver .12s infinite alternate}
.sorry .actor-mouse .cuebox{transform:rotate(-10deg);transition:transform .4s}
.story-svg .rustle{transform-box:fill-box;transform-origin:50% 100%;animation:cake-rustle .5s ease-in-out}
@keyframes cake-rustle{25%{transform:rotate(-3deg) scale(1.03)}75%{transform:rotate(3deg)}}
.story-svg .swing{transform-box:fill-box;transform-origin:100% 50%;animation:cake-swing .6s ease-in-out}
@keyframes cake-swing{50%{transform:scaleX(.6)}}
.story-svg .treat{opacity:0;transition:opacity .5s}
.treats .treat{opacity:1}
.story-svg .actor.eaten .cuebox{transform:scale(.2);opacity:0;transition:transform 1s ease-in,opacity .6s .5s}
.story-svg .confetti rect{opacity:0}
.party .confetti rect{animation:cake-confetti 2.4s var(--d) linear infinite}
@keyframes cake-confetti{0%{opacity:1;transform:translateY(0) rotate(0)}100%{opacity:1;transform:translateY(215px) rotate(540deg)}}
.party .friends .bob,.party .actor-mouse .bob{animation:story-hop .4s ease-in-out infinite alternate}
.party .actor-cat .bob{animation-delay:.1s}.party .actor-dog .bob{animation-delay:.2s}.party .actor-bear .bob{animation-delay:.3s}.party .actor-mouse .bob{animation-delay:.15s}
`;

const head=(who,view)=>box(view,BODIES[who]);
export default {
 firstScene:()=>kitchenScene(),
 scenes:()=>[kitchenScene(),gardenScene(),partyScene()],
 play,pictures,cover,css,fun,
 avatars:{
  bear:head('bear','-21 -62 42 42'),rabbit:head('rabbit','-24 -80 48 58'),cat:head('cat','-22 -64 44 44'),dog:head('dog','-22 -60 44 40'),mouse:head('mouse','-24 -64 48 48'),
  all:box('-22 -62 74 44',`${BODIES.bear}<g transform="translate(38 -10) scale(.8)">${BODIES.mouse}</g>`)
 }
};
