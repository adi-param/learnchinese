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
