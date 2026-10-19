// Every story, in the order the list shows them. Only this small list loads with the app: a story's module, text,
// recordings and timings load when it is opened, and its cover is a picture file (assets/stories/<id>-cover.svg,
// made by scripts/story-covers.mjs). To add a story: data/stories/<id>.json, src/stories/<id>.js, an entry here,
// then run scripts/generate-audio.py and scripts/story-covers.mjs.
export const STORIES=[
 {id:'three-pigs',title:'三只小猪',english:'The three little pigs'},
 {id:'spidey-singapore',title:'蜘蛛小队救新加坡',english:'Team Spidey saves Singapore'},
 {id:'billy-goats',title:'三只山羊过桥',english:'The three billy goats'},
 {id:'paw-patrol',title:'PAW Patrol 救小鸡',english:'PAW Patrol saves the chicken'},
 {id:'kitten-mummy',title:'小猫找妈妈',english:'Little kitten looks for mummy'},
 {id:'turnip',title:'拔萝卜',english:'Let’s pull out the turnip'},
 {id:'tadpoles',title:'小蝌蚪找妈妈',english:'Little tadpoles look for their mother'},
 {id:'sima-guang',title:'司马光砸缸',english:'Sima Guang saves his friend'},
 {id:'tails',title:'谁的尾巴？',english:'Whose tail is it?'},
 {id:'cake',title:'谁拿走了我的蛋糕？',english:'Who took my cake?'}
];
