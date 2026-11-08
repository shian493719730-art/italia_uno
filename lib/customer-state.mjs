import {MENU_ITEMS,menuById} from './menu-data.mjs';
import {initialPostcard,normalisePostcard,reduceSeek,seekReason,SEEK_ACTIONS} from './postcard-game.mjs';
export const CUSTOMER_PHASES=['explore','ready','ordering','eating','checkout','goodbye','complete'];
export const EATING_SECONDS=5;
export const CART_LIMIT=20;
// Invented virtual-menu prices in integer pence. Never current café prices.
const categoryPrices={'panini':450,'hot-food':550,'salads':500,'rolls':350,'breakfast':500,'hot-drinks':220,'bakery':180,'dolci':300,'gelato':280,'juice':280};
const knownItem=id=>typeof id==='string'&&Object.hasOwn(menuById,id);
export const virtualPrice=id=>knownItem(id)?(categoryPrices[menuById[id].category]??300):0;
export const pounds=pence=>'£'+(pence/100).toFixed(2);
// Version 2 adds `postcard`: the optional hide-and-seek during the meal (lib/postcard-game.mjs).
export const initialCustomer=()=>({version:2,phase:'explore',cart:{},eatenSeconds:0,storyRead:false,checkoutAt:null,postcard:initialPostcard()});
export const cartCount=c=>Object.values(c.cart).reduce((n,q)=>n+q,0);
export const orderLines=c=>MENU_ITEMS.filter(item=>c.cart[item.id]).map(item=>({id:item.id,qty:c.cart[item.id],unitPence:virtualPrice(item.id)}));
export const orderTotal=c=>orderLines(c).reduce((n,l)=>n+l.qty*l.unitPence,0);
export function normaliseCustomer(value){
 if(!value||![1,2].includes(value.version)||!CUSTOMER_PHASES.includes(value.phase))return initialCustomer();
 const c=initialCustomer();let room=CART_LIMIT;
 for(const item of MENU_ITEMS){const qty=value.cart?.[item.id];if(Number.isInteger(qty)&&qty>0&&room){c.cart[item.id]=Math.min(9,qty,room);room-=c.cart[item.id];}}
 c.phase=value.phase;c.eatenSeconds=Number.isInteger(value.eatenSeconds)?Math.max(0,Math.min(EATING_SECONDS,value.eatenSeconds)):0;c.storyRead=value.storyRead===true;
 c.checkoutAt=typeof value.checkoutAt==='string'&&Number.isFinite(Date.parse(value.checkoutAt))?value.checkoutAt:null;
 // Version 1 saves have no postcard game; it can only have progress once the meal has started.
 if(value.version===2&&['eating','checkout','goodbye','complete'].includes(c.phase))c.postcard=normalisePostcard(value.postcard);
 if(['eating','checkout','goodbye','complete'].includes(c.phase)&&!cartCount(c))return initialCustomer();
 if(['checkout','goodbye','complete'].includes(c.phase)&&(!c.checkoutAt||c.eatenSeconds<EATING_SECONDS)){c.phase='eating';c.checkoutAt=null;}
 if(!['checkout','goodbye','complete'].includes(c.phase))c.checkoutAt=null;
 return c;
}
export function customerReason(c,a){
 if(SEEK_ACTIONS.includes(a.type))return seekReason(c,a);
 if(a.type==='ADD')return c.phase!=='ordering'?'not-ordering':!knownItem(a.id)?'unknown-item':(c.cart[a.id]||0)>=9?'item-limit':cartCount(c)>=CART_LIMIT?'cart-full':'';
 if(a.type==='REMOVE')return c.phase!=='ordering'?'not-ordering':!c.cart[a.id]?'not-in-cart':'';
 if(a.type==='DONE')return c.phase!=='ordering'?'not-ordering':!cartCount(c)?'empty-order':'';
 if(a.type==='CHECKOUT')return c.phase!=='eating'?'not-eating':c.eatenSeconds<EATING_SECONDS?'still-eating':'';
 return '';
}
export function reduceCustomer(c,a){
 if(a.type==='RESET')return initialCustomer();
 if(SEEK_ACTIONS.includes(a.type))return reduceSeek(c,a);
 if(customerReason(c,a))return c;
 switch(a.type){
 case 'YES':return c.phase==='explore'?{...c,phase:'ready'}:c;
 case 'ORDER':return c.phase==='ready'?{...c,phase:'ordering'}:c;
 case 'ADD':return {...c,cart:{...c.cart,[a.id]:(c.cart[a.id]||0)+1}};
 case 'REMOVE':{const cart={...c.cart};if(cart[a.id]===1)delete cart[a.id];else cart[a.id]--;return {...c,cart};}
 case 'DONE':return {...c,phase:'eating'};
 case 'TICK':return c.phase==='eating'&&Number.isInteger(a.seconds)&&a.seconds>0&&a.seconds<=60?{...c,eatenSeconds:Math.min(EATING_SECONDS,c.eatenSeconds+a.seconds)}:c;
 case 'STORY':return c.phase==='eating'&&!c.storyRead?{...c,storyRead:true}:c;
 case 'CHECKOUT':return typeof a.at==='string'&&Number.isFinite(Date.parse(a.at))?{...c,phase:'checkout',checkoutAt:a.at}:c;
 case 'RECEIPT_DONE':return c.phase==='checkout'?{...c,phase:'goodbye'}:c;
 case 'OK':return c.phase==='goodbye'?{...c,phase:'complete'}:c;
 default:return c;
 }
}
