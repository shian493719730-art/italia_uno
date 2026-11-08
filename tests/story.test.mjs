import assert from 'node:assert/strict';
import { initialCustomer, reduceCustomer as r, customerReason, normaliseCustomer } from '../lib/customer-state.mjs';
import { STORY_ACTIONS, TOTAL_BITES, QUIZZES, journeyStamps, storyDone, storySkipped, canSkip, postcardReady, initialStory, NAME_LIMIT, NOTE_LIMIT } from '../lib/story-journey.mjs';
import { initial, reduce } from '../lib/game-state.mjs';
import { STORY_COPY } from '../lib/story-copy.mjs';
import { ITALIAN } from '../lib/locales.mjs';
import { STORY_PATH, playStory } from './story-play.mjs';

const AT = '2026-11-08T18:00:00.000Z';
const eating = () => [{ type: 'YES' }, { type: 'ORDER' }, { type: 'ADD', id: 'italia' }, { type: 'DONE' }].reduce(r, initialCustomer());
const roundTrip = c => normaliseCustomer(JSON.parse(JSON.stringify(c)));
const blocked = (c, a, why) => { assert.equal(r(c, a), c, `${a.type} should be blocked`); if (why) assert.equal(customerReason(c, a), why); };

// The story only runs during the meal.
let c = [{ type: 'YES' }, { type: 'ORDER' }, { type: 'ADD', id: 'italia' }].reduce(r, initialCustomer());
blocked(c, { type: 'STORY_START' }, 'not-eating');
c = eating();
assert.equal(c.chapter, 0); assert.equal(c.bites, 0);

// Chapter order: nothing but STORY_START works before the story starts.
for (const a of STORY_PATH.slice(1)) blocked(c, a);
blocked(c, { type: 'STORY_SKIP' }, 'finish-chapter-one');
blocked(c, { type: 'CHECKOUT', at: AT }, 'still-eating');
c = r(c, { type: 'STORY_START' }); assert.equal(c.chapter, 1);
blocked(c, { type: 'STORY_START' }, 'already-started');

// Chapter 1: the quiz must be right before the activity; wrong answers can be retried.
blocked(c, { type: 'PACK_TOGGLE', id: 'scarf' }, 'not-packing');
blocked(c, { type: 'CHAPTER_COMPLETE' }, 'quiz-first');
for (const wrong of ['milan', 'rome', 'soho', 'napoli', undefined]) blocked(c, { type: 'QUIZ_ANSWER', answer: wrong }, 'wrong-answer');
blocked(c, { type: 'SERVE_MATCH', item: 'espresso' }, 'not-serving');
blocked(c, { type: 'FIND_ITEM', id: 'scarf' }, 'not-searching');
blocked(c, { type: 'POSTCARD_SET', to: 'mum' }, 'not-finale');
c = r(c, { type: 'QUIZ_ANSWER', answer: 'bari' }); assert.deepEqual(c.quiz, [true, false, false]);
blocked(c, { type: 'QUIZ_ANSWER', answer: 'bari' }, 'already-answered');

// Pack the suitcase: exactly three known items.
blocked(c, { type: 'PACK_CONFIRM' }, 'pack-three');
for (const id of ['invented', '__proto__', 'constructor']) blocked(c, { type: 'PACK_TOGGLE', id }, 'unknown-item');
c = ['coffee-pot', 'scarf', 'umbrella'].reduce((s, id) => r(s, { type: 'PACK_TOGGLE', id }), c);
blocked(c, { type: 'PACK_TOGGLE', id: 'photo' }, 'suitcase-full');
c = r(c, { type: 'PACK_TOGGLE', id: 'umbrella' }); assert.deepEqual(c.packed, ['coffee-pot', 'scarf']);
blocked(c, { type: 'PACK_CONFIRM' }, 'pack-three');
blocked(c, { type: 'CHAPTER_COMPLETE' }, 'activity-first');
c = r(c, { type: 'PACK_TOGGLE', id: 'photo' }); c = r(c, { type: 'PACK_CONFIRM' }); assert(c.packDone);
blocked(c, { type: 'PACK_TOGGLE', id: 'photo' }, 'already-packed');
blocked(c, { type: 'STORY_SKIP' }, 'finish-chapter-one');
c = r(c, { type: 'CHAPTER_COMPLETE' }); assert.equal(c.chapter, 2); assert.equal(c.bites, 1);
blocked(c, { type: 'CHECKOUT', at: AT }, 'still-eating');
assert(canSkip(c));

