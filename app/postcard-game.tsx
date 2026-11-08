// @ts-nocheck
'use client';
// "The swinging postcard": hide-and-seek in three imagined rooms (rules: lib/postcard-game.mjs).
// Each room is an original hand-drawn SVG. Five things are tucked behind furniture; three decoys answer
// "Just a lamp. Keep looking!". Every object is a real button, so the game works by mouse, touch and keyboard.
import { useEffect, useRef, useState } from 'react';
import HandArrow from './hand-arrow';
import PixelHost from './pixel-host';
import { POSTCARD_COPY, POSTCARD_SOURCE, fill } from '../lib/postcard-copy.mjs';
import { SEEK_ROOMS, POSTCARD_ROOM, currentRoom, roomDone } from '../lib/postcard-game.mjs';

const INK = '#17307f', PAPER = '#f5ebd6', PALE = '#e6dcc4', WOOD = '#dcc6a1', GLASS = '#c7d5da', BREAD = '#d9bd8b', RED = '#c99486', SKY = '#8fb3dd', LEAF = '#b1becb', METAL = '#c9ccd1';
const W = 640, H = 400;
const ZOOMS = ['fit', 'mid', 'close']; // phone zoom levels (app/postcard.css)

const scarf = (a, b) => <g><rect x="-22" y="-6" width="44" height="12" fill={a}/>{[-14, -2, 10].map(x => <rect key={x} x={x} y="-6" width="6" height="12" fill={b} stroke="none"/>)}<rect x="-22" y="-6" width="44" height="12" fill="none"/><path d="M-22 -4h-4M-22 0h-5M-22 4h-4M22 -4h4M22 0h5M22 4h4" fill="none" strokeWidth="1"/></g>;
// Every object is drawn around (0,0), so the same art serves the room and the tray.
const ART = {
  moka: <g><path d="M-8 -1H8L10 14H-10Z" fill={METAL}/><path d="M-7 -1L-5 -15H5L7 -1Z" fill="#dfe1e4"/><path d="M-6 -15L0 -19L6 -15Z" fill={METAL}/><circle cx="0" cy="-20" r="1.8" fill={INK}/><path d="M7 -11Q15 -9 11 2M-6 -12L-11 -15" fill="none"/></g>,
  scarf: scarf(INK, '#fff'),
  photo: <g><rect x="-12" y="-14" width="24" height="28" fill={WOOD}/><rect x="-9" y="-11" width="18" height="19" fill={PAPER}/><circle cx="-4" cy="-4" r="2.4" fill={PAPER}/><circle cx="4" cy="-5" r="2.6" fill={PAPER}/><path d="M-8 6Q-4 0 0 6M0 6Q4 -1 8 6" fill="none"/></g>,
  recipes: <g><rect x="-11" y="-14" width="22" height="28" rx="1" fill={RED}/><rect x="-6" y="-9" width="13" height="7" fill={PAPER}/>{[-10, -4, 2, 8].map(y => <circle key={y} cx="-11" cy={y} r="1.3" fill={PAPER}/>)}<path d="M-5 4h11M-5 8h9" fill="none" strokeWidth="1"/></g>,
  umbrella: <g><path d="M0 -26L6 8Q0 11 -6 8Z" fill={RED}/><path d="M-3 -10L-1 6M3 -10L1 6" fill="none" strokeWidth="1"/><path d="M0 9V20Q0 26 -5 25" fill="none" strokeWidth="2"/></g>,
  key: <g><circle cx="-9" cy="0" r="6" fill="#e2c37a"/><circle cx="-9" cy="0" r="2" fill="#efe3c8"/><path d="M-3 0H12M8 0v5M12 0v4" fill="none" strokeWidth="2"/></g>,
  sign: <g><path d="M-10 -14L0 -22L10 -14" fill="none" strokeWidth="1"/><circle cx="0" cy="-22" r="1.5" fill={INK}/><rect x="-18" y="-14" width="36" height="16" rx="2" fill={PAPER}/><text x="0" y="-3" textAnchor="middle" fontSize="7.5" fontWeight="700" fontFamily="sans-serif" fill={INK} stroke="none">APERTO</text></g>,
  beans: <g><path d="M-14 12Q-16 -6 -8 -12H8Q16 -6 14 12Z" fill={WOOD}/>{[[-5, -14], [0, -16], [5, -14], [-1, -12]].map(([x, y]) => <ellipse key={x + ',' + y} cx={x} cy={y} rx="2.3" ry="1.6" fill="#7a5235"/>)}<text x="0" y="5" textAnchor="middle" fontSize="6" fontFamily="sans-serif" fill={INK} stroke="none">CAFFÈ</text></g>,
  espresso: <g><ellipse cx="0" cy="7" rx="11" ry="3" fill={PAPER}/><path d="M-6 -4H6L5 5Q0 8 -5 5Z" fill={PAPER}/><path d="M6 -2Q10 -1 6 3" fill="none"/><ellipse cx="0" cy="-4" rx="6" ry="1.6" fill="#7a5235"/></g>,
  sugar: <g><path d="M-10 -2H10Q10 10 0 11Q-10 10 -10 -2Z" fill={PAPER}/><path d="M-10 -2Q0 -9 10 -2Z" fill={SKY}/><circle cx="0" cy="-7" r="1.8" fill={SKY}/><path d="M4 -6L12 -14" fill="none" strokeWidth="1.4"/></g>,
  ball: <g><circle r="10" fill="#fff"/><path d="M0 -4L4 -1L2.5 4H-2.5L-4 -1Z" fill={INK}/><path d="M0 -4V-10M4 -1L9.5 -3M2.5 4L6 8M-2.5 4L-6 8M-4 -1L-9.5 -3" fill="none" strokeWidth="1"/></g>,
  flag: <g><path d="M-10 18V-18" fill="none" strokeWidth="2"/><path d="M-10 -18H12V-4H-10Z" fill={SKY}/><path d="M-10 -11H12" fill="none" stroke="#fff" strokeWidth="3"/><path d="M-10 -18H12V-4H-10" fill="none"/></g>,
  bluescarf: scarf(SKY, '#fff'),
  coffeecup: <g><ellipse cx="0" cy="9" rx="15" ry="4" fill={PAPER}/><path d="M-10 -6H10L8 7Q0 11 -8 7Z" fill={PAPER}/><path d="M10 -3Q16 -1 9 5" fill="none"/><ellipse cx="0" cy="-6" rx="10" ry="2.5" fill="#c8a27a"/><path d="M-3 -13q2 -3 0 -6M3 -13q2 -3 0 -6" fill="none" strokeWidth="1"/></g>,
  panino: <g><ellipse cx="0" cy="8" rx="17" ry="4" fill={PAPER}/><path d="M-15 2Q-14 -8 0 -9Q14 -8 15 2Z" fill={BREAD}/><path d="M-15 2Q0 7 15 2L14 4Q0 9 -14 4Z" fill="#9baa7b"/><path d="M-14 4Q0 10 14 4L13 6Q0 11 -13 6Z" fill={BREAD}/></g>,
  // Decoys
  plant: <g><path d="M-9 4H9L7 18H-7Z" fill={RED}/><path d="M0 4V-16" fill="none"/><path d="M0 -4Q-12 -6 -14 -16Q-3 -14 0 -6Z" fill={LEAF}/><path d="M0 -8Q10 -12 13 -22Q2 -19 0 -10Z" fill={LEAF}/><path d="M0 -15Q-6 -22 -4 -28Q2 -24 0 -16Z" fill={LEAF}/></g>,
  lamp: <g><path d="M-14 -40H14L20 -22H-20Z" fill="#f0d9a0"/><path d="M0 -22V48" fill="none" strokeWidth="2"/><ellipse cx="0" cy="50" rx="14" ry="4" fill={INK}/></g>,
  clock: <g><circle r="16" fill={PAPER}/><circle r="12.5" fill="none" strokeWidth="1"/><path d="M0 0V-9M0 0L7 3" fill="none" strokeWidth="1.8"/><circle r="1.5" fill={INK}/></g>,
  chair: <g><path d="M-14 -34V24M-14 0H14V24M-10 -34V0" fill="none" strokeWidth="2.4"/><rect x="-16" y="-3" width="32" height="6" fill={WOOD}/></g>,
  broom: <g><path d="M-14 -50L6 26" fill="none" strokeWidth="2.4"/><path d="M0 22L14 30L6 44L-8 36Z" fill={BREAD}/><path d="M2 32L-2 40M6 34L2 42" fill="none" strokeWidth="1"/></g>,
  radio: <g><rect x="-18" y="-10" width="36" height="22" rx="3" fill={RED}/><circle cx="-8" cy="1" r="6" fill={PAPER}/><path d="M4 -3h10M4 2h10M4 7h10" fill="none" strokeWidth="1"/><path d="M10 -10L18 -24" fill="none"/></g>,
  tv: <g><rect x="-42" y="-28" width="84" height="56" rx="4" fill={INK}/><rect x="-36" y="-22" width="72" height="44" fill="#9fbf8f"/><path d="M0 -22V22M-36 0H36" fill="none" stroke="#fff" strokeWidth="1"/><circle r="8" fill="none" stroke="#fff" strokeWidth="1"/><path d="M-10 28L-14 40M10 28L14 40" fill="none"/></g>,
  hat: <g><path d="M-16 4Q-14 -10 0 -11Q14 -10 15 4Z" fill="#8a8f9c"/><path d="M-16 4Q0 0 22 6Q4 10 -16 7Z" fill="#8a8f9c"/></g>,
  menu: <g><path d="M-26 -34H26V20H-26Z" fill="#2d3b55"/><path d="M-20 -24h24M-20 -14h32M-20 -4h18M-20 6h28" fill="none" stroke={PAPER} strokeWidth="1.4"/><path d="M-20 20L-28 46M20 20L28 46" fill="none" strokeWidth="2"/></g>,
};

