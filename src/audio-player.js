// One reusable HTML audio element: play() is called directly from the user's tap.
// Request IDs prevent an interrupted older playback from reporting a false error.
export function createAudioPlayer(audio, {onState=()=>{}, onFailure=()=>{}}={}) {
  let request=0;
  let timer;
  const clear=()=>{clearTimeout(timer);timer=undefined;};
  function stop(){request++;clear();audio.onended=null;audio.onerror=null;audio.pause();onState('idle');}
  async function play(url){
    stop();const current=request;
    audio.src=url;audio.playbackRate=0.85;audio.preservesPitch=true;
    const fail=()=>{if(current!==request)return;request++;clear();audio.pause();onState('idle');onFailure();};
    audio.onended=()=>{if(current===request){clear();onState('idle');}};
    audio.onerror=fail;
    onState('loading');timer=setTimeout(fail,15000);
    try{await audio.play();if(current!==request)return;clear();onState('playing');}
    catch(error){if(current===request&&error.name!=='AbortError')fail();}
  }
  return {play,stop};
}
