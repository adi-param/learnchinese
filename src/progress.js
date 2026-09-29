// Progress stays on this device only (browser storage). Nothing is sent anywhere, and the site
// still works when storage is blocked; it just forgets between visits.
const KEY='learnchinese.progress.v1';
export const defaultProgress=()=>({level:0,levelPerfect:0,stats:{},missed:[],excluded:[],mix:false,mixLessons:[],seen:{},round:0});
export function loadProgress(storage=globalThis.localStorage){
 try{const saved=JSON.parse(storage?.getItem(KEY)||'{}');return {...defaultProgress(),...saved};}catch{return defaultProgress();}
}
export function saveProgress(progress,storage=globalThis.localStorage){
 try{storage?.setItem(KEY,JSON.stringify(progress));}catch{}
}
