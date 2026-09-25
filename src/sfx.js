// Tiny synthesised reward sounds, so games need no extra audio files. Always called from a tap.
let context;
const tunes={yay:[523.25,659.25,783.99,1046.5],fanfare:[523.25,659.25,783.99,659.25,783.99,1046.5,1318.5],ding:[659.25,987.77],oops:[293.66,220]};
export function chime(kind='ding'){
 try{context??=new (window.AudioContext||window.webkitAudioContext)();}catch{return;}
 if(context.state==='suspended')context.resume().catch(()=>{});
 const start=context.currentTime;
 tunes[kind].forEach((frequency,index)=>{
  const oscillator=context.createOscillator(),gain=context.createGain(),t=start+index*0.11;
  oscillator.type=kind==='oops'?'sine':'triangle';oscillator.frequency.value=frequency;
  gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(0.1,t+0.02);gain.gain.exponentialRampToValueAtTime(0.001,t+0.35);
  oscillator.connect(gain).connect(context.destination);oscillator.start(t);oscillator.stop(t+0.4);
 });
}
