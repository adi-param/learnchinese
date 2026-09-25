import {mkdir,rm,cp,writeFile} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});await mkdir('dist',{recursive:true});
for(const path of ['index.html','favicon.svg','src','data','docs','assets'])await cp(path,`dist/${path}`,{recursive:true});
await writeFile('dist/.nojekyll','');console.log('Static website built in dist/');
