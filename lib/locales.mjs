import core from './it/core.mjs';
import owner from './it/owner.mjs';
import menu from './it/menu.mjs';
import inline from './it/inline.mjs';
import postcard from './it/postcard.mjs';
import japaneseCore from './ja/core.mjs';
import japanesePostcard from './ja/postcard.mjs';

// Source-keyed, bundled copy: no translation service or runtime API is needed.
export const ITALIAN = Object.freeze({...core,...owner,...menu,...inline,...postcard,Language:'Lingua','ITALIA UNO · LITTLE DISCOVERIES':'ITALIA UNO · PICCOLE SCOPERTE',Morning:'Mattina',Daytime:'Giorno',Evening:'Sera',Night:'Notte','Previewing · tap to change':'Anteprima · tocca per cambiare','Your local time · tap to preview':'La tua ora locale · tocca per l’anteprima'});
export const JAPANESE = Object.freeze({...japaneseCore,...japanesePostcard,Morning:'朝',Daytime:'昼',Evening:'夕方',Night:'夜','Previewing · tap to change':'プレビュー中 · タップで切り替え','Your local time · tap to preview':'現在の時刻 · タップでプレビュー'});
export const LANGUAGES = Object.freeze([{id:'it',label:'Italiano'},{id:'en',label:'EN'},{id:'zh',label:'中文'},{id:'ja',label:'日本語'}]);
export const normaliseLanguage = value => ['it','en','zh','ja'].includes(value)?value:'en';
const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
function makeTranslator(dict){
 const templates=Object.entries(dict).filter(([key])=>/\{\d+\}/.test(key)).map(([key,value])=>{
  const indices=[...key.matchAll(/\{(\d+)\}/g)].map(m=>Number(m[1]));
  return {regex:new RegExp('^'+key.split(/\{\d+\}/).map(escapeRegex).join(/^\{0\}(?:s|m \{1\}s)$/.test(key)?'(\\d+)':'(.*?)')+'$','s'),value,indices};
 });
 const translate=value=>{
  if(typeof value==='string'){
   if(Object.hasOwn(dict,value))return dict[value];
   for(const template of templates){const match=value.match(template.regex);if(match){const args={};template.indices.forEach((id,i)=>{args[id]=match[i+1];});return template.value.replace(/\{(\d+)\}/g,(_,id)=>args[id]??'');}}
   return value;
  }
  if(Array.isArray(value))return value.map(translate);
  if(value&&typeof value==='object'){
   // JSX copy fragments contain React metadata; only localise readable props.
   if(value.$$typeof){const props={...value.props};for(const key of ['children','title','placeholder','aria-label'])if(key in props)props[key]=translate(props[key]);return {...value,props};}
   return Object.fromEntries(Object.entries(value).map(([key,item])=>[key,translate(item)]));
  }
  return value;
 };
 return translate;
}
export const italian = makeTranslator(ITALIAN);
export const japanese = makeTranslator(JAPANESE);
// Numbers (e.g. receipt wrap widths) follow the Chinese value for Japanese: both are full-width scripts.
export const ui=(lang,english,chinese)=>lang==='zh'?chinese:lang==='it'?italian(english):lang==='ja'?(typeof english==='number'?chinese:japanese(english)):english;
export const withItalian = copy => ({...copy,it:italian(copy.en),ja:japanese(copy.en)});
