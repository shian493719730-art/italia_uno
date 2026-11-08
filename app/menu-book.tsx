'use client';
import HandArrow from './hand-arrow';
import {ui,withItalian} from '../lib/locales.mjs';

import { useId, useMemo, useState } from 'react';
import { MENU_ITEMS, MENU_CATEGORIES, MENU_COUNT } from '../lib/menu-data.mjs';
import { virtualPrice, pounds } from '../lib/customer-state.mjs';
type Recipe = 'italia' | 'campagnolo' | 'barese';
type Props = {
    lang?: 'it' | 'en' | 'zh' | 'ja';
    onChoose?: (recipe: Recipe) => void;
    onAdd?: (id: string) => void;
    quantities?: Record<string, number>;
    addReason?: (id: string) => string;
};
type MenuItem = {
    id: string;
    category: string;
    name: string;
    it: string;
    en: string;
    zh: string;
    ja: string;
    description: {
        it: string;
        en: string;
        zh: string;
        ja: string;
    };
    certainty: string;
    gameRecipe?: Recipe;
};
const items = MENU_ITEMS as MenuItem[];
const copy = withItalian({ en: { eyebrow: 'FROM THE REAL BLACKBOARDS', title: 'The whole little menu.', intro: 'Explore every legible menu name and named option in the supplied café photographs.', all: 'All', search: 'Find a dish, drink or filling', placeholder: 'Try coffee, panini, mozzarella…', count: 'entries', result: 'shown', try: 'Try this panino in the game', photo: 'Reference-photo menu', note: 'Not a live menu. Prices are omitted; current dishes, prices, availability and allergens should be checked with the café.', empty: 'No matches. Try another word or clear the category.', clear: 'Clear search & filters', source: 'How this menu was made', sourceText: 'Transcribed from the two team-supplied blackboard photos. Sizes and named OR choices appear as separate entries. The original names are retained. The three panino puzzles use simplified featured fillings. “Ask staff” and unspecified formats remain explicit; no missing dishes have been invented.', sources: 'Supplied files: caption.jpg and caption-1.jpg. Photography dates unverified. The website supplied earlier redirected to a third-party directory and was not treated as an official current menu.', listing: 'Restaurant listing', play: 'The “try” buttons open a virtual recipe only. This is not an order.', original: 'Blackboard name', format: 'Format not fully specified in the photo' }, zh: { eyebrow: '来自真实店内黑板', title: '翻翻小店的完整照片菜单。', intro: '这里收录参考照片中所有可辨认的菜名及明确列出的选项。', all: '全部', search: '查找菜品、饮料或食材', placeholder: '试试咖啡、帕尼尼、奶酪…', count: '项', result: '项已显示', try: '在游戏中试做这份帕尼尼', photo: '参考照片菜单', note: '非实时菜单。此处不显示历史价格；当前菜品、价格、供应和过敏原请向店家确认。', empty: '没有匹配项，请换一个关键词或清除分类。', clear: '清除搜索与筛选', source: '这份菜单如何整理', sourceText: '逐行抄录团队提供的两张黑板照片。尺寸和明确列出的“或”选项分开展示，保留原名。三种帕尼尼小游戏使用简化的主要馅料。照片未说明的形式和“询问店员”备注均明确保留，没有补造看不见的菜品。', sources: '原始文件：caption.jpg 与 caption-1.jpg。拍摄日期未经独立核实。此前提供的网站跳转至第三方目录，因此未当作官方当前菜单。', listing: '店铺目录', play: '“试做”只打开虚拟食谱，不会真实下单。', original: '黑板原名', format: '照片未完整说明具体形式' } });
export function MenuSprite({ category = 'panini' }: {
    category?: string;
}) { return <div className={'menu-book-pixel menu-book-pixel-' + category} aria-hidden="true"><i /><b /><em /></div>; }
export default function MenuBook({ lang = 'en', onChoose, onAdd, quantities = {}, addReason }: Props) {
    const c = copy[lang], uid = useId();
    const [category, setCategory] = useState('all'), [query, setQuery] = useState('');
    const filtered = useMemo(() => { const needle = query.trim().toLocaleLowerCase(); return items.filter(item => (category === 'all' || item.category === category) && (!needle || [item.name, item.it, item.en, item.zh, item.ja, item.description.it, item.description.en, item.description.zh, item.description.ja].join(' ').toLocaleLowerCase().includes(needle))); }, [category, query]);
    return <section className="menu-book" aria-labelledby={uid + '-title'}>
  <header className="menu-book-header"><span className="menu-book-eyebrow">{c.eyebrow}</span><h3 id={uid + '-title'}>{c.title}</h3><p>{c.intro}</p><div className="menu-book-reference"><span aria-hidden="true">▧</span><div><strong>{c.photo}</strong><p>{onAdd ? (ui(lang, 'Photo-menu names, virtual prices: amounts below are invented for play, not current café prices. No order is sent and nothing is charged.', '照片菜名，虚拟价格：下方金额只为游戏设置，并非店家当前报价。不会下单或扣费。')) : c.note}</p></div></div></header>
  <div className="menu-book-tools"><label htmlFor={uid + '-search'}>{c.search}</label><div className="menu-book-search"><span aria-hidden="true">⌕</span><input type="search" id={uid + '-search'} value={query} placeholder={c.placeholder} onChange={e => setQuery(e.target.value)} autoComplete="off"/></div><nav className="menu-book-tabs" aria-label={ui(lang, 'Menu categories', '菜单分类')}><button type="button" className={category === 'all' ? 'active' : ''} aria-pressed={category === 'all'} onClick={() => setCategory('all')}>{c.all}<span>{MENU_COUNT}</span></button>{MENU_CATEGORIES.map(cat => <button type="button" key={cat.id} className={category === cat.id ? 'active' : ''} aria-pressed={category === cat.id} onClick={() => setCategory(cat.id)}>{cat[lang]}<span>{items.filter(x => x.category === cat.id).length}</span></button>)}</nav></div>
  <p className="menu-book-count" role="status" aria-live="polite">{filtered.length} / {MENU_COUNT} {ui(lang, c.count + ' ' + c.result, c.result)}</p>
  <div className="menu-book-sections">{MENU_CATEGORIES.map(cat => { const rows = filtered.filter(x => x.category === cat.id); if (!rows.length)
        return null; return <section key={cat.id} aria-labelledby={uid + '-' + cat.id}><h4 id={uid + '-' + cat.id}><i aria-hidden="true"/>{cat[lang]}<span>{cat.board}</span></h4><ul className="menu-book-list">{rows.map(item => <li className={'menu-book-item ' + (item.gameRecipe ? 'menu-book-playable' : '')} key={item.id}><MenuSprite category={cat.id}/><div className="menu-book-item-copy"><h5>{item[lang]}</h5>{item[lang] !== item.name && <span className="menu-book-original">{item.name}</span>}<p>{item.description[lang]}</p>{item.certainty === 'format-unspecified' && <small className="menu-book-caveat">◇ {c.format}</small>}{onAdd && <div className="menu-order-action"><strong>{pounds(virtualPrice(item.id))}</strong><button type="button" className="menu-book-try" disabled={!!addReason?.(item.id)} aria-label={(ui(lang, 'Add ', '添加 ')) + item[lang]} onClick={() => onAdd(item.id)}>{ui(lang, 'Add to order', '加入点单')} +</button>{!!quantities[item.id] && <small>{ui(lang, 'In your order:', '已选')} {quantities[item.id]}</small>}{addReason?.(item.id) && <small className="order-reason">{addReason(item.id)}</small>}</div>}{item.gameRecipe && onChoose && <button type="button" className="menu-book-try" onClick={() => onChoose(item.gameRecipe as Recipe)}>{c.try} <span aria-hidden="true">→</span></button>}</div></li>)}</ul></section>; })}</div>
  {!filtered.length && <div className="menu-book-empty"><p>{c.empty}</p><button type="button" onClick={() => { setCategory('all'); setQuery(''); }}>{c.clear}</button></div>}
  <details className="menu-book-source"><summary>{c.source}</summary><p>{c.sourceText}</p><p>{c.sources}</p><a href="https://www.tripadvisor.co.uk/Restaurant_Review-g186338-d2395438-Reviews-Italia_Uno-London_England.html" target="_blank" rel="noopener noreferrer">{c.listing} <HandArrow/></a></details>
  {onChoose && <p className="menu-book-play-note">{c.play}</p>}
 </section>;
}