// Chapter 2: serve the queue in order; a wrong item changes nothing.
blocked(c, { type: 'SERVE_MATCH', item: 'espresso' }, 'not-serving');
c = r(c, { type: 'QUIZ_ANSWER', answer: 'soho' });
blocked(c, { type: 'SERVE_MATCH', item: 'cappuccino' }, 'wrong-order');
blocked(c, { type: 'SERVE_MATCH', item: 'tea' }, 'wrong-order');
for (const item of ['espresso', 'cappuccino', 'panino']) c = r(c, { type: 'SERVE_MATCH', item });
assert.deepEqual(c.served, ['espresso', 'cappuccino', 'panino']);
blocked(c, { type: 'SERVE_MATCH', item: 'espresso' }, 'all-served');
c = r(c, { type: 'CHAPTER_COMPLETE' }); assert.equal(c.chapter, 3); assert.equal(c.bites, 2);

// Chapter 3: find all five hidden things, each once.
c = r(c, { type: 'QUIZ_ANSWER', answer: 'napoli' });
blocked(c, { type: 'FIND_ITEM', id: 'trophy' }, 'unknown-item');
c = r(c, { type: 'FIND_ITEM', id: 'flag' });
blocked(c, { type: 'FIND_ITEM', id: 'flag' }, 'already-found');
blocked(c, { type: 'CHAPTER_COMPLETE' }, 'activity-first');
for (const id of ['scarf', 'ball', 'cup', 'panino']) c = r(c, { type: 'FIND_ITEM', id });
c = r(c, { type: 'CHAPTER_COMPLETE' }); assert.equal(c.chapter, 4); assert.equal(c.bites, 3);

// Finale: a postcard needs someone, a sticker and a note; text is cleaned and limited.
blocked(c, { type: 'CHAPTER_COMPLETE' }, 'activity-first');
c = r(c, { type: 'POSTCARD_SET', to: 'custom', note: 'Hi' }); assert(!postcardReady(c.postcard), 'custom needs a name');
c = r(c, { type: 'POSTCARD_SET', name: 'Nonna\u0000 Rosa' + 'x'.repeat(40) }); assert.equal(c.postcard.name, ('Nonna Rosa' + 'x'.repeat(40)).slice(0, NAME_LIMIT));
c = r(c, { type: 'POSTCARD_SET', note: 'y'.repeat(500) }); assert.equal(c.postcard.note.length, NOTE_LIMIT);
c = r(c, { type: 'POSTCARD_SET', to: 'stranger', sticker: 'skull' }); assert.equal(c.postcard.to, 'custom'); assert.equal(c.postcard.sticker, 'heart');
c = r(c, { type: 'POSTCARD_SET', note: '   ' }); blocked(c, { type: 'CHAPTER_COMPLETE' }, 'activity-first');
c = r(c, { type: 'POSTCARD_SET', to: 'friend', sticker: 'football', note: 'Dear best friend, let’s go to Italia Uno together.' });
c = r(c, { type: 'CHAPTER_COMPLETE' });
assert.equal(c.chapter, 5); assert.equal(c.bites, TOTAL_BITES); assert(c.storyRead); assert(storyDone(c)); assert(!storySkipped(c));
assert.deepEqual(journeyStamps(c), [1, 2, 3]);
for (const type of STORY_ACTIONS) blocked(c, { type, answer: 'bari', id: 'scarf', item: 'espresso', to: 'mum' }, 'story-done');
c = r(c, { type: 'CHECKOUT', at: AT }); assert.equal(c.phase, 'checkout');

// Bites only ever go 0 → 1 → 2 → 3 → 4, one per finished chapter.
let s = eating(); const bites = [s.bites];
for (const a of STORY_PATH) { s = r(s, a); if (bites.at(-1) !== s.bites) bites.push(s.bites); }
assert.deepEqual(bites, [0, 1, 2, 3, 4]);

// Skip: only after chapter 1, keeps stamps already earned, empties the plate and unlocks checkout.
s = eating();
blocked(s, { type: 'STORY_SKIP' }, 'finish-chapter-one');
s = playStory(s, r, STORY_PATH.slice(0, 1)); blocked(s, { type: 'STORY_SKIP' }, 'finish-chapter-one');
for (const upTo of [7, 12, 19]) {
  let k = playStory(eating(), r, STORY_PATH.slice(0, upTo));
  const chapter = k.chapter; k = r(k, { type: 'STORY_SKIP' });
  assert.equal(k.bites, TOTAL_BITES); assert(k.storyRead); assert(storySkipped(k)); assert.equal(k.chapter, chapter);
  assert.deepEqual(journeyStamps(k), [1, 2, 3].filter(n => n < chapter));
  blocked(k, { type: 'STORY_SKIP' }, 'story-done');
  assert.equal(r(k, { type: 'CHECKOUT', at: AT }).phase, 'checkout');
  assert.deepEqual(roundTrip(k), k);
}

