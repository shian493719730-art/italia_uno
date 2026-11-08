import core from './it/core.mjs';
import owner from './it/owner.mjs';
import menu from './it/menu.mjs';
import inline from './it/inline.mjs';
import postcard from './it/postcard.mjs';

// Source-keyed, bundled copy: no translation service or runtime API is needed.
export const ITALIAN = Object.freeze({...core,...owner,...menu,...inline,...postcard,Language:'Lingua','ITALIA UNO · LITTLE DISCOVERIES':'ITALIA UNO · PICCOLE SCOPERTE'});
export const LANGUAGES = Object.freeze([{id:'it',label:'Italiano'},{id:'en',label:'EN'},{id:'zh',label:'中文'}]);
export const normaliseLanguage = value => ['it','en','zh'].includes(value)?value:'en';
const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const templates=Object.entries(ITALIAN).filter(([key])=>/\{\d+\}/.test(key)).map(([key,value])=>{
 const indices=[...key.matchAll(/\{(\d+)\}/g)].map(m=>Number(m[1]));
 return {regex:new RegExp('^'+key.split(/\{\d+\}/).map(escapeRegex).join(/^\{0\}(?:s|m \{1\}s)$/.test(key)?'(\\d+)':'(.*?)')+'$','s'),value,indices};
});
export function italian(value){
 if(typeof value==='string'){
  if(Object.hasOwn(ITALIAN,value))return ITALIAN[value];
  for(const template of templates){const match=value.match(template.regex);if(match){const args={};template.indices.forEach((id,i)=>{args[id]=match[i+1];});return template.value.replace(/\{(\d+)\}/g,(_,id)=>args[id]??'');}}
  return value;
 }
 if(Array.isArray(value))return value.map(italian);
 if(value&&typeof value==='object'){
  // JSX copy fragments contain React metadata; only localise readable props.
  if(value.$$typeof){const props={...value.props};for(const key of ['children','title','placeholder','aria-label'])if(key in props)props[key]=italian(props[key]);return {...value,props};}
  return Object.fromEntries(Object.entries(value).map(([key,item])=>[key,italian(item)]));
 }
 return value;
}
export const ui=(lang,english,chinese)=>lang==='zh'?chinese:lang==='it'?italian(english):english;
export const withItalian = copy => ({...copy,it:italian(copy.en)});
