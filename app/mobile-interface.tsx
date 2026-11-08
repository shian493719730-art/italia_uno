// @ts-nocheck
'use client';
import HandArrow from './hand-arrow';
import {useEffect,useId,useRef,useState} from 'react';

const copy={
 en:{explore:'Explore the café',places:'Five places to discover',show:'View the counter',hide:'Hide the counter',pause:'Pause visit',language:'Language'},
 it:{explore:'Esplora il caffè',places:'Cinque dettagli da scoprire',show:'Guarda il banco',hide:'Nascondi il banco',pause:'Una pausa',language:'Lingua'},
 zh:{explore:'探索店里的细节',places:'五处小发现，点开选择',show:'看看柜台',hide:'收起柜台',pause:'暂停探店',language:'语言'},
 ja:{explore:'カフェを探検',places:'5つの小さな発見',show:'カウンターを見る',hide:'カウンターを閉じる',pause:'ひと休み',language:'言語'}
};

export function MobileLanguageSelect({lang,onChange}){
 return <select className="mobile-language-select" aria-label={(copy[lang]||copy.en).language} value={lang} onChange={e=>onChange(e.target.value)}><option value="it" aria-label="Italiano">IT</option><option value="en" aria-label="English">EN</option><option value="zh" aria-label="简体中文">中文</option><option value="ja" aria-label="日本語">日本語</option></select>;
}

export function useMobilePageEntry(page){
 const previous=useRef(page);
 useEffect(()=>{
  if(previous.current===page)return;
  previous.current=page;
  if(window.matchMedia('(max-width:760px)').matches){
   const raf=requestAnimationFrame(()=>window.scrollTo({top:0,left:0,behavior:'instant'}));
   return ()=>cancelAnimationFrame(raf);
  }
 },[page]);
}

// These presentation controls are phone-only. They never dispatch game actions
// except when the player deliberately chooses an existing café interaction.
export function MobileExploreActions({lang='en',labels,onSelect}){
 const c=copy[lang]||copy.en,[expanded,setExpanded]=useState(false),id=useId();
 return <section className="mobile-explore-tray" aria-label={c.explore}>
  <button className="mobile-explore-heading" aria-expanded={expanded} aria-controls={id} onClick={()=>setExpanded(v=>!v)}>
   <span><strong>{c.explore}</strong><small>{c.places}</small></span><b aria-hidden="true">{expanded?'−':'+'}</b>
  </button>
  {expanded&&<div className="mobile-explore-grid" id={id}>{Object.entries(labels).map(([key,label])=><button key={key} onClick={()=>onSelect(key)}><i className={'px-icon icon-'+key} aria-hidden="true"/><span>{label}</span><b aria-hidden="true"><HandArrow/></b></button>)}</div>}
 </section>;
}

export function MobileOrderBrief({lang='en',owner,message,expanded,onExpand,onPause}){
 const c=copy[lang]||copy.en;
 return <section className="mobile-order-brief">
  <div role="status" aria-live="polite" aria-atomic="true"><small>{owner}</small><p>{message}</p></div>
  <div className="mobile-order-tools"><button onClick={onExpand} aria-expanded={expanded}><i className="px-icon icon-coffee" aria-hidden="true"/>{expanded?c.hide:c.show}<span aria-hidden="true">{expanded?'−':'+'}</span></button><button onClick={onPause}>{c.pause}</button></div>
 </section>;
}

export function MobileOptionalPanel({title,description,children}){
 const [expanded,setExpanded]=useState(false),id=useId();
 return <div className={'mobile-optional-panel'+(expanded?' is-expanded':'')}>
  <button className="mobile-optional-heading" aria-expanded={expanded} aria-controls={id} onClick={()=>setExpanded(v=>!v)}><span><strong>{title}</strong><small>{description}</small></span><b aria-hidden="true">{expanded?'−':'+'}</b></button>
  <div id={id} className="mobile-optional-content">{children}</div>
 </div>;
}
