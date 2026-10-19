// A picture for every word in data/catalog.json, in the 120×96 word-picture box (animals face right, so food can
// fly into their mouths). To add a word: add it to the catalogue, draw it here under the same id, then run
// scripts/generate-audio.py. tests/situations.test.js checks every catalogue word has a picture.
import {illustrations} from './illustrations.js';
import {animalPicture as oldAnimal,foodPicture as oldFood,MOUTHS as OLD_MOUTHS} from './game-art.js';

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
const blob=colour=>`<path d="M30 52Q22 26 46 22Q60 12 78 20Q98 28 92 52Q90 76 64 78Q36 82 30 52Z" fill="${colour}" ${L}/>`;
const dots=n=>Array.from({length:n},(_,i)=>`<circle cx="${22+(i%5)*19}" cy="${n>5?(i<5?32:62):48}" r="7.5" fill="${ORANGE}" ${L} stroke-width="1.6"/>`).join('');

export function picture(list,item){
 const id=typeof item==='string'?item:item.id;
 if(list==='animals')return ANIMALS[id]?art(ANIMALS[id]):oldAnimal(id);
 if(list==='foods')return FOODS[id]?art(FOODS[id]):id==='cake'?illustrations.cake:oldFood(id);
 if(list==='drinks')return DRINKS[id]?art(DRINKS[id]):illustrations.milk;
 if(list==='places')return PLACES[id]?art(PLACES[id]):illustrations.school;
 if(list==='colours')return art(blob(item.hex));
 if(list==='numbers')return art(dots(Number(id)));
 return '';
}
export const mouthOf=id=>MOUTHS[id]||[92,44];
// A Singapore one-dollar coin, and the things she asks the waiter for.
export const coin=`<svg class="art coin" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17" fill="#e8b84a" ${L}/><circle cx="20" cy="20" r="12.5" fill="none" stroke="#c9952a" stroke-width="2"/><text x="20" y="26" text-anchor="middle" font-size="16" font-weight="700" font-family="Fredoka,sans-serif" fill="#7a5a1a">1</text></svg>`;
export const spoon=`<svg class="art" viewBox="0 0 120 96" aria-hidden="true"><ellipse cx="38" cy="36" rx="16" ry="11" fill="#d9dbe5" ${L} transform="rotate(-30 38 36)"/><path d="M50 44 96 76" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M50 44 96 76" stroke="#d9dbe5" stroke-width="4.5" stroke-linecap="round"/></svg>`;
export const chopsticks=`<svg class="art" viewBox="0 0 120 96" aria-hidden="true">${[0,10].map(d=>`<path d="M${30+d} 14 ${80+d} 84" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M${30+d} 14 ${80+d} 84" stroke="#c98b4a" stroke-width="3.6" stroke-linecap="round"/>`).join('')}</svg>`;
