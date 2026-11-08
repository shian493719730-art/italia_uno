// @ts-nocheck
'use client';
import HandArrow from './hand-arrow';
import {ui,withItalian} from '../lib/locales.mjs';

import { useEffect, useRef } from 'react';
import { drawVisitVignette } from '../lib/handdrawn-scenes.mjs';
import { useSceneCamera, CameraTools } from './scene-camera';
// postcard (table view only): { label, bubble, onPick }. The "Un piccolo mondo." card on the noticeboard
// swings on its pin with a "Click me!" bubble beside it (app/postcard.css); clicking opens the hide-and-seek.
export default function VisitVignette({ view = 'counter', lang = 'en', progress = 0, activity = 0, onBoard, postcard = null }) {
    const camera = useSceneCamera(view === 'table' ? 'table' : 'street');
    const mount = useRef(null), canvas = useRef(null), board = useRef(null), card = useRef(null), bubble = useRef(null), actionAt = useRef(0), data = useRef({ view, progress, activity });
    data.current = { view, progress, activity, postcardOff: !!postcard };
    useEffect(() => { actionAt.current = performance.now(); }, [activity]);
    useEffect(() => { let raf, last = 0, active = true; const g = canvas.current.getContext('2d'); const draw = now => { if (now - last > 95) {
        const anchors = drawVisitVignette(g, { ...data.current, time: now, reaction: data.current.activity > 0 && now - actionAt.current < 1800 });
        if (board.current && anchors.board) {
            const [x, y, w, h] = anchors.board, { scale, x: ox, y: oy } = camera.projection.current;
            Object.assign(board.current.style, { left: ox + x * scale + 'px', top: oy + y * scale + 'px', width: w * scale + 'px', height: h * scale + 'px' });
        }
        if (card.current && anchors.postcard) {
            const [x, y, w, h] = anchors.postcard, { scale, x: ox, y: oy } = camera.projection.current;
            Object.assign(card.current.style, { left: ox + x * scale + 'px', top: oy + y * scale + 'px', width: w * scale + 'px', height: h * scale + 'px' });
            card.current.style.setProperty('--u', String(scale));
            // The bubble sits just left of the card, pointing at it.
            if (bubble.current) Object.assign(bubble.current.style, { left: ox + x * scale + 'px', top: oy + (y + h / 2) * scale + 'px' });
        }
        last = now;
    } if (active)
        raf = requestAnimationFrame(draw); }; raf = requestAnimationFrame(draw); return () => { active = false; cancelAnimationFrame(raf); }; }, []);
    return <div className={'visit-vignette vignette-' + view} ref={mount} role="group" aria-label={ui(lang, (view === 'counter' ? 'The pixel host behind the blue counter' : 'Your café table and wall noticeboard'), (view === 'counter' ? '蓝色柜台后的像素老板' : '餐桌与墙上布告板'))}><div className="scene-camera" ref={camera.viewport} tabIndex={view === 'table' ? 0 : undefined} aria-label={ui(lang, 'Drag left or right to explore the scene', '左右拖动查看场景')} {...camera.handlers}><div className="scene-world" style={camera.worldStyle}><canvas width="1280" height="840" ref={canvas} style={camera.canvasStyle} aria-hidden="true"/>{onBoard && <button ref={board} className="noticeboard-target" aria-label={ui(lang, 'Wall map', '墙上地图')} onClick={onBoard}><span>{ui(lang, 'Explore the noticeboard', '看看布告板')} <HandArrow/></span></button>}{postcard && <><button ref={card} className="board-postcard" aria-label={postcard.label} title={postcard.label} onClick={postcard.onPick}><i aria-hidden="true"/><span aria-hidden="true"><b>Un piccolo</b><b>mondo.</b></span></button><span ref={bubble} className="board-postcard-bubble" aria-hidden="true" onClick={postcard.onPick}>{postcard.bubble}</span></>}</div></div>{view === 'table' && <CameraTools camera={camera} lang={lang} kind="table"/>}</div>;
}