// Saved progress: every step of the story reloads exactly.
s = eating();
for (const a of STORY_PATH) { s = r(s, a); assert.deepEqual(roundTrip(s), s, `round trip after ${a.type}`); }
for (const phase of ['checkout', 'goodbye', 'complete']) { let k = r(s, { type: 'CHECKOUT', at: AT }); if (phase !== 'checkout') k = r(k, { type: 'RECEIPT_DONE' }); if (phase === 'complete') k = r(k, { type: 'OK' }); assert.equal(k.phase, phase); assert.deepEqual(roundTrip(k), k); }

// Tampered or broken saves restart the story instead of breaking the game.
const story = playStory(eating(), r, STORY_PATH.slice(0, 12));
const fresh = { ...story, ...initialStory() };
for (const bad of [{ chapter: 3, packed: [] }, { chapter: 4, found: ['scarf'] }, { bites: 3 }, { chapter: 9 }, { quiz: [true, false, false] },{ served: ['panino'], chapter: 3 }, { packDone: true, packed: ['scarf'] }]) {
  assert.deepEqual(normaliseCustomer({ ...story, ...bad }), fresh, 'reset for ' + JSON.stringify(bad));
}
const odd = normaliseCustomer({ ...story, packed: ['coffee-pot', 'coffee-pot', 'nope', 'scarf', 'photo'], postcard: 'nonsense' });
assert.deepEqual(odd, story, 'duplicates and junk are cleaned without losing progress');
// A story can never reach the receipt with food left on the plate.
assert.equal(normaliseCustomer({ ...story, phase: 'checkout', checkoutAt: AT }).phase, 'eating');

// Old saves (version 1, five-second meal).
const v1 = { version: 1, phase: 'eating', cart: { italia: 1 }, eatenSeconds: 3, storyRead: false, checkoutAt: null };
assert.deepEqual(normaliseCustomer(v1), { ...initialCustomer(), phase: 'eating', cart: { italia: 1 } });
const v1done = normaliseCustomer({ ...v1, phase: 'checkout', eatenSeconds: 5, storyRead: true, checkoutAt: AT });
assert.equal(v1done.phase, 'checkout'); assert.equal(v1done.bites, TOTAL_BITES); assert.deepEqual(journeyStamps(v1done), []); assert.equal(v1done.version, 2);
assert.equal(normaliseCustomer({ ...v1, phase: 'complete', eatenSeconds: 2, checkoutAt: AT }).phase, 'eating');
assert.deepEqual(roundTrip(v1done), v1done);
for (const junk of [null, 'x', { version: 3, phase: 'eating' }, { version: 2, phase: 'flying' }]) assert.deepEqual(normaliseCustomer(junk), initialCustomer());

// Reset clears the story; story actions only work inside the café.
assert.deepEqual(r(s, { type: 'RESET' }), initialCustomer());
let visit = reduce(initial(), { type: 'ENTER' });
for (const action of [{ type: 'YES' }, { type: 'ORDER' }, { type: 'ADD', id: 'italia' }, { type: 'DONE' }, { type: 'STORY_START' }]) visit = reduce(visit, { type: 'CUSTOMER', action });
assert.equal(visit.customer.chapter, 1);
const outside = reduce(visit, { type: 'OUTSIDE' });
assert.equal(reduce(outside, { type: 'CUSTOMER', action: { type: 'QUIZ_ANSWER', answer: 'bari' } }), outside);
assert.deepEqual(reduce(visit, { type: 'RESET' }).customer, initialCustomer());

// Copy: every quiz option has a label, and every English story string has an Italian entry.
for (const lang of ['en', 'it', 'zh']) for (const q of QUIZZES) for (const id of q.options) assert(STORY_COPY[lang].answers[id], `${lang} label for ${id}`);
const strings = new Set(); const walk = v => typeof v === 'string' ? strings.add(v) : Array.isArray(v) ? v.forEach(walk) : v && typeof v === 'object' ? Object.values(v).forEach(walk) : 0;
walk(STORY_COPY.en);
assert.deepEqual([...strings].filter(text => !Object.hasOwn(ITALIAN, text)), [], 'Italian entries missing');
const zhKeys = JSON.stringify(Object.keys(STORY_COPY.zh).sort()), enKeys = JSON.stringify(Object.keys(STORY_COPY.en).sort());
assert.equal(zhKeys, enKeys, 'Chinese copy has the same keys as English');

console.log(`Story journey passed: strict chapter order, right-answer quizzes, exactly ${3} packed, ordered serving, five finds, bites 0→4, checkout gate, skip after chapter 1, saved progress, tampered and version-1 saves, reset, and ${strings.size} Italian story strings.`);