// Each room: back drawing, middle (furniture that hides things), front (closest objects), and where each
// object sits: [x, y, scale, rotation, layer, hit width, hit height]. Hit areas are at least 44 units.
const floorTiles = (y, colour) => Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${i * 52 - 40} ${H} L${i * 52 + 10} ${y}`} stroke={colour} strokeWidth="1" fill="none"/>);
const ROOM_ART = {
  bari: {
    back: <>
      <rect width={W} height="292" fill="#efe3c8" stroke="none"/><rect y="292" width={W} height="108" fill="#e2cfad" stroke="none"/>{floorTiles(292, '#cdb995')}<path d={`M0 292H${W}`}/>
      <rect x="40" y="48" width="170" height="122" fill={GLASS}/><circle cx="170" cy="82" r="13" fill="#f3e2a6"/><path d="M40 128Q70 120 100 128T160 128T210 128V170H40Z" fill="#9db6c6"/><path d="M60 142q10 -5 20 0M120 150q10 -5 20 0" fill="none" strokeWidth="1"/><path d="M125 48V170M40 110H210" fill="none" strokeWidth="2.2"/><rect x="34" y="168" width="182" height="8" fill={WOOD}/>
      <path d="M212 40Q232 90 222 140Q236 170 250 196H262Q250 120 262 40Z" fill="#e3c3b6"/>
      <rect x="262" y="118" width="150" height="8" fill={WOOD}/>{[270, 281, 291].map((x, i) => <rect key={x} x={x} y={92 + i * 2} width="9" height={26 - i * 2} fill={[RED, SKY, LEAF][i]}/>)}
    </>,
    middle: <>
      <rect x="430" y="190" width="200" height="104" fill={WOOD}/><rect x="440" y="176" width="110" height="14" fill="#3c4a68"/><path d="M455 176v-4M535 176v-4" fill="none"/><rect x="560" y="200" width="56" height="70" fill="#e5d3b3"/><circle cx="604" cy="236" r="2" fill={INK}/>
      <path d="M232 232H400L404 276Q392 270 380 276Q368 270 356 276Q344 270 332 276Q320 270 308 276Q296 270 284 276Q272 270 260 276Q248 270 236 276Z" fill="#f2dcd2"/><path d="M246 276V300M386 276V300" fill="none" strokeWidth="2.4"/>
    </>,
    front: <>
      <ellipse cx="514" cy="172" rx="20" ry="6" fill="#59647d"/><path d="M534 172H560" fill="none" strokeWidth="3"/><rect x="444" y="242" width="80" height="24" fill="#d2bb94"/><rect x="478" y="250" width="12" height="4" fill={INK}/>
    </>,
    at: { moka: [492, 160, .95, 0, 'back', 50, 50], scarf: [482, 238, .9, -8, 'front', 64, 46], photo: [318, 98, .95, -4, 'back', 48, 50], recipes: [322, 284, .9, 70, 'back', 56, 48], umbrella: [229, 262, .95, -10, 'back', 44, 84],
      lamp: [32, 232, 1, 0, 'front', 46, 110], clock: [334, 40, 1, 0, 'back', 46, 46], plant: [356, 96, 1, 0, 'front', 44, 50] },
  },
  soho: {
    back: <>
      <rect width={W} height="300" fill="#eadfca" stroke="none"/><rect y="300" width={W} height="100" fill="#dfe4ea" stroke="none"/>{Array.from({ length: 4 * 26 }, (_, i) => { const row = Math.floor(i / 26), col = i % 26; return (row + col) % 2 ? <rect key={i} x={col * 25} y={300 + row * 25} width="25" height="25" fill="#b9c6dc" stroke="none"/> : null; })}<path d={`M0 300H${W}`}/>
      <rect x="28" y="40" width="190" height="150" fill={GLASS}/><text transform="translate(123 82) scale(-1 1)" textAnchor="middle" fontSize="20" fontFamily="var(--hand)" fill="#ffffffcc" stroke="none">Italia Uno</text><path d="M28 120H218M123 40V190" fill="none" strokeWidth="2"/>
      <rect x="250" y="70" width="84" height="230" fill="#7d8fb3"/><rect x="262" y="84" width="60" height="80" fill={GLASS}/><circle cx="324" cy="196" r="3" fill={PAPER}/><path d="M346 150l-4 4" fill="none" strokeWidth="2"/>
      <rect x="400" y="96" width="220" height="8" fill={WOOD}/>{[420, 446, 472, 498].map(x => <path key={x} d={`M${x} 96v-10h14v10`} fill={PAPER}/>)}
    </>,
    middle: <>
      <rect x="392" y="196" width="238" height="104" fill="#a9b8d6"/><path d="M392 214H630" fill="none"/><rect x="430" y="132" width="90" height="64" rx="4" fill={METAL}/><path d="M446 196v-14h12v14M490 196v-14h12v14" fill={PAPER}/><circle cx="475" cy="152" r="6" fill="#fff"/>
      <ellipse cx="128" cy="252" rx="42" ry="8" fill={WOOD}/><path d="M128 260V300M108 300H148" fill="none" strokeWidth="2.4"/>
    </>,
    front: <>
      <rect x="540" y="300" width="58" height="40" fill="#cbb08a"/><path d="M540 312H598M540 326H598" fill="none" strokeWidth="1"/>
    </>,
    at: { key: [345, 168, .9, 80, 'back', 44, 50], sign: [194, 300, .95, -10, 'back', 52, 44], beans: [572, 294, 1, -6, 'back', 52, 50], espresso: [528, 188, .9, 0, 'back', 44, 44], sugar: [104, 238, .85, 0, 'front', 44, 44],
      chair: [206, 286, 1, 0, 'front', 46, 70], broom: [236, 246, .9, 0, 'front', 44, 100], radio: [588, 82, 1, 0, 'back', 50, 44] },
  },
  charlotte: {
    back: <>
      <rect width={W} height="296" fill="#e9dcc3" stroke="none"/><rect y="296" width={W} height="104" fill="#d8c4a2" stroke="none"/>{floorTiles(296, '#c4ad87')}<path d={`M0 296H${W}`}/>
      <path d="M0 22Q160 46 320 22T640 22" fill="none" strokeWidth="1"/>{Array.from({ length: 12 }, (_, i) => { const x = 18 + i * 52, y = 26 + Math.sin(i * 1.3) * 4; return <path key={i} d={`M${x} ${y}l10 18l10 -18`} fill={[SKY, PAPER, RED][i % 3]}/>; })}
      {[150, 450].map(x => <g key={x}><rect x={x} y="70" width="52" height="64" fill={PAPER}/><path d={`M${x + 8} ${86}l10 -8h16l10 8l-6 8v30h-24v-30Z`} fill={x === 150 ? '#d6dbe6' : '#e3d1c4'}/></g>)}
      <path d="M40 112h40" fill="none" strokeWidth="3"/><path d="M50 112v8M70 112v8" fill="none" strokeWidth="2"/>
      <rect x="560" y="140" width="70" height="8" fill={WOOD}/>
    </>,
    middle: <>
      <rect x="420" y="214" width="220" height="86" fill="#a9b8d6"/><path d="M420 228H640" fill="none"/>
      <rect x="586" y="112" width="12" height="28" fill="#9fbf8f"/><rect x="604" y="118" width="12" height="22" fill="#d8b98b"/>
      <ellipse cx="150" cy="300" rx="28" ry="6" fill={WOOD}/><path d="M134 304L124 360M166 304L176 360M150 306V362" fill="none" strokeWidth="2.6"/>
      <ellipse cx="400" cy="236" rx="22" ry="5" fill={PAPER}/>
    </>,
    front: <>
      {[456, 478, 500].map((x, i) => <path key={x} d={`M${x} 214v-22h12v22`} fill={i === 1 ? '#e8eef4' : '#f3eee2'}/>)}
    </>,
    at: { ball: [150, 350, .95, 0, 'back', 48, 44], flag: [590, 106, .8, 6, 'back', 44, 50], bluescarf: [62, 134, .85, 80, 'back', 44, 64], coffeecup: [488, 204, .85, 0, 'back', 50, 44], panino: [400, 226, .85, 0, 'back', 52, 44],
      tv: [308, 92, 1, 0, 'back', 92, 70], hat: [60, 120, .95, -8, 'front', 46, 44], menu: [364, 262, 1, 0, 'front', 60, 88] },
  },
};

function RoomScene({ room, found, hintId, t, onFind, onDecoy, zoom, scrollRef }) {
  const art = ROOM_ART[room.id], objects = [...room.decoys, ...room.items];
  const draw = layer => objects.filter(id => art.at[id][4] === layer).map(id => { const [x, y, s, r] = art.at[id]; return <g key={id} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>{ART[id]}</g>; });
  return <div className={'seek-scroll seek-zoom-' + zoom} ref={scrollRef}><div className="seek-stage">
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={t.searchLabel}><g stroke={INK} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
      {art.back}{draw('back')}{art.middle}{draw('front')}{art.front}
      {found.map(id => { const [x, y, , , , w, h] = art.at[id]; return <ellipse key={'ring-' + id} className="seek-ring" cx={x} cy={y} rx={w / 2 + 2} ry={h / 2 + 2} fill="none" stroke={INK} strokeWidth="2.6" pathLength="1"/>; })}
    </g></svg>
    {/* Decoys first, then the five things, so a found item always wins where hit areas touch. */}
    {objects.map(id => { const [x, y, , , , w, h] = art.at[id], isItem = room.items.includes(id), done = found.includes(id);
      return <button key={id} className={'seek-spot' + (done ? ' found' : '') + (hintId === id ? ' hint' : '')} style={{ left: (x - w / 2) / W * 100 + '%', top: (y - h / 2) / H * 100 + '%', width: w / W * 100 + '%', height: h / H * 100 + '%' }} aria-label={isItem ? t.items[id] + (done ? ' ✓' : '') : t.decoys[id]} aria-disabled={done || undefined} onClick={() => isItem ? onFind(id) : onDecoy(id)}/>; })}
  </div></div>;
}

function Icon({ id }) { return <svg viewBox="-26 -28 52 56" aria-hidden="true"><g stroke={INK} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">{ART[id]}</g></svg>; }

export default function PostcardGame({ postcard: p, lang, onAction, onSound, onClose }) {
  const t = POSTCARD_COPY[lang] || POSTCARD_COPY.en;
  const room = currentRoom(p), index = p.room - 1, done = roomDone(p);
  const [line, setLine] = useState(''), [hintId, setHintId] = useState(''), heading = useRef(null), hintTimer = useRef(), first = useRef(true);
  // Phones: the room starts a little zoomed out; − shows the whole room, + zooms in for easier tapping.
  const [zoom, setZoom] = useState(1), scrollRef = useRef(null);
  useEffect(() => { const s = scrollRef.current; if (s) s.scrollLeft = (s.scrollWidth - s.clientWidth) / 2; }, [zoom, p.room]);
  useEffect(() => { setLine(''); setHintId(''); if (first.current) { first.current = false; return; } heading.current?.focus(); }, [p.room]);
  useEffect(() => () => clearTimeout(hintTimer.current), []);
  const find = id => {
    if (p.found.includes(id)) return;
    const last = room.items.filter(x => !p.found.includes(x)).length === 1;
    onAction({ type: 'SEEK_FIND', id }); setLine(t.reactions[id]); setHintId('');
    onSound?.(last ? (p.room === SEEK_ROOMS.length ? 'win' : 'stamp') : 'select');
  };
  const decoy = id => { setLine(t.decoyLines[id]); onSound?.('click'); };
  const hint = () => { const next = room.items.find(id => !p.found.includes(id)); if (!next) return; setHintId(next); setLine(t.hintLine); onSound?.('click'); clearTimeout(hintTimer.current); hintTimer.current = setTimeout(() => setHintId(''), 2600); };
  const next = () => { onAction({ type: 'SEEK_NEXT' }); onSound?.('enter'); };
  const pin = () => { onAction({ type: 'SEEK_PIN' }); onSound?.('stamp'); setLine(t.pinned); };

  const host = room ? (done ? t.roomDone[index] : line || t.intros[index]) : p.pinned ? (line || t.pinned) : t.postcardTitle;
  return <section className="postcard-game" aria-label={t.title}>
    <header className="seek-head">
      <p className="micro">{t.eyebrow}{room ? ' · ' + fill(t.roomOf, p.room) + ' · ' + t.rooms[index] : ''}</p>
      <ol className="seek-rooms" aria-label={t.title}>{t.rooms.map((name, i) => <li key={name} className={p.room > i + 1 ? 'done' : p.room === i + 1 ? 'current' : ''} aria-current={p.room === i + 1 ? 'step' : undefined}><span aria-hidden="true">{p.room > i + 1 ? '✓' : i + 1}</span>{name}</li>)}</ol>
    </header>
    <div className="seek-host">
      <div className="seek-host-art" aria-hidden="true"><PixelHost/></div>
      <div><p className="seek-speaker">{t.speaker} · <span>{t.fiction}</span></p><h3 ref={heading} tabIndex={-1} role="status" aria-live="polite">{host}</h3></div>
    </div>

    {room && <>
      <RoomScene room={room} found={p.found} hintId={hintId} t={t} onFind={find} onDecoy={decoy} zoom={ZOOMS[zoom]} scrollRef={scrollRef}/>
      <div className="seek-zoom-row">
        <button className="outlined-button" aria-label={t.zoomOut} disabled={zoom === 0} onClick={() => setZoom(z => Math.max(0, z - 1))}>−</button>
        <span aria-hidden="true">{zoom > 0 ? '← ' + t.swipe + ' →' : ''}</span>
        <button className="outlined-button" aria-label={t.zoomIn} disabled={zoom === ZOOMS.length - 1} onClick={() => setZoom(z => Math.min(ZOOMS.length - 1, z + 1))}>+</button>
      </div>
      <div className="seek-bar">
        <div className="seek-tray" aria-label={t.trays[index] + ': ' + fill(t.foundCount, p.found.length)}>
          <span className="seek-tray-label">{t.trays[index]} <b>{fill(t.foundCount, p.found.length)}</b></span>
          <ul>{room.items.map(id => <li key={id} className={p.found.includes(id) ? 'found' : ''}><Icon id={id}/><span>{t.items[id]}</span></li>)}</ul>
        </div>
        <div className="seek-actions">{done ? <button className="primary" onClick={next}>{p.room === SEEK_ROOMS.length ? t.turnOver : t.next} →</button> : <button className="outlined-button" onClick={hint}>✦ {t.hint}</button>}</div>
      </div>
    </>}

    {p.room === POSTCARD_ROOM && <div className="seek-postcard">
      <article className="seek-card front" aria-hidden="true"><b>Un piccolo</b><b>mondo.</b><div className="seek-stamps">{t.rooms.map(name => <span key={name}>✓ {name}</span>)}</div></article>
      <article className="seek-card back"><span className="micro">{t.trueStory}</span><p>{t.fact}</p><p className="seek-source">{t.source} <a href={POSTCARD_SOURCE.href} target="_blank" rel="noopener noreferrer">{POSTCARD_SOURCE.label} <HandArrow/></a></p></article>
      <div className="seek-actions">{p.pinned ? <button className="primary" onClick={onClose}>{t.backToTable} →</button> : <button className="primary" onClick={pin}>{t.pin} →</button>}</div>
    </div>}
  </section>;
}
