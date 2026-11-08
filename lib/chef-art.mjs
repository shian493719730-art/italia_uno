// Illustrated avatar inspired by the café's owner, drawn like a fine-liner
// doodle: one thin pen line, few marks, a long nose stroke, smiling eyes.
// Kept from the reference: bald crown with short grey sides, big ears, a wide
// grin, reading glasses on a cord and the blue Italia Uno tee.
// Dialogue in the game stays fictional. Same 96 × 128 box and drawChef API;
// feet end at y = 126, so all existing world anchors and counter masks still work.
const INK = '#17307f';
const WHITE = '#fbf8f1';
const TEE = '#3a5fc4';
const TROUSERS = '#ddd2bd';

function rng(seed) {
  let v = seed >>> 0 || 1;
  return () => { v = (Math.imul(v, 1664525) + 1013904223) >>> 0; return v / 4294967296; };
}

function pen(g, seed) {
  const rnd = rng(seed);
  const j = (n = .12) => (rnd() - .5) * 2 * n;
  const W = .72; // a fine-liner
  const path = (pts, close) => {
    const p = pts.map(([x, y]) => [x + j(), y + j()]);
    g.beginPath(); g.moveTo(p[0][0], p[0][1]);
    for (let i = 1; i < p.length - 1; i++) g.quadraticCurveTo(p[i][0], p[i][1], (p[i][0] + p[i + 1][0]) / 2, (p[i][1] + p[i + 1][1]) / 2);
    const l = p[p.length - 1];
    if (close) { g.quadraticCurveTo(l[0], l[1], (l[0] + p[0][0]) / 2, (l[1] + p[0][1]) / 2); g.closePath(); }
    else g.lineTo(l[0], l[1]);
  };
  const shape = (pts, fill = WHITE, w = W) => { path(pts, true); if (fill) { g.fillStyle = fill; g.fill(); } if (w) { g.strokeStyle = INK; g.lineWidth = w; g.stroke(); } };
  const line = (pts, w = W, color = INK) => { path(pts, false); g.strokeStyle = color; g.lineWidth = w; g.stroke(); };
  // A slim arm: an outlined, tapering sleeve of skin.
  const arm = pts => {
    const L = [], R = [];
    pts.forEach((p, i) => {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
      const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1, w = 2.7 - .6 * i / (pts.length - 1);
      L.push([p[0] - dy / len * w, p[1] + dx / len * w]); R.unshift([p[0] + dy / len * w, p[1] - dx / len * w]);
    });
    shape([...L, ...R]);
  };
  return {shape, line, arm, W};
}

// A loose fist with the thumb up. dir = 1 thumb on the left, -1 on the right.
function thumbsUp(d, x, y, dir) {
  d.shape([[x - 3, y - 1.8], [x + 2.6, y - 2.2], [x + 3.4, y + .8], [x + 2.6, y + 3.6], [x - 2.4, y + 3.8], [x - 3.4, y + 1]]);
  d.line([[x - 1.2, y + .3], [x + 2.8, y + .1]], .45); d.line([[x - 1.2, y + 2], [x + 2.6, y + 1.9]], .45);
  const t = x - dir * 1.6;
  d.shape([[t - 1.2, y - 1.8], [t - 1.3, y - 6], [t - .2, y - 7], [t + 1.1, y - 6.2], [t + 1.2, y - 1.9]]);
}

