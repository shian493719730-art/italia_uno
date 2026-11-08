// "The swinging postcard": an optional hide-and-seek during the meal at My table.
// A postcard swings on the noticeboard with a "Click me!" bubble; clicking it opens three imagined rooms
// (Bari, Soho 1987, Charlotte Street 1996). Find five hidden things in each, then pin the postcard back.
// Pure data and rules only. Text: lib/postcard-copy.mjs. Drawing and UI: app/postcard-game.tsx.

export const SEEK_ROOMS = [
  { id: 'bari', items: ['moka', 'scarf', 'photo', 'recipes', 'umbrella'], decoys: ['plant', 'lamp', 'clock'] },
  { id: 'soho', items: ['key', 'sign', 'beans', 'espresso', 'sugar'], decoys: ['chair', 'broom', 'radio'] },
  { id: 'charlotte', items: ['ball', 'flag', 'bluescarf', 'coffeecup', 'panino'], decoys: ['tv', 'hat', 'menu'] },
];
// room: 0 = postcard not picked up, 1–3 = searching that room, 4 = all rooms done (postcard turned over).
export const POSTCARD_ROOM = SEEK_ROOMS.length + 1;
export const TOTAL_FINDS = SEEK_ROOMS.reduce((n, r) => n + r.items.length, 0);
export const SEEK_ACTIONS = ['SEEK_START', 'SEEK_FIND', 'SEEK_NEXT', 'SEEK_PIN'];

export const initialPostcard = () => ({ room: 0, found: [], pinned: false });
export const currentRoom = p => SEEK_ROOMS[p.room - 1] || null;
export const roomDone = p => !!currentRoom(p) && currentRoom(p).items.every(id => p.found.includes(id));

// '' when allowed, otherwise a short reason. The game only runs while eating, and stops once pinned.
export function seekReason(c, a) {
  const p = c.postcard;
  if (c.phase !== 'eating') return 'not-eating';
  if (p.pinned) return 'game-done';
  switch (a.type) {
    case 'SEEK_START': return p.room !== 0 ? 'already-started' : '';
    case 'SEEK_FIND': return !currentRoom(p) ? 'no-room' : !currentRoom(p).items.includes(a.id) ? 'not-here' : p.found.includes(a.id) ? 'already-found' : '';
    case 'SEEK_NEXT': return !currentRoom(p) ? 'no-room' : !roomDone(p) ? 'keep-looking' : '';
    case 'SEEK_PIN': return p.room !== POSTCARD_ROOM ? 'not-finished' : '';
    default: return 'unknown-action';
  }
}

export function reduceSeek(c, a) {
  if (seekReason(c, a)) return c;
  const p = c.postcard;
  switch (a.type) {
    case 'SEEK_START': return { ...c, postcard: { ...p, room: 1 } };
    case 'SEEK_FIND': return { ...c, postcard: { ...p, found: [...p.found, a.id] } };
    case 'SEEK_NEXT': return { ...c, postcard: { ...p, room: p.room + 1, found: [] } };
    case 'SEEK_PIN': return { ...c, postcard: { ...p, pinned: true } };
    default: return c;
  }
}

// Saved games are cleaned: found items must belong to the current room; pinned only after the last room.
export function normalisePostcard(value) {
  if (!value || typeof value !== 'object') return initialPostcard();
  const room = Number.isInteger(value.room) && value.room >= 0 && value.room <= POSTCARD_ROOM ? value.room : 0;
  const items = SEEK_ROOMS[room - 1]?.items || [];
  const found = Array.isArray(value.found) ? [...new Set(value.found.filter(id => items.includes(id)))] : [];
  return { room, found, pinned: room === POSTCARD_ROOM && value.pinned === true };
}
