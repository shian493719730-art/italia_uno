import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,cp,readFile,writeFile,readdir,stat,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const packagePath=fileURLToPath(new URL('../',import.meta.url));
const run=(pkg,brief,out)=>spawnSync(process.execPath,[path.join(pkg,'scripts/prepare-project.mjs'),'--brief',brief,'--out',out],{encoding:'utf8',cwd:tmpdir()});
async function setup(t){
 const root=await mkdtemp(path.join(tmpdir(),'custom-game-builder-check-'));
 t.after(()=>rm(root,{recursive:true,force:true}));
 const pkg=path.join(root,'copied workflow');await cp(packagePath,pkg,{recursive:true});
 return {root,pkg,example:JSON.parse(await readFile(path.join(pkg,'examples/orbit-parcel.json'),'utf8'))};
}

test('a copied folder prepares a new puzzle handoff without café source or implementation claims',async t=>{
 const {root,pkg}=await setup(t),out=path.join(root,'puzzle assignment');
 const result=run(pkg,path.join(pkg,'examples/orbit-parcel.json'),out);
 assert.equal(result.status,0,result.stderr);
 const brief=JSON.parse(await readFile(path.join(out,'brief.json'),'utf8'));
 const status=JSON.parse(await readFile(path.join(out,'STATUS.json'),'utf8'));
 assert.equal(brief.project.name,'Orbit Parcel');assert.equal(brief.game.genre,'puzzle');
 assert.equal(brief.delivery.format,'single-html');assert.deepEqual(brief.delivery.languages,['en']);
 assert.equal(status.implementation,'not_started');assert.equal(status.verification,'not_run');assert.equal(status.network_actions_performed,false);
 for(const file of status.artifacts)assert((await stat(path.join(out,file))).isFile());
 assert(!(await readdir(out)).includes('index.html'));
 const prompt=await readFile(path.join(out,'BUILD_PROMPT.md'),'utf8');
 assert(prompt.includes(brief.game.core_loop));assert(!prompt.includes('91 Charlotte Street'));
});

test('another genre, custom fields and optional-module plans stay intact without executing strings',async t=>{
 const {root,pkg,example}=await setup(t),input=path.join(root,'mystery.json'),out=path.join(root,'mystery handoff');
 const marker=path.join(root,'must-not-be-created');
 const brief={...example,mode:'build',project:{...example.project,name:`Museum $(touch ${marker})`,purpose:'A bilingual detective story.'},game:{...example.game,genre:'narrative mystery',core_loop:'Interview witnesses and connect clues.',custom_chapters:4},art:{...example.art,direction:'Watercolour museum rooms.',palette:['warm grey','copper']},delivery:{...example.delivery,format:'web-project',engine:'user-selected framework',languages:['zh','ja']},optional_modules:{mailbox_setup:false,email_results:true,social_publishing:false},extra_requirements:{ending:'Let the player revisit clues.'}};
 await writeFile(input,JSON.stringify(brief));const result=run(pkg,input,out);assert.equal(result.status,0,result.stderr);
 const saved=JSON.parse(await readFile(path.join(out,'brief.json'),'utf8'));
 assert.equal(saved.game.genre,'narrative mystery');assert.equal(saved.game.custom_chapters,4);assert.deepEqual(saved.extra_requirements,brief.extra_requirements);assert.equal(saved.delivery.engine,brief.delivery.engine);
 assert.deepEqual(saved.delivery.languages,['zh','ja']);assert.equal(saved.optional_modules.email_results,true);
 assert((await readFile(path.join(out,'ART_DIRECTION.md'),'utf8')).includes('Watercolour museum rooms.'));
 assert((await readFile(path.join(out,'QA_PLAN.md'),'utf8')).includes('email_results'));
 await assert.rejects(stat(marker),{code:'ENOENT'});
 assert.equal(JSON.parse(await readFile(path.join(out,'STATUS.json'),'utf8')).network_actions_performed,false);
});

test('reusing a destination refuses to overwrite existing work',async t=>{
 const {root,pkg}=await setup(t),input=path.join(pkg,'examples/orbit-parcel.json'),out=path.join(root,'existing');
 assert.equal(run(pkg,input,out).status,0);
 await writeFile(path.join(out,'USER_WORK.txt'),'keep this exact content');
 const original=await readFile(path.join(out,'brief.json'),'utf8');
 const result=run(pkg,input,out);assert.notEqual(result.status,0);assert.match(result.stderr,/already exists/);
 assert.equal(await readFile(path.join(out,'USER_WORK.txt'),'utf8'),'keep this exact content');assert.equal(await readFile(path.join(out,'brief.json'),'utf8'),original);
});

test('invalid required fields or option types do not create a destination',async t=>{
 const {root,pkg,example}=await setup(t);
 const cases=[{...example,game:{...example.game,core_loop:''}},{...example,optional_modules:{email_results:'yes'}},{...example,delivery:{...example.delivery,languages:[]}}];
 for(let i=0;i<cases.length;i++){
  const input=path.join(root,`invalid-${i}.json`),out=path.join(root,`invalid-out-${i}`);await writeFile(input,JSON.stringify(cases[i]));
  const result=run(pkg,input,out);assert.notEqual(result.status,0);await assert.rejects(stat(out),{code:'ENOENT'});
 }
});
