import {MENU_ITEMS,menuById} from './menu-data.mjs';
import {initialStory,normaliseStory,reduceStory,storyReason,STORY_ACTIONS,TOTAL_BITES} from './story-journey.mjs';
export const CUSTOMER_PHASES=['explore','ready','ordering','eating','checkout','goodbye','complete'];
const AFTER_MEAL=['checkout','goodbye','complete'];
export const CART_LIMIT=20;
// Invented virtual-menu prices in integer pence. Never current café prices.
const categoryPrices={'panini':450,'hot-food':550,'salads':500,'rolls':350,'breakfast':500,'hot-drinks':220,'bakery':180,'dolci':300,'gelato':280,'juice':280};
const knownItem=id=>typeof id==='string'&&Object.hasOwn(menuById,id);
export const virtualPrice=id=>knownItem(id)?(categoryPrices[menuById[id].category]??300):0;
export const pounds=pence=>'£'+(pence/100).toFixed(2);
// Version 2 adds the story journey (chapter, bites, quiz, packed, served, found, postcard).
export const initialCustomer=()=>({version:2,phase:'explore',cart:{},storyRead:false,checkoutAt:null,...initialStory()});
export const cartCount=c=>Object.values(c.cart).reduce((n,q)=>n+q,0);
export const orderLines=c=>MENU_ITEMS.filter(item=>c.cart[item.id]).map(item=>({id:item.id,qty:c.cart[item.id],unitPence:virtualPrice(item.id)}));
export const orderTotal=c=>orderLines(c).reduce((n,l)=>n+l.qty*l.unitPence,0);
export function normaliseCustomer(value){
 if(!value||![1,2].includes(value.version)||!CUSTOMER_PHASES.includes(value.phase))return initialCustomer();
 const c=initialCustomer();let room=CART_LIMIT;
 for(const item of MENU_ITEMS){const qty=value.cart?.[item.id];if(Number.isInteger(qty)&&qty>0&&room){c.cart[item.id]=Math.min(9,qty,room);room-=c.cart[item.id];}}
 c.phase=value.phase;c.storyRead=value.storyRead===true;
 c.checkoutAt=typeof value.checkoutAt==='string'&&Number.isFinite(Date.parse(value.checkoutAt))?value.checkoutAt:null;
 // Version 1 saves come from the old five-second meal: a finished meal counts as a skipped story; otherwise the story starts fresh.
 if(value.version===1){if(AFTER_MEAL.includes(c.phase)&&Number.isInteger(value.eatenSeconds)&&value.eatenSeconds>=5)c.bites=TOTAL_BITES;}
 else if(['eating',...AFTER_MEAL].includes(c.phase))Object.assign(c,normaliseStory(value));
 if(['eating',...AFTER_MEAL].includes(c.phase)&&!cartCount(c))return initialCustomer();
 if(AFTER_MEAL.includes(c.phase)&&(!c.checkoutAt||c.bites!==TOTAL_BITES)){c.phase='eating';c.checkoutAt=null;}
 if(!AFTER_MEAL.includes(c.phase))c.checkoutAt=null;
 return c;
}
export function customerReason(c,a){
 if(STORY_ACTIONS.includes(a.type))return storyReason(c,a);
 if(a.type==='ADD')return c.phase!=='ordering'?'not-ordering':!knownItem(a.id)?'unknown-item':(c.cart[a.id]||0)>=9?'item-limit':cartCount(c)>=CART_LIMIT?'cart-full':'';
 if(a.type==='REMOVE')return c.phase!=='ordering'?'not-ordering':!c.cart[a.id]?'not-in-cart':'';
 if(a.type==='DONE')return c.phase!=='ordering'?'not-ordering':!cartCount(c)?'empty-order':'';
 // Checkout unlocks when the plate is empty: the story is complete or skipped.
 if(a.type==='CHECKOUT')return c.phase!=='eating'?'not-eating':c.bites!==TOTAL_BITES?'still-eating':'';
 return '';
}
export function reduceCustomer(c,a){
 if(a.type==='RESET')return initialCustomer();
 if(STORY_ACTIONS.includes(a.type))return reduceStory(c,a);
 if(customerReason(c,a))return c;
 switch(a.type){
 case 'YES':return c.phase==='explore'?{...c,phase:'ready'}:c;
 case 'ORDER':return c.phase==='ready'?{...c,phase:'ordering'}:c;
 case 'ADD':return {...c,cart:{...c.cart,[a.id]:(c.cart[a.id]||0)+1}};
 case 'REMOVE':{const cart={...c.cart};if(cart[a.id]===1)delete cart[a.id];else cart[a.id]--;return {...c,cart};}
 case 'DONE':return {...c,phase:'eating'};
 case 'CHECKOUT':return typeof a.at==='string'&&Number.isFinite(Date.parse(a.at))?{...c,phase:'checkout',checkoutAt:a.at}:c;
 case 'RECEIPT_DONE':return c.phase==='checkout'?{...c,phase:'goodbye'}:c;
 case 'OK':return c.phase==='goodbye'?{...c,phase:'complete'}:c;
 default:return c;
 }
}
