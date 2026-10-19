// 小蝌蚪找妈妈 Little tadpoles look for their mother. Spring in the pond: the tadpoles swim off to find Mummy. She
// taps them along to the duck (your mummy has two big eyes), the big fish (a white tummy) and the turtle (four legs),
// and each clue lands as a badge in the corner. Up by the lily pads a big frog is singing 呱呱呱: she taps the one with
// all three clues and the badges fly to it. Then she taps the tadpoles to grow them, legs, legs, no tail, into little
// frogs that hop onto the lily pads.
import {INK,L,scene,target,actor,box,funSun,funCloud,funActors} from '../story-kit.js';

// ---- Pictures ----
const DARK='#2c2a44',GREEN='#6cc24a',DEEP='#4f9d36';
// One tadpole seen from above, head to the right. It carries the legs it will grow, hidden until then.
const tadpole=(x,y,i)=>`<g class="tad tad-${i}" transform="translate(${x} ${y})">
 <path class="tail" d="M-2 -3Q-11 -6 -21 -1Q-11 2 -2 3Z" fill="${DARK}" stroke="${DARK}" stroke-width="1" stroke-linejoin="round"/>
 <path class="leg-back" opacity="0" d="M-3 3l-3 5h-3M-3 -3l-3 -5h-3" fill="none" stroke="${DEEP}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
 <path class="leg-front" opacity="0" d="M4 3.5l2 4h2M4 -3.5l2 -4h2" fill="none" stroke="${DEEP}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
 <ellipse class="tad-head" cx="1" cy="0" rx="6.5" ry="5.2" fill="${DARK}"/>
 <g class="blink"><circle cx="4" cy="-2" r="1.9" fill="#fff"/><circle cx="4.5" cy="-2" r=".9" fill="${INK}"/></g>
 <path d="M3 2q2 1.5 4 0" fill="none" stroke="#fff" stroke-width=".9" stroke-linecap="round"/></g>`;
