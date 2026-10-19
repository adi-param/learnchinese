// The drawing kit every story shares, in the same flat style as the word pictures: ink outlines, warm fills.
// A scene is one SVG in a 320×200 box. Characters are drawn around their feet (0,0), so moving one is a single
// translate. Anything a line of the story names carries data-cue, so it can light up as it is said; anything she
// can tap has a hint ring and a bigger invisible hit area with the same name.
export const INK='#1f1b3a';
export const L=`stroke="${INK}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`;
// Glow for whatever is being said.
const defs=`<defs><filter id="story-glow" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#fff3a0"/><feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#ffc233" flood-opacity=".9"/></filter></defs>`;
export const scene=(label,body)=>`<svg class="story-svg" viewBox="0 0 320 200" role="img" aria-label="${label}">${defs}${body}</svg>`;
// A pulsing ring where she should tap, and the larger target under it for small fingers.
export const hint=(name,x,y,r)=>`<g class="hint hint-${name}" transform="translate(${x} ${y})"><circle r="${r}" fill="none" stroke="#ff7a45" stroke-width="3.5"/><circle class="hint-echo" r="${r}" fill="none" stroke="#ff7a45" stroke-width="2.5"/></g>`;
export const hit=(name,x,y,r)=>`<circle class="hit hit-${name}" cx="${x}" cy="${y}" r="${r}"/>`;
export const target=(name,x,y,r,reach=r+8)=>hint(name,x,y,r)+hit(name,x,y,reach);
// Someone who moves: the outer group is positioned, `bob` walks and dances, `cuebox` lights up when named.
export const actor=(name,x,y,body,cue=name)=>`<g class="actor actor-${name}" style="transform:translate(${x}px,${y}px)"><g class="bob"><g class="cuebox" data-cue="${cue}">${body}</g></g></g>`;
// A 52×36 speech bubble at x,y that says it in pictures; its tail leaves the bottom edge at `base` and points at tailX,tailY.
export const bubble=(cls,x,y,base,tailX,tailY,body)=>`<g class="bubble ${cls}"><rect x="${x}" y="${y}" width="52" height="36" rx="8" fill="#fff" ${L}/><path d="M${base} ${y+35}L${tailX} ${tailY}L${base+11} ${y+35}" fill="#fff" ${L}/><path d="M${base+1.5} ${y+36}H${base+9.5}" stroke="#fff" stroke-width="3"/>${body}</g>`;
// The big character that pops up when counting.
export const countPop=(x=150,y=58)=>`<text class="count-pop" x="${x}" y="${y}" text-anchor="middle" lang="zh-Hans"></text>`;
// A small picture for the word cards at the end, or a speaker's face.
export const box=(viewBox,body)=>`<svg class="art" viewBox="${viewBox}" aria-hidden="true">${body}</svg>`;
export const star=(x,y,s=1,fill='#ffc233')=>`<path transform="translate(${x} ${y}) scale(${s})" d="M0 -4l1.2 2.6 2.8.4-2 2 .5 2.8-2.5-1.3-2.5 1.3.5-2.8-2-2 2.8-.4z" fill="${fill}" stroke="${INK}" stroke-width="1"/>`;
export const tree=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><rect x="-4" y="-26" width="8" height="26" rx="2" fill="#b9743c" ${L}/><circle cx="0" cy="-40" r="18" fill="#5fbf4a" ${L}/><circle cx="-9" cy="-46" r="4" fill="#7fd36a"/></g>`;
// A sunny meadow, used by any story set outdoors.
export const meadow=`<rect width="320" height="200" fill="#cfeaff"/>
<circle cx="44" cy="38" r="15" fill="#ffd34d"/><g fill="#fff" opacity=".95"><ellipse cx="110" cy="30" rx="18" ry="7"/><ellipse cx="121" cy="25" rx="11" ry="7"/><ellipse cx="236" cy="42" rx="16" ry="6"/><ellipse cx="246" cy="38" rx="9" ry="6"/></g>
<path d="M0 118Q70 96 160 112T320 104V200H0Z" fill="#a6dc84"/><path d="M0 140Q90 124 180 136T320 132V200H0Z" fill="#8fd16e"/>
${tree(286,148,1.05)}${tree(22,140,.8)}
<path d="M0 162Q90 150 160 158T320 156V200H0Z" fill="#6cc24a"/>
<g fill="#fff">${[[40,182],[96,190],[210,186],[270,192],[150,196]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.6"/>`).join('')}</g>`;
// A paint blob for colour words, and dots for numbers.
export const blob=colour=>`<path d="M-20 -2Q-24 -18 -8 -22Q4 -30 16 -20Q26 -10 18 2Q10 12 -4 8Q-18 10 -20 -2Z" fill="${colour}" ${L}/>`;
export const dots=n=>[[-14,-20],[14,-20],[-14,4],[14,4],[0,-8]].slice(0,n).map(([x,y])=>`<circle cx="${x}" cy="${y}" r="6.5" fill="#ff7a45" ${L}/>`).join('');
// The cover as a standalone file, so the story list never has to load a story to show it. A file must be strict
// XML, so an attribute given twice (an outline style followed by a thinner stroke) keeps its first value, which is
// the one a page shows.
const firstOfEach=tag=>{const seen=new Set();return tag.replace(/\s([\w:-]+)="[^"]*"/g,(attribute,name)=>seen.has(name)?'':(seen.add(name),attribute));};
export const standalone=svg=>svg.replace('<svg class="art"','<svg xmlns="http://www.w3.org/2000/svg"').replace(/<[a-zA-Z][^>]*>/g,firstOfEach);

// Things any scene can scatter about for her to tap for fun (the engine makes them react; they never move the
// story on): a smiling sun that winks, clouds that drift, a tree a bird flies out of, flowers that boing.
export const funSun=(x,y,r=15)=>`<g data-fun="sun" class="fun-sun"><g class="rays" stroke="#ffc233" stroke-width="3" stroke-linecap="round">${Array.from({length:8},(_,i)=>{const a=i*Math.PI/4;return `<path d="M${x+Math.cos(a)*(r+4)} ${y+Math.sin(a)*(r+4)}L${x+Math.cos(a)*(r+10)} ${y+Math.sin(a)*(r+10)}"/>`;}).join('')}</g><circle cx="${x}" cy="${y}" r="${r}" fill="#ffd34d"/><circle cx="${x-5}" cy="${y-3}" r="1.6" fill="${INK}"/><path class="sun-eye" d="M${x+3} ${y-3}h4" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/><circle class="sun-open" cx="${x+5}" cy="${y-3}" r="1.6" fill="${INK}"/><path d="M${x-6} ${y+3}q6 5 12 0" fill="none" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/></g>`;
export const funCloud=(x,y,s=1)=>`<g data-fun="cloud" class="fun-cloud"><ellipse cx="${x}" cy="${y}" rx="${18*s}" ry="${7*s}" fill="#fff"/><ellipse cx="${x+11*s}" cy="${y-5*s}" rx="${11*s}" ry="${7*s}" fill="#fff"/></g>`;
export const funTree=(x,y,r=20)=>`<circle data-fun="tree" cx="${x}" cy="${y}" r="${r}" fill="transparent"/><g transform="translate(${x-10} ${y-4})"><g class="bird"><path d="M0 0q5-6 10 0q5-6 10 0" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/></g></g>`;
export const funFlower=(x,y,c='#fff')=>`<g data-fun="flower" class="fun-flower"><circle cx="${x}" cy="${y}" r="7" fill="transparent"/><circle cx="${x}" cy="${y}" r="3.4" fill="${c}"/><circle cx="${x}" cy="${y}" r="1.4" fill="#ffc233"/></g>`;
// Marks the actors in a scene as tappable for fun: `names` maps an actor's name to its fun name.
export const funActors=(svg,names)=>Object.entries(names).reduce((out,[actor,fun])=>out.replace(new RegExp(`class="actor actor-${actor}"`,'g'),`data-fun="${fun}" class="actor actor-${actor}"`),svg);
