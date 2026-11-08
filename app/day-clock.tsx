// @ts-nocheck
'use client';
import {useEffect, useState} from 'react';
import {ui} from '../lib/locales.mjs';
import {PHASES, phaseFor} from '../lib/daytime.mjs';

// Rounded sun / half-moon icons, one per time of day.
function PhaseIcon({phase}) {
  const ink = 'var(--ink)';
  if (phase === 'night') return <svg viewBox="0 0 28 28" aria-hidden="true"><path d="M17.6 4.6a9.6 9.6 0 1 0 6 13.6A8 8 0 0 1 17.6 4.6z" fill="#f6dea9" stroke={ink} strokeWidth="1.6" strokeLinejoin="round"/><circle cx="21.5" cy="7.5" r="1.1" fill={ink}/><circle cx="24.5" cy="12" r=".8" fill={ink}/></svg>;
  const sunrise = phase === 'dawn', sunset = phase === 'dusk';
  const color = sunrise ? '#f6b26b' : sunset ? '#ea8a55' : '#f5c84c';
  const cy = sunrise || sunset ? 17 : 14;
  const rays = [0, 45, 90, 135, 180, 225, 270, 315].filter(a => !(sunrise || sunset) || (a >= 180 || a === 0));
  return <svg viewBox="0 0 28 28" aria-hidden="true">
    {rays.map(a => { const r = a * Math.PI / 180; return <line key={a} x1={14 + Math.cos(r) * 8.6} y1={cy + Math.sin(r) * 8.6} x2={14 + Math.cos(r) * 11.4} y2={cy + Math.sin(r) * 11.4} stroke={ink} strokeWidth="1.6" strokeLinecap="round"/>; })}
    {sunrise || sunset
      ? <><path d={`M7.4 ${cy}a6.6 6.6 0 0 1 13.2 0z`} fill={color} stroke={ink} strokeWidth="1.6" strokeLinejoin="round"/><line x1="4" y1={cy + .4} x2="24" y2={cy + .4} stroke={ink} strokeWidth="1.6" strokeLinecap="round"/></>
      : <circle cx="14" cy={cy} r="6.2" fill={color} stroke={ink} strokeWidth="1.6"/>}
  </svg>;
}

const NAMES = {
  dawn: ['Morning', '清晨'], day: ['Daytime', '白天'], dusk: ['Evening', '傍晚'], night: ['Night', '夜晚'],
};

export default function DayClock({lang = 'en'}) {
  const [now, setNow] = useState(() => new Date());
  const [preview, setPreview] = useState(() => {
    const q = typeof location !== 'undefined' && new URLSearchParams(location.search).get('time');
    return PHASES.includes(q) ? q : null;
  });
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 20000); return () => clearInterval(id); }, []);
  const phase = preview || phaseFor(now);
  useEffect(() => { document.documentElement.dataset.daytime = phase; }, [phase]);
  const time = new Intl.DateTimeFormat(lang === 'zh' ? 'zh-CN' : lang === 'ja' ? 'ja-JP' : lang === 'it' ? 'it-IT' : 'en-GB', {hour: '2-digit', minute: '2-digit'}).format(now);
  const name = ui(lang, NAMES[phase][0], NAMES[phase][1]);
  const next = () => { const i = preview ? PHASES.indexOf(preview) : PHASES.indexOf(phaseFor(now)); setPreview(i === PHASES.length - 1 && preview ? null : PHASES[(i + 1) % PHASES.length]); };
  const hint = preview ? ui(lang, 'Previewing · tap to change', '预览中 · 点按切换') : ui(lang, 'Your local time · tap to preview', '你的当地时间 · 点按预览');
  return <button className={'day-clock phase-' + phase + (preview ? ' is-preview' : '')} onClick={next} title={name + ' · ' + hint} aria-label={time + ', ' + name + '. ' + hint}>
    <span className="day-clock-icon"><PhaseIcon phase={phase}/></span>
    <span className="day-clock-time">{time}</span>
    {preview && <small>{name}</small>}
  </button>;
}
