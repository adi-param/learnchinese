// Recording her voice for Say it with the panda. Everything stays in this page: the recording is kept in memory
// as a blob, played back from there, and gone when the page moves on or reloads. Nothing is saved or sent.
//
// Kept as plain as possible, because iPads and iPhones are fussy:
// - her voice plays back through one audio player that is unlocked during her tap on the mic (Safari only lets a
//   player start by itself once a tap has started it), so it can play the moment she stops talking;
// - the loudness meter gets its own short-lived sound context, opened while the mic is on and closed straight after,
//   so it never upsets other sound on the page; if it can't measure, the take is kept anyway;
// - only a refused or missing mic turns recording off; a mic that is briefly busy just tries again next tap.
let blocked=false,stopCurrent=null,playing=null;
export const canRecord=()=>!blocked&&!!globalThis.navigator?.mediaDevices?.getUserMedia&&typeof MediaRecorder==='function';
export const stopRecording=()=>stopCurrent?.();
export const stopPlayback=()=>playing?.();

const player=typeof Audio==='function'?new Audio():null;
// A tenth of a second of silence, to unlock the player during a tap.
const silence=(()=>{
 if(typeof Blob!=='function'||typeof URL?.createObjectURL!=='function')return '';
 const rate=8000,samples=800,bytes=new DataView(new ArrayBuffer(44+samples*2)),text=(at,s)=>[...s].forEach((c,i)=>bytes.setUint8(at+i,c.charCodeAt(0)));
 text(0,'RIFF');bytes.setUint32(4,36+samples*2,true);text(8,'WAVEfmt ');bytes.setUint32(16,16,true);bytes.setUint16(20,1,true);bytes.setUint16(22,1,true);
 bytes.setUint32(24,rate,true);bytes.setUint32(28,rate*2,true);bytes.setUint16(32,2,true);bytes.setUint16(34,16,true);text(36,'data');bytes.setUint32(40,samples*2,true);
 return URL.createObjectURL(new Blob([bytes.buffer],{type:'audio/wav'}));
})();
let unlocked=false;
function unlock(){
 if(unlocked||!player||!silence||playing)return;
 player.src=silence;player.play().then(()=>{unlocked=true;}).catch(()=>{});
}
// Her first tap anywhere (the ▶ that starts a game, say) unlocks it too, well before the mic is involved.
if(typeof document==='object')for(const kind of ['touchend','click'])document.addEventListener(kind,()=>unlock(),{capture:true,passive:true});
const MIME=['audio/mp4','audio/webm;codecs=opus','audio/webm','audio/ogg;codecs=opus'];
const mimeType=()=>MIME.find(type=>MediaRecorder.isTypeSupported?.(type));

// Watches how loud she is. Returns a reader of the level (0 to 1, or null when it can't tell) and a closer.
function meter(stream){
 try{
  const context=new (window.AudioContext||window.webkitAudioContext)(),analyser=context.createAnalyser(),data=new Float32Array(1024);
  analyser.fftSize=1024;context.createMediaStreamSource(stream).connect(analyser);
  if(context.state!=='running')context.resume().catch(()=>{});
  return {
   level:()=>{if(context.state!=='running')return null;analyser.getFloatTimeDomainData(data);let sum=0;for(const v of data)sum+=v*v;return Math.sqrt(sum/data.length);},
   close:()=>{context.close().catch(()=>{});}
  };
 }catch{return {level:()=>null,close(){}};}
}

