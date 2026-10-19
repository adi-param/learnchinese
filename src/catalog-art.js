// A picture for every word in data/catalog.json, in the 120×96 word-picture box (animals face right, so food can
// fly into their mouths). To add a word: add it to the catalogue, draw it here under the same id, then run
// scripts/generate-audio.py. tests/games.test.js checks every catalogue word has a picture.
import {illustrations} from './illustrations.js';
import {animalPicture as oldAnimal,foodPicture as oldFood,MOUTHS as OLD_MOUTHS,pandaPicture} from './game-art.js';

const INK='#1f1b3a',ORANGE='#ff7a45';
const L=`stroke="${INK}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`;
const art=body=>`<svg class="art" viewBox="0 0 120 96" aria-hidden="true">${body}</svg>`;
const eye=(x,y,r=2.2)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}"/><circle cx="${x+.7}" cy="${y-.7}" r="${r*.35}" fill="#fff"/>`;
const shadow=(x,y,rx)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="2.6" fill="${INK}" opacity=".1"/>`;
const leg=(x,y,h,c)=>`<rect x="${x}" y="${y}" width="8" height="${h}" rx="3.5" fill="${c}" ${L}/>`;
const steam=(x,y)=>`<path d="M${x} ${y}q-4-5 0-10t0-10M${x+12} ${y+2}q-4-5 0-10t0-10" fill="none" stroke="#b6b3c4" stroke-width="2.4" stroke-linecap="round"/>`;
const bowl=(fill,inside)=>`<path d="M22 46H98Q96 80 60 82Q24 80 22 46Z" fill="${fill}" ${L}/>${inside}<path d="M20 46H100" ${L} stroke-width="3"/><path d="M44 82h32" ${L} stroke-width="3"/>`;
const glass=(fill,extra='')=>`<path d="M38 18H82L76 86H44Z" fill="#eef7ff" ${L}/><path d="M40.5 38H79.5L76 86H44Z" fill="${fill}"/><path d="M38 18H82L76 86H44Z" fill="none" ${L}/>${extra}`;

const ANIMALS={
 elephant:`${shadow(60,88,34)}${leg(32,62,24,'#9b98a8')}${leg(46,64,22,'#9b98a8')}${leg(70,64,22,'#9b98a8')}${leg(82,62,24,'#9b98a8')}<path d="M24 52q-8 2-8 12" fill="none" ${L}/><ellipse cx="58" cy="54" rx="34" ry="22" fill="#9b98a8" ${L}/>
  <circle cx="88" cy="40" r="16" fill="#9b98a8" ${L}/><path d="M100 46Q110 60 104 76Q100 82 96 78Q100 66 92 54Z" fill="#9b98a8" ${L}/><path d="M80 28Q64 30 66 48Q72 58 82 52Z" fill="#b6b3c4" ${L}/>${eye(92,36)}<path d="M96 52l6 6" stroke="#fffaf0" stroke-width="3" stroke-linecap="round"/>`,
 lion:`${shadow(58,88,30)}<path d="M28 58q-14-2-12-16q4 2 4 6" fill="none" ${L}/><circle cx="18" cy="40" r="4" fill="#a8703f" ${L} stroke-width="1.4"/>${leg(36,64,22,'#f2b950')}${leg(48,64,22,'#f2b950')}${leg(68,64,22,'#f2b950')}${leg(80,64,22,'#f2b950')}<ellipse cx="58" cy="60" rx="30" ry="16" fill="#f2b950" ${L}/>
  ${Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;return `<circle cx="${88+Math.cos(a)*16}" cy="${38+Math.sin(a)*16}" r="7" fill="#c97a2a" ${L} stroke-width="1.6"/>`;}).join('')}<circle cx="88" cy="38" r="15" fill="#f2b950" ${L}/>${eye(84,34)}${eye(94,34)}<path d="M86 42h4l-2 3z" fill="${INK}"/><path d="M84 47q4 3 8 0" fill="none" ${L} stroke-width="1.6"/>`,
 frog:`${shadow(60,88,30)}<ellipse cx="38" cy="80" rx="14" ry="6" fill="#4fb33f" ${L}/><ellipse cx="82" cy="80" rx="14" ry="6" fill="#4fb33f" ${L}/><ellipse cx="60" cy="64" rx="30" ry="20" fill="#5fbf4a" ${L}/><ellipse cx="60" cy="70" rx="18" ry="11" fill="#c7f0b8"/>
  <circle cx="46" cy="42" r="10" fill="#5fbf4a" ${L}/><circle cx="74" cy="42" r="10" fill="#5fbf4a" ${L}/><circle cx="46" cy="42" r="5" fill="#fff" ${L} stroke-width="1.4"/><circle cx="74" cy="42" r="5" fill="#fff" ${L} stroke-width="1.4"/><circle cx="47" cy="43" r="2.4" fill="${INK}"/><circle cx="75" cy="43" r="2.4" fill="${INK}"/><path d="M46 62q14 8 28 0" fill="none" ${L}/>`
};
const MOUTHS={...OLD_MOUTHS,elephant:[96,52],lion:[88,46],frog:[60,62]};
const FOODS={
 noodles:bowl('#fff4dc',`<path d="M30 50q6-8 12 0t12 0 12 0 12 0 12 0M32 56q6-6 12 0t12 0 12 0 12 0" fill="none" stroke="#e8b36a" stroke-width="3" stroke-linecap="round"/>`)+`<path d="M70 14 86 44M78 12 92 42" stroke="#a8703f" stroke-width="3" stroke-linecap="round"/>`,
 rice:`<path d="M32 46Q36 26 60 24Q84 26 88 46Z" fill="#fff" ${L}/><circle cx="50" cy="36" r="1.6" fill="#e3ddd5"/><circle cx="64" cy="32" r="1.6" fill="#e3ddd5"/><circle cx="72" cy="40" r="1.6" fill="#e3ddd5"/>`+bowl('#7cc3ff',''),
 dumplings:`<ellipse cx="60" cy="70" rx="46" ry="12" fill="#fff" ${L}/>${[[38,60],[60,56],[82,60]].map(([x,y])=>`<path d="M${x-14} ${y+6}Q${x-14} ${y-12} ${x} ${y-12}Q${x+14} ${y-12} ${x+14} ${y+6}Z" fill="#fffaf0" ${L}/><path d="M${x-8} ${y-8}l2 4M${x} ${y-10}v4M${x+8} ${y-8}l-2 4" stroke="#d9d4cc" stroke-width="1.4"/>`).join('')}`,
 bun:`${shadow(60,84,30)}<path d="M28 76Q24 40 60 34Q96 40 92 76Z" fill="#fffaf0" ${L}/><path d="M60 36q-2 8 0 14M48 40q2 6 6 10M72 40q-2 6-6 10" stroke="#d9d4cc" stroke-width="2" stroke-linecap="round" fill="none"/><path d="M28 76H92" ${L} stroke-width="2.4"/>`,
 soup:bowl('#ffd09a',`<ellipse cx="60" cy="47" rx="36" ry="5" fill="#ffb347"/><circle cx="48" cy="48" r="3" fill="#5fbf4a"/><circle cx="70" cy="47" r="2.4" fill="#ff7a45"/>`)+steam(52,36),
 pizza:`<path d="M24 24Q60 12 96 24L60 88Z" fill="#ffd34d" ${L}/><path d="M24 24Q60 12 96 24L92 32Q60 22 28 32Z" fill="#e8b36a" ${L} stroke-width="1.6"/><circle cx="54" cy="42" r="6" fill="#e2504f" ${L} stroke-width="1.4"/><circle cx="70" cy="50" r="5" fill="#e2504f" ${L} stroke-width="1.4"/><circle cx="60" cy="66" r="4.4" fill="#e2504f" ${L} stroke-width="1.4"/>`,
 burger:`<path d="M26 44Q28 18 60 18Q92 18 94 44Z" fill="#e8b36a" ${L}/><circle cx="48" cy="30" r="1.6" fill="#fff"/><circle cx="62" cy="26" r="1.6" fill="#fff"/><circle cx="74" cy="32" r="1.6" fill="#fff"/><path d="M22 46q8 8 16 0t16 0 16 0 16 0 16 0" fill="#5fbf4a" ${L}/><rect x="24" y="52" width="72" height="10" rx="5" fill="#8c5428" ${L}/><path d="M24 64H96" stroke="#ffd34d" stroke-width="5"/><path d="M26 66Q28 82 60 82Q92 82 94 66Z" fill="#e8b36a" ${L}/>`,
 icecream:`<path d="M44 52 60 90 76 52Z" fill="#e8b36a" ${L}/><path d="M48 60l20 0M52 70h16" stroke="#c98b4a" stroke-width="1.6"/><circle cx="50" cy="44" r="13" fill="#ff9fb0" ${L}/><circle cx="70" cy="44" r="13" fill="#fff4dc" ${L}/><circle cx="60" cy="28" r="13" fill="#a8703f" ${L}/><circle cx="62" cy="16" r="3.4" fill="#e2504f" ${L} stroke-width="1.2"/>`,
 egg:`${shadow(60,84,22)}<path d="M60 12Q84 14 86 52Q86 82 60 84Q34 82 34 52Q36 14 60 12Z" fill="#fff8ec" ${L}/><ellipse cx="50" cy="36" rx="5" ry="9" fill="#fff" transform="rotate(20 50 36)"/>`
};
const DRINKS={
 juice:glass('#ffb347',`<path d="M66 10 72 4M66 10 62 44" stroke="#ff7fb6" stroke-width="3.4" stroke-linecap="round"/>`),
 water:glass('#bfe3ff'),
 tea:`<ellipse cx="60" cy="80" rx="40" ry="8" fill="#fff" ${L}/><path d="M30 40H90Q88 76 60 78Q32 76 30 40Z" fill="#fff" ${L}/><ellipse cx="60" cy="41" rx="29" ry="5" fill="#c98b4a"/><path d="M90 48q14 0 12 12q-2 10-14 8" fill="none" ${L} stroke-width="3"/>${steam(52,30)}`
};
const PLACES={
 farm:`<path d="M0 74H120V96H0Z" fill="#8fd16e"/><path d="M26 76V40L60 18 94 40V76Z" fill="#e2504f" ${L}/><path d="M48 76V54H72V76Z" fill="#fff" ${L}/><path d="M48 54 72 76M72 54 48 76" stroke="#e2504f" stroke-width="2.6"/><path d="M44 38h32" stroke="#fff" stroke-width="3"/><path d="M8 76V60h12v16M100 76V64h12v12" fill="#ffd34d" ${L} stroke-width="1.4"/>`,
 zoo:`<path d="M0 80H120V96H0Z" fill="#8fd16e"/><path d="M14 80V30M106 80V30" ${L} stroke-width="6"/><path d="M14 30Q60 4 106 30" fill="none" ${L} stroke-width="6"/><path d="M14 30Q60 4 106 30" fill="none" stroke="#5fbf4a" stroke-width="3"/>${[30,46,62,78,94].map(x=>`<path d="M${x} 80V${x===62?40:46}" stroke="${INK}" stroke-width="2.4"/>`).join('')}<g transform="translate(26 26) scale(.55)">${ANIMALS.elephant}</g>`,
 beach:`<rect width="120" height="96" fill="#cfeaff"/><circle cx="96" cy="22" r="11" fill="#ffd34d"/><path d="M0 52Q30 46 60 52T120 50V70H0Z" fill="#3f8cff"/><path d="M0 64Q60 58 120 66V96H0Z" fill="#ffe0a0"/><path d="M40 86V40" ${L} stroke-width="2.4"/><path d="M14 46Q40 18 66 46Z" fill="#ff7fb6" ${L}/><path d="M28 46Q40 26 52 46" fill="none" stroke="#fff" stroke-width="2"/>`,
 forest:`<path d="M0 84H120V96H0Z" fill="#8fd16e"/>${[[28,84,1],[60,84,1.25],[92,84,1]].map(([x,y,s])=>`<g transform="translate(${x} ${y}) scale(${s})"><rect x="-4" y="-12" width="8" height="12" fill="#a8703f" ${L} stroke-width="1.4"/><path d="M0 -60 18 -30H-18ZM0 -46 20 -12H-20Z" fill="#3f8f3a" ${L} stroke-width="1.6"/></g>`).join('')}`,
 park:`<rect width="120" height="96" fill="#cfeaff"/><path d="M0 76H120V96H0Z" fill="#8fd16e"/><path d="M20 80 32 24 44 80M76 80 88 24 100 80M30 26H90" fill="none" ${L} stroke-width="3"/><path d="M50 26V60M64 26V60" stroke="${INK}" stroke-width="1.6"/><rect x="46" y="60" width="22" height="5" rx="2" fill="#ff7a45" ${L} stroke-width="1.4"/>`,
 school:null
};
const FRUITS={
 orange:`${shadow(60,86,24)}<circle cx="60" cy="52" r="32" fill="#ff9a3c" ${L}/><path d="M60 20q-2-8 4-12" fill="none" stroke="#8c5428" stroke-width="3" stroke-linecap="round"/><path d="M62 18q12-6 18 2q-10 6-18-2z" fill="#5fbf4a" ${L} stroke-width="1.4"/>${[[48,40],[70,46],[56,64],[74,62],[44,56]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.2" fill="#e5782a"/>`).join('')}<ellipse cx="46" cy="38" rx="5" ry="8" fill="#fff" opacity=".4" transform="rotate(25 46 38)"/>`,
 pear:`${shadow(60,88,24)}<path d="M60 18Q72 18 72 34Q72 44 80 54Q88 66 84 76Q78 88 60 88Q42 88 36 76Q32 66 40 54Q48 44 48 34Q48 18 60 18Z" fill="#c7e05a" ${L}/><path d="M60 18q0-8 4-12" fill="none" stroke="#8c5428" stroke-width="3" stroke-linecap="round"/><path d="M63 12q10-6 16 0q-8 6-16 0z" fill="#5fbf4a" ${L} stroke-width="1.4"/><ellipse cx="50" cy="62" rx="5" ry="9" fill="#fff" opacity=".4"/>`,
 watermelon:`<path d="M14 40H106Q104 84 60 86Q16 84 14 40Z" fill="#3ccf6e" ${L}/><path d="M22 40H98Q96 76 60 78Q24 76 22 40Z" fill="#fffaf0"/><path d="M26 40H94Q92 72 60 74Q28 72 26 40Z" fill="#ff5a6e"/>${[[42,50],[56,56],[70,50],[50,64],[66,64],[60,46],[80,54]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="1.6" ry="2.6" fill="${INK}"/>`).join('')}<path d="M14 40H106" ${L} stroke-width="2.4"/>`,
 mango:`${shadow(60,86,28)}<path d="M28 58Q24 30 52 22Q82 16 92 40Q100 64 78 78Q54 90 38 78Q30 70 28 58Z" fill="#ffc233" ${L}/><path d="M60 20q-2-8 4-12" fill="none" stroke="#8c5428" stroke-width="3" stroke-linecap="round"/><path d="M62 16q10-6 18 0q-10 6-18 0z" fill="#5fbf4a" ${L} stroke-width="1.4"/><path d="M40 58Q44 34 64 30" fill="none" stroke="#ff9a3c" stroke-width="5" stroke-linecap="round" opacity=".6"/>`,
 peach:`${shadow(60,86,26)}<path d="M60 26Q30 18 28 50Q28 80 60 84Q92 80 92 50Q90 18 60 26Z" fill="#ffb3a0" ${L}/><path d="M60 28Q52 52 60 82" fill="none" stroke="#f08a78" stroke-width="2"/><path d="M60 26q-2-8 2-12" fill="none" stroke="#8c5428" stroke-width="3" stroke-linecap="round"/><path d="M62 20q10-8 18-2q-8 8-18 2z" fill="#5fbf4a" ${L} stroke-width="1.4"/><ellipse cx="44" cy="46" rx="5" ry="9" fill="#fff" opacity=".4"/>`
};
const MORE_FOODS={
 tomato:`${shadow(60,86,28)}<path d="M60 26Q28 22 26 52Q26 82 60 84Q94 82 94 52Q92 22 60 26Z" fill="#ff4d4d" ${L}/><path d="M60 28l-10-8 6 10-14 0 14 4-8 8 12-6 12 6-8-8 14-4-14 0 6-10Z" fill="#5fbf4a" ${L} stroke-width="1.4"/><ellipse cx="44" cy="46" rx="5" ry="9" fill="#fff" opacity=".4"/>`,
 potato:`${shadow(60,86,32)}<path d="M26 56Q22 30 52 28Q86 22 94 46Q100 72 70 78Q34 84 26 56Z" fill="#d9a066" ${L}/>${[[46,44],[70,40],[80,58],[54,64]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2" fill="#a8703f"/>`).join('')}`,
 mushroom:`${shadow(60,88,24)}<path d="M50 58H70V84Q60 90 50 84Z" fill="#fffaf0" ${L}/><path d="M18 60Q20 18 60 16Q100 18 102 60Z" fill="#e2504f" ${L}/>${[[44,36,6],[66,30,5],[82,46,5],[34,52,4]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/>`).join('')}`
};
const MORE_PLACES={
 supermarket:`<rect width="120" height="96" fill="#cfeaff"/><path d="M0 82H120V96H0Z" fill="#d9d4cc"/><rect x="14" y="30" width="92" height="52" fill="#fffaf0" ${L}/><rect x="14" y="20" width="92" height="14" fill="#3fae6e" ${L}/><text x="60" y="31" text-anchor="middle" font-size="10" font-weight="700" font-family="Fredoka,sans-serif" fill="#fff">SHOP</text><rect x="24" y="44" width="30" height="24" fill="#bfe3ff" ${L} stroke-width="1.6"/><rect x="66" y="44" width="28" height="38" fill="#bfe3ff" ${L} stroke-width="1.6"/><path d="M28 60h22M28 52h22" stroke="#ff7a45" stroke-width="3"/>`,
 hospital:`<rect width="120" height="96" fill="#cfeaff"/><path d="M0 82H120V96H0Z" fill="#d9d4cc"/><rect x="22" y="22" width="76" height="60" fill="#fff" ${L}/><rect x="50" y="62" width="20" height="20" fill="#bfe3ff" ${L} stroke-width="1.6"/><path d="M60 30v22M49 41h22" stroke="#e2504f" stroke-width="8" stroke-linecap="round"/><rect x="28" y="56" width="14" height="12" fill="#bfe3ff" ${L} stroke-width="1.4"/><rect x="78" y="56" width="14" height="12" fill="#bfe3ff" ${L} stroke-width="1.4"/>`,
 home:`<rect width="120" height="96" fill="#cfeaff"/><path d="M0 82H120V96H0Z" fill="#8fd16e"/><path d="M30 82V46H90V82Z" fill="#ffe1b0" ${L}/><path d="M22 48 60 18 98 48Z" fill="#e2504f" ${L}/><rect x="52" y="60" width="16" height="22" fill="#c98b4a" ${L} stroke-width="1.6"/><rect x="36" y="54" width="12" height="12" fill="#bfe3ff" ${L} stroke-width="1.4"/><rect x="74" y="54" width="12" height="12" fill="#bfe3ff" ${L} stroke-width="1.4"/><path d="M60 40a6 6 0 0 1 0 0" fill="none"/><path d="M57 38c-2-3-6 0-3 3l3 2 3-2c3-3-1-6-3-3z" fill="#f0507a"/>`
};
// Clothes, drawn flat in any colour (from the catalogue's colours).
const shade=(hex,amount)=>{const n=parseInt(hex.slice(1),16),mix=v=>Math.round(v*(1-amount));return '#'+[n>>16,n>>8&255,n&255].map(v=>mix(v).toString(16).padStart(2,'0')).join('');};
export const CLOTHES={
 shoes:c=>`<path d="M14 66Q14 48 30 48L44 50Q48 62 56 66H58V76H14Z" fill="${c}" ${L}/><path d="M62 66Q62 48 78 48L92 50Q96 62 104 66H106V76H62Z" fill="${c}" ${L}/><path d="M14 72H58M62 72H106" stroke="#fff" stroke-width="3"/>`,
 socks:c=>`<path d="M30 14H50V56Q50 66 42 70L26 78Q14 82 14 72Q14 64 26 60L30 58Z" fill="${c}" ${L}/><path d="M70 14H90V56Q90 66 82 70L66 78Q54 82 54 72Q54 64 66 60L70 58Z" fill="${c}" ${L}/><path d="M30 22H50M70 22H90" stroke="#fff" stroke-width="3"/>`,
 hat:c=>`<ellipse cx="60" cy="70" rx="46" ry="10" fill="${shade(c,.15)}" ${L}/><path d="M32 70Q30 24 60 22Q90 24 88 70Z" fill="${c}" ${L}/><path d="M33 58H87" stroke="#fff" stroke-width="5"/>`,
 shirt:c=>`<path d="M44 14 20 26 28 44 38 40V84H82V40L92 44 100 26 76 14Q60 24 44 14Z" fill="${c}" ${L}/><path d="M48 15q12 10 24 0" fill="none" ${L} stroke-width="1.6"/>`,
 dress:c=>`<path d="M46 12H74L78 34 98 84H22L42 34Z" fill="${c}" ${L}/><path d="M42 36H78" stroke="#fff" stroke-width="4"/><path d="M24 78H96" stroke="${shade(c,.2)}" stroke-width="3"/>`,
 trousers:c=>`<path d="M34 12H86L92 86H66L60 40L54 86H28Z" fill="${c}" ${L}/><path d="M34 20H86" stroke="${shade(c,.2)}" stroke-width="3"/>`,
 coat:c=>`<path d="M44 12 18 24 22 84H50V30Q60 40 70 30V84H98L102 24 76 12Q60 22 44 12Z" fill="${c}" ${L}/><path d="M60 34V84" stroke="${shade(c,.25)}" stroke-width="2"/>${[46,60,74].map(y=>`<circle cx="66" cy="${y}" r="2.6" fill="#fff" ${L} stroke-width="1"/>`).join('')}`
};
export const clothesPicture=(id,hex)=>art(CLOTHES[id](hex));
export const TOYS={
 ball:`${shadow(60,86,24)}<circle cx="60" cy="54" r="30" fill="#ff7a45" ${L}/><path d="M32 46Q60 60 88 46M34 66Q60 52 86 66" fill="none" stroke="#fff" stroke-width="5"/>`,
 blocks:`${[[30,58,'#ff4d4d','A'],[64,58,'#3f8cff','B'],[47,24,'#ffd34d','C']].map(([x,y,c,t])=>`<rect x="${x}" y="${y}" width="30" height="30" rx="3" fill="${c}" ${L}/><text x="${x+15}" y="${y+22}" text-anchor="middle" font-size="18" font-weight="700" font-family="Fredoka,sans-serif" fill="#fff">${t}</text>`).join('')}`,
 doll:`${shadow(60,90,18)}<path d="M44 86 50 50H70L76 86Z" fill="#ff8cc6" ${L}/><circle cx="60" cy="34" r="16" fill="#ffd9b8" ${L}/><path d="M44 34Q42 14 60 14Q78 14 76 34Q72 22 60 22Q48 22 44 34Z" fill="#f5c84c" ${L}/><circle cx="54" cy="36" r="1.8" fill="${INK}"/><circle cx="66" cy="36" r="1.8" fill="${INK}"/><path d="M56 42q4 3 8 0" fill="none" ${L} stroke-width="1.4"/>`,
 car:`${shadow(60,86,36)}<path d="M18 74V60Q20 50 34 50L44 36H74L88 50Q102 52 102 62V74Z" fill="#3f8cff" ${L}/><path d="M48 40H72L82 50H40Z" fill="#bfe3ff" ${L} stroke-width="1.6"/>${[38,82].map(x=>`<circle cx="${x}" cy="76" r="9" fill="#3b3a4a" ${L}/><circle cx="${x}" cy="76" r="3" fill="#b6b3c4"/>`).join('')}`,
 book:`<path d="M60 26Q40 18 20 24V80Q40 74 60 82Q80 74 100 80V24Q80 18 60 26Z" fill="#fff" ${L}/><path d="M60 26V82" ${L} stroke-width="1.6"/><path d="M28 36h24M28 46h24M68 36h24M68 46h24" stroke="#b6b3c4" stroke-width="2"/><path d="M20 24V80Q40 74 60 82" fill="none" stroke="#7cc3ff" stroke-width="4" opacity=".6"/>`,
 drum:`<ellipse cx="60" cy="36" rx="34" ry="11" fill="#fffaf0" ${L}/><path d="M26 36V72Q60 88 94 72V36Q60 50 26 36Z" fill="#e2504f" ${L}/><path d="M26 44 46 74M46 44 66 76M66 44 86 74" stroke="#ffd34d" stroke-width="3"/><path d="M80 10 62 30M96 14 74 32" stroke="#a8703f" stroke-width="4" stroke-linecap="round"/>`,
 robot:`${shadow(60,90,22)}<rect x="40" y="46" width="40" height="34" rx="6" fill="#9b98a8" ${L}/><rect x="44" y="16" width="32" height="26" rx="6" fill="#b6b3c4" ${L}/><path d="M60 16V8" ${L}/><circle cx="60" cy="6" r="3" fill="#ff4d4d" ${L} stroke-width="1.2"/><circle cx="52" cy="28" r="4" fill="#59b6ff" ${L} stroke-width="1.2"/><circle cx="68" cy="28" r="4" fill="#59b6ff" ${L} stroke-width="1.2"/><rect x="50" y="56" width="20" height="10" rx="2" fill="#ffd34d" ${L} stroke-width="1.2"/><path d="M40 54H30M80 54H90M50 80V88M70 80V88" ${L} stroke-width="4"/>`,
 duck:`${shadow(60,86,28)}<path d="M28 60Q24 44 40 46Q50 36 74 42Q90 46 88 62Q84 80 58 80Q32 80 28 60Z" fill="#ffd34d" ${L}/><circle cx="74" cy="34" r="14" fill="#ffd34d" ${L}/><path d="M86 34q10-2 14 2q-4 6-14 4z" fill="${ORANGE}" ${L} stroke-width="1.6"/>${eye(78,30)}`,
 kite:`<path d="M60 8 92 40 60 72 28 40Z" fill="#9b6ccf" ${L}/><path d="M60 8V72M28 40H92" stroke="#fff" stroke-width="2"/><path d="M60 72q-6 8 0 12t0 12" fill="none" ${L}/><path d="M56 82l8 2-8 2zM56 92l8 2-8 2" fill="#ff8cc6"/>`
};
const blob=colour=>`<path d="M30 52Q22 26 46 22Q60 12 78 20Q98 28 92 52Q90 76 64 78Q36 82 30 52Z" fill="${colour}" ${L}/>`;
const dots=n=>Array.from({length:n},(_,i)=>`<circle cx="${22+(i%5)*19}" cy="${n>5?(i<5?32:62):48}" r="7.5" fill="${ORANGE}" ${L} stroke-width="1.6"/>`).join('');

export function picture(list,item){
 const id=typeof item==='string'?item:item.id;
 if(list==='animals')return ANIMALS[id]?art(ANIMALS[id]):oldAnimal(id);
 if(list==='foods')return FOODS[id]?art(FOODS[id]):MORE_FOODS[id]?art(MORE_FOODS[id]):id==='cake'?illustrations.cake:oldFood(id);
 if(list==='drinks')return DRINKS[id]?art(DRINKS[id]):illustrations.milk;
 if(list==='places')return PLACES[id]?art(PLACES[id]):MORE_PLACES[id]?art(MORE_PLACES[id]):illustrations.school;
 if(list==='fruits')return FRUITS[id]?art(FRUITS[id]):oldFood(id);
 if(list==='toys')return art(TOYS[id]);
 if(list==='clothes')return clothesPicture(id,'#ff7a45');
 if(list==='actions')return pandaPicture(id);
 if(list==='body')return '';
 if(list==='spots')return '';
 if(list==='colours')return art(blob(item.hex));
 if(list==='numbers')return art(dots(Number(id)));
 return '';
}
export const mouthOf=id=>MOUTHS[id]||[92,44];
