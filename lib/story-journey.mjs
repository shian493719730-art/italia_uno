// "The Postcard That Fell": the guided story at My table (docs/STORY_JOURNEY_SPEC.md).
// Pure data and rules only. Player-facing text lives in story-copy.mjs; the UI lives in app/story-journey.tsx.
// Story progress is stored on the customer state, so it is saved, normalised and reset with the visit.

// chapter: 0 opening, 1 Bari, 2 Soho, 3 Charlotte Street, 4 finale, 5 complete.
export const FINAL_CHAPTER = 4, STORY_COMPLETE = 5, TOTAL_BITES = 4;
// The right answer is never the first option.
export const QUIZZES = [
  { options: ['milan', 'bari', 'rome'], answer: 'bari' },
  { options: ['charlotte', 'naples', 'soho'], answer: 'soho' },
  { options: ['juventus', 'napoli', 'arsenal'], answer: 'napoli' },
];
export const SUITCASE_ITEMS = ['coffee-pot', 'scarf', 'photo', 'recipes', 'umbrella', 'sunglasses'];
export const PACK_SIZE = 3;
export const ORDERS = ['espresso', 'cappuccino', 'panino']; // served in queue order
export const HIDDEN_ITEMS = ['scarf', 'ball', 'cup', 'flag', 'panino'];
export const BRING_OPTIONS = ['mum', 'dad', 'sibling', 'partner', 'friend', 'flatmate', 'custom'];
export const STICKERS = ['panino', 'espresso', 'football', 'heart'];
export const NAME_LIMIT = 24, NOTE_LIMIT = 160;
export const STORY_ACTIONS = ['STORY_START', 'QUIZ_ANSWER', 'PACK_TOGGLE', 'PACK_CONFIRM', 'SERVE_MATCH', 'FIND_ITEM', 'POSTCARD_SET', 'CHAPTER_COMPLETE', 'STORY_SKIP'];

const cleanLine = (value, max) => Array.from(String(value ?? '').replace(/[\u0000-\u001f\u007f-\u009f]/g, '')).slice(0, max).join('');
const cleanNote = value => Array.from(String(value ?? '').replace(/\r\n?/g, '\n').replace(/[\u0000-\u0009\u000b-\u001f\u007f-\u009f]/g, '')).slice(0, NOTE_LIMIT).join('');
const emptyPostcard = () => ({ to: '', name: '', sticker: 'heart', note: '' });

export const initialStory = () => ({ chapter: 0, bites: 0, quiz: [false, false, false], packed: [], packDone: false, served: [], found: [], postcard: emptyPostcard() });

// The plate is empty when the story is complete or skipped; checkout needs an empty plate.
export const storyDone = c => c.bites === TOTAL_BITES;
export const storySkipped = c => storyDone(c) && c.chapter < STORY_COMPLETE;
export const postcardReady = p => BRING_OPTIONS.includes(p.to) && (p.to !== 'custom' || !!p.name.trim()) && STICKERS.includes(p.sticker) && !!p.note.trim();
export function activityDone(c, chapter = c.chapter) {
  if (chapter === 1) return c.packDone;
  if (chapter === 2) return c.served.length === ORDERS.length;
  if (chapter === 3) return HIDDEN_ITEMS.every(id => c.found.includes(id));
  if (chapter === FINAL_CHAPTER) return postcardReady(c.postcard);
  return false;
}
// Chapters 1–3 finished, for journey stamps (a skipped story keeps the ones already earned).
export const journeyStamps = c => [1, 2, 3].filter(n => c.chapter > n);
export const canSkip = c => c.phase === 'eating' && !storyDone(c) && c.chapter >= 2 && c.chapter <= FINAL_CHAPTER;

// Returns '' when the action is allowed, otherwise a short reason (same style as customerReason).
export function storyReason(c, a) {
  if (c.phase !== 'eating') return 'not-eating';
  if (storyDone(c)) return 'story-done';
  const ch = c.chapter, quizDone = ch >= 1 && ch <= 3 && c.quiz[ch - 1];
  switch (a.type) {
    case 'STORY_START': return ch !== 0 ? 'already-started' : '';
    case 'QUIZ_ANSWER': return ch < 1 || ch > 3 ? 'no-quiz' : quizDone ? 'already-answered' : a.answer !== QUIZZES[ch - 1].answer ? 'wrong-answer' : '';
    case 'PACK_TOGGLE': return ch !== 1 || !quizDone ? 'not-packing' : c.packDone ? 'already-packed' : !SUITCASE_ITEMS.includes(a.id) ? 'unknown-item' : !c.packed.includes(a.id) && c.packed.length >= PACK_SIZE ? 'suitcase-full' : '';
    case 'PACK_CONFIRM': return ch !== 1 || !quizDone ? 'not-packing' : c.packDone ? 'already-packed' : c.packed.length !== PACK_SIZE ? 'pack-three' : '';
    case 'SERVE_MATCH': return ch !== 2 || !quizDone ? 'not-serving' : c.served.length >= ORDERS.length ? 'all-served' : a.item !== ORDERS[c.served.length] ? 'wrong-order' : '';
    case 'FIND_ITEM': return ch !== 3 || !quizDone ? 'not-searching' : !HIDDEN_ITEMS.includes(a.id) ? 'unknown-item' : c.found.includes(a.id) ? 'already-found' : '';
    case 'POSTCARD_SET': return ch !== FINAL_CHAPTER ? 'not-finale' : '';
    case 'CHAPTER_COMPLETE': return ch < 1 || ch > FINAL_CHAPTER ? 'no-chapter' : ch <= 3 && !quizDone ? 'quiz-first' : !activityDone(c) ? 'activity-first' : '';
    case 'STORY_SKIP': return ch < 2 ? 'finish-chapter-one' : '';
    default: return 'unknown-action';
  }
}

