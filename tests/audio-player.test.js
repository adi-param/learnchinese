import test from 'node:test';
import assert from 'node:assert/strict';
import {createAudioPlayer} from '../src/audio-player.js';
function fakeAudio(play=()=>Promise.resolve()){return {pause(){},play};}
test('first tap directly starts a saved recording and reports playback',async()=>{
 const states=[];let calls=0;const audio=fakeAudio(()=>{calls++;return Promise.resolve();});const p=createAudioPlayer(audio,{onState:s=>states.push(s)});
 await p.play('/test.m4a');assert.equal(calls,1);assert.equal(audio.src,'/test.m4a');assert.equal(audio.playbackRate,.85);assert.equal(states.at(-1),'playing');audio.onended();assert.equal(states.at(-1),'idle');
});
test('failed recording shows help exactly once',async()=>{
 let failed=0;const p=createAudioPlayer(fakeAudio(()=>Promise.reject(new Error('network'))),{onFailure:()=>failed++});await p.play('/missing.m4a');assert.equal(failed,1);
});
test('rapid taps ignore failure from the superseded recording',async()=>{
 let rejectFirst;let calls=0;let failed=0;const a=fakeAudio(()=>++calls===1?new Promise((resolve,reject)=>{rejectFirst=reject;}):Promise.resolve());const p=createAudioPlayer(a,{onFailure:()=>failed++});
 const first=p.play('/first.m4a');await p.play('/second.m4a');rejectFirst(new Error('interrupted'));await first;assert.equal(a.src,'/second.m4a');assert.equal(failed,0);p.stop();
});
test('word-by-word plays each recording in order, then reports it is finished',async()=>{
 const played=[];const steps=[];const states=[];const a=fakeAudio(()=>{played.push(a.src);setTimeout(()=>a.onended(),0);return Promise.resolve();});
 const p=createAudioPlayer(a,{onState:s=>states.push(s)});
 await p.playAll(['/a.m4a','/b.m4a','/c.m4a'],{gap:0,onStep:i=>steps.push(i)});
 assert.deepEqual(played,['/a.m4a','/b.m4a','/c.m4a']);assert.deepEqual(steps,[0,1,2,-1]);assert.equal(states.at(-1),'idle');
});
test('a new tap interrupts word-by-word without a false failure',async()=>{
 let failed=0;const steps=[];const a=fakeAudio(()=>Promise.resolve());const p=createAudioPlayer(a,{onFailure:()=>failed++});
 const sequence=p.playAll(['/a.m4a','/b.m4a'],{gap:0,onStep:i=>steps.push(i)});
 await p.play('/other.m4a');await sequence;
 assert.equal(a.src,'/other.m4a');assert.deepEqual(steps,[0,-1]);assert.equal(failed,0);
});
