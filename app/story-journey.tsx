// @ts-nocheck
'use client';
// "The Postcard That Fell": the guided story shown at My table while the player eats (docs/STORY_JOURNEY_SPEC.md).
// Each chapter: story card (a real fact) → quick question → activity → reward (stamp + one bite).
// Phase 1: activities are plain, keyboard-friendly button versions; artwork and the journey map come later.
import { useEffect, useRef, useState } from 'react';
import HandArrow from './hand-arrow';
import PixelHost from './pixel-host';
import { STORY_COPY, STORY_SOURCES, FACT_SOURCES, fill } from '../lib/story-copy.mjs';
import { QUIZZES, SUITCASE_ITEMS, PACK_SIZE, ORDERS, HIDDEN_ITEMS, BRING_OPTIONS, TOTAL_BITES, FINAL_CHAPTER, storyDone, activityDone, canSkip, postcardReady } from '../lib/story-journey.mjs';

const COUNTER = ['panino', 'espresso', 'cappuccino']; // counter order differs from the queue, so it is a real match

function FactCard({ t, index }) {
  return <article className="story-card">
    <p className="story-card-label">{t.reporting}</p>
    <p className="story-card-fact">{t.facts[index]}</p>
    <div className="story-card-sources"><span>{t.sources}</span>{FACT_SOURCES[index].map(i => <a key={i} href={STORY_SOURCES[i].href} target="_blank" rel="noopener noreferrer">{STORY_SOURCES[i].label} <HandArrow/></a>)}</div>
  </article>;
}

