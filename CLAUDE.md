# Italia Uno · A Little Local Adventure — project brief for Claude

A browser café game for Italia Uno, an Italian sandwich bar at 91 Charlotte Street, Fitzrovia, London (phone 020 763 75326). Visitors explore the shopfront and an isometric café room, order from the real blackboard menu, get a keepsake receipt, and can play a three-day "run the café" mini-game. Vite + React 19 + TypeScript, canvas-drawn scenes, no backend, no API keys. Work happens on branch `oil-pastel-redesign`.

## Run it
- Node 22.13 or newer.
- `npm ci` → install. `npm run dev` → http://127.0.0.1:5173.
- `npm test` → node:test suites in `tests/`. `npm run build` → typecheck + static site in `dist/`.
- Preview lighting with `?time=dawn`, `?time=day`, `?time=dusk` or `?time=night`.

## Where things live
| File | What it does |
| --- | --- |
| `app/game.tsx` | App shell: header, steps, panels, most copy (English + Chinese; Italian and Japanese are generated). |
| `app/bistro.css` | The current look, loaded last: fonts, palette, rounded/bouncy UI, day clock, Japanese fonts. Older layers underneath: `globals.css`, `handdrawn.css`, `mobile.css`, `welcome.css`. |
| `app/day-clock.tsx`, `lib/daytime.mjs` | Clock pill with sun / half-moon. Phases: dawn 5–8, day 8–17, dusk 17–20, night 20–5. Sets `<html data-daytime>`. |
| `lib/drawing-kit.mjs` | Canvas pen helpers (chunky, rounded) and `finishDrawing(g, lights)`: paper grain, time-of-day tint, night lamp glows and lit windows. |
| `lib/handdrawn-scenes.mjs` | All scenes in a 640×420 world: shopfront, isometric room, counter view (three blue menu boards, deli case), table view. Scenes add lamps with `light(x,y,r)` and `pane(x,y,w,h)`. |
| `lib/chef-art.mjs` | `drawChef(g, x, y, {scale, frame, pose})` — the owner avatar. Poses: `idle`, `wave` (double thumbs-up), `present`. Keep the 96×128 box with feet at y=126. |
| `lib/locales.mjs`, `lib/it/*`, `lib/ja/core.mjs` | Dictionaries keyed by the English text. `ui(lang, en, zh)`; `withItalian(copy)` adds `it` and `ja`. Every new English string needs Italian and Japanese entries. |
| `lib/menu-data.mjs` | 65 menu items transcribed from the blackboard photos (see `docs/menu-transcription.txt`). |
| `lib/service-state.mjs`, `app/service-shift.tsx` | Three-day owner mini-game. |
| `lib/receipt.mjs`, `app/keepsake-receipt.tsx` | Keepsake receipts (SVG download). |

## Design rules
- Colours: navy ink `#17307f` and cream `#f6dea9` from the team logo (`public/handdrawn/italia-uno-logo.jpeg`), tan paper `#f3eadb`. Shopfront: cream fascia, navy awning, slate-blue frames `#3a5a93`, red-and-black chequer tiles; the deli counter has a red base.
- Type: Homemade Apple for headlines only (Apache 2.0); Crimson Pro for text and spaced small-capital labels (OFL). Japanese falls back to a Mincho serif. Fonts and licences are in `public/fonts`.
- Feel: cosy game — thick rounded outlines, round corners, little wobble, pill buttons with a pressable lip, springy pop-ins, gently bobbing labels. Honour `prefers-reduced-motion`.
- Avatar: a fine-line chibi doodle of the owner — bald crown, short grey sides, big grin, rosy cheeks, glasses on a cord, blue ITALIA UNO tee.

## Keep these true
- Menu boards use the transcribed wording. Prices are left off because some digits are hidden in the photos — never invent real prices. In-game prices are fictional and labelled so.
- The host is described as "an illustrated portrait inspired by the owner"; game dialogue is fictional. Get the owner's OK before a public launch.
- Japanese translations were written by Claude — get a native speaker to review them.
- Hotspot labels follow the anchors each scene returns, so keep scene coordinates in the 640×420 world.

## Open items
- Push the branch to GitHub.
- "PATATINE SAN CARLO" appears on the newest board photo but not in the transcription; add it if wanted.
- The isometric room's small boards still use short Italian placeholder text.

## How to work here
- Run `npm test` and `npm run build` before each commit; keep commits small.
- Check visual changes in the browser (or a Playwright screenshot) at desktop and phone widths, and with `?time=night`.