// Records until she has spoken and then been quiet for a moment (or 6 seconds, or she taps again). `onLevel` gets
// the loudness (0 to 1) for the mic ring. Resolves with a blob, or null if nothing was heard or the mic is not
// allowed. Call it straight from her tap, before any await, so the player is unlocked by that tap.
export async function record(onLevel=()=>{}){
 stopPlayback();unlock();
 let cancelled=false;stopCurrent=()=>{cancelled=true;};
 let stream;
 try{stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});}
 catch(error){
  // Refused or no mic: stop offering it. Anything else (the mic still busy from last time) can try again.
  if(['NotAllowedError','SecurityError','NotFoundError','OverconstrainedError'].includes(error?.name))blocked=true;
  stopCurrent=null;return null;
 }
 const release=()=>stream.getTracks().forEach(track=>track.stop());
 if(cancelled){stopCurrent=null;release();return null;}
 let recorder;
 try{const type=mimeType();recorder=new MediaRecorder(stream,type?{mimeType:type}:undefined);}catch{try{recorder=new MediaRecorder(stream);}catch{stopCurrent=null;release();return null;}}
 const loudness=meter(stream),pieces=[];
 recorder.ondataavailable=e=>{if(e.data?.size)pieces.push(e.data);};
 return new Promise(resolve=>{
  // `measured` is whether the meter really worked; if it never did, keep whatever was recorded.
  let heard=false,measured=false,peak=0,quietSince=0,watch=0,over=false;const started=performance.now();
  const end=keep=>{if(over)return;over=true;stopCurrent=null;clearTimeout(watch);onLevel(0);
   let settled=false;
   const finish=()=>{if(settled)return;settled=true;loudness.close();release();
    const type=recorder.mimeType||pieces[0]?.type||'audio/mp4';
    // A moment for the phone to switch from the mic back to the speaker before anything plays.
    setTimeout(()=>resolve(keep&&pieces.length&&(heard||peak>.01||!measured)?new Blob(pieces,{type}):null),250);};
   recorder.onstop=finish;recorder.onerror=finish;
   // Some browsers now and then never say they have stopped; don't wait for ever.
   setTimeout(finish,1500);
   try{if(recorder.state!=='inactive')recorder.stop();else finish();}catch{finish();}};
  stopCurrent=()=>end(true);
  recorder.onerror=()=>end(false);
  // A plain timer, not the screen-refresh callback, so listening carries on even when the page is not being drawn.
  const listen=()=>{
   const now=performance.now(),level=loudness.level();
   if(level===null)onLevel(.15+.1*Math.sin(now/150));
   else{
    if(level>0)measured=true;peak=Math.max(peak,level);onLevel(Math.min(1,level*8));
    if(level>.02){heard=true;quietSince=0;}else if(heard&&!quietSince)quietSince=now;
   }
   if((heard&&quietSince&&now-quietSince>1000)||now-started>6000){end(true);return;}
   watch=setTimeout(listen,40);
  };
  try{recorder.start();}catch{end(false);return;}
  listen();
 });
}

// Plays her recording and resolves when it ends (or is stopped).
export function playRecording(blob){
 stopPlayback();
 if(!blob||!player)return Promise.resolve();
 return new Promise(resolve=>{
  const src=URL.createObjectURL(blob);let timer=0;
  const finish=()=>{clearTimeout(timer);player.onended=player.onerror=null;URL.revokeObjectURL(src);if(playing===stop)playing=null;resolve();};
  const stop=()=>{player.pause();finish();};
  playing=stop;player.onended=player.onerror=finish;
  player.src=src;player.preservesPitch=player.webkitPreservesPitch=true;player.defaultPlaybackRate=player.playbackRate=1;
  // In case the player never says it has ended: a take is at most a little over 6 seconds.
  timer=setTimeout(stop,9000);
  player.play().catch(finish);
 });
}
// Plays a clip from a file (the right one) and resolves when it ends.
export function playUrl(audio,src,{rate=1,keep=true}={}){
 return new Promise(resolve=>{audio.onended=audio.onerror=()=>resolve();audio.src=src;audio.preservesPitch=audio.webkitPreservesPitch=keep;audio.defaultPlaybackRate=audio.playbackRate=rate;audio.play().then(()=>{audio.playbackRate=rate;}).catch(()=>resolve());});
}
