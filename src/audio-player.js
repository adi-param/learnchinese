// One reusable HTML audio element: play() is called directly from the user's tap.
// Request IDs prevent an interrupted older playback from reporting a false error.
export function createAudioPlayer(audio, {onState=()=>{}, onFailure=()=>{}}={}) {
  let request=0;
  let timer;
  let settle=null;
  const clear=()=>{clearTimeout(timer);timer=undefined;};
  function stop(){request++;clear();settle?.(false);settle=null;audio.onended=null;audio.onerror=null;audio.pause();onState('idle');}
  // Starts one file for the current request. `started` settles once playback begins;
  // `ended` resolves true when the file finishes, false if it failed or was superseded.
  function run(url,current,{idleOnEnd}){
    const ended=new Promise(resolve=>{settle=resolve;});
    const finish=ok=>{settle?.(ok);settle=null;};
    audio.src=url;audio.playbackRate=0.85;audio.preservesPitch=true;
    const fail=()=>{if(current!==request)return;request++;clear();audio.pause();onState('idle');onFailure();finish(false);};
    audio.onended=()=>{if(current!==request)return;clear();if(idleOnEnd)onState('idle');finish(true);};
    audio.onerror=fail;
    onState('loading');timer=setTimeout(fail,15000);
    const started=(async()=>{
      try{await audio.play();if(current!==request)return;clear();onState('playing');}
      catch(error){if(current===request&&error.name!=='AbortError')fail();}
    })();
    return {started,ended};
  }
  async function play(url){stop();await run(url,request,{idleOnEnd:true}).started;}
  // Plays several recordings in order with a gap between them, reporting the index being spoken
  // (-1 when finished or interrupted) so the page can highlight each word.
  async function playAll(urls,{gap=350,onStep=()=>{}}={}){
    stop();const current=request;
    for(const [index,url] of urls.entries()){
      onStep(index);
      const ok=await run(url,current,{idleOnEnd:false}).ended;
      if(!ok||current!==request){onStep(-1);return;}
      if(index<urls.length-1)await new Promise(resolve=>{timer=setTimeout(resolve,gap);});
      if(current!==request){onStep(-1);return;}
    }
    onStep(-1);onState('idle');
  }
  return {play,playAll,stop};
}
