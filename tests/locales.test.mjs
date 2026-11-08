import assert from 'node:assert/strict';
import {ITALIAN,LANGUAGES,normaliseLanguage,ui,withItalian,italian} from '../lib/locales.mjs';
import {MENU_ITEMS,MENU_CATEGORIES} from '../lib/menu-data.mjs';
import {makeReceipt,receiptSVG} from '../lib/receipt.mjs';
import {initial,reduce} from '../lib/game-state.mjs';
import {STORY_PATH} from './story-play.mjs';

assert.deepEqual(LANGUAGES.map(x=>x.id),['it','en','zh']);
assert.equal(normaliseLanguage('it'),'it');assert.equal(normaliseLanguage('en'),'en');assert.equal(normaliseLanguage('zh'),'zh');assert.equal(normaliseLanguage(null),'en');assert.equal(normaliseLanguage('xx'),'en');
assert.equal(ui('en','Ready to order?','准备好点单了吗？'),'Ready to order?');assert.equal(ui('zh','Ready to order?','准备好点单了吗？'),'准备好点单了吗？');assert.notEqual(ui('it','Ready to order?','准备好点单了吗？'),'Ready to order?');
assert.deepEqual(withItalian({en:{button:'Back to the street'},zh:{button:'回到店外'}}).it,{button:'Torna in strada'});
assert.equal(italian('11 guests + 35 tokens'),'11 clienti + 35 gettoni');assert.equal(italian('12s'),'12 s');
assert.equal(italian('Ciao, Alice & <Bob>!'),'Ciao, Alice & <Bob>!');
assert.equal(MENU_ITEMS.length,65);
for(const item of MENU_ITEMS){assert(item.it?.length,`Italian name missing: ${item.id}`);assert(item.description.it?.length,`Italian description missing: ${item.id}`);assert.notEqual(item.description.it,item.description.en,`Untranslated description: ${item.id}`);assert(!/[\u3400-\u9fff]/.test(item.it+item.description.it));}
for(const category of MENU_CATEGORIES)assert(category.it?.length,`Italian category missing: ${category.id}`);
assert(MENU_ITEMS.some(x=>(x.it+' '+x.description.it).toLowerCase().includes('melanzane')));
const initialState=initial();let s=reduce(initialState,{type:'ENTER'});
for(const action of [{type:'YES'},{type:'ORDER'},{type:'ADD',id:'italia'},{type:'DONE'},...STORY_PATH,{type:'CHECKOUT',at:'2026-11-07T18:00:00.000Z'}])s=reduce(s,{type:'CUSTOMER',action});
const it=makeReceipt({lang:'it',visit:s,name:'Alice & <Bob>',seconds:123}),en=makeReceipt({lang:'en',visit:s,name:'Alice & <Bob>',seconds:123});
assert(it.bill,'Italian checkout produces bill');assert.equal(it.bill.total,en.bill.total);assert.equal(it.bill.lines.length,en.bill.lines.length);assert.equal(it.name,'Alice & <Bob>');assert.equal(it.duration,'2 min 03 s');assert(it.rows.length);assert(it.rows.every(([label])=>typeof label==='string'));
const svg=receiptSVG(it,{layout:'slip'});assert(svg.includes('S C O N T R I N O'));assert(svg.includes('ORDINE #1'));assert(svg.includes('Alice &amp; &lt;Bob&gt;'));assert(svg.includes('£0.00'));assert(!svg.includes('undefined'));assert(!svg.includes('You spent'));
const owner=makeReceipt({lang:'it',kind:'owner',service:{phase:'review',day:3,cash:35,receipts:[{},{},{}],upgrade:'counter',totals:{served:11,lost:4},memories:{}},seconds:30});assert(owner.rows.every(([label,value])=>label!==undefined&&value!==undefined));assert(owner.rows.some(([label,value])=>label==='Il tuo miglioramento'&&value===italian('Prep counter')&&value!=='Prep counter'));
assert(Object.keys(ITALIAN).length>550,'Bundled translation coverage is substantial');
console.log('Italian passed: picker order, saved locale validation, English/Chinese stability, 65 menu names/descriptions, dynamic copy, Italian receipt and SVG, owner receipt, exact totals and escaped nickname.');
