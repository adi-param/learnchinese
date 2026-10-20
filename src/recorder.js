// Recording her voice for Say it with the panda. Everything stays in this page: the recording is kept in memory
// as a blob, played back from there, and gone when the page moves on or reloads. Nothing is saved or sent.
//
// Made to work every time on an iPad or iPhone as well as a computer:
// - the sound context is woken during her tap (Safari keeps it asleep otherwise, the level meter reads silence
//   and the take would be thrown away);
// - only a refused or missing mic turns recording off; a mic that is briefly busy just tries again next tap;
// - her voice plays back through that same woken sound context, not a fresh <audio> that Safari may refuse to
//   play outside a tap, with the silence before she speaks skipped and a quiet voice made louder;
// - the phone is told it is playing, not recording, once the mic is off, so playback is not stuck quiet.
let blocked=false,context=null,stopCurrent=null,playing=null;
const prepared=new WeakMap();
export const canRecord=()=>!blocked&&!!globalThis.navigator?.mediaDevices?.getUserMedia&&typeof MediaRecorder==='function';
export const stopRecording=()=>stopCurrent?.();
export const stopPlayback=()=>playing?.();

// Wakes the shared sound context. Call it while a tap is being handled, so Safari allows it.
function sound(){
 try{context??=new (window.AudioContext||window.webkitAudioContext)();if(context.state!=='running')context.resume().catch(()=>{});}catch{}
 return context;
}
const session=type=>{try{if(navigator.audioSession)navigator.audioSession.type=type;}catch{}};
const MIME=['audio/mp4','audio/webm;codecs=opus','audio/webm','audio/ogg;codecs=opus'];
const mimeType=()=>MIME.find(type=>MediaRecorder.isTypeSupported?.(type));

// Records until she has spoken and then been quiet for a moment (or 6 seconds, or she taps again). `onLevel` gets
// the loudness (0 to 1) for the mic ring. Resolves with a blob, or null if nothing was heard or the mic is not
// allowed. Call it straight from her tap, before any await.
export async function record(onLevel=()=>{}){
 stopPlayback();
 const ctx=sound();
 let cancelled=false;stopCurrent=()=>{cancelled=true;};
 session('play-and-record');
 let stream;
 try{stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});}
 catch(error){
  // Refused or no mic: stop offering it. Anything else (the mic still busy from last time) can try again.
  if(['NotAllowedError','SecurityError','NotFoundError','OverconstrainedError'].includes(error?.name))blocked=true;
  stopCurrent=null;session('auto');return null;
 }
 const release=()=>{stream.getTracks().forEach(track=>track.stop());session('playback');};
 if(cancelled){stopCurrent=null;release();return null;}
 let recorder;
 try{const type=mimeType();recorder=new MediaRecorder(stream,type?{mimeType:type}:undefined);}catch{try{recorder=new MediaRecorder(stream);}catch{stopCurrent=null;release();return null;}}
 let analyser=null,source=null;
 try{analyser=ctx.createAnalyser();analyser.fftSize=1024;source=ctx.createMediaStreamSource(stream);source.connect(analyser);}catch{analyser=null;}
 const pieces=[],data=new Float32Array(1024);
 recorder.ondataavailable=e=>{if(e.data?.size)pieces.push(e.data);};
 return new Promise(resolve=>{
  // `measured` is whether the meter really worked; if it never did, keep whatever was recorded.
  let heard=false,measured=false,peak=0,quietSince=0,watch=0,over=false;const started=performance.now();
  const end=keep=>{if(over)return;over=true;stopCurrent=null;clearTimeout(watch);onLevel(0);
   let settled=false;
   const finish=()=>{if(settled)return;settled=true;try{source?.disconnect();}catch{}release();
    const type=recorder.mimeType||pieces[0]?.type||'audio/mp4';
    resolve(keep&&pieces.length&&(heard||peak>.01||!measured)?new Blob(pieces,{type}):null);};
   recorder.onstop=finish;recorder.onerror=finish;
   // Some browsers now and then never say they have stopped; don't wait for ever.
   setTimeout(finish,1500);
   try{if(recorder.state!=='inactive')recorder.stop();else finish();}catch{finish();}};
  stopCurrent=()=>end(true);
  recorder.onerror=()=>end(false);
  // A plain timer, not the screen-refresh callback, so listening carries on even when the page is not being drawn.
  const listen=()=>{
   const now=performance.now();
   if(analyser&&ctx.state==='running'){
    analyser.getFloatTimeDomainData(data);let sum=0;for(const v of data)sum+=v*v;const level=Math.sqrt(sum/data.length);
    if(level>0)measured=true;peak=Math.max(peak,level);onLevel(Math.min(1,level*8));
    if(level>.02){heard=true;quietSince=0;}else if(heard&&!quietSince)quietSince=now;
   }else onLevel(.15+.1*Math.sin(now/150));
   if((heard&&quietSince&&now-quietSince>1000)||now-started>6000){end(true);return;}
   watch=setTimeout(listen,40);
  };
  try{recorder.start();}catch{end(false);return;}
  listen();
 });
}