const TADS=[[-16,-11],[13,-14],[-8,9],[18,6]];
const burst=`<g class="burst" opacity="0">${[[-4,-12,2.6],[4,-16,2],[0,-22,3],[8,-24,1.6]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" fill-opacity=".35" stroke="#fff" stroke-width="1"/>`).join('')}</g>`;
const tadpoles=`<g transform="scale(1.3)">${TADS.map(([x,y],i)=>tadpole(x,y,i)).join('')}</g>${burst}`;
// The big frog, sitting up and facing us: two big eyes, a white tummy, four legs.
const frogBody=`<g data-cue="clue-legs"><path d="M-14 -6Q-28 -8 -24 -20Q-14 -20 -11 -10ZM14 -6Q28 -8 24 -20Q14 -20 11 -10Z" fill="${GREEN}" ${L}/>
 <path d="M-22 -1q-6 0-9 2h11zM22 -1q6 0 9 2h-11z" fill="${DEEP}" ${L} stroke-width="1.6"/>
 <path d="M-8 -8l-2 7h-5M8 -8l2 7h5" fill="none" stroke="${DEEP}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></g>
 <ellipse cx="0" cy="-15" rx="17" ry="14" fill="${GREEN}" ${L}/>
 <ellipse data-cue="clue-tummy" cx="0" cy="-10" rx="10" ry="7.5" fill="#fff" ${L} stroke-width="1.6"/>
 <g data-cue="clue-eyes"><circle cx="-9" cy="-29" r="7.5" fill="${GREEN}" ${L}/><circle cx="9" cy="-29" r="7.5" fill="${GREEN}" ${L}/>
 <g class="blink"><circle cx="-9" cy="-30" r="5" fill="#fff"/><circle cx="9" cy="-30" r="5" fill="#fff"/><circle cx="-8" cy="-30" r="2.6" fill="${INK}"/><circle cx="10" cy="-30" r="2.6" fill="${INK}"/><circle cx="-7.2" cy="-31" r=".9" fill="#fff"/><circle cx="10.8" cy="-31" r=".9" fill="#fff"/></g></g>
 <ellipse cx="-12" cy="-19" rx="3" ry="1.8" fill="#ff9bb3" opacity=".7"/><ellipse cx="12" cy="-19" rx="3" ry="1.8" fill="#ff9bb3" opacity=".7"/>
 <path class="frog-mouth" d="M-8 -21Q0 -15 8 -21" fill="none" ${L}/><path class="frog-talk" opacity="0" d="M-7 -21Q0 -12 7 -21Z" fill="#d94b62" ${L} stroke-width="1.4"/>`;
const frog=`<g transform="translate(0 2)">${frogBody}</g>`;
const froglet=i=>`<g class="froglet"><g transform="scale(.42)">${frogBody}</g></g>`;
// The mother duck afloat (her feet paddle under the water) with two ducklings behind her.
const duckling=(x,c)=>`<g transform="translate(${x} 0) scale(.5)"><ellipse cx="-2" cy="-7" rx="16" ry="9" fill="${c}" ${L}/><circle cx="11" cy="-20" r="7.5" fill="${c}" ${L}/><path d="M17 -21q6 0 6 2q-3 2-6 1z" fill="#ff9a3c" ${L} stroke-width="1.6"/><circle cx="13" cy="-22" r="1.5" fill="${INK}"/></g>`;
const duck=`<g class="paddle"><path d="M-8 3l-4 8h8zM4 3l-1 9h8z" fill="#ff9a3c" ${L} stroke-width="1.4"/></g>
 <path d="M-20 -10l-6-6 1 9z" fill="#fff" ${L} stroke-width="1.6"/><ellipse cx="-2" cy="-6" rx="19" ry="10" fill="#fff" ${L}/><path d="M-12 -9q8-5 14 1q-7 4-14-1z" fill="#eef1f6" ${L} stroke-width="1.4"/>
 <path d="M8 -12q2-6 4-10" stroke="#fff" stroke-width="9" stroke-linecap="round"/><circle cx="13" cy="-23" r="8.5" fill="#fff" ${L}/><path d="M8 -12q2-6 4-10" stroke="#fff" stroke-width="6" stroke-linecap="round"/>
 <path d="M20 -24q8-1 9 2q-4 2-9 1z" fill="#ff9a3c" ${L} stroke-width="1.6"/><path class="duck-talk" opacity="0" d="M20 -21q7 1 7 4q-4 1-7-2z" fill="#e8782a" ${L} stroke-width="1.4"/>
 <g class="blink"><circle cx="15" cy="-25" r="1.6" fill="${INK}"/></g><ellipse cx="13" cy="-20" rx="2.4" ry="1.4" fill="#ff9bb3" opacity=".7"/>
 ${duckling(-34,'#ffd84d')}${duckling(-54,'#ffd84d')}`;
// A big orange fish, facing left.
const fish=`<path class="fish-tail" d="M18 0l14-11q-3 11 0 22z" fill="#ff8a3d" ${L}/>
 <ellipse cx="0" cy="0" rx="22" ry="14" fill="#ffa24d" ${L}/><path d="M-4 -13q8-9 16-2" fill="#ff8a3d" ${L} stroke-width="1.6"/><path d="M2 4q6 6 10 1" fill="#ff8a3d" ${L} stroke-width="1.6"/>
 <path d="M-8 -10q4 10 0 20M2 -12q4 12 0 24" fill="none" stroke="#e8782a" stroke-width="1.4"/>
 <g class="blink"><circle cx="-12" cy="-4" r="4" fill="#fff" ${L} stroke-width="1.4"/><circle cx="-13" cy="-4" r="1.8" fill="${INK}"/></g>
 <path class="fish-mouth" d="M-21 2q2 2 4 0" fill="none" ${L} stroke-width="1.6"/><ellipse class="fish-talk" opacity="0" cx="-20" cy="3" rx="2.4" ry="2.4" fill="${INK}"/>`;
// A turtle on the pond floor, facing left, four stubby legs.
const turtle=`${[-13,-3,8,17].map(x=>`<ellipse cx="${x}" cy="0" rx="4.5" ry="4" fill="#8fcf7a" ${L} stroke-width="1.6"/>`).join('')}
 <g class="turtle-head"><path d="M-18 -8Q-30 -14 -34 -8Q-32 0 -18 -3Z" fill="#8fcf7a" ${L}/><g class="blink"><circle cx="-28" cy="-9" r="1.6" fill="${INK}"/></g>
 <path class="turtle-mouth" d="M-33 -5q3 1 5 0" fill="none" ${L} stroke-width="1.2"/><ellipse class="turtle-talk" opacity="0" cx="-31" cy="-4.5" rx="2" ry="1.5" fill="${INK}"/></g>
 <path d="M22 -4l6 2-6 2z" fill="#8fcf7a" ${L} stroke-width="1.4"/>
 <path d="M-22 -2Q-20 -26 0 -26Q20 -26 24 -2Z" fill="#4f9d6a" ${L}/>
 <path d="M-6 -24l-4 10 6 10h8l6-10-4-10M-10 -14h-10M10 -14h12M-4 -4l-4 2M4 -4l4 2" fill="none" stroke="#2f6f48" stroke-width="1.6" stroke-linejoin="round"/>
 <path d="M-22 -2h46" ${L}/>`;
// The clue badges in the corner: eyes, a white tummy, four legs. Dim until a clue is found.
const BADGES={
 eyes:`<circle r="11" fill="#e3f6d8" ${L} stroke-width="1.6"/><circle cx="-4.5" cy="0" r="4" fill="#fff" ${L} stroke-width="1.2"/><circle cx="4.5" cy="0" r="4" fill="#fff" ${L} stroke-width="1.2"/><circle cx="-4" cy=".5" r="1.8" fill="${INK}"/><circle cx="5" cy=".5" r="1.8" fill="${INK}"/>`,
 tummy:`<circle r="11" fill="${GREEN}" ${L} stroke-width="1.6"/><ellipse cx="0" cy="1.5" rx="6.5" ry="5" fill="#fff" ${L} stroke-width="1.2"/>`,
 legs:`<circle r="11" fill="#e3f6d8" ${L} stroke-width="1.6"/><path d="M-4 -2l-4-4M4 -2l4-4M-4 3l-4 4M4 3l4 4" stroke="${DEEP}" stroke-width="2.4" stroke-linecap="round"/><ellipse cx="0" cy=".5" rx="4.5" ry="5.5" fill="${GREEN}" ${L} stroke-width="1.2"/>`
};
const badges=`<rect class="badge-pill" x="4" y="4" width="80" height="26" rx="13" fill="#fff" opacity=".7"/>${Object.entries(BADGES).map(([k,art],i)=>`<g class="badge badge-${k}" data-cue="clue-${k}"><g transform="translate(${18+i*26} 17)"><g class="badge-art">${art}</g></g></g>`).join('')}`;
const weed=(x,h,d)=>`<path class="weed" style="animation-delay:${d}s" d="M${x} 200q-6-${h/3} 0-${h/2}t0-${h/2}" fill="none" stroke="#3f9a5a" stroke-width="4" stroke-linecap="round"/>`;
const rising=xs=>xs.map(([x,y,d])=>`<circle class="rise" style="animation-delay:${d}s" cx="${x}" cy="${y}" r="2.2" fill="#fff" fill-opacity=".3" stroke="#fff" stroke-width=".8"/>`).join('');
const water=top=>`<defs><linearGradient id="tad-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fd0f2"/><stop offset="1" stop-color="#3f8fcf"/></linearGradient></defs>
 <rect class="water" data-cue="pond" data-fun="water" y="${top}" width="320" height="${200-top}" fill="url(#tad-water)"/>
 <path d="M0 ${top}q20-3 40 0t40 0 40 0 40 0 40 0 40 0 40 0 40 0" fill="none" stroke="#fff" stroke-width="2" opacity=".8"/>
 <g fill="#fff" opacity=".12"><path d="M40 ${top}l30 0-50 ${200-top}h-30zM170 ${top}l26 0-30 ${200-top}h-30z"/></g>
 <path d="M0 188Q60 180 120 190T240 186T320 188V200H0Z" fill="#e6cf95" ${L} stroke-width="1.6"/>
 <g fill="#c9b07a">${[[30,194],[90,196],[180,195],[300,196]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="5" ry="2.4"/>`).join('')}</g>`;
const tadActors=svg=>funActors(svg,{tadpoles:'tadpoles',duck:'duck',fish:'fish',turtle:'turtle',frog:'frog',...Object.fromEntries([0,1,2,3].map(i=>['froglet-'+i,'froglet']))});

// The pond: the tadpoles swim past the duck, the fish and the turtle.
const STOPS=[[54,128],[92,98],[140,126],[198,160],[372,130]];
function pondScene(){
 return tadActors(scene('Tadpoles in the pond',`<rect width="320" height="60" fill="#cfeaff"/>${funSun(292,24,12)}${funCloud(200,22,.8)}
 <path d="M0 56Q20 40 34 56ZM300 56q10-20 20-10v10z" fill="#7cc867" ${L} stroke-width="1.6"/>
 ${water(56)}${weed(14,90,0)}${weed(26,60,.6)}${weed(130,50,.3)}${weed(300,100,.9)}${weed(312,70,.2)}
 ${rising([[20,150,0],[132,170,1.2],[296,140,2.1],[250,120,.6]])}
 ${badges}
 ${actor('duck',122,58,duck,'duck')}${actor('fish',214,116,fish,'fish')}${actor('turtle',268,186,turtle,'turtle')}
 ${actor('tadpoles',...STOPS[0],tadpoles,'tadpoles')}
 ${STOPS.slice(0,4).map(([x,y],i)=>target('swim-'+(i+1),x,y,20,24)).join('')}`));
}
// The lily pads: the frog sings on the big pad; the little frogs hop onto the small ones.
const PADS=[[42,96],[96,98],[150,96],[282,97]];
const FROG=[214,96],MEET=[180,130];
const pad=(x,y,big)=>`<g transform="translate(${x} ${y})"><ellipse rx="${big?32:18}" ry="${big?8:5}" fill="#5fbf4a" ${L}/><path d="M0 0L${big?30:17} ${big?-3:-2}" ${L} stroke-width="1.6"/><path d="M0 0l-${big?16:9} ${big?-4:-2}M0 0l-${big?8:5} ${big?5:3}M0 0l${big?10:6} ${big?5:3}" stroke="#4aa63a" stroke-width="1.2"/></g>`;
const lotus=`<g data-fun="lotus" class="lotus"><circle cx="123" cy="96" r="10" fill="transparent"/><ellipse cx="123" cy="103" rx="9" ry="2.6" fill="#5fbf4a" ${L} stroke-width="1.4"/><path d="M123 102q-10-4-8-12q5 2 8 8q3-6 8-8q2 8-8 12zM123 102q-3-8 0-14q3 6 0 14z" fill="#ff9bc6" ${L} stroke-width="1.4"/></g>`;
function padScene(){
 return tadActors(scene('The frog on the lily pad',`<rect width="320" height="96" fill="#cfeaff"/>${funSun(292,28,13)}${funCloud(130,26)}${funCloud(220,46,.7)}
 <path d="M0 92Q40 70 90 92ZM240 92Q290 66 320 80V92Z" fill="#a6dc84" ${L} stroke-width="1.6"/>
 ${[[16,92,52],[26,92,40],[306,92,48]].map(([x,y,h])=>`<path d="M${x} ${y}V${y-h}" stroke="#3f9a5a" stroke-width="2.4"/><rect x="${x-2.5}" y="${y-h-12}" width="5" height="12" rx="2.5" fill="#9b6a3c" ${L} stroke-width="1.2"/>`).join('')}
 ${water(92)}${weed(10,80,.4)}${weed(120,46,0)}${weed(250,60,.7)}${weed(310,90,.2)}
 ${rising([[60,170,.4],[250,160,1.5],[300,180,.9]])}
 <g class="pads">${PADS.map(([x,y])=>pad(x,y)).join('')}${lotus}</g><g data-cue="pad">${pad(...FROG,true)}</g>
 ${badges}
 <g class="hearts">${[[-12,0],[0,-8],[12,-2]].map(([x,y],i)=>`<path style="animation-delay:${i*.25}s" class="heart" transform="translate(${FROG[0]-28+x} ${FROG[1]-50+y})" d="M0 -2c-2-3-7 0-3 4l3 2.5 3-2.5c4-4-1-7-3-4z" fill="#f0507a"/>`).join('')}</g>
 ${actor('frog',...FROG,frog,'frog')}
 ${actor('tadpoles',-40,150,tadpoles,'tadpoles')}
 ${TADS.map(([x,y],i)=>actor('froglet-'+i,MEET[0]+x*1.3,MEET[1]+y*1.3,froglet(i),'tadpoles')).join('')}
 ${target('frog',FROG[0],FROG[1]-18,24,30)}${target('grow',...MEET,22,28)}`));
}

const pictures={
 tadpole:box('-24 -12 36 22',tadpole(0,0,0)),
 mummy:box('-34 -48 68 60',`${frog}<g transform="translate(-24 6) scale(.8)">${tadpole(0,0,0)}</g><g transform="translate(26 6) scale(-.8 .8)">${tadpole(0,0,1)}</g><path d="M0 -44c-2-3-7 0-3 4l3 2.5 3-2.5c4-4-1-7-3-4z" fill="#f0507a"/>`),
 frog:box('-32 -42 64 46',frog),
 duck:box('-30 -34 62 48',duck.replace(duckling(-34,'#ffd84d'),'').replace(duckling(-54,'#ffd84d'),'')),
 fish:box('-26 -18 62 36',fish),
 turtle:box('-38 -30 66 38',turtle),
 eyes:box('-13 -13 26 26',BADGES.eyes),
 tummy:box('-13 -13 26 26',BADGES.tummy),
 legs:box('-13 -13 26 26',BADGES.legs),
 tail:box('-24 -8 34 16',`<path d="M-2 -3Q-11 -6 -21 -1Q-11 2 -2 3Z" fill="#ff7a45" ${L} stroke-width="1.4"/><ellipse cx="2" cy="0" rx="6" ry="5" fill="${DARK}"/><circle cx="5" cy="-2" r="1.6" fill="#fff"/>`),
 swim:box('-36 -20 66 34',`<rect x="-36" y="-20" width="66" height="34" rx="8" fill="#7fd0f2"/>${tadpole(-2,-2,0)}${tadpole(14,6,1)}<path d="M-30 4q5-3 10 0M-26 10q5-3 10 0" fill="none" stroke="#fff" stroke-width="1.6"/>`)
};
const cover=()=>box('0 0 320 200',`<rect width="320" height="96" fill="#cfeaff"/><circle cx="292" cy="28" r="13" fill="#ffd34d"/>
 <path d="M0 92Q40 70 90 92ZM240 92Q290 66 320 80V92Z" fill="#a6dc84" ${L} stroke-width="1.6"/>
 <rect y="92" width="320" height="108" fill="#5fb0e0"/><path d="M0 188Q60 180 120 190T240 186T320 188V200H0Z" fill="#e6cf95"/>
 ${PADS.map(([x,y])=>pad(x,y)).join('')}${pad(...FROG,true)}<g transform="translate(${FROG[0]} ${FROG[1]})">${frog}</g>
 <g transform="translate(150 140) scale(1.6)">${TADS.map(([x,y],i)=>tadpole(x,y,i)).join('')}</g>`);

// ---- The story ----
let api;
const say=(key,t)=>api.say(key,t),wait=(ms,t)=>api.wait(ms,t),flag=(name,on)=>api.flag(name,on),move=(...args)=>api.move(...args);
const swimTo=async(t,[x,y],ms=1600)=>{flag('swimming');move('tadpoles',x,y,ms);await wait(ms,t);flag('swimming',false);};
// One friend on the way: tap to swim there, ask, and the answer leaves a clue badge in the corner.
async function visit(t,i,see,no,clue){
 await say('tapSwim',t);
 await api.tap('swim-'+i,t,'tapSwim');
 api.voice('bubble');await swimTo(t,STOPS[i]);
 await say(see,t);
 await say('ask',t);
 await say(no,t);
 flag('got-'+clue);api.chime('ding');api.replay(api.stage().querySelector(`.badge-${clue} .badge-art`),'pop');
 await say('thanks',t);
}
async function inThePond(t){
 await wait(400,t);
 await say('spring',t);
 await say('look',t);
 await say('where',t);
 await visit(t,1,'seeDuck','duckNo','eyes');
 await visit(t,2,'seeFish','fishNo','tummy');
 await visit(t,3,'seeTurtle','turtleNo','legs');
 await say('tapSwim',t);
 await api.tap('swim-4',t,'tapSwim');
 api.voice('bubble');await swimTo(t,STOPS[4],1400);
}
async function atTheLilyPads(t){
 await api.changeScene(t,padScene(),s=>s.classList.add('got-eyes','got-tummy','got-legs'));
 api.ambient('birds');
 swimTo(t,[110,150],2200);
 await say('frog',t);
 flag('singing');await say('sing',t);flag('singing',false);
 await say('tapFrog',t);
 await api.tap('frog',t,'tapFrog');
 flag('badges-fly');api.sounds.magic();await wait(1200,t);
 api.replay(api.stage().querySelector('.actor-frog .cuebox'),'jig');api.voice('ribbitMum');
 await swimTo(t,MEET,1200);
 await say('mummy',t);
 flag('love');api.chime('yay');
 await say('children',t);
 await wait(500,t);
 // Growing up: a tap for each change.
 await say('grow',t);
 await say('tapGrow',t);
 for(const [stage,line] of [['legs-back','legs'],['legs-front','front'],['no-tail','tail']]){
  await api.tap('grow',t,'tapGrow');
  flag(stage);api.effect('twinkle');api.replay(api.stage().querySelector('.actor-tadpoles .cuebox'),'jig');
  await say(line,t);
 }
 await api.tap('grow',t,'tapGrow');
 flag('froglets');api.sounds.magic();await wait(700,t);
 await say('frogs',t);
 for(const [i,[x,y]] of PADS.entries()){move('froglet-'+i,x,y-1,700);api.effect('boing');await wait(380,t);}
 await wait(500,t);
 flag('dance');api.chime('yay');
 await say('ribbit',t);
 await wait(900,t);
}
async function play(storyApi,t){
 api=storyApi;
 api.ambient('music');
 await inThePond(t);
 await atTheLilyPads(t);
}
function fun(name,el,a){
 const box=el.querySelector('.cuebox');
 if(name==='tadpoles'){a.replay(el.querySelector('.burst'),'go');a.replay(box,'jig');a.voice('bubble');return true;}
 if(name==='duck'){a.replay(box,'jig');a.voice('quack');return true;}
 if(name==='fish'){a.replay(box,'flip');a.effect('swish');return true;}
 if(name==='turtle'){a.replay(el.querySelector('.turtle-head'),'tuck');a.voice('hm');return true;}
 if(name==='frog'){a.replay(box,'jig');a.voice('ribbitMum');return true;}
 if(name==='froglet'){a.replay(box,'jig');a.effect('boing');return true;}
 if(name==='lotus'){a.replay(el,'jig');a.effect('twinkle');return true;}
 if(name==='water'){const b=a.stage().querySelector('.actor-tadpoles .burst');if(b)a.replay(b,'go');a.effect('pop');return true;}
}

const fly=(k,i,[x,y])=>`.badges-fly .badge-${k}{transform:translate(${x-(18+i*26)}px,${y-17}px);opacity:0;transition:transform 1s ease-in-out,opacity .4s 1s}`;
const css=`
.story-svg .water.cue{animation:none}
.story-svg .blink{transform-box:fill-box;transform-origin:center;animation:tad-blink 4.6s infinite}
.story-svg .tad-1 .blink,.story-svg .actor-fish .blink{animation-delay:1.3s}.story-svg .tad-2 .blink,.story-svg .actor-duck .blink{animation-delay:2.4s}.story-svg .tad-3 .blink,.story-svg .actor-turtle .blink{animation-delay:3.1s}
@keyframes tad-blink{0%,94%,100%{transform:none}97%{transform:scaleY(.1)}}
.story-svg .tail{transform-box:fill-box;transform-origin:100% 50%;animation:tad-wiggle .45s ease-in-out infinite alternate;transition:transform 1s,opacity 1s}
.story-svg .tad-1 .tail{animation-delay:.15s}.story-svg .tad-2 .tail{animation-delay:.3s}.story-svg .tad-3 .tail{animation-delay:.1s}
.swimming .tail{animation-duration:.18s}
@keyframes tad-wiggle{from{transform:skewY(-14deg)}to{transform:skewY(14deg)}}
.story-svg .leg-back,.story-svg .leg-front{opacity:0;transition:opacity .8s}
.legs-back .leg-back,.legs-front .leg-front{opacity:1}
.legs-front .tad-head{fill:#3f6a3a;transition:fill 1s}
.no-tail .tail{animation:none;transform:scaleX(0);opacity:0}
.story-svg .actor-tadpoles{transition:transform 1.4s ease-in-out,opacity .5s}
.froglets .actor-tadpoles{opacity:0}
.story-svg .froglet{opacity:0;transition:opacity .6s}
.froglets .froglet{opacity:1}
.story-svg [class*="actor-froglet"]{transition:transform .7s cubic-bezier(.3,-.6,.6,1.4)}
.dance [class*="actor-froglet"] .bob,.dance .actor-frog .bob{animation:story-hop .3s ease-in-out infinite alternate}
.dance .actor-froglet-1 .bob{animation-delay:.1s}.dance .actor-froglet-2 .bob{animation-delay:.2s}.dance .actor-froglet-3 .bob{animation-delay:.05s}
.story-svg .burst{opacity:1}.story-svg .burst circle{opacity:0}
.story-svg .burst.go circle{animation:tad-burst 1s ease-out}
.story-svg .burst.go circle:nth-child(2){animation-delay:.12s}.story-svg .burst.go circle:nth-child(3){animation-delay:.24s}
@keyframes tad-burst{0%{opacity:1;transform:translateY(6px)}100%{opacity:0;transform:translateY(-14px)}}
.story-svg .rise{animation:tad-rise 3.6s ease-in infinite;opacity:0}
@keyframes tad-rise{0%{opacity:0;transform:none}15%{opacity:1}100%{opacity:0;transform:translateY(-70px)}}
.story-svg .weed{transform-box:fill-box;transform-origin:50% 100%;animation:tad-sway 3s ease-in-out infinite alternate}
@keyframes tad-sway{from{transform:skewX(-8deg)}to{transform:skewX(8deg)}}
.story-svg .paddle{transform-box:fill-box;transform-origin:50% 0;animation:tad-paddle .5s ease-in-out infinite alternate}
@keyframes tad-paddle{to{transform:skewX(20deg)}}
.story-svg .fish-tail{transform-box:fill-box;transform-origin:0 50%;animation:tad-fin .6s ease-in-out infinite alternate}
@keyframes tad-fin{to{transform:scaleX(.7)}}
.story-svg .actor-fish .bob,.story-svg .actor-duck .bob{animation:tad-float 2.4s ease-in-out infinite alternate}
@keyframes tad-float{to{transform:translateY(-3px)}}
.story-svg .duck-talk,.story-svg .fish-talk,.story-svg .turtle-talk,.story-svg .frog-talk{opacity:0}
[data-talking="duck"] .duck-talk,[data-talking="fish"] .fish-talk,[data-talking="turtle"] .turtle-talk,[data-talking="frog"] .actor-frog .frog-talk,.singing .actor-frog .frog-talk,[data-talking="tadpoles"] .froglet .frog-talk{animation:tad-talk .22s steps(2) infinite}
[data-talking="frog"] .actor-frog .frog-mouth,.singing .actor-frog .frog-mouth{opacity:0}
@keyframes tad-talk{0%{opacity:1}100%{opacity:0}}
[data-talking="tadpoles"] .actor-tadpoles .bob{animation:story-hop .25s ease-in-out infinite alternate}
.singing .actor-frog .cuebox{animation:tad-sing .4s ease-in-out infinite alternate}
@keyframes tad-sing{to{transform:scale(1.05,.95)}}
.story-svg .turtle-head{transition:transform .3s}
.story-svg .turtle-head.tuck{animation:tad-tuck 1.4s ease-in-out}
@keyframes tad-tuck{30%,70%{transform:translateX(12px)}}
.story-svg .lotus{transform-box:fill-box;transform-origin:50% 100%}
.story-svg .cuebox.jig,.story-svg .lotus.jig{animation:story-hop .22s ease-in-out 4 alternate}
.story-svg .cuebox.flip{transform-box:fill-box;transform-origin:center;animation:tad-flip .9s ease-in-out}
@keyframes tad-flip{50%{transform:translateY(-14px) rotate(-360deg)}100%{transform:rotate(-360deg)}}
.story-svg .badge-pill{transition:opacity .4s 1s}.badges-fly .badge-pill{opacity:0}
.story-svg .badge{transition:transform 1s ease-in-out,opacity .4s}
.story-svg .badge-art{transform-box:fill-box;transform-origin:center;opacity:.3;transition:opacity .4s}
.got-eyes .badge-eyes .badge-art,.got-tummy .badge-tummy .badge-art,.got-legs .badge-legs .badge-art{opacity:1}
.story-svg .badge-art.pop{animation:story-pop .7s var(--spring)}
${fly('eyes',0,[FROG[0],FROG[1]-30])}${fly('tummy',1,[FROG[0],FROG[1]-10])}${fly('legs',2,[FROG[0]-18,FROG[1]-6])}
.story-svg .heart{opacity:0}
.love .heart{animation:tad-heart 2.4s ease-out infinite}
@keyframes tad-heart{0%{opacity:0}20%{opacity:1}100%{opacity:0;translate:0 -24px}}
`;

export default {
 firstScene:()=>pondScene(),
 scenes:()=>[pondScene(),padScene()],
 play,pictures,cover,css,fun,
 avatars:{
  tadpoles:box('-36 -18 56 34',TADS.slice(0,3).map(([x,y],i)=>tadpole(x*.8,y*.8,i)).join('')),
  duck:box('2 -34 30 30',duck),
  fish:box('-24 -16 32 32',fish),
  turtle:box('-36 -18 22 22',turtle),
  frog:box('-20 -40 40 40',frog)
 }
};
