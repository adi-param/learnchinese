// 灰姑娘 Cinderella. At home she sweeps while her stepmother and stepsisters boss her about, and they leave for the
// prince's dance without her. In the garden the fairy godmother turns a pumpkin into a carriage, mice into white
// horses and her rags into a dress with glass slippers. She dances with the prince until the clock strikes twelve,
// runs and loses a slipper; at home again the slipper is too small for the sisters and fits her just right.
import {INK,L,scene,target,actor,bubble,box,star} from '../story-kit.js';
import {animal} from '../illustrations.js';

// ---- Pictures ----
const SKIN='#ffd9b8',BLUSH='#ffb3c1',GOLD='#ffc233',GLASS='#c9f0ff',DOOR='#a8703f';
const limb=(x1,y1,x2,y2,colour,w=4.5)=>`<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${INK}" stroke-width="${w+3.5}" stroke-linecap="round"/><path d="M${x1} ${y1}L${x2} ${y2}" stroke="${colour}" stroke-width="${w}" stroke-linecap="round"/>`;
const hand=(x,y)=>`<circle cx="${x}" cy="${y}" r="2.8" fill="${SKIN}" ${L} stroke-width="1.6"/>`;
// Hair is drawn in two parts: behind the head and over it. The head's centre is at (0,-56).
const cap=colour=>`<path d="M-12 -55Q-12 -69 0 -69Q12 -69 12 -55Q6 -63 0 -62Q-6 -63 -12 -55Z" fill="${colour}" ${L}/>`;
const HAIR={
 scarf:{back:`<path d="M-11 -58Q-13 -46 -9 -42H9Q13 -46 11 -58Z" fill="#8a5a3b" ${L}/>`,front:`<path d="M-12.5 -55Q-13 -70 0 -70Q13 -70 12.5 -55Q7 -63 0 -63Q-7 -63 -12.5 -55Z" fill="#b08a6a" ${L}/><circle cx="12" cy="-61" r="2.6" fill="#b08a6a" ${L} stroke-width="1.6"/>`},
 golden:{back:`<path d="M-12 -58Q-16 -40 -10 -33H10Q16 -40 12 -58Z" fill="#f5c84c" ${L}/>`,front:`${cap('#f5c84c')}<path d="M-6 -66l2-5 2 3 2-4 2 4 2-3 2 5Z" fill="${GOLD}" stroke="${INK}" stroke-width="1.2" stroke-linejoin="round"/>`},
 bun:{back:`<circle cx="0" cy="-70" r="5.5" fill="#6b5b7b" ${L}/>`,front:cap('#6b5b7b')},
 curls:{back:[[-12,-50],[12,-50],[-11,-44],[11,-44]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="4.2" fill="#d9662b" ${L} stroke-width="1.6"/>`).join(''),front:cap('#d9662b')},
 pigtails:{back:`<circle cx="-14" cy="-52" r="5" fill="#3b2b35" ${L}/><circle cx="14" cy="-52" r="5" fill="#3b2b35" ${L}/>`,front:`${cap('#3b2b35')}<path d="M-17 -58l3 3-3 3M17 -58l-3 3 3 3" stroke="#f0507a" stroke-width="2.4" stroke-linecap="round"/>`},
 white:{back:`<circle cx="0" cy="-70" r="5" fill="#f1f0f7" ${L}/>`,front:cap('#f1f0f7')},
 prince:{back:'',front:`${cap('#6b4226')}<path d="M-8 -65l1-7 3.5 4 3.5-6 3.5 6 3.5-4 1 7Z" fill="${GOLD}" ${L} stroke-width="1.4"/>`}
};
const face=(mood='smile')=>{
 const eyes=mood==='sad'?`<path d="M-5.5 -57q1.7-1.3 3.4 0M2.1 -57q1.7-1.3 3.4 0" fill="none" ${L} stroke-width="1.6"/>`:`<circle cx="-3.8" cy="-56.5" r="1.6" fill="${INK}"/><circle cx="3.8" cy="-56.5" r="1.6" fill="${INK}"/>`;
 const brows=mood==='stern'?`<path d="M-6.5 -61l4.2 1.6M6.5 -61l-4.2 1.6" ${L} stroke-width="1.8"/>`:'';
 const mouth=mood==='stern'?`<path d="M-3 -49.5q3-2 6 0" fill="none" ${L} stroke-width="1.6"/>`:mood==='sad'?`<path d="M-2.6 -49.5q2.6-2 5.2 0" fill="none" ${L} stroke-width="1.6"/>`:`<path d="M-3 -51q3 2.6 6 0" fill="none" ${L} stroke-width="1.6"/>`;
 return `${eyes}${brows}<circle cx="-7" cy="-52.5" r="2" fill="${BLUSH}" opacity=".85"/><circle cx="7" cy="-52.5" r="2" fill="${BLUSH}" opacity=".85"/>${mouth}`;
};
const head=(hair,mood)=>`${HAIR[hair].back}<rect x="-2.5" y="-46" width="5" height="4" fill="${SKIN}"/><circle cx="0" cy="-56" r="11" fill="${SKIN}" ${L}/>${face(mood)}${HAIR[hair].front}`;
// A woman or girl standing, facing us: a long dress, arms by her sides. `feet` are her shoes; big feet stick out.
function lady({dress,trim,hair,mood='smile',wide=false,rags=false,feet='#7a5a44',big=false,sleeves=false,extra=''}){
 const hem=wide?25:18,fx=big?7.5:5,frx=big?8:5;
 const hemline=rags?`M-${hem} -4l4 4 4-4 4 4 4-4 4 4 4-4 4 4 4-4 ${hem*2-32} 0`:'';
 return `<g class="feet"><ellipse cx="-${fx}" cy="-1.6" rx="${frx}" ry="2.8" fill="${feet}" ${L} stroke-width="1.6"/><ellipse cx="${fx}" cy="-1.6" rx="${frx}" ry="2.8" fill="${feet}" ${L} stroke-width="1.6"/></g>
 ${limb(-8,-41,-13.5,-25,dress)}${limb(8,-41,13.5,-25,dress)}${hand(-13.5,-24)}${hand(13.5,-24)}
 <path d="M-8.5 -44Q-11 -30 -${hem} -4Q0 3 ${hem} -4Q11 -30 8.5 -44Z" fill="${dress}" ${L}/>
 ${rags?`<path d="${hemline}" fill="none" ${L} stroke-width="1.6"/><rect x="-10" y="-20" width="6" height="6" fill="#c9a77f" ${L} stroke-width="1.2"/><rect x="5" y="-12" width="5" height="5" fill="#9d7f63" ${L} stroke-width="1.2"/>`:''}
 <path d="M-9.5 -34H9.5" stroke="${trim}" stroke-width="3" stroke-linecap="round"/>
 ${sleeves?`<circle cx="-9" cy="-41" r="4.5" fill="${trim}" ${L} stroke-width="1.6"/><circle cx="9" cy="-41" r="4.5" fill="${trim}" ${L} stroke-width="1.6"/>`:''}
 ${head(hair,mood)}${extra}`;
}
// Tears that run while she cries.
const tears=`<g class="tears"><path d="M-5 -53q-1.6 3 0 4.4q1.6-1.4 0-4.4z" fill="#7cc3ff"/><path d="M5 -53q-1.6 3 0 4.4q1.6-1.4 0-4.4z" fill="#7cc3ff"/></g>`;
const glassFeet=`<g class="slippers" data-cue="slippers"><path d="M-10 -1.5q0-4 5-4q5 0 5 4z" fill="${GLASS}" ${L} stroke-width="1.4"/><path d="M0 -1.5q0-4 5-4q5 0 5 4z" fill="${GLASS}" ${L} stroke-width="1.4"/><path d="M-7 -3.5h2M3 -3.5h2" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/></g>`;
const rags=lady({dress:'#a98d74',trim:'#7a6250',hair:'scarf',rags:true,extra:tears});
const gown=lady({dress:'#7cc3ff',trim:'#d6efff',hair:'golden',wide:true,sleeves:true,feet:GLASS,extra:glassFeet});
// Cinderella carries both outfits; magic (the `dressed` class on the stage) swaps them.
const cinderella=`<g class="rags">${rags}</g><g class="gown">${gown}</g>`;
const stepmother=lady({dress:'#7b4f9e',trim:'#c9a5e6',hair:'bun',mood:'stern',big:true});
const sister1=lady({dress:'#f08a5d',trim:'#ffd0b8',hair:'curls',mood:'stern',big:true,feet:'#a0522d'});
const sister2=lady({dress:'#5fbf8f',trim:'#c7f0da',hair:'pigtails',mood:'stern',big:true,feet:'#2f6f4f'});
const wings=`<ellipse cx="-14" cy="-40" rx="9" ry="15" fill="#e3f6ff" fill-opacity=".85" ${L} stroke-width="1.6" transform="rotate(-20 -14 -40)"/><ellipse cx="14" cy="-40" rx="9" ry="15" fill="#e3f6ff" fill-opacity=".85" ${L} stroke-width="1.6" transform="rotate(20 14 -40)"/>`;
const wand=`<g class="wand" data-cue="wand"><path d="M13.5 -25 24 -46" ${L} stroke-width="2.2"/>${star(24.5,-48,1.5,GOLD)}</g>`;
const fairy=wings+lady({dress:'#b9a1f0',trim:'#efe6ff',hair:'white',sleeves:true,feet:'#8b78c9'})+wand;
const prince=`<path d="M-11 -44Q-20 -20 -17 -4H17Q20 -20 11 -44Z" fill="#d94a4a" ${L}/>
 <rect x="-7" y="-18" width="5.5" height="16" rx="2" fill="#f5f0e6" ${L} stroke-width="1.6"/><rect x="1.5" y="-18" width="5.5" height="16" rx="2" fill="#f5f0e6" ${L} stroke-width="1.6"/>
 <ellipse cx="-5" cy="-1.6" rx="5.4" ry="2.8" fill="#3b2b35" ${L} stroke-width="1.6"/><ellipse cx="5" cy="-1.6" rx="5.4" ry="2.8" fill="#3b2b35" ${L} stroke-width="1.6"/>
 ${limb(-8,-41,-13.5,-25,'#3a6fd8')}${limb(8,-41,13.5,-25,'#3a6fd8')}${hand(-13.5,-24)}${hand(13.5,-24)}
 <path d="M-9 -44H9L10 -16H-10Z" fill="#3a6fd8" ${L}/><path d="M-10 -22H10" stroke="${GOLD}" stroke-width="3"/><path d="M0 -44V-24" stroke="#2a54b0" stroke-width="1.6"/>
 ${head('prince','smile')}`;
// The glass slipper on its own, standing on (0,0).
const slipper=`<path d="M-9 0Q-10 -6 -4 -7Q2 -7 4 -3L9 -1V0Z" fill="${GLASS}" ${L} stroke-width="1.6"/><path d="M6 0V4" ${L} stroke-width="2"/><path d="M-5 -4.5h3" stroke="#fff" stroke-width="1.3" stroke-linecap="round"/>`;
const mouse=`<path d="M7 -3q8 0 9 -6" fill="none" ${L} stroke-width="1.6"/><ellipse cx="0" cy="-4.5" rx="7.5" ry="4.8" fill="#b6b3c4" ${L} stroke-width="1.6"/><circle cx="-7" cy="-7" r="3.8" fill="#b6b3c4" ${L} stroke-width="1.6"/><circle cx="-7.5" cy="-11" r="2.4" fill="#f3c6d2" ${L} stroke-width="1.2"/><circle cx="-8.5" cy="-7.3" r=".9" fill="${INK}"/><circle cx="-11" cy="-6.5" r="1" fill="#f0507a"/>`;
const pumpkin=`<ellipse cx="0" cy="-15" rx="24" ry="15" fill="#ff9a3c" ${L}/><ellipse cx="0" cy="-15" rx="12" ry="15" fill="none" stroke="#e5782a" stroke-width="2"/><ellipse cx="0" cy="-15" rx="3" ry="15" fill="none" stroke="#e5782a" stroke-width="2"/><path d="M0 -30q-1-6 4-9" fill="none" stroke="#3f8f3a" stroke-width="3.5" stroke-linecap="round"/><path d="M3 -33q8-4 10 2q-6 2-10-2z" fill="#5fbf4a" ${L} stroke-width="1.4"/>`;
const wheel=(x)=>`<circle cx="${x}" cy="-10" r="10" fill="#fff6d6" ${L}/><path d="M${x-10} -10h20M${x} -20v20M${x-7} -17l14 14M${x+7} -17l-14 14" stroke="${INK}" stroke-width="1.2"/><circle cx="${x}" cy="-10" r="2.2" fill="${GOLD}" ${L} stroke-width="1"/>`;
const carriage=`${wheel(-22)}${wheel(24)}<path d="M-34 -18Q-38 -62 0 -66Q38 -62 34 -18Z" fill="#ff9a3c" ${L}/><path d="M-20 -24Q-24 -58 0 -60" fill="none" stroke="#e5782a" stroke-width="2"/><path d="M20 -24Q24 -58 0 -60" fill="none" stroke="#e5782a" stroke-width="2"/>
 <rect x="-12" y="-52" width="24" height="18" rx="7" fill="#bfe3ff" ${L}/><path d="M-36 -18H36" stroke="${GOLD}" stroke-width="4" stroke-linecap="round"/><path d="M-7 -66l1-7 3 4 3-6 3 6 3-4 1 7Z" fill="${GOLD}" ${L} stroke-width="1.4"/>`;
const horse=(x,y,w)=>animal('horse','#fffaf2').replace('<svg class="art"',`<svg x="${x}" y="${y}" width="${w}" height="${w*.8}"`);
// Sparkles that burst where magic happens.
const sparkle=(name,x,y)=>`<g class="sparkle sparkle-${name}" transform="translate(${x} ${y})">${[[-18,-14],[16,-18],[20,8],[-16,10],[0,-26],[2,16]].map(([dx,dy],i)=>`<g class="spark" style="--dx:${dx}px;--dy:${dy}px">${star(0,0,1.2+(i%2)*.4,i%2?'#fff3a0':GOLD)}</g>`).join('')}</g>`;
const sparkles=(names)=>names.map(([n,x,y])=>sparkle(n,x,y)).join('');

// At home: a kitchen with a fireplace full of cinders, a window and the front door. The first time, she does three
// chores (sweeps the floor, wipes the table, washes the bowls); the second time the prince comes in with the slipper.
const homeRoom=`<rect width="320" height="200" fill="#f3e2cc"/><rect y="118" width="320" height="34" fill="#ead2b5"/><path d="M0 118H320" stroke="#d9bc99" stroke-width="2"/>
 <rect class="floor" data-cue="clean" y="152" width="320" height="48" fill="#cdb69a"/><path d="M0 152H320M0 172H320M40 152v20M120 152v20M200 152v20M280 152v20M80 172v28M160 172v28M240 172v28" stroke="#b39a7d" stroke-width="1.5"/>
 <rect x="14" y="86" width="66" height="66" fill="#b07c5b" ${L}/><path d="M26 152V112a21 16 0 0 1 42 0V152Z" fill="#3a2a33" ${L}/><path d="M30 152q6-10 12-4q6-8 12 0q6-6 10 4Z" fill="#9b98a8" ${L} stroke-width="1.6"/><rect x="8" y="80" width="78" height="8" rx="2" fill="#8c5428" ${L}/>
 <rect x="128" y="34" width="56" height="46" rx="4" fill="#bfe3ff" ${L}/><path d="M156 34v46M128 57h56" ${L}/>
 <g class="door" data-cue="door"><rect x="262" y="88" width="40" height="64" rx="3" fill="#5a4a3a" ${L}/><g class="door-leaf"><rect x="262" y="88" width="40" height="64" rx="3" fill="${DOOR}" ${L}/><path d="M270 96v48M294 96v48" stroke="#8c5428" stroke-width="1.6"/><circle cx="295" cy="122" r="2" fill="${GOLD}" ${L} stroke-width="1"/></g></g>`;
const dust=(x,y)=>`<g class="dust" data-cue="dust"><path d="M${x-16} ${y}Q${x-12} ${y-10} ${x} ${y-11}Q${x+12} ${y-10} ${x+16} ${y}Z" fill="#a9a5b4" ${L} stroke-width="1.6"/><circle cx="${x-6}" cy="${y-5}" r="1.4" fill="#7d7a8b"/><circle cx="${x+5}" cy="${y-7}" r="1.2" fill="#7d7a8b"/><circle cx="${x+9}" cy="${y-3}" r="1" fill="#7d7a8b"/></g>`;
const table=`<g class="table" data-cue="table clean"><path d="M122 178V154M178 178V154" ${L} stroke-width="4"/><path d="M122 178V154M178 178V154" stroke="#c98b4a" stroke-width="1.6"/><path d="M114 154 122 140H178L186 154Z" fill="#d9a066" ${L}/><rect x="114" y="154" width="72" height="6" fill="#b5743f" ${L}/>
 <g class="spots"><ellipse cx="136" cy="147" rx="6" ry="2.6" fill="#8b6a4a"/><ellipse cx="160" cy="145" rx="4" ry="2" fill="#8b6a4a"/><ellipse cx="170" cy="150" rx="5" ry="2.2" fill="#8b6a4a"/></g>
 <g class="cloth"><path d="M128 136h14l2 8h-14z" fill="#7cc3ff" ${L} stroke-width="1.4"/></g></g>`;
const bowl=(x,y)=>`<path d="M${x-9} ${y}q9 9 18 0z" fill="#fffaf0" ${L} stroke-width="1.6"/>`;
const bowls=`<g class="bowls" data-cue="bowls clean"><path d="M184 168h32l-4 16h-24z" fill="#b07c5b" ${L}/><path d="M186 174h28" stroke="#8c5428" stroke-width="1.4"/>${bowl(194,166)}${bowl(206,164)}${bowl(200,159)}
 <g class="grime"><circle cx="192" cy="167.5" r="1.8" fill="#8b6a4a"/><circle cx="207" cy="166" r="1.6" fill="#8b6a4a"/><circle cx="201" cy="161" r="1.5" fill="#8b6a4a"/></g>
 <g class="suds">${[[188,160],[196,154],[206,156],[212,161],[200,150]].map(([x,y],i)=>`<circle class="sud" style="--d:${i*.12}s" cx="${x}" cy="${y}" r="${2.4+(i%2)}" fill="#fff" stroke="#7cc3ff" stroke-width="1"/>`).join('')}</g></g>`;
const broom=`<g class="broom"><path d="M0 -48 6 -8" ${L} stroke-width="3" stroke="#8c5428"/><path d="M0 -6Q2 -12 8 -10L14 2H-2Z" fill="#e8c26a" ${L} stroke-width="1.6"/></g>`;
const letter=`<g class="letter" data-cue="letter"><rect x="134" y="92" width="44" height="30" rx="3" fill="#fffaf0" ${L}/><path d="M134 92l22 16 22-16" fill="none" ${L}/><circle cx="156" cy="108" r="6" fill="#e2504f" ${L} stroke-width="1.4"/><path d="M152.5 110l.6-4 1.6 2 1.3-3 1.3 3 1.6-2 .6 4Z" fill="${GOLD}"/></g>`;
const miniLetter=(x,y)=>`<rect x="${x}" y="${y}" width="24" height="17" rx="2" fill="#fffaf0" ${L} stroke-width="1.5"/><path d="M${x} ${y}l12 9 12-9" fill="none" ${L} stroke-width="1.5"/><circle cx="${x+12}" cy="${y+9}" r="3.4" fill="#e2504f"/>`;
function homeScene(after=false){
 // Before: Cinderella sweeps on the left, the family stands by the door. After: the family waits in the middle
 // and the prince comes in through the door with the slipper.
 const spots=after?{cinderella:44,stepmother:180,sister1:216,sister2:250}:{cinderella:52,stepmother:238,sister1:266,sister2:294};
 return scene(after?'The prince brings the slipper to the house':'Cinderella sweeps the kitchen',`${homeRoom}
 ${after?'':`${dust(96,182)}${table}${bowls}${letter}`}
 ${actor('cinderella',spots.cinderella,184,cinderella+(after?'':`<g transform="translate(15 0)">${broom}</g>`),'cinderella')}
 ${actor('stepmother',spots.stepmother,182,stepmother,'stepmother')}${actor('sister1',spots.sister1,184,sister1,'sisters sister1')}${actor('sister2',spots.sister2,184,sister2,'sisters sister2')}
 ${after?`${actor('prince',300,186,prince+`<ellipse cx="6" cy="-24" rx="13" ry="4" fill="#b23a3a" ${L} stroke-width="1.6"/>`,'prince')}${actor('slipper',306,162,slipper,'slipper')}`:''}
 ${bubble('bubble-no',176,40,196,212,132,`${miniLetter(190,49)}<path d="M186 46 220 72M220 46 186 72" stroke="#f0507a" stroke-width="3.4" stroke-linecap="round"/>`)}
 ${sparkles(after?[['fit',44,170]]:[['dust',96,172],['table',150,140],['bowls',200,160],['letter',156,104]])}
 ${after?`${target('sister1',216,150,22,26)}${target('sister2',250,150,22,26)}${target('cinderella',44,150,22,28)}`:`${target('dust',96,176,18,24)}${target('table',150,148,22,28)}${target('bowls',200,170,18,24)}`}`);
}
// The garden at night: a pumpkin, two mice, and the fairy godmother floating down.
const nightSky=`<rect width="320" height="200" fill="#2f3a78"/>${[[30,24],[78,48],[120,18],[200,30],[300,70],[176,60],[60,90],[230,92]].map(([x,y],i)=>star(x,y,.9+(i%3)*.3,'#fff3a0')).join('')}
 <circle cx="270" cy="40" r="20" fill="#fff3c4" ${L}/><circle cx="262" cy="36" r="3" fill="#f2e3a0"/><circle cx="276" cy="46" r="4" fill="#f2e3a0"/>
 <path d="M0 132Q80 116 160 128T320 122V200H0Z" fill="#3f7a4a"/>
 ${Array.from({length:17},(_,i)=>`<path d="M${i*20+4} 150V130l6-6 6 6V150Z" fill="#e9dcc6" ${L} stroke-width="1.4"/>`).join('')}<path d="M0 136H320M0 146H320" stroke="#c9b69a" stroke-width="3"/>
 <path d="M0 152Q100 144 200 152T320 150V200H0Z" fill="#4e8f45"/>`;
function gardenScene(){
 return scene('The fairy godmother in the garden at night',`${nightSky}
 <g transform="translate(128 182)"><g class="pumpkin" data-cue="pumpkin">${pumpkin}</g></g>
 <g transform="translate(128 184)"><g class="carriage" data-cue="carriage">${carriage}</g></g>
 <g class="mice" data-cue="mice"><g transform="translate(214 186)">${mouse}</g><g transform="translate(236 188)">${mouse}</g></g>
 <g class="horses" data-cue="horses">${horse(188,116,72)}${horse(222,122,72)}</g>
 ${actor('cinderella',44,186,cinderella,'cinderella')}
 ${actor('fairy',108,110,fairy,'fairy')}
 ${bubble('bubble-twelve',132,6,140,128,58,`<circle cx="158" cy="24" r="13" fill="#fffaf0" ${L}/><path d="M158 24V14M158 24V16" ${L} stroke-width="2.4"/><text x="158" y="16.5" font-size="6.5" text-anchor="middle" font-family="Fredoka,sans-serif" font-weight="700" fill="${INK}">12</text>`)}
 ${sparkles([['pumpkin',128,160],['mice',225,170],['cinderella',44,150]])}
 ${target('pumpkin',128,164,24,30)}${target('mice',225,178,18,24)}${target('cinderella',44,150,22,28)}`);
}
// The ballroom: columns, a chandelier, the big clock and the stairs she runs down.
function ballroomScene(){
 const ticks=Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;return `<path d="M${256+Math.sin(a)*18} ${58-Math.cos(a)*18}L${256+Math.sin(a)*21} ${58-Math.cos(a)*21}" stroke="${INK}" stroke-width="${i%3?1.2:2.2}"/>`;}).join('');
 return scene('The prince and Cinderella dance in the ballroom',`<rect width="320" height="200" fill="#f6d8e8"/>
 <path d="M60 140V60a40 40 0 0 1 80 0V140M170 140V60a40 40 0 0 1 80 0" fill="#fbe8f1" stroke="#e8b9cf" stroke-width="3"/>
 ${[34,286].map(x=>`<rect x="${x-9}" y="20" width="18" height="132" fill="#fff6fb" ${L}/><rect x="${x-13}" y="14" width="26" height="8" rx="2" fill="#fff6fb" ${L}/>`).join('')}
 <g transform="translate(150 0)"><path d="M0 0V14" ${L}/><path d="M-26 22Q0 40 26 22" fill="none" stroke="${GOLD}" stroke-width="3"/>${[-26,-13,0,13,26].map(x=>`<rect x="${x-2}" y="${x%26?20:14}" width="4" height="8" fill="#fffaf0" ${L} stroke-width="1"/><path d="M${x} ${x%26?16:10}q-2-3 0-5q2 2 0 5z" fill="#ffb347"/>`).join('')}</g>
 <rect y="150" width="320" height="50" fill="#fff4e6"/>${Array.from({length:16},(_,i)=>`<rect x="${i*20}" y="${150+(i%2)*25}" width="20" height="25" fill="#f2d6c0"/>`).join('')}${Array.from({length:16},(_,i)=>`<rect x="${i*20}" y="${175-(i%2)*25}" width="20" height="25" fill="#fff4e6"/>`).join('')}
 <path d="M0 150H320" stroke="#e0b9a0" stroke-width="2"/>
 <g class="stairs">${[0,1,2,3,4].map(i=>`<rect x="0" y="${150+i*10}" width="${70-i*14}" height="10" fill="#fff" ${L} stroke-width="1.4"/>`).join('')}</g>
 <g class="stair-slipper" data-cue="stair-slipper" transform="translate(30 170)">${slipper}</g>
 <g class="clock" data-cue="clock"><rect x="232" y="30" width="48" height="56" rx="10" fill="#c98b4a" ${L}/><circle cx="256" cy="58" r="22" fill="#fffaf0" ${L}/>${ticks}<path d="M256 58V39" ${L} stroke-width="2"/><path class="hour" d="M256 58V45" ${L} stroke-width="3.2"/><circle cx="256" cy="58" r="2.4" fill="${INK}"/></g>
 <g class="notes" fill="${INK}">${[[118,96],[176,88],[150,74]].map(([x,y],i)=>`<g class="note" style="--d:${i*.25}s"><circle cx="${x}" cy="${y}" r="3.4"/><path d="M${x+3} ${y}V${y-12}l6 2" fill="none" stroke="${INK}" stroke-width="1.8"/></g>`).join('')}</g>
 ${actor('prince',134,186,prince,'prince dancers')}${actor('cinderella',166,186,cinderella,'cinderella dancers')}
 ${target('dancers',150,148,30,40)}${target('clock',256,58,26,32)}`);
}
const pictures={
 cinderella:box('-30 -74 60 78',gown),
 stepmother:box('-30 -76 60 80',stepmother),
 sister:box('-30 -74 60 78',sister1),
 prince:box('-30 -76 60 80',prince),
 fairy:box('-30 -76 64 80',fairy),
 cry:box('-16 -72 32 30',head('scarf','sad')+tears.replace('class="tears"','')),
 pumpkin:box('-28 -42 56 46',pumpkin),
 carriage:box('-40 -76 80 78',carriage),
 mouse:box('-14 -16 32 20',mouse),
 dress:box('-28 -48 56 52',`<path d="M-8.5 -44Q-11 -30 -25 -4Q0 3 25 -4Q11 -30 8.5 -44Z" fill="#7cc3ff" ${L}/><path d="M-9.5 -34H9.5" stroke="#d6efff" stroke-width="3" stroke-linecap="round"/><circle cx="-9" cy="-41" r="4.5" fill="#d6efff" ${L} stroke-width="1.6"/><circle cx="9" cy="-41" r="4.5" fill="#d6efff" ${L} stroke-width="1.6"/>`),
 dance:box('-34 -76 68 80',`<g transform="translate(-14 0)">${prince}</g><g transform="translate(14 0)">${gown}</g>`),
 table:box('110 132 80 50',table.replace('class="spots"','class="spots" opacity="0"').replace('class="cloth"','class="cloth" opacity="0"')),
 bowl:box('-14 -12 28 16',bowl(0,-6)),
 clean:box('-30 -30 60 40',`<path d="M-24 6 -16 -10H16L24 6Z" fill="#d9a066" ${L}/>${star(-10,-18,1.6,GOLD)}${star(8,-22,1.2,'#fff3a0')}${star(16,-10,1,GOLD)}`),
 clock:box('228 26 56 64',`<rect x="232" y="30" width="48" height="56" rx="10" fill="#c98b4a" ${L}/><circle cx="256" cy="58" r="22" fill="#fffaf0" ${L}/><path d="M256 58V44" ${L} stroke-width="3"/><path d="M256 58H268" ${L} stroke-width="2"/>`),
 twelve:box('-24 -26 48 44',Array.from({length:12},(_,i)=>`<circle cx="${-15+(i%4)*10}" cy="${-17+Math.floor(i/4)*12}" r="4" fill="#ff7a45" ${L} stroke-width="1.4"/>`).join('')),
 shoe:box('-12 -10 24 16',slipper),
 foot:box('-16 -26 32 30',`<path d="M-6 0Q-12 0 -11 -8Q-10 -20 -2 -22Q6 -22 6 -14Q8 -6 10 -3Q11 0 6 0Z" fill="${SKIN}" ${L}/>${[[-9,-22],[-4.5,-24],[0,-24],[4,-22],[7,-19]].map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="${2.4-i*.25}" fill="${SKIN}" ${L} stroke-width="1.4"/>`).join('')}`)
};
const cover=()=>box('0 0 320 200',`${nightSky}<g transform="translate(150 184)">${carriage}</g>${horse(196,114,74)}<g transform="translate(64 186)">${gown}</g>${star(108,72,2,'#fff3a0')}${star(122,92,1.4,'#fff3a0')}`);

// ---- The story ----
let api;
const say=(key,t)=>api.say(key,t),wait=(ms,t)=>api.wait(ms,t),flag=(name,on)=>api.flag(name,on),move=(...args)=>api.move(...args);
const poof=name=>{api.replay(api.stage().querySelector('.sparkle-'+name),'poof');api.sounds.magic();};

async function atHome(t){
 await wait(400,t);
 await say('once',t);
 await say('family',t);
 flag('bossy');await say('work',t);flag('bossy',false);
 // Three chores: she walks to each, the line names it, and her tap does it.
 const chores=[['dust','sweep',74,()=>{api.replay(api.stage().querySelector('.broom'),'sweep');api.stage().querySelector('.dust').classList.add('gone');api.sounds.whoosh(.6);}],
  ['table','wipe',100,()=>{api.replay(api.stage().querySelector('.cloth'),'swipe');flag('table-clean');api.sounds.whoosh(.4);}],
  ['bowls','wash',172,()=>{flag('bowls-clean');api.chime('ding');}]];
 for(const [thing,line,x,doIt] of chores){
  move('cinderella',x,184,900);await wait(900,t);
  await say(line,t);
  await api.tap(thing,t,line);
  doIt();api.replay(api.stage().querySelector('.sparkle-'+thing),'poof');
  await wait(900,t);
 }
 await say('allClean',t);
 move('cinderella',60,184,1100);
 // The prince's letter arrives.
 flag('letter-came');poof('letter');await say('invite',t);
 flag('excited');await say('goDance',t);
 flag('say-no');await say('cantGo',t);await wait(300,t);flag('say-no',false);
 // Off they go without her.
 flag('door-open');flag('excited',false);
 for(const [who,ms] of [['stepmother',1200],['sister1',1300],['sister2',1100]])move(who,284,180,ms);
 await wait(1400,t);flag('family-gone');flag('door-open',false);await wait(300,t);
 flag('crying');await say('cry',t);await wait(500,t);
}
async function inTheGarden(t){
 await api.changeScene(t,gardenScene(),s=>s.classList.add('crying'));
 await wait(300,t);
 flag('fairy-in');api.sounds.magic();await say('fairyCame',t);
 await say('dontCry',t);flag('crying',false);
 // 变！变！变！ The fairy waves her wand at whatever she taps.
 for(const [thing,prompt,line] of [['pumpkin','tapPumpkin','carriage'],['mice','tapMice','horses'],['cinderella','tapCinderella','dress']]){
  await say(prompt,t);
  await api.tap(thing,t,prompt);
  api.replay(api.stage().querySelector('.actor-fairy'),'wave');
  await say('bian',t);
  poof(thing);flag(thing==='cinderella'?'dressed':'magic-'+thing);
  await wait(700,t);
  await say(line,t);
 }
 await say('slippers',t);
 await say('thanks',t);
 flag('say-twelve');await say('beBack',t);await wait(400,t);flag('say-twelve',false);
}
async function atTheDance(t){
 await api.changeScene(t,ballroomScene(),s=>s.classList.add('dressed'));
 await wait(300,t);
 await say('dance',t);
 await say('tapSpin',t);
 for(let i=0;i<3;i++){await api.tap('dancers',t,'tapSpin');api.replay(api.stage(),'spin');api.chime('ding');await wait(950,t);}
 // The night goes on: each tap moves the hour hand on, from ten to twelve; at twelve the bell rings.
 const hour=api.stage().querySelector('.hour');
 await say('tapClock',t);
 for(const [h,line] of [[10,'ten'],[11,'eleven'],[12,'midnight']]){
  await api.tap('clock',t,'tapClock');
  hour.style.setProperty('--hour',h);api.sounds.tick();api.replay(api.stage().querySelector('.clock'),'ring');
  await wait(700,t);if(h===12)api.sounds.bell();
  await say(line,t);
 }
 // She runs down the stairs and a slipper is left behind.
 move('cinderella',24,166,900);await wait(700,t);flag('slipper-left');move('cinderella',-40,196,900);await wait(1100,t);
 await say('shoeFell',t);await wait(400,t);
}
async function backHome(t){
 await api.changeScene(t,homeScene(true));
 // The prince comes in with the slipper on a cushion.
 flag('door-open');move('prince',120,186,1600);move('slipper',126,162,1600);await wait(1700,t);flag('door-open',false);
 await say('whose',t);
 for(const [sister,x] of [['sister1',216],['sister2',250]]){
  await say('tapSister',t);
  await api.tap(sister,t,'tapSister');
  move('slipper',x-6,184,700);await wait(800,t);
  api.replay(api.stage().querySelector(`.actor-${sister} .cuebox`),'strain');api.sounds.knock();await wait(500,t);
  move('slipper',126,162,600);
  await say('tooBig',t);
 }
 await say('youTry',t);
 await say('tapCinderella',t);
 await api.tap('cinderella',t,'tapCinderella');
 move('slipper',40,184,900);await wait(1000,t);
 poof('fit');flag('dressed');
 await say('fits',t);
 move('prince',86,186,900);await wait(900,t);
 flag('dance');await say('happy',t);await wait(900,t);
}
async function play(storyApi,t){
 api=storyApi;
 await atHome(t);
 await inTheGarden(t);
 await atTheDance(t);
 await backHome(t);
}

const css=`
.story-svg .gown,.dressed .rags{opacity:0}
.dressed .gown{opacity:1}
.story-svg .rags,.story-svg .gown{transition:opacity .6s}
.story-svg .tears{opacity:0}
.crying .tears{opacity:1;animation:cin-tear 1s ease-in infinite}
@keyframes cin-tear{from{transform:translateY(0)}to{transform:translateY(5px);opacity:.2}}
.crying .actor-cinderella .bob{animation:story-shiver .5s ease-in-out infinite alternate}
.story-svg .dust{transition:opacity .4s,transform .4s;transform-box:fill-box;transform-origin:50% 100%}
.story-svg .dust.gone{opacity:0;transform:scale(.2)}
.story-svg .broom{transform-box:fill-box;transform-origin:0 0}
.story-svg .broom.sweep{animation:cin-sweep .45s ease-in-out 2}
@keyframes cin-sweep{50%{transform:rotate(28deg)}}
.story-svg .letter{opacity:0;transform-box:fill-box;transform-origin:center;transition:opacity .4s}
.letter-came .letter{opacity:1;animation:cin-float 1.6s ease-in-out infinite alternate}
.family-gone .letter{opacity:0}
@keyframes cin-float{to{transform:translateY(-5px) rotate(3deg)}}
.bossy .actor-stepmother .cuebox,.cuebox.strain{animation:story-no .35s ease-in-out 3}
.excited .actor-sister1 .bob,.excited .actor-sister2 .bob{animation:story-hop .3s ease-in-out infinite alternate}
.excited .actor-sister2 .bob{animation-delay:.15s}
.family-gone .actor-stepmother,.family-gone .actor-sister1,.family-gone .actor-sister2{opacity:0}
.story-svg .door-leaf{transform-box:fill-box;transform-origin:100% 50%;transition:transform .35s var(--spring)}
.door-open .door-leaf{transform:scaleX(.2)}
.say-no .bubble-no,.say-twelve .bubble-twelve{opacity:1;transform:none}
.story-svg .actor-fairy{opacity:0}
.fairy-in .actor-fairy{opacity:1;transition:opacity 1s}
.fairy-in .actor-fairy .bob{animation:cin-float 1.4s ease-in-out infinite alternate}
.story-svg .wand{transform-box:fill-box;transform-origin:0 100%}
.actor-fairy.wave .wand{animation:cin-wave .6s ease-in-out}
@keyframes cin-wave{30%{transform:rotate(-30deg)}70%{transform:rotate(15deg)}}
.story-svg .carriage,.story-svg .horses{opacity:0;transform-box:fill-box;transform-origin:50% 100%;transform:scale(.4);transition:opacity .5s,transform .7s var(--spring)}
.story-svg .pumpkin,.story-svg .mice{transform-box:fill-box;transform-origin:50% 100%;transition:opacity .4s,transform .4s}
.magic-pumpkin .pumpkin,.magic-mice .mice{opacity:0;transform:scale(.3)}
.magic-pumpkin .carriage,.magic-mice .horses{opacity:1;transform:none}
.story-svg .sparkle .spark{opacity:0}
.story-svg .sparkle.poof .spark{animation:cin-spark .9s ease-out}
@keyframes cin-spark{0%{opacity:1;transform:translate(0,0) scale(.3)}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(1.2) rotate(90deg)}}
.story-svg .hour{transform-box:view-box;transform-origin:256px 58px;transform:rotate(calc(var(--hour,9)*30deg));transition:transform .7s var(--spring)}
.story-svg .spots,.story-svg .grime{transition:opacity .5s}
.table-clean .spots,.bowls-clean .grime{opacity:0}
.story-svg .cloth{transform-box:fill-box;transform-origin:center}
.story-svg .cloth.swipe{animation:cin-swipe .5s ease-in-out 2}
@keyframes cin-swipe{50%{transform:translateX(26px)}}
.story-svg .sud{opacity:0}
.bowls-clean .sud{animation:cin-sud 1.2s var(--d) ease-out}
@keyframes cin-sud{0%{opacity:0;transform:translateY(4px)}30%{opacity:1}100%{opacity:0;transform:translateY(-8px)}}
.story-svg .clock{transform-box:fill-box;transform-origin:50% 0}
.story-svg .clock.ring{animation:cin-ring .5s ease-in-out}
@keyframes cin-ring{25%{transform:rotate(-5deg)}75%{transform:rotate(5deg)}}
.spin .actor-prince .cuebox,.spin .actor-cinderella .cuebox{animation:cin-twirl .9s ease-in-out}
@keyframes cin-twirl{50%{transform:scaleX(-1) translateY(-4px)}}
.story-svg .notes{opacity:0}
.spin .notes{opacity:1}
.spin .note{animation:cin-note .9s var(--d) ease-out}
@keyframes cin-note{from{transform:translateY(8px);opacity:0}50%{opacity:1}to{transform:translateY(-10px);opacity:0}}
.story-svg .stair-slipper{opacity:0;transition:opacity .3s}
.slipper-left .stair-slipper{opacity:1}
.dance .actor-prince .bob,.dance .actor-cinderella .bob{animation:story-hop .4s ease-in-out infinite alternate}
.dance .actor-cinderella .bob{animation-delay:.2s}
`;

export default {
 firstScene:()=>homeScene(),
 scenes:()=>[homeScene(),gardenScene(),ballroomScene(),homeScene(true)],
 play,pictures,cover,css,
 avatars:{
  stepmother:box('-16 -76 32 34',head('bun','stern')),sister:box('-18 -74 36 34',head('curls','stern')),
  fairy:box('-16 -76 32 34',head('white','smile')),cinderella:box('-16 -74 32 34',head('golden','smile')),prince:box('-16 -76 32 34',head('prince','smile'))
 }
};
