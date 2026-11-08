import {ui,withItalian} from './locales.mjs';
import { cleanName, normaliseMemory } from './visit-memory.mjs';
import { SERVICE_TARGET, serviceWon } from './service-state.mjs';
import { normaliseCustomer, orderLines, orderTotal, pounds } from './customer-state.mjs';
import { menuById } from './menu-data.mjs';
const MAP_URL = 'https://www.google.com/maps/search/?api=1&query=Italia+Uno+91+Charlotte+Street+London+W1T+4PX';
const titles = { italia: 'Italia', campagnolo: 'Campagnolo', barese: 'Barese', espresso: 'Espresso' };
const detailNames = withItalian({ en: { menu: 'Browsed the blackboard menu', coffee: 'Stopped at the coffee corner', football: 'Explored the football wall', map: 'Opened the neighbourhood map', boss: 'Said ciao to the pixel boss', notebook: 'Opened your little notebook', 'story-map': 'Opened the world map' }, zh: { menu: '翻看黑板菜单', coffee: '在咖啡角停留', football: '探索足球墙', map: '打开街区地图', boss: '和像素老板打招呼', notebook: '打开小小笔记本', 'story-map': '打开世界地图' } });
export function playDuration(seconds, lang = 'en') { const n = Math.max(0, Math.floor(Number(seconds) || 0)), m = Math.floor(n / 60), s = n % 60; return ui(lang, (m ? `${m}m ${String(s).padStart(2, '0')}s` : `${s}s`), (m ? `${m} 分 ${s} 秒` : `${s} 秒`)); }
export function makeReceipt({ kind = 'visitor', lang = 'en', visit = {}, service = {}, name, seconds } = {}) {
    const zh = lang === 'zh', m = normaliseMemory(visit.memory), owner = kind === 'owner', who = cleanName(name ?? m.name).trim() || (ui(lang, 'neighbour', '新邻居'));
    const duration = playDuration(seconds ?? m.seconds, lang), rows = [];
    const customer = normaliseCustomer(visit.customer);
    const bill = !owner && ['checkout', 'goodbye', 'complete'].includes(customer.phase) ? { number: 'IU-' + customer.checkoutAt.replace(/[^0-9]/g, '').slice(0, 14), date: new Intl.DateTimeFormat((lang === 'ja' ? 'ja-JP' : ui(lang, 'en-GB', 'zh-CN')), { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(customer.checkoutAt)), lines: orderLines(customer).map(line => ({ ...line, name: menuById[line.id][lang], unit: pounds(line.unitPence), amount: pounds(line.qty * line.unitPence) })), total: pounds(orderTotal(customer)) } : null;
    if (owner) {
        const dishes = service.memories?.servedDishes || {}, stats = service.totals || {}, completed = service.receipts?.length || 0;
        rows.push([ui(lang, 'Days completed', '完成营业日'), `${completed} / 3`], [ui(lang, 'Guests welcomed', '招待顾客'), String(stats.served || 0)], [ui(lang, 'Guests missed', '未能招待的顾客'), String(stats.lost || 0)]);
        if (service.phase === 'review')
            rows.push([ui(lang, 'Three-day aim', '三天经营目标'), ui(lang, `${SERVICE_TARGET.served} guests + ${SERVICE_TARGET.cash} tokens`, `${SERVICE_TARGET.served} 位顾客 + ${SERVICE_TARGET.cash} 代币`)], [ui(lang, 'Aim result', '目标结果'), serviceWon(service) ? (ui(lang, 'MET', '已达成')) : (ui(lang, 'NOT YET MET', '尚未达成'))]);
        for (const [id, label] of Object.entries(titles))
            if (dishes[id])
                rows.push([ui(lang, `Served ${label}`, `送出 ${label}`), `× ${dishes[id]}`]);
        if (service.memories?.cleans)
            rows.push([ui(lang, 'Worktop wipes', '擦净操作台'), `× ${service.memories.cleans}`]);
        if (service.upgrade)
            rows.push([ui(lang, 'Your improvement', '你的小升级'), (withItalian({ en: { counter: 'Prep counter', grinder: 'Coffee grinder', seats: 'Waiting corner' }, zh: { counter: '提前备好的操作台', grinder: '小磨豆机', seats: '舒适等候角' } }))[lang][service.upgrade]]);
        rows.push([ui(lang, 'Service actions', '完成的经营行动'), String((service.receipts || []).reduce((n, r) => n + (r.turns || 0), 0) + (service.phase === 'trade' ? (service.daily?.turns || 0) : 0))], [ui(lang, 'Game tokens left', '剩余游戏代币'), String(service.cash ?? 0)]);
    }
    else {
        for (const [id, n] of Object.entries(m.opened))
            if (n)
                rows.push([detailNames[lang][id], `× ${n}`]);
        for (const [id, n] of Object.entries(m.madeRecipes))
            if (n)
                rows.push([ui(lang, `Made a virtual ${titles[id]}`, `亲手搭配 ${titles[id]}`), `× ${n}`]);
        if (visit.stamps?.includes('neighbourhood'))
            rows.push([ui(lang, 'Pinned this little place', '记住了这个街角'), ui(lang, 'PINNED', '已标记')]);
        if (customer.storyRead)
            rows.push([ui(lang, 'Read the café’s origin story', '读过小店的起源故事'), ui(lang, 'READ', '已读')]);
        if (bill)
            rows.push([ui(lang, 'Virtual meal finished', '完成虚拟用餐'), '✓']);
        else
            rows.push([ui(lang, 'Little discoveries', '收集的探店印章'), `${new Set(visit.stamps || []).size} / 3`]);
    }
    return { kind, lang, name: who, bill, mapURL: MAP_URL, title: owner ? (ui(lang, 'A little shift. A lovely memory.', '一班经营，一张回忆小票。')) : (ui(lang, 'A little visit, kept on paper.', '一张小票，一次小小探访。')), role: owner ? (ui(lang, 'YOUR COUNTER KEEPSAKE', '像素老板的留念小票')) : bill ? (ui(lang, 'VIRTUAL GUEST RECEIPT', '虚拟用餐结账小票')) : (ui(lang, 'YOUR LITTLE VISIT RECEIPT', '顾客的探店留念小票')), greeting: ui(lang, `Ciao, ${who}!`, `${who}，Ciao！`), intro: owner ? (ui(lang, `You spent ${duration} behind our pixel counter. Every little shift has its own rhythm. Here is yours.`, `你在像素柜台后度过了 ${duration}。每一班都有自己的节奏，这是属于你的那一班。`)) : (ui(lang, `You spent ${duration} in our pixel café. Thank you for making a little time for a little place.`, `你在像素小店里度过了 ${duration}。谢谢你为一个小小的地方，留下一点时间。`)), timeLabel: ui(lang, 'Recorded play time', '记录的游戏时长'), duration, rows, message: ui(lang, 'Next time, take your little adventure beyond the screen. Come by the real Italia Uno and see how the real owner brings this little café to life.', '下次，让这段小小探访发生在屏幕之外吧。欢迎来真实的 Italia Uno，看看真正的老板是怎样让小店运转起来的。'), signoff: ui(lang, 'Keep this little memory. Leave room for a real visit.', '把这份回忆带走，把下一次留给街角。'), address: '91 Charlotte Street · Fitzrovia', city: 'London W1T 4PX', footer: owner ? (ui(lang, 'GAME KEEPSAKE · TOKENS ARE FICTIONAL · NOT A PAYMENT RECEIPT', '游戏留念 · 代币不是真实收入 · 非消费凭证')) : (ui(lang, 'GAME KEEPSAKE · NOT AN ORDER, PAYMENT RECEIPT OR VOUCHER', '游戏留念 · 非订单、消费凭证或优惠券')) };
}
export const escapeXML = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]));
function wrap(text, width) { const words = /[\u3400-\u9fff]/.test(text) ? Array.from(text) : text.split(' '), join = /[\u3400-\u9fff]/.test(text) ? '' : ' '; const lines = []; let line = ''; for (const word of words) {
    const next = line ? line + join + word : word;
    if (Array.from(next).length > width && line) {
        lines.push(line);
        line = word;
    }
    else
        line = next;
} if (line)
    lines.push(line); return lines; }