const setPostcard = (p, a) => ({
  to: BRING_OPTIONS.includes(a.to) ? a.to : p.to,
  name: 'name' in a ? cleanLine(a.name, NAME_LIMIT) : p.name,
  sticker: STICKERS.includes(a.sticker) ? a.sticker : p.sticker,
  note: 'note' in a ? cleanNote(a.note) : p.note,
});

export function reduceStory(c, a) {
  if (storyReason(c, a)) return c;
  switch (a.type) {
    case 'STORY_START': return { ...c, chapter: 1 };
    case 'QUIZ_ANSWER': { const quiz = [...c.quiz]; quiz[c.chapter - 1] = true; return { ...c, quiz }; }
    case 'PACK_TOGGLE': return { ...c, packed: c.packed.includes(a.id) ? c.packed.filter(id => id !== a.id) : [...c.packed, a.id] };
    case 'PACK_CONFIRM': return { ...c, packDone: true };
    case 'SERVE_MATCH': return { ...c, served: [...c.served, a.item] };
    case 'FIND_ITEM': return { ...c, found: [...c.found, a.id] };
    case 'POSTCARD_SET': return { ...c, postcard: setPostcard(c.postcard, a) };
    // Each finished chapter is one bite; the finale empties the plate.
    case 'CHAPTER_COMPLETE': return c.chapter === FINAL_CHAPTER ? { ...c, chapter: STORY_COMPLETE, bites: TOTAL_BITES, storyRead: true } : { ...c, chapter: c.chapter + 1, bites: c.chapter };
    case 'STORY_SKIP': return { ...c, bites: TOTAL_BITES, storyRead: true };
    default: return c;
  }
}

// A saved story must look like one the reducer could have produced; anything else starts the story again.
const started = [s => s.packed.length > 0 || s.packDone, s => s.served.length > 0, s => s.found.length > 0, s => !!(s.postcard.to || s.postcard.name || s.postcard.note)];
export function consistentStory(s) {
  for (let n = 1; n <= FINAL_CHAPTER; n++) {
    const quizDone = n > 3 || s.quiz[n - 1];
    if (s.chapter > n && !(quizDone && activityDone(s, n))) return false;
    if (s.chapter < n && ((n <= 3 && s.quiz[n - 1]) || started[n - 1](s))) return false;
    if (s.chapter === n && !quizDone && started[n - 1](s)) return false;
  }
  if (s.packDone && s.packed.length !== PACK_SIZE) return false;
  if (s.chapter === STORY_COMPLETE) return s.bites === TOTAL_BITES;
  return s.bites === TOTAL_BITES || s.bites === Math.max(0, s.chapter - 1);
}

const list = (value, allowed, max) => Array.isArray(value) ? [...new Set(value.filter(id => allowed.includes(id)))].slice(0, max) : [];
const prefix = (value, order) => { const out = []; if (Array.isArray(value)) for (const id of order) { if (value[out.length] !== id) break; out.push(id); } return out; };
export function normaliseStory(value) {
  if (!value || typeof value !== 'object') return initialStory();
  const p = value.postcard && typeof value.postcard === 'object' ? value.postcard : {};
  const s = {
    chapter: Number.isInteger(value.chapter) && value.chapter >= 0 && value.chapter <= STORY_COMPLETE ? value.chapter : 0,
    bites: Number.isInteger(value.bites) && value.bites >= 0 && value.bites <= TOTAL_BITES ? value.bites : 0,
    quiz: [0, 1, 2].map(i => Array.isArray(value.quiz) && value.quiz[i] === true),
    packed: list(value.packed, SUITCASE_ITEMS, PACK_SIZE),
    packDone: value.packDone === true,
    served: prefix(value.served, ORDERS),
    found: list(value.found, HIDDEN_ITEMS, HIDDEN_ITEMS.length),
    postcard: { to: BRING_OPTIONS.includes(p.to) ? p.to : '', name: cleanLine(p.name, NAME_LIMIT), sticker: STICKERS.includes(p.sticker) ? p.sticker : 'heart', note: cleanNote(p.note) },
  };
  return consistentStory(s) ? s : initialStory();
}
