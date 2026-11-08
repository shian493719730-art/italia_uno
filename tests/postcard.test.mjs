import assert from 'node:assert/strict';
import { initialCustomer, reduceCustomer as r, customerReason, normaliseCustomer, EATING_SECONDS } from '../lib/customer-state.mjs';
import { SEEK_ROOMS, POSTCARD_ROOM, TOTAL_FINDS, SEEK_ACTIONS, initialPostcard, roomDone } from '../lib/postcard-game.mjs';
import { initial, reduce } from '../lib/game-state.mjs';
import { makeReceipt } from '../lib/receipt.mjs';
import { POSTCARD_COPY } from '../lib/postcard-copy.mjs';
import { ITALIAN, JAPANESE } from '../lib/locales.mjs';

const AT = '2026-11-08T18:00:00.000Z';
const eating = () => [{ type: 'YES' }, { type: 'ORDER' }, { type: 'ADD', id: 'italia' }, { type: 'DONE' }].reduce(r, initialCustomer());
const roundTrip = c => normaliseCustomer(JSON.parse(JSON.stringify(c)));
const blocked = (c, a, why) => { assert.equal(r(c, a), c, `${a.type} should be blocked`); assert.equal(customerReason(c, a), why); };
const playRoom = (c, n) => SEEK_ROOMS[n - 1].items.reduce((s, id) => r(s, { type: 'SEEK_FIND', id }), c);

// Only during the meal.
let c = [{ type: 'YES' }, { type: 'ORDER' }].reduce(r, initialCustomer());
blocked(c, { type: 'SEEK_START' }, 'not-eating');
c = eating();
assert.deepEqual(c.postcard, initialPostcard());

// The original meal is untouched: the game is optional and checkout still opens after five seconds.
assert.equal(customerReason(c, { type: 'CHECKOUT' }), 'still-eating');
const fed = r(c, { type: 'TICK', seconds: EATING_SECONDS });
assert.equal(r(fed, { type: 'CHECKOUT', at: AT }).phase, 'checkout', 'checkout without playing');

// Nothing works before the postcard is picked up.
blocked(c, { type: 'SEEK_FIND', id: 'moka' }, 'no-room');
blocked(c, { type: 'SEEK_NEXT' }, 'no-room');
blocked(c, { type: 'SEEK_PIN' }, 'not-finished');
c = r(c, { type: 'SEEK_START' }); assert.equal(c.postcard.room, 1);
blocked(c, { type: 'SEEK_START' }, 'already-started');

// Each room: only its own five things count, each once; the next room opens when all five are found.
for (let n = 1; n <= SEEK_ROOMS.length; n++) {
  const { items, decoys } = SEEK_ROOMS[n - 1];
  for (const id of [...decoys, 'invented', '__proto__', ...SEEK_ROOMS.filter((_, i) => i !== n - 1).flatMap(room => room.items).filter(id => !items.includes(id))]) blocked(c, { type: 'SEEK_FIND', id }, 'not-here');
  blocked(c, { type: 'SEEK_NEXT' }, 'keep-looking');
  c = r(c, { type: 'SEEK_FIND', id: items[2] });
  blocked(c, { type: 'SEEK_FIND', id: items[2] }, 'already-found');
  blocked(c, { type: 'SEEK_NEXT' }, 'keep-looking');
  c = playRoom(c, n); assert(roomDone(c.postcard)); assert.equal(c.postcard.found.length, 5);
  assert.deepEqual(roundTrip(c), c, `save mid-game, room ${n}`);
  c = r(c, { type: 'SEEK_NEXT' }); assert.equal(c.postcard.room, n + 1); assert.deepEqual(c.postcard.found, []);
}
assert.equal(c.postcard.room, POSTCARD_ROOM);
blocked(c, { type: 'SEEK_FIND', id: 'ball' }, 'no-room');
blocked(c, { type: 'SEEK_NEXT' }, 'no-room');
c = r(c, { type: 'SEEK_PIN' }); assert(c.postcard.pinned);
for (const type of SEEK_ACTIONS) blocked(c, { type, id: 'moka' }, 'game-done');
assert.deepEqual(roundTrip(c), c);

