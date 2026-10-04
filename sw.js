// Offline support for the installed app. On install it stores the app and every recording; after that each
// request tries the network first (revalidating, so updates arrive straight away) and falls back to the
// stored copy when there is no connection.
const CACHE='learnchinese-v1';
const SHELL=['./','index.html','manifest.webmanifest','favicon.svg','src/styles.css','src/app.js','src/audio-help.js','src/audio-player.js',
 'src/core.js','src/icons.js','src/illustrations.js','src/pictures.js','src/progress.js','src/sentences.js','src/sfx.js','src/stage.js','src/speech.js',
 'data/library.json','data/patterns.json','data/sentence-chunks.json','assets/audio/manifest.json','assets/icons/icon-192.png','assets/icons/apple-touch-icon.png'];
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);
 await cache.addAll(SHELL.map(path=>new Request(path,{cache:'no-cache'})));
 const recordings=Object.values(await (await fetch('assets/audio/manifest.json',{cache:'no-cache'})).json()).map(entry=>entry.file);
 await Promise.all([...new Set(recordings)].map(file=>cache.add(new Request(file,{cache:'no-cache'})).catch(()=>{})));
 await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 for(const key of await caches.keys())if(key!==CACHE)await caches.delete(key);
 await self.clients.claim();
})()));
// Audio players ask for byte ranges; a stored full file is sliced to match when offline.
async function asRange(request,response){
 const range=/bytes=(\d*)-(\d*)/.exec(request.headers.get('range')||'');if(!range||response.status!==200)return response;
 const body=await response.arrayBuffer(),start=Number(range[1])||0,end=range[2]?Math.min(Number(range[2]),body.byteLength-1):body.byteLength-1;
 return new Response(body.slice(start,end+1),{status:206,headers:{'Content-Type':response.headers.get('Content-Type')||'audio/mp4','Content-Range':`bytes ${start}-${end}/${body.byteLength}`,'Content-Length':String(end-start+1),'Accept-Ranges':'bytes'}});
}
self.addEventListener('fetch',event=>{
 const request=event.request;if(request.method!=='GET'||new URL(request.url).origin!==location.origin)return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  try{
   const response=await fetch(request,{cache:'no-cache'});
   if(response.status===200)cache.put(request,response.clone()).catch(()=>{});
   return response;
  }catch{
   const stored=await cache.match(request,{ignoreSearch:true})||(request.mode==='navigate'&&await cache.match('./'));
   if(stored)return asRange(request,stored);
   throw new Error('Offline and not stored');
  }
 })());
});