function head(d, frame) {
  const blink = frame % 53 > 50;
  // Ears drawn as open C strokes.
  d.shape([[38.6, 21.2], [35.6, 20.6], [34.8, 24.6], [36.2, 28.6], [38.8, 28.4]]);
  d.line([[37.2, 22.8], [36.6, 24.8], [37.4, 26.6]], .45);
  d.shape([[57.4, 21.2], [60.4, 20.6], [61.2, 24.6], [59.8, 28.6], [57.2, 28.4]]);
  d.line([[58.8, 22.8], [59.4, 24.8], [58.6, 26.6]], .45);
  // A long face, a domed bald crown.
  d.shape([[48, 10.6], [54.6, 12], [58.4, 17], [59, 24], [57.8, 30.6], [53.8, 35.4], [48, 37], [42.2, 35.4], [38.2, 30.6], [37, 24], [37.6, 17], [41.4, 12]]);
  // Grey sides: short quick ticks, like close-cropped hair.
  for (let i = 0; i < 7; i++) {
    const yy = 14.6 + i * 1.05, inset = i < 2 ? 1.4 - i * .5 : 0;
    d.line([[39.4 + inset, yy], [40.6 + inset, yy + .7]], .42);
    d.line([[56.6 - inset, yy], [55.4 - inset, yy + .7]], .42);
  }
  // Two faint forehead lines.
  d.line([[44.4, 15.2], [48, 14.6], [51.6, 15.2]], .4); d.line([[45.4, 17], [48, 16.6], [50.6, 17]], .35);
  // Brows, happy closed eyes set low and close, rosy cheeks.
  d.line([[42.8, 21.4], [44.4, 20.8], [45.8, 21.2]], .55); d.line([[50.2, 21.2], [51.6, 20.8], [53.2, 21.4]], .55);
  if (blink) { d.line([[43, 24.6], [45.4, 24.6]], .55); d.line([[50.6, 24.6], [53, 24.6]], .55); }
  else { d.line([[42.9, 25], [44.2, 23.7], [45.5, 25]], .7); d.line([[50.5, 25], [51.8, 23.7], [53.1, 25]], .7); }
  d.shape([[40.2, 27.4], [43.4, 27.2], [43.6, 29], [40.4, 29.2]], '#eea7a066', 0);
  d.shape([[52.6, 27.2], [55.8, 27.4], [55.6, 29.2], [52.4, 29]], '#eea7a066', 0);
  // A little button nose and a small happy grin.
  d.line([[48.2, 25.6], [48.8, 27.6], [47.4, 28]], .55);
  d.shape([[45.4, 30.2], [48, 30.7], [50.6, 30.2], [49.6, 32.4], [48, 33], [46.4, 32.4]], WHITE, .55);
  d.line([[44.2, 29.6], [44.8, 30.6]], .35); d.line([[51.8, 29.6], [51.2, 30.6]], .35);
}

function tee(d, g, sleeves) {
  // Neck first, under the collar.
  d.shape([[45.4, 35.6], [51, 35.6], [51.4, 41.4], [45, 41.4]]);
  // Soft-shouldered tee, a little narrower at the hem; sleeves follow the arms.
  d.shape([[45.2, 39.6], [48.2, 41.8], [51.2, 39.6], [55.4, 40.6], [58.6, 43.4], [57.6, 60], [57.2, 78.6], [48, 79.6], [38.8, 78.6], [38.4, 60], [37.4, 43.4], [40.6, 40.6]], TEE);
  d.line([[45.2, 39.8], [48.2, 42.6], [51.2, 39.8]], .5);
  // A couple of drape folds.
  d.line([[40.6, 66], [42, 74]], .35); d.line([[55.4, 64], [54.6, 72]], .35); d.line([[47, 76.6], [49.6, 78.4]], .3);
  sleeves(d);
  g.save(); g.fillStyle = WHITE; g.textAlign = 'center';
  g.font = "600 3.3px 'IU Serif', Georgia, serif"; g.fillText('ITALIA UNO', 48, 59.6);
  g.font = "italic 400 2.7px 'IU Serif', Georgia, serif"; g.fillText('Caffè', 48, 63);
  g.font = "500 2.3px 'IU Serif', Georgia, serif"; g.fillText('London', 48, 66.2);
  // Reading glasses hang on a cord.
  g.strokeStyle = WHITE; g.lineWidth = .4;
  g.beginPath(); g.moveTo(45.2, 41.2); g.quadraticCurveTo(45.2, 47, 46.2, 50.4); g.moveTo(51.2, 41.2); g.quadraticCurveTo(51.2, 47, 50.2, 50.4); g.stroke();
  g.lineWidth = .6;
  g.beginPath(); g.ellipse(46, 51.8, 1.9, 1.5, 0, 0, Math.PI * 2); g.stroke();
  g.beginPath(); g.ellipse(50.4, 51.8, 1.9, 1.5, 0, 0, Math.PI * 2); g.stroke();
  g.restore();
}

