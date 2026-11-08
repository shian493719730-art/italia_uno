#!/usr/bin/env node
// Prepare a new handoff directory. No AI calls, shell execution, game generation or network.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const home=fileURLToPath(new URL('../',import.meta.url));
const args=process.argv.slice(2);
const usage='node scripts/prepare-project.mjs --brief <brief.json> --out <new-directory>';
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const cleanText=(x,label,required=false)=>{
 if(x===undefined||x===null||x===''){if(required)throw new Error(`Missing ${label}.`);return '';}
 if(typeof x!=='string')throw new Error(`${label} must be a string.`);
 const result=x.trim();if(required&&!result)throw new Error(`Missing ${label}.`);return result;
};
const stringList=(x,label,fallback=[])=>{
 if(x===undefined)return [...fallback];
 if(!Array.isArray(x)||x.some(v=>typeof v!=='string'||!v.trim()))throw new Error(`${label} must be an array of non-empty strings.`);
 return [...new Set(x.map(v=>v.trim()))];
};
const boolean=(x,label,fallback=false)=>{
 if(x===undefined)return fallback;if(typeof x!=='boolean')throw new Error(`${label} must be true or false.`);return x;
};
function validate(raw){
 if(!object(raw)||raw.schema_version!==1)throw new Error('Use a brief with schema_version 1.');
 if(!['plan','build','extend'].includes(raw.mode))throw new Error('Choose mode plan, build or extend.');
 for(const key of ['project','game','art','delivery','optional_modules'])if(raw[key]!==undefined&&!object(raw[key]))throw new Error(`${key} must be an object.`);
 const p=raw.project||{},g=raw.game||{},a=raw.art||{},d=raw.delivery||{},o=raw.optional_modules||{};
 if(d.format!==undefined&&typeof d.format!=='string')throw new Error('delivery.format must be a string.');
 const format=d.format?.trim()||'single-html';
 if(!['single-html','web-project','existing-project','other'].includes(format))throw new Error('Choose delivery format single-html, web-project, existing-project or other.');
 const languages=stringList(d.languages,'delivery.languages',['en']);if(!languages.length)throw new Error('Choose at least one delivery language.');
 const devices=stringList(d.devices,'delivery.devices',['desktop','phone']);if(!devices.length)throw new Error('Choose at least one target device.');
 const minutes=g.session_minutes??null;if(minutes!==null&&(!Number.isFinite(minutes)||minutes<=0))throw new Error('game.session_minutes must be positive or null.');
 return {...raw,schema_version:1,mode:raw.mode,project:{...p,existing_source:cleanText(p.existing_source,'project.existing_source'),name:cleanText(p.name,'project.name',true),purpose:cleanText(p.purpose,'project.purpose'),audience:cleanText(p.audience,'project.audience')},game:{...g,genre:cleanText(g.genre,'game.genre',true),core_loop:cleanText(g.core_loop,'game.core_loop',true),goal:cleanText(g.goal,'game.goal'),end_conditions:cleanText(g.end_conditions,'game.end_conditions'),controls:stringList(g.controls,'game.controls'),session_minutes:minutes},art:{...a,direction:cleanText(a.direction,'art.direction'),palette:stringList(a.palette,'art.palette'),references:stringList(a.references,'art.references'),sound:cleanText(a.sound,'art.sound')},delivery:{...d,engine:cleanText(d.engine,'delivery.engine'),format,languages,devices,offline:boolean(d.offline,'delivery.offline',true)},constraints:stringList(raw.constraints,'constraints'),optional_modules:{mailbox_setup:boolean(o.mailbox_setup,'optional_modules.mailbox_setup'),email_results:boolean(o.email_results,'optional_modules.email_results'),social_publishing:boolean(o.social_publishing,'optional_modules.social_publishing')}};
}
const bullet=items=>items.length?items.map(x=>`- ${x}`).join('\n'):'- Not specified; clarify or state an appropriate assumption.';
const fenced=text=>{const longest=Math.max(2,...[...text.matchAll(/`+/g)].map(m=>m[0].length));const fence='`'.repeat(longest+1);return `${fence}json\n${text}\n${fence}`;};
async function main(){
 if(args.length===1&&args[0]==='--help'){console.log(usage);return;}
 const flags={};
 for(let i=0;i<args.length;i+=2){if(!['--brief','--out'].includes(args[i])||!args[i+1]||args[i+1].startsWith('--')||flags[args[i]])throw new Error(usage);flags[args[i]]=args[i+1];}
 if(!flags['--brief']||!flags['--out'])throw new Error(usage);
 const source=path.resolve(flags['--brief']),destination=path.resolve(flags['--out']);
 const input=await readFile(source,'utf8');if(Buffer.byteLength(input)>256*1024)throw new Error('Keep the JSON brief under 256 KiB; reference larger assets by path.');
 const brief=validate(JSON.parse(input));
 const prompt=await readFile(path.join(home,'PROMPT.md'),'utf8');
 const json=JSON.stringify(brief,null,2);
 const optional=Object.entries(brief.optional_modules).filter(([,value])=>value).map(([key])=>key);
 const files={
  'brief.json':json+'\n',
  'START_HERE.md':`# ${brief.project.name} — prepared handoff\n\nSelected mode: **${brief.mode}**. This folder contains requirements and instructions; no game has been implemented or tested by the preparation script.\n\nGive BUILD_PROMPT.md and brief.json to your coding assistant in a new project workspace, or the selected existing project for extend mode. In build mode, request the runnable implementation, appropriate tests and source delivery. In plan mode, request a reviewable design/handoff only.\n\nART_DIRECTION.md records your chosen visual input; QA_PLAN.md lists work still to verify. Use WORKFLOW_LOG.md and SOURCE_REGISTER.md for actual decisions, sources and results. STATUS.json starts with implementation not_started and verification not_run.\n\nOptional module selections are planning inputs, not permission to create accounts or send/publish anything.\n`,
  'BUILD_PROMPT.md':`${prompt}\n\n## This assignment\n\nRead the structured brief as this user's project data. Honour its selected mode and constraints.\n\n${fenced(json)}\n`,
  'ART_DIRECTION.md':`# ${brief.project.name} — art direction input\n\n## Intended direction\n\n${brief.art.direction||'Not specified. Propose a direction suited to the current genre and audience.'}\n\n## Palette\n\n${bullet(brief.art.palette)}\n\n## References\n\n${bullet(brief.art.references)}\n\n## Sound\n\n${brief.art.sound||'Not specified.'}\n\nThese are brief inputs, not completed artwork or verified asset licences. Define composition, scale, typography, motion and input/readability for ${brief.delivery.devices.join(', ')}. Record reference purposes and rights; preserve mechanics during an art-only change.\n`,
  'QA_PLAN.md':`# Verification plan — not yet executed\n\n- [ ] Start → play → ending → restart follows the current brief.\n- [ ] Core loop works: ${brief.game.core_loop}\n- [ ] Goal/end conditions match: ${brief.game.goal||'To be defined'} / ${brief.game.end_conditions||'To be defined'}.\n- [ ] Controls work: ${brief.game.controls.join(', ')||'To be selected'}.\n- [ ] Layout/readability checked on: ${brief.delivery.devices.join(', ')}.\n- [ ] Language consistency checked for: ${brief.delivery.languages.join(', ')}.\n- [ ] Repeated actions, timers and save/reset are checked where present.\n- [ ] Source/run instructions and required asset licences are included.\n- [ ] Offline requirement checked: ${brief.delivery.offline?'required':'not required'}.\n\n## Specific constraints to verify\n\n${bullet(brief.constraints)}\n\n## Optional modules to plan separately\n\n${optional.length?bullet(optional):'None selected.'}\n\nOnly mark a check complete after running it and recording evidence. Select additional tests from the actual mechanics; this file does not certify any result.\n`,
  'WORKFLOW_LOG.md':'# Project decisions and evidence\n\nThe preparation script captured the brief and created this folder. It did not call an AI or implement/test/publish a game.\n\n| Stage | Human input / AI proposal | Decision | Artifact / evidence | Actual status |\n| --- | --- | --- | --- | --- |\n| Intake | Supplied JSON brief | Selected mode recorded in brief.json | brief.json | Prepared |\n\nRecord later tool use, review, changes and checks as they happen. Do not reconstruct hypothetical work as a historical transcript.\n',
  'SOURCE_REGISTER.md':`# Sources and creative interpretation\n\n## Reference inputs — not independently verified\n\n${bullet(brief.art.references)}\n\nFor each factual claim or asset, record source/author/year/link, what it supports and any rights/limits. Keep fictional scenes and balancing parameters separate from research findings. No factual research or asset licence is certified by preparing this folder.\n`
 };
 const status={schema_version:1,project:brief.project.name,mode:brief.mode,preparation:'complete',implementation:'not_started',verification:'not_run',publication:'not_requested',network_actions_performed:false,artifacts:[...Object.keys(files),'STATUS.json']};
 files['STATUS.json']=JSON.stringify(status,null,2)+'\n';
 await mkdir(path.dirname(destination),{recursive:true});
 try{await mkdir(destination);}catch(error){if(error.code==='EEXIST')throw new Error('Destination already exists; choose a new directory. Nothing was overwritten.');throw error;}
 for(const [name,content] of Object.entries(files))await writeFile(path.join(destination,name),content,{encoding:'utf8',flag:'wx'});
 console.log(JSON.stringify({destination,files:Object.keys(files),status:'prepared',game_implemented:false,network_actions_performed:false},null,2));
}
main().catch(error=>{console.error(`Preparation failed: ${error.message}`);process.exitCode=1;});
