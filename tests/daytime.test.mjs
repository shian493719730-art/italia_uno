import assert from 'node:assert/strict';
import {phaseFor, PHASES} from '../lib/daytime.mjs';
const at = (h, m = 0) => phaseFor(new Date(2026, 10, 8, h, m));
assert.deepEqual(PHASES, ['dawn', 'day', 'dusk', 'night']);
assert.equal(at(4, 59), 'night'); assert.equal(at(5), 'dawn'); assert.equal(at(7, 59), 'dawn');
assert.equal(at(8), 'day'); assert.equal(at(16, 59), 'day'); assert.equal(at(17), 'dusk');
assert.equal(at(19, 59), 'dusk'); assert.equal(at(20), 'night'); assert.equal(at(0), 'night');
console.log('Daytime passed: dawn 5–8, day 8–17, dusk 17–20, night 20–5.');