export function receiptSVG(model, options = {}) {
    if (options.layout === 'slip' && model.bill)
        return thermalReceiptSVG(model);
    const parts = [], x = 90;
    let y = 280;
    const text = (value, at, size = 24, extra = '') => `<text x="${x}" y="${at}" font-size="${size}" ${extra}>${escapeXML(value)}</text>`;
    const para = (value, size = 24) => { for (const line of wrap(value, ui(model.lang, Math.floor(700 / (size * .62)), Math.floor(700 / size)))) {
        parts.push(text(line, y, size));
        y += size * 1.55;
    } y += 16; };
    if (model.bill) {
        const b = model.bill;
        para(b.number + ' · ' + b.date, 19);
        para(ui(model.lang, 'QTY / ITEM                         EACH / AMOUNT', '数量 / 菜品                         单价 / 金额'), 18);
        for (const line of b.lines) {
            const names = wrap(line.qty + ' × ' + line.name, ui(model.lang, 32, 22));
            for (let i = 0; i < names.length; i++) {
                parts.push(text(names[i], y, 21));
                if (i === 0)
                    parts.push(`<text x="675" y="${y}" text-anchor="end" font-size="20">${escapeXML(line.unit)}</text><text x="810" y="${y}" text-anchor="end" font-size="22">${escapeXML(line.amount)}</text>`);
                y += 32;
            }
            y += 8;
        }
        para((ui(model.lang, 'VIRTUAL TOTAL ', '虚拟合计 ')) + b.total, 26);
        para(ui(model.lang, 'ACTUALLY CHARGED £0.00 · NO PAYMENT REQUIRED', '实际扣费 £0.00 · 无需支付'), 18);
        y += 15;
    }
    para(model.greeting, 36);
    para(model.intro);
    parts.push(`<path d="M90 ${y}H810" stroke="#b29273" stroke-width="2" stroke-dasharray="8 7"/>`);
    y += 45;
    parts.push(text(model.timeLabel, y, 21), `<text x="810" y="${y}" text-anchor="end" font-size="23">${escapeXML(model.duration)}</text>`);
    y += 45;
    for (const [label, value] of model.rows) {
        const labelLines = wrap(label, ui(model.lang, 36, 19));
        for (let i = 0; i < labelLines.length; i++) {
            parts.push(text(labelLines[i], y, 21));
            if (i === 0)
                parts.push(`<text x="810" y="${y}" text-anchor="end" font-size="22">${escapeXML(value)}</text>`);
            y += 32;
        }
        y += 9;
    }
    parts.push(`<path d="M90 ${y}H810" stroke="#b29273" stroke-width="2" stroke-dasharray="8 7"/>`);
    y += 52;
    para(model.message, 24);
    para(model.signoff, 22);
    y += 24;
    const h = y + 180;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="${h}" viewBox="0 0 900 ${h}" role="img" aria-label="Italia Uno keepsake receipt"><rect width="900" height="${h}" fill="#eee1c8"/><path d="M40 30H860V${h - 30}H40Z" fill="#fbf4e4" stroke="#17307f" stroke-width="3"/><path d="M55 45H845M55 ${h - 45}H845" stroke="#a3a7b3" stroke-width="4" stroke-dasharray="8 8"/><g fill="#17307f" font-family="monospace, sans-serif"><text x="450" y="120" text-anchor="middle" font-size="60" font-weight="bold">ITALIA UNO</text><text x="450" y="175" text-anchor="middle" font-size="20">${escapeXML(model.role)}</text><text x="450" y="215" text-anchor="middle" font-size="18">91 CHARLOTTE STREET · FITZROVIA</text>${parts.join('')}<a href="${escapeXML(model.mapURL || MAP_URL)}" target="_blank"><text x="450" y="${h - 160}" text-anchor="middle" font-size="19" text-decoration="underline">${ui(model.lang, 'Google Maps · Visit the real café ↗', 'Google 地图 · 到真实小店看看 ↗')}</text></a><text x="450" y="${h - 125}" text-anchor="middle" font-size="22">${escapeXML(model.address)}</text><text x="450" y="${h - 90}" text-anchor="middle" font-size="20">${escapeXML(model.city)}</text><text x="450" y="${h - 60}" text-anchor="middle" font-size="11">${escapeXML(model.footer)}</text></g></svg>`;
}
function thermalReceiptSVG(model) {
    const b = model.bill, zh = model.lang === 'zh', parts = [];
    let y = 210;
    const txt = (s, x = 32, size = 16, anchor = 'start') => `<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}">${escapeXML(s)}</text>`;
    const para = (s, size = 16) => { for (const line of wrap(s, ui(model.lang, Math.floor(385 / (size * .62)), Math.floor(385 / size)))) {
        parts.push(txt(line, 32, size));
        y += size * 1.55;
    } y += 9; };
    parts.push(txt(ui(model.lang, 'QTY', '数量'), 32, 14), txt(ui(model.lang, 'ITEM', '菜品'), 87, 14), txt(ui(model.lang, 'PRICE', '金额'), 418, 14, 'end'));
    y += 25;
    for (const line of b.lines) {
        const names = wrap(line.name, ui(model.lang, 25, 17));
        parts.push(txt(line.qty + '×', 32, 16), txt(line.amount, 418, 16, 'end'));
        for (const name of names) {
            parts.push(txt(name, 87, 16));
            y += 25;
        }
        parts.push(txt(line.unit + (ui(model.lang, ' each', ' 每份')), 87, 12));
        y += 28;
    }
    parts.push(`<path d="M30 ${y}H420" stroke="#a1a6b2" stroke-dasharray="5 5"/>`);
    y += 33;
    para(model.greeting, 20);
    para(ui(model.lang, `You spent ${model.duration} in our little simulation. Thanks for ordering—come and see us in person!`, `你在像素小店度过了 ${model.duration}。谢谢你的虚拟点单，下次来真实的小店看看吧。`), 16);
    parts.push(`<a href="${escapeXML(model.mapURL)}" target="_blank">${txt(ui(model.lang, 'Visit the real café · Google Maps ↗', '真实小店 · Google 地图 ↗'), 32, 14)}</a>`);
    y += 37;
    if (model.rows.length) {
        para(ui(model.lang, 'YOUR LITTLE MEMORIES', '你的小小经历'), 14);
        for (const [label, value] of model.rows)
            para(label + '  ' + value, 12);
    }
    parts.push(`<path d="M30 ${y}H420" stroke="#a1a6b2" stroke-dasharray="5 5"/>`);
    y += 35;
    parts.push(txt(ui(model.lang, 'TOTAL', '合计'), 32, 26), txt(b.total, 418, 28, 'end'));
    y += 30;
    para(ui(model.lang, 'GAME PRICES ONLY · ACTUALLY CHARGED £0.00', '仅游戏虚拟价格 · 实际扣费 £0.00'), 11);
    para(b.number + ' · ' + b.date, 10);
    para(model.footer, 9);
    const h = y + 28, edge = Array.from({ length: 25 }, (_, i) => `${435 - i * 17},${h - 15 + (i % 2) * 8}`).join(' ');
    return `<svg xmlns="http://www.w3.org/2000/svg" width="450" height="${h}" viewBox="0 0 450 ${h}" role="img" aria-label="Italia Uno virtual receipt"><rect width="450" height="${h}" fill="#eee1c8"/><path d="M15 10H435V${h - 15}L${edge}L15 ${h - 15}Z" fill="#fbf4e4" stroke="#8c94a8" stroke-width="2"/><g fill="#17307f" font-family="monospace,sans-serif"><text x="225" y="52" text-anchor="middle" font-size="32" font-weight="bold">ITALIA UNO</text><text x="225" y="82" text-anchor="middle" font-size="22">${ui(model.lang, 'ORDER #1', '点单 #1')}</text><text x="225" y="112" text-anchor="middle" font-size="13">91 Charlotte Street · London W1T 4PX</text><path d="M30 132H420" stroke="#a1a6b2" stroke-dasharray="5 5"/><text x="225" y="157" text-anchor="middle" font-size="20">${ui(model.lang, 'R E C E I P T', '留 念 小 票')}</text><text x="225" y="181" text-anchor="middle" font-size="10">${ui(model.lang, 'VIRTUAL MENU · NO REAL ORDER', '虚拟菜单 · 不会真实下单')}</text>${parts.join('')}</g></svg>`;
}
