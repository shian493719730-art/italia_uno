// @ts-nocheck
'use client';
import {ui,withItalian} from '../lib/locales.mjs';

import { useEffect, useRef, useState } from 'react';
import { cameraLayout } from '../lib/scene-camera.mjs';
// The world scrolls; dialogue and controls belong to the screen, not the world.
export function useSceneCamera(kind) {
    const viewport = useRef(null), [overview, setOverview] = useState(false), [frame, setFrame] = useState(() => cameraLayout({ width: 640, height: 420, kind })), [portrait, setPortrait] = useState(false), gesture = useRef(null);
    const projection = useRef(frame);
    projection.current = frame;
    useEffect(() => {
        const el = viewport.current;
        let first = true;
        const resize = () => {
            const width = el.clientWidth, height = el.clientHeight;
            if (!width || !height)
                return;
            const old = projection.current, ratio = first ? 0.5 : (el.scrollLeft + width / 2) / old.worldWidth;
            // Desktop arrival frames the complete shop; phone exploration keeps its camera.
            const fitStreet = kind === 'street' && window.matchMedia('(min-width:761px)').matches;
            const desktop = window.matchMedia('(min-width:761px)').matches;
            const next = cameraLayout({ width, height, kind, overview: overview || fitStreet, desktop });
            projection.current = next;
            setFrame(next);
            setPortrait(width / height < 1.15 || next.worldWidth > width + 2);
            requestAnimationFrame(() => { el.scrollLeft = Math.max(0, Math.min(next.worldWidth - width, ratio * next.worldWidth - width / 2)); });
            first = false;
        };
        const observer = new ResizeObserver(resize);
        observer.observe(el);
        resize();
        return () => observer.disconnect();
    }, [kind, overview]);
    const pan = direction => viewport.current.scrollBy({ left: direction * viewport.current.clientWidth * .65, behavior: 'smooth' });
    const onPointerDown = e => { gesture.current = null; if (e.button !== 0 || e.pointerType === 'touch')
        return; gesture.current = { x: e.clientX, start: viewport.current.scrollLeft, moved: false }; };
    const onPointerMove = e => {
        const g = gesture.current;
        if (!g || !e.buttons)
            return;
        if (Math.abs(e.clientX - g.x) > 6) {
            g.moved = true;
            viewport.current.setPointerCapture(e.pointerId);
        }
        if (g.moved) {
            e.preventDefault();
            viewport.current.scrollLeft = g.start + g.x - e.clientX;
        }
    };
    const onPointerUp = e => { if (viewport.current.hasPointerCapture(e.pointerId))
        viewport.current.releasePointerCapture(e.pointerId); setTimeout(() => { gesture.current = null; }, 0); };
    return { viewport, frame, projection, portrait, overview, toggle: () => setOverview(v => !v), pan,
        canvasStyle: { position: 'absolute', left: frame.x, top: frame.y, width: 640 * frame.scale, height: 420 * frame.scale },
        worldStyle: { width: frame.worldWidth, height: frame.worldHeight },
        handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: () => { gesture.current = null; },
            onClickCapture: e => { if (gesture.current?.moved) {
                e.preventDefault();
                e.stopPropagation();
                gesture.current = null;
            } },
            onFocusCapture: e => { if (e.target.matches('.hotspot:focus-visible,.noticeboard-target:focus-visible')) {
                const b = e.target;
                viewport.current.scrollLeft = Math.max(0, b.offsetLeft - viewport.current.clientWidth / 2);
            } },
            onKeyDown: e => { if (e.target !== viewport.current)
                return; if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
                e.preventDefault();
                if (e.key === 'Home')
                    viewport.current.scrollLeft = 0;
                else if (e.key === 'End')
                    viewport.current.scrollLeft = frame.worldWidth;
                else
                    pan(e.key === 'ArrowRight' ? 1 : -1);
            } }
        }
    };
}
export function CameraTools({ camera, lang = 'en', kind = 'room' }) {
    const zh = lang === 'zh', panning = camera.frame.worldWidth > (camera.viewport.current?.clientWidth || 640) + 2;
    if (!camera.portrait)
        return null;
    return <div className="camera-tools" aria-label={ui(lang, 'Scene camera', '场景镜头')}>
  <button className="camera-fit" aria-pressed={camera.overview} onClick={camera.toggle}><span aria-hidden="true">{camera.overview ? '⊕' : '⊞'}</span>{camera.overview ? (ui(lang, 'Closer look', '看近一点')) : (ui(lang, kind === 'room' ? 'Whole café' : 'Full view', '查看全景'))}</button>
  {panning && <div className="camera-pan-controls"><button onClick={() => camera.pan(-1)} aria-label={ui(lang, 'Look left', '向左看')}>←</button><span>{ui(lang, 'Drag to explore', '左右拖动探索')}</span><button onClick={() => camera.pan(1)} aria-label={ui(lang, 'Look right', '向右看')}>→</button></div>}
 </div>;
}
