import {readFileSync,existsSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../../',import.meta.url));
const manifest=JSON.parse(readFileSync(new URL('./evidence.json',import.meta.url),'utf8'));
const failures=[];
const requireCheck=(condition,message)=>{if(!condition)failures.push(message);};
requireCheck(manifest.schema_version===1,'Unsupported evidence manifest.');
requireCheck(/^[a-f0-9]{40}$/.test(manifest.source_commit),'Source commit must be exact.');
requireCheck(manifest.conversations.length===2,'Two reviewed Gemini sessions are required.');
for(const c of manifest.conversations){
 const submitted=new URL(c.submitted_url),canonical=new URL(c.canonical_url);
 requireCheck(submitted.protocol==='https:'&&submitted.hostname==='share.gemini.google',`Invalid submitted share URL: ${c.id}`);
 requireCheck(canonical.protocol==='https:'&&canonical.hostname==='gemini.google.com'&&canonical.pathname.startsWith('/share/'),`Invalid canonical URL: ${c.id}`);
 requireCheck(c.reviewed===true&&!!c.observed_contribution&&!!c.does_not_establish,`Missing evidence boundary: ${c.id}`);
}
for(const relative of [...manifest.source_files,...manifest.package_files]){
 const absolute=path.resolve(root,relative);
 requireCheck(absolute.startsWith(root)&&existsSync(absolute),`Missing/invalid local reference: ${relative}`);
}
for(const item of manifest.source_tokens){
 requireCheck(readFileSync(path.join(root,item.path),'utf8').includes(item.value),`Source mismatch: ${item.path} / ${item.value}`);
}
const log=readFileSync(path.join(root,'docs/GEMINI_AGENT_LOG.md'),'utf8');
for(const c of manifest.conversations)requireCheck(log.includes(c.submitted_url),`Agent log misses ${c.id}.`);
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}
else console.log(`Package references passed: ${manifest.conversations.length} share records, ${manifest.source_files.length} source files, ${manifest.package_files.length} package files. This is a local reference check, not network or game-test verification.`);
