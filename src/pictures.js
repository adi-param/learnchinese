// Picture hints for pre-readers. These are presentation only: the curriculum's `image` field stays null
// and nothing here is a translation.
// Every picture is a drawing from src/illustrations.js in one consistent style.
// Rule: a picture must show the word itself, never one example of it, because a child learns whatever it shows.
// Qualities are shown by contrast (the same object twice, the answer glowing under an arrow), family roles
// within one family, actions being done. Colours are shapeless paint blobs and shapes are colourless outlines.
import {illustrations} from './illustrations.js';
const art=name=>({art:name});
const swatch=(...colours)=>({swatch:colours});
const shape=name=>({shape:name});
export const wordPictures={
 // things
 马:art('horse'),鸭:art('duck'),牛:art('cow'),羊:art('sheep'),兔:art('rabbit'),
 草:art('grass'),草地:art('lawn'),太阳:art('sun'),天:art('sky'),月亮:art('moon'),树:art('tree'),山:art('mountain'),
 船:art('boat'),火车:art('train'),
 草莓:art('strawberry'),蛋糕:art('cake'),巧克力:art('chocolate'),牛奶:art('milk'),饼干:art('biscuit'),
 菜:art('vegetables'),肉:art('meat'),白米饭:art('rice'),葡萄:art('grapes'),
 书:art('book'),故事书:art('storybook'),桌子:art('table'),椅子:art('chair'),沙发:art('sofa'),床:art('bed'),
 枕头:art('pillow'),积木:art('blocks'),球:art('ball'),玩具:art('toys'),鞋子:art('shoes'),袜子:art('socks'),
 学校:art('school'),房间:art('room'),客厅:art('livingroom'),
 // body, language and sounds
 脸:art('face'),眼睛:art('eyes'),华语:art('mandarin'),风儿:art('wind'),轰隆隆:art('rumble'),
 // colours and shapes
 黑:swatch('#222222'),黄:swatch('#ffd21f'),绿:swatch('#2fb84f'),白:swatch('#ffffff'),红:swatch('#e8342e'),
 颜色:swatch('#e8342e','#ffd21f','#2f7fe0'),
 圆形:shape('circle'),正方形:shape('square'),三角形:shape('triangle'),
 // qualities and positions, by contrast
 大:art('big'),小:art('small'),高:art('tall'),长:art('long'),亮:art('bright'),弯:art('curved'),圆:art('round'),
 上:art('on'),下:art('under'),
 // feelings and manners
 甜:art('sweet'),香:art('fragrant'),轻轻:art('gently'),安静:art('quiet'),开开心心:art('happy'),
 // family: one person highlighted in the same family
 爸爸:art('dad'),妈妈:art('mum'),妹妹:art('sister'),弟弟:art('brother'),
 // actions: someone doing it
 长大:art('growup'),说:art('speak'),读:art('read'),唱歌:art('sing'),喜欢:art('like'),来:art('come'),去:art('go'),
 吃:art('eat'),游泳:art('swim'),出来:art('comeout'),睡觉:art('sleep'),吹:art('blow'),跳:art('jump'),看:art('look'),
 玩:art('play'),写:art('write'),穿:art('wear'),点:art('tap'),学:art('learn'),想要:art('want'),帮:art('help'),找:art('find')
};
// Lesson chips show that lesson's headline picture.
export const lessonPictures={
 'lesson-32':art('growup'),'lesson-33':art('horse'),'lesson-34':art('cow'),'lesson-35':art('sun'),'lesson-36':art('moon'),
 'lesson-37':null,'lesson-38':art('cake'),'lesson-39':art('biscuit'),'lesson-40':art('rice'),'lesson-41':art('grapes'),
 'lesson-42':art('train'),'lesson-43':art('rabbit'),'lesson-44':art('livingroom'),'lesson-45':art('socks'),'lesson-46':art('sofa'),
 all:art('all')
};
const shapes={
 circle:'<circle cx="50" cy="50" r="38"/>',
 square:'<rect x="14" y="14" width="72" height="72" rx="4"/>',
 triangle:'<path d="M50 12 88 84H12Z" stroke-linejoin="round"/>'
};
export function renderPicture(p){
 if(p.art)return illustrations[p.art];
 if(p.swatch)return `<span class="swatches">${p.swatch.map(colour=>`<span class="swatch${p.swatch.length>1?' mini':''}" style="--swatch:${colour}"></span>`).join('')}</span>`;
 return `<svg class="outline" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="8">${shapes[p.shape]}</svg>`;
}
// Phrases and sentences borrow up to three pictures from their component words, things before qualities.
const thingFirst=['animal','food','object','transport','nature','body','clothing','place'];
const rank=word=>{const index=thingFirst.indexOf(word.category);return index<0?thingFirst.length:index;};
export function picturesOf(item,byId){
 if(item.kind==='word')return wordPictures[item.hanzi]?[wordPictures[item.hanzi]]:[];
 const words=[...new Set(item.wordIds||[])].map(id=>byId.get(id)).filter(word=>wordPictures[word?.hanzi]);
 return words.sort((a,b)=>rank(a)-rank(b)).slice(0,3).map(word=>wordPictures[word.hanzi]);
}
// Returns trusted markup for a decorative, aria-hidden picture slot ('' when there is no picture).
export const pictureFor=(item,byId)=>picturesOf(item,byId).map(p=>`<span class="pic">${renderPicture(p)}</span>`).join('');