export default function StoryJourney({ customer: c, lang, onAction, onCheckout, onPause, onSound }) {
  const t = STORY_COPY[lang] || STORY_COPY.en;
  const [feedback, setFeedback] = useState(''), [tried, setTried] = useState([]);
  const heading = useRef(null), firstStep = useRef(true);
  const ch = c.chapter, done = storyDone(c), p = c.postcard;
  const step = done ? 'done' : ch === 0 ? 'opening' : ch === FINAL_CHAPTER ? 'finale' : !c.quiz[ch - 1] ? 'quiz' : !activityDone(c) ? 'activity' : 'reward';
  const stepKey = step + ch;
  // Move keyboard and screen-reader focus to the new host line whenever the story moves on (not on first load).
  useEffect(() => {
    setFeedback(''); setTried([]);
    if (firstStep.current) { firstStep.current = false; return; }
    heading.current?.focus();
  }, [stepKey]);
  const say = (text, sound = 'click') => { setFeedback(text); onSound?.(sound); };
  const act = (action, sound = 'click') => { onAction(action); onSound?.(sound); };

  const answer = id => {
    if (id !== QUIZZES[ch - 1].answer) { setTried(list => [...list, id]); say(t.wrong); return; }
    act({ type: 'QUIZ_ANSWER', answer: id }, 'stamp');
  };
  const togglePack = id => {
    if (!c.packed.includes(id) && c.packed.length >= PACK_SIZE) { say(t.suitcaseFull); return; }
    setFeedback(''); act({ type: 'PACK_TOGGLE', id }, 'select');
  };
  const serve = item => {
    if (item !== ORDERS[c.served.length]) { say(t.serveWrong); return; }
    setFeedback(''); act({ type: 'SERVE_MATCH', item }, 'serve');
  };
  const find = id => {
    if (c.found.includes(id)) return;
    act({ type: 'FIND_ITEM', id }, c.found.length === HIDDEN_ITEMS.length - 1 ? 'win' : 'select');
  };
  const noteFor = name => name ? fill(t.noteDefault, name) : '';
  const chooseWho = id => act({ type: 'POSTCARD_SET', to: id, note: noteFor(id === 'custom' ? p.name.trim() : t.dear[id]) }, 'select');
  const typeName = value => onAction({ type: 'POSTCARD_SET', name: value, note: noteFor(value.trim()) });

  // What the host says at each step.
  const host = step === 'opening' ? [t.opening[0], t.opening[1], t.opening[2]]
    : step === 'quiz' ? [t.questions[ch - 1]]
    : step === 'activity' ? [t.right[ch - 1], t.tasks[ch - 1]]
    : step === 'reward' ? [t.rewards[ch - 1], ch === 2 ? t.allServed : ch === 3 ? t.goal : '']
    : step === 'finale' ? [t.finale[0], t.finale[1]]
    : [t.clean];
  const [title, ...lines] = host;

  return <section className="story-panel" id="story-panel" aria-label={t.panel}>
    <header className="story-head">
      <p className="micro">{t.eyebrow}{ch >= 1 && ch <= FINAL_CHAPTER && !done ? ' · ' + fill(t.chapterOf, ch) + ' · ' + t.titles[ch - 1] : ''}</p>
      <ol className="story-steps" aria-label={t.progress}>{t.places.map((place, i) => {
        const n = i + 1, finished = ch > n, current = ch === n && !done;
        return <li key={place} className={finished ? 'finished' : current ? 'current' : ''} aria-current={current ? 'step' : undefined}><span aria-hidden="true">{finished ? '✓' : n}</span>{place}</li>;
      })}</ol>
      <div className="story-plate" role="status"><span className="sr-only">{t.plate}: </span><span className="story-plate-bites" aria-hidden="true">{Array.from({ length: TOTAL_BITES }, (_, i) => <i key={i} className={i < TOTAL_BITES - c.bites ? 'left' : ''}/>)}</span><span>{t.bitesLeft[TOTAL_BITES - c.bites]}</span></div>
    </header>

    <div className="story-host">
      <div className="customer-host-art" aria-hidden="true"><PixelHost/></div>
      <div className="story-host-copy">
        <p className="speaker-label">{t.speaker} · <span>{t.fiction}</span></p>
        <h2 ref={heading} tabIndex={-1}>{title}</h2>
        {lines.filter(Boolean).map(line => <p key={line}>{line}</p>)}
      </div>
    </div>

    <div className="story-body">
      {step === 'opening' && <button className="primary" onClick={() => act({ type: 'STORY_START' }, 'enter')}>{t.start} →</button>}

      {step === 'quiz' && <><FactCard t={t} index={ch - 1}/><div className="story-choices story-quiz" role="group" aria-label={t.questions[ch - 1]}>{QUIZZES[ch - 1].options.map(id => <button key={id} className={tried.includes(id) ? 'tried' : ''} onClick={() => answer(id)}>{t.answers[id]}</button>)}</div></>}

      {step === 'activity' && ch === 1 && <>
        <div className="story-choices" role="group" aria-label={t.suitcaseLabel}>{SUITCASE_ITEMS.map(id => { const on = c.packed.includes(id); return <button key={id} aria-pressed={on} className={on ? 'picked' : ''} onClick={() => togglePack(id)}><span aria-hidden="true">{on ? '✓' : '+'}</span>{t.suitcase[id]}</button>; })}</div>
        <p className="story-count">{fill(t.packedCount, c.packed.length)}</p>
        <button className="primary" disabled={c.packed.length !== PACK_SIZE} onClick={() => act({ type: 'PACK_CONFIRM' }, 'stamp')}>{t.pack} →</button>
      </>}

      {step === 'activity' && ch === 2 && <>
        <ol className="story-queue" aria-label={t.queueLabel}>{ORDERS.map((id, i) => { const served = i < c.served.length, current = i === c.served.length; return <li key={id} className={served ? 'served' : current ? 'current' : ''}><span>{fill(t.customer, i + 1)}</span><b className="story-bubble">{t.orders[id]}</b>{served && <small>✓ {t.servedMark}</small>}</li>; })}</ol>
        <div className="story-choices" role="group" aria-label={t.counter}><p className="story-choices-label">{t.counter}</p>{COUNTER.map(id => <button key={id} onClick={() => serve(id)}>{t.orders[id]}</button>)}</div>
      </>}

      {step === 'activity' && ch === 3 && <>
        <div className="story-choices" role="group" aria-label={t.hiddenLabel}>{HIDDEN_ITEMS.map(id => { const found = c.found.includes(id); return <button key={id} aria-pressed={found} className={found ? 'picked' : ''} onClick={() => find(id)}><span aria-hidden="true">{found ? '✓' : '?'}</span>{t.hidden[id]}</button>; })}</div>
        <p className="story-count">{fill(t.foundCount, c.found.length)}</p>
      </>}

      {step === 'reward' && <button className="primary" onClick={() => act({ type: 'CHAPTER_COMPLETE' }, 'stamp')}>{t.bite} →</button>}

      {step === 'finale' && <>
        <fieldset className="story-bring"><legend>{t.finale[2]}</legend>
          <div className="story-choices">{BRING_OPTIONS.map(id => <button key={id} aria-pressed={p.to === id} className={p.to === id ? 'picked' : ''} onClick={() => chooseWho(id)}>{t.bring[id]}</button>)}</div>
          {p.to === 'custom' && <label className="story-field"><span>{t.nameLabel}</span><input type="text" value={p.name} maxLength={24} autoComplete="off" placeholder={t.namePlaceholder} onChange={e => typeName(e.target.value)}/></label>}
        </fieldset>
        {p.note && <article className="story-postcard-preview" aria-label={t.postcard}><span className="micro">{t.postcard}</span><p>{p.note}</p></article>}
        <button className="primary" disabled={!postcardReady(p)} onClick={() => act({ type: 'CHAPTER_COMPLETE' }, 'stamp')}>{t.pin} →</button>
      </>}

      {step === 'done' && <button className="primary" onClick={onCheckout}>{t.checkout} →</button>}

      <p className="story-feedback" role="status" aria-live="polite">{feedback}</p>
    </div>

    <footer className="story-foot">
      {canSkip(c) && <button className="quiet story-skip" onClick={() => act({ type: 'STORY_SKIP' })}>{t.skip}</button>}
      <button className="quiet" onClick={onPause}>{t.pause}</button>
    </footer>
  </section>;
}