const decode=(ctx,bytes)=>new Promise((resolve,reject)=>{const p=ctx.decodeAudioData(bytes,resolve,reject);p?.then?.(resolve,reject);});
// Decodes a recording once, and works out where her voice starts and how much to turn it up.
async function prepare(ctx,blob){
 if(prepared.has(blob))return prepared.get(blob);
 const buffer=await decode(ctx,await blob.arrayBuffer());
 const samples=buffer.getChannelData(0);let peak=0;for(const v of samples)peak=Math.max(peak,Math.abs(v));
 let first=0;while(first<samples.length&&Math.abs(samples[first])<peak*.15)first++;
 const take={buffer,start:Math.max(0,first/buffer.sampleRate-.15),gain:peak>0?Math.min(4,.85/peak):1};
 prepared.set(blob,take);return take;
}
// Plays her recording and resolves when it ends (or is stopped).
export async function playRecording(blob){
 stopPlayback();
 if(!blob)return;
 const ctx=sound();
 let take=null;
 try{if(ctx){if(ctx.state!=='running')await Promise.race([ctx.resume(),new Promise(r=>setTimeout(r,400))]);take=await prepare(ctx,blob);}}catch{}
 if(take&&ctx.state==='running')return new Promise(resolve=>{
  const node=ctx.createBufferSource(),gain=ctx.createGain();node.buffer=take.buffer;gain.gain.value=take.gain;node.connect(gain);gain.connect(ctx.destination);
  let timer=0;
  const finish=()=>{clearTimeout(timer);if(playing===stop)playing=null;try{node.disconnect();}catch{}resolve();};
  const stop=()=>{try{node.stop();}catch{}finish();};
  playing=stop;node.onended=finish;
  timer=setTimeout(finish,(take.buffer.duration-take.start)*1000+800);
  node.start(0,take.start);
 });
 // The sound context could not play it: fall back to a plain audio player.
 return new Promise(resolve=>{
  const src=URL.createObjectURL(blob),audio=new Audio(src);
  const finish=()=>{URL.revokeObjectURL(src);if(playing===stop)playing=null;resolve();};
  const stop=()=>{audio.pause();finish();};
  playing=stop;audio.onended=audio.onerror=finish;audio.play().catch(finish);
 });
}
// Plays a clip from a file (the right one) and resolves when it ends.
export function playUrl(audio,src,{rate=1,keep=true}={}){
 return new Promise(resolve=>{audio.onended=audio.onerror=()=>resolve();audio.src=src;audio.preservesPitch=audio.webkitPreservesPitch=keep;audio.defaultPlaybackRate=audio.playbackRate=rate;audio.play().then(()=>{audio.playbackRate=rate;}).catch(()=>resolve());});
}
