// Recording her voice for Say it with the panda. Everything stays in this page: the recording is kept in memory
// as a blob, played back from there, and gone when the page moves on or reloads. Nothing is saved or sent.
let blocked=false,context=null,stopCurrent=null;
export const canRecord=()=>!blocked&&!!globalThis.navigator?.mediaDevices?.getUserMedia&&typeof MediaRecorder==='function';
export const stopRecording=()=>stopCurrent?.();
// Records until she has spoken and then been quiet for a moment (or 6 seconds). `onLevel` gets the loudness
// (0 to 1) for the mic ring. Resolves with a blob, or null if she said nothing or the mic is not allowed.
export async function record(onLevel=()=>{}){
 let stream;
 try{stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true}});}catch{blocked=true;return null;}
 try{context??=new (window.AudioContext||window.webkitAudioContext)();if(context.state==='suspended')await context.resume().catch(()=>{});}catch{}
 const analyser=context?.createAnalyser();if(analyser){analyser.fftSize=1024;context.createMediaStreamSource(stream).connect(analyser);}
 const recorder=new MediaRecorder(stream),pieces=[],data=new Float32Array(1024);
 recorder.ondataavailable=e=>{if(e.data.size)pieces.push(e.data);};
 return new Promise(resolve=>{
  let spoke=!analyser,quietSince=0,watch=0,over=false;const started=performance.now();
  const end=keep=>{if(over)return;over=true;stopCurrent=null;clearTimeout(watch);
   recorder.onstop=()=>{stream.getTracks().forEach(track=>track.stop());resolve(keep&&spoke&&pieces.length?new Blob(pieces,{type:recorder.mimeType}):null);};
   if(recorder.state!=='inactive')recorder.stop();else recorder.onstop();};
  stopCurrent=()=>end(true);
  // A plain timer, not the screen-refresh callback, so listening carries on even when the page is not being drawn.
  const listen=()=>{
   const now=performance.now();
   if(analyser){analyser.getFloatTimeDomainData(data);let sum=0;for(const v of data)sum+=v*v;const level=Math.sqrt(sum/data.length);onLevel(Math.min(1,level*8));
    if(level>.035){spoke=true;quietSince=0;}else if(spoke&&!quietSince)quietSince=now;}
   if((spoke&&quietSince&&now-quietSince>900)||now-started>6000){end(true);return;}
   watch=setTimeout(listen,40);
  };
  recorder.start();listen();
 });
}
// Plays a recording (hers, or the right one) and resolves when it ends.
export function playUrl(audio,src,{rate=1,keep=true}={}){
 return new Promise(resolve=>{audio.onended=audio.onerror=()=>resolve();audio.src=src;audio.preservesPitch=audio.webkitPreservesPitch=keep;audio.defaultPlaybackRate=audio.playbackRate=rate;audio.play().then(()=>{audio.playbackRate=rate;}).catch(()=>resolve());});
}