// The finished game shows on the receipt; an unfinished one does not.
c = r(r(c, { type: 'TICK', seconds: EATING_SECONDS }), { type: 'CHECKOUT', at: AT });
const rows = makeReceipt({ visit: { ...initial(), customer: c } }).rows;
assert(rows.some(([label, value]) => label === 'Postcard hide-and-seek' && value === `${TOTAL_FINDS}/${TOTAL_FINDS} ✓`));
assert(makeReceipt({ lang: 'it', visit: { ...initial(), customer: c } }).rows.some(([label]) => label === 'Nascondino della cartolina'));
const unfinished = r(r(r(eating(), { type: 'SEEK_START' }), { type: 'TICK', seconds: EATING_SECONDS }), { type: 'CHECKOUT', at: AT });
assert(!makeReceipt({ visit: { ...initial(), customer: unfinished } }).rows.some(([label]) => label === 'Postcard hide-and-seek'));
// After checkout the game is frozen.
blocked(unfinished, { type: 'SEEK_FIND', id: 'moka' }, 'not-eating');

// Saves: junk is cleaned, found items must belong to the current room, pinned only at the end.
const mid = r(r(eating(), { type: 'SEEK_START' }), { type: 'SEEK_FIND', id: 'moka' });
const load = postcard => normaliseCustomer({ ...mid, postcard }).postcard;
assert.deepEqual(load({ room: 1, found: ['moka', 'moka', 'ball', 'nope'], pinned: true }), { room: 1, found: ['moka'], pinned: false });
assert.deepEqual(load({ room: 9, found: ['moka'] }), initialPostcard());
assert.deepEqual(load('nonsense'), initialPostcard());
assert.deepEqual(load({ room: POSTCARD_ROOM, found: ['moka'], pinned: true }), { room: POSTCARD_ROOM, found: [], pinned: true });
assert.deepEqual(normaliseCustomer({ ...mid, phase: 'ordering', postcard: { room: 2 } }).postcard, initialPostcard(), 'no game before the meal');
// Version 1 saves (before the game) load with a fresh postcard.
const v1 = { version: 1, phase: 'eating', cart: { italia: 1 }, eatenSeconds: 3, storyRead: false, checkoutAt: null };
assert.deepEqual(normaliseCustomer(v1), { ...initialCustomer(), phase: 'eating', cart: { italia: 1 }, eatenSeconds: 3 });

// Reset clears the game; game actions only work inside the café.
assert.deepEqual(r(mid, { type: 'RESET' }), initialCustomer());
let visit = reduce(initial(), { type: 'ENTER' });
for (const action of [{ type: 'YES' }, { type: 'ORDER' }, { type: 'ADD', id: 'italia' }, { type: 'DONE' }, { type: 'SEEK_START' }]) visit = reduce(visit, { type: 'CUSTOMER', action });
assert.equal(visit.customer.postcard.room, 1);
const outside = reduce(visit, { type: 'OUTSIDE' });
assert.equal(reduce(outside, { type: 'CUSTOMER', action: { type: 'SEEK_FIND', id: 'moka' } }), outside);

// Text: every object has a name and a line in all three languages, and every English string has Italian.
for (const lang of ['en', 'it', 'zh', 'ja']) {
  const t = POSTCARD_COPY[lang];
  for (const room of SEEK_ROOMS) {
    for (const id of room.items) { assert(t.items[id], `${lang} name ${id}`); assert(t.reactions[id], `${lang} reaction ${id}`); }
    for (const id of room.decoys) { assert(t.decoys[id], `${lang} decoy ${id}`); assert(t.decoyLines[id], `${lang} decoy line ${id}`); }
  }
  assert.equal(t.intros.length, SEEK_ROOMS.length); assert.equal(t.roomDone.length, SEEK_ROOMS.length);
}
const strings = new Set(); const walk = v => typeof v === 'string' ? strings.add(v) : Array.isArray(v) ? v.forEach(walk) : v && typeof v === 'object' ? Object.values(v).forEach(walk) : 0;
walk(POSTCARD_COPY.en);
assert.deepEqual([...strings].filter(text => !Object.hasOwn(ITALIAN, text)), [], 'Italian entries missing');
assert.deepEqual([...strings, 'Postcard hide-and-seek'].filter(text => !Object.hasOwn(JAPANESE, text)), [], 'Japanese entries missing');
assert.equal(JSON.stringify(Object.keys(POSTCARD_COPY.zh).sort()), JSON.stringify(Object.keys(POSTCARD_COPY.en).sort()), 'Chinese has the same keys as English');

console.log(`Postcard hide-and-seek passed: optional (5-second checkout unchanged), ${SEEK_ROOMS.length} rooms × 5 finds in order, decoys and other rooms' items ignored, pin at the end, frozen after checkout, receipt row, saves and version-1 saves, reset, and ${strings.size} strings in Italian and Japanese.`);
