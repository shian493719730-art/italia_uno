// Offline payload preview only. No network transport, credentials or email sending.
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {initialCustomer,reduceCustomer,orderTotal} from '../../lib/customer-state.mjs';
import {makeReceipt} from '../../lib/receipt.mjs';
import {ui} from '../../lib/locales.mjs';

const lang=process.argv[2]||'en';
if(!['it','en','zh','ja'].includes(lang))throw new Error('Choose it, en, zh or ja.');
const config=JSON.parse(readFileSync(new URL('./config.example.json',import.meta.url),'utf8'));
assert.equal(config.enabled,false,'The offline example must stay disabled.');
assert.equal(config.mode,'document_only');
let customer=initialCustomer();
for(const action of [{type:'YES'},{type:'ORDER'},{type:'ADD',id:'italia'},{type:'ADD',id:'espresso'},{type:'DONE'},{type:'TICK',seconds:5},{type:'CHECKOUT',at:'2026-11-08T13:00:00Z'}])customer=reduceCustomer(customer,action);
const receipt=makeReceipt({lang,visit:{customer,memory:{name:'Guest',seconds:90}},seconds:90});
assert(receipt.bill,'The example must use a completed checkout.');
assert.equal(orderTotal(customer),670);
assert.equal(receipt.bill.total,'£6.70');
assert.equal(receipt.bill.lines.length,2);
const receiptText=[receipt.role,receipt.greeting,'',...receipt.bill.lines.map(line=>`${line.qty} × ${line.name} · ${line.unit} · ${line.amount}`),'',ui(lang,'VIRTUAL TOTAL','虚拟合计')+': '+receipt.bill.total,ui(lang,'ACTUALLY CHARGED £0.00 · NO PAYMENT REQUIRED','实际扣费 £0.00 · 无需支付'),'',receipt.intro,receipt.message,receipt.signoff,'',receipt.address,receipt.city,receipt.mapURL,'',receipt.footer].join('\n');
console.log(JSON.stringify({dry_run:true,live_send_performed:false,recipient_example_only:true,shop_copy:'NOT_CONFIGURED — set fixed Bcc in the provider template later',template_params:{customer_email:'guest@example.com',order_id:receipt.bill.number,order_date:receipt.bill.date,language:lang,receipt_text:receiptText}},null,2));
