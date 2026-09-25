import test from 'node:test';
import assert from 'node:assert/strict';
import {femaleMandarinVoice,PRONUNCIATION_RATE} from '../src/speech.js';
test('prefers a female Mandarin voice over the first installed voice',()=>{
 const voices=[{name:'Male Mandarin',lang:'zh-CN'},{name:'Meijia',lang:'zh-TW'},{name:'Tingting',lang:'zh-CN'}];
 assert.equal(femaleMandarinVoice(voices),voices[2]);assert.equal(PRONUNCIATION_RATE,0.5);
});
test('accepts female Mandarin variants and never substitutes Cantonese or male voices',()=>{
 assert.equal(femaleMandarinVoice([{name:'Sinji',lang:'zh-HK'},{name:'Male Mandarin',lang:'zh-CN'}]),null);
 assert.equal(femaleMandarinVoice([{name:'Microsoft Xiaoxiao Online (Natural)',lang:'zh-CN'}]).name,'Microsoft Xiaoxiao Online (Natural)');
 assert.equal(femaleMandarinVoice([{name:'Meijia',lang:'zh-TW'}]).name,'Meijia');
 assert.equal(femaleMandarinVoice([]),null);
});