function legs(d) {
  // Trousers that taper to the ankle, a crease line, and small shoes.
  d.shape([[39.4, 77.6], [56.6, 77.6], [57, 96], [56.2, 120.6], [50.8, 120.8], [48.8, 95.4], [47.2, 95.4], [45.2, 120.8], [39.8, 120.6], [39, 96]], TROUSERS);
  d.line([[43, 84], [42.6, 118]], .35, '#a99c84'); d.line([[53, 84], [53.4, 118]], .35, '#a99c84');
  d.shape([[39.6, 120.4], [45.4, 120.4], [46, 125.6], [37, 126], [36.6, 124]], INK, .5);
  d.shape([[50.6, 120.4], [56.4, 120.4], [59.4, 124], [59, 126], [50, 125.6]], INK, .5);
}

export function drawChef(g, x, y, {scale = 1, frame = 0, pose = 'idle'} = {}) {
  g.save();
  g.translate(x, y); g.scale(scale, scale);
  g.imageSmoothingEnabled = true;
  g.lineCap = 'round'; g.lineJoin = 'round';
  const d = pen(g, 5 + Math.floor(frame / 5) % 3 * 113);
  const bob = Math.sin(frame * .07) * .3;
  const pump = pose === 'wave' ? Math.max(0, Math.sin(frame * .3)) * 1.2 : 0;

  // Chibi proportions: a shorter body under a bigger head.
  g.save(); g.translate(48, 126); g.scale(1, .82); g.translate(-48, -126);
  legs(d);
  g.save(); g.translate(0, bob);
  if (pose === 'wave') {
    // His double thumbs-up, elbows out.
    g.save(); g.translate(0, -pump);
    d.arm([[36, 47], [28.6, 52], [27.4, 41]]); d.arm([[60, 47], [67.4, 52], [68.6, 41]]);
    thumbsUp(d, 27.4, 38.4, 1); thumbsUp(d, 68.6, 38.4, -1);
    g.restore();
    tee(d, g, d => {
      d.shape([[40.6, 40.6], [37.4, 43.4], [33, 47.6], [35.6, 51.4], [39, 49]], TEE);
      d.shape([[55.4, 40.6], [58.6, 43.4], [63, 47.6], [60.4, 51.4], [57, 49]], TEE);
    });
  } else if (pose === 'present') {
    d.arm([[37.6, 48], [36.8, 60], [42.4, 65.6]]); d.arm([[58.4, 48], [59.2, 60], [53.6, 65.6]]);
    tee(d, g, d => {
      d.shape([[40.6, 40.6], [37.4, 43.4], [35.6, 50.6], [39.6, 51.4]], TEE);
      d.shape([[55.4, 40.6], [58.6, 43.4], [60.4, 50.6], [56.4, 51.4]], TEE);
    });
    // A panino on a plate, held out.
    d.shape([[34, 64.4], [62, 64.2], [60.6, 66.6], [35.4, 66.8]]);
    d.shape([[39, 64.4], [41.6, 60.4], [48, 59.2], [54.6, 60.4], [57, 64.2]], '#efdcb6');
    d.line([[43.4, 62], [44.6, 61]], .45); d.line([[47.6, 61.6], [48.8, 60.6]], .45); d.line([[52, 62], [53, 61]], .45);
  } else {
    // One arm easy, one thumbs-up beside the chest.
    d.arm([[37.6, 48], [36.4, 60], [37.2, 70.4]]);
    d.shape([[35.2, 70], [39.4, 70], [39.6, 73.6], [37.4, 75], [35, 73.6]]);
    d.arm([[58.4, 48], [63.4, 58], [63.6, 53.6]]);
    thumbsUp(d, 63.8, 51.6, -1);
    tee(d, g, d => {
      d.shape([[40.6, 40.6], [37.4, 43.4], [35.6, 50.6], [39.6, 51.4]], TEE);
      d.shape([[55.4, 40.6], [58.6, 43.4], [61.4, 50], [57, 51.6]], TEE);
    });
  }
  g.restore(); g.restore();
  g.save(); g.translate(0, bob); g.translate(48, 53.6); g.scale(1.42, 1.42); g.translate(-48, -37.4);
  head(d, frame);
  g.restore(); g.restore();
}
