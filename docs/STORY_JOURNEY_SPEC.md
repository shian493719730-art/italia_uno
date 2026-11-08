> **Status (8 November 2026): replaced.** After trying it, the team chose a different design. The original
> 5-second meal stays as it was, and a postcard on the noticeboard swings with a "Click me!" bubble. Clicking it
> opens an optional hide-and-seek in three imagined rooms (Bari, Soho 1987, Charlotte Street 1996), with no quizzes.
> See `lib/postcard-game.mjs`, `app/postcard-game.tsx` and `tests/postcard.test.mjs`. This spec is kept for reference.

# Feature spec: "The Postcard That Fell" — interactive story at My table

## Goal

Replace the current optional wall-map story with a guided, interactive story that starts automatically while the player eats at **My table**. The story leads the player through the existing world map in three chapters (Bari → Soho 1987 → Charlotte Street 1996) and a finale. Each finished chapter is one bite of the meal. When the plate is empty, checkout unlocks.

Family theme: the café is family-run (already stated in our sourced copy), and the game's message is "family is whoever you share a table with". The finale asks who the player would bring to the real café and makes a postcard for them.

## Where this lives in the current code

- `lib/customer-state.mjs`: customer reducer. Phase `eating`, `EATING_SECONDS = 5`, actions `TICK` and `STORY`, `storyRead` flag, `normaliseCustomer()` for saved progress.
- `app/game.tsx`: `mealVisible`, `VisitVignette view="table"` with `progress={customer.eatenSeconds / 5}` and `onBoard={() => open('story-map')}`, the `usePlayClock` call that ticks the meal (line ~75), the `checkout` guard (line ~123), and the `story-map` panel (line ~155).
- `app/customer-visit.tsx`: `CustomerDialogue` (host dialogue per phase), the `story` copy object, and the `StoryMap` component (world map → story card with source links).
- `lib/receipt.mjs`: receipt rows (already adds a row when `customer.storyRead`).
- `lib/visit-vignettes.mjs`: the table and noticeboard drawing.
- `lib/it/*.mjs` and `lib/locales.mjs`: Italian dictionaries keyed by the English string. Chinese is given inline with `ui(lang, en, zh)`.
- `docs/SOURCES.json`: the two Fitzrovia News sources (26 January 2015 and 13 March 2026) already used by `StoryMap`.

Read these files before changing anything, and follow their existing patterns.

## Rules (do not break these)

1. **Facts vs fiction.** Only these facts may be presented as real, with a "From the reporting" label and the existing Fitzrovia News links:
   - Felice Bracco grew up in Bari, southern Italy, before coming to London.
   - He opened the first Italia Uno in Soho with a business partner in 1987.
   - It moved to 91 Charlotte Street in 1996.
   - Coffee, sandwiches and football brought people together there. The family-run café became a gathering place for London's Napoli supporters.

   Everything the host says is fictional and stays labelled as such. Do not invent family members, recipes, quotes or anything else about the real owner. The suitcase activity is the **player's** imagination, not what the founder packed.
2. **No new dependencies**, no backend, no API calls, no real orders or payments.
3. **Keep the existing journey working:** Explore → Order → Enjoy → Receipt, owner mode, notebook, receipt download, music and mute.
4. **Three languages.** Every new string needs English and Chinese (via `ui()` or the existing copy objects) plus an Italian entry in `lib/it/`.
5. **Accessibility.** Every activity must be playable by keyboard and tap, with visible focus, `aria-label`s, buttons of at least 44px, and no time pressure that can fail the player.
6. **Mobile.** It must work on a narrow phone layout (see `app/mobile.css`) as well as desktop.
7. **Saved progress.** Store story progress inside the existing saved customer state, versioned and validated in `normaliseCustomer()`. Old saves must still load safely.
8. **A small "Skip the story" link** appears after chapter 1 is complete, and sets the plate to empty so checkout unlocks.

## State to add (customer state)

- `chapter`: 0 = not started, 1 = Bari, 2 = Soho, 3 = Charlotte Street, 4 = finale, 5 = complete
- `bites`: 0–4 (replaces the 5-second `eatenSeconds` as the meal progress; the plate shows 4 → 0 portions left)
- `quiz`: per chapter, answered correctly yes/no
- `packed`: up to 3 item IDs from the suitcase activity
- `postcard`: `{ to, name, sticker, note }`, with text limited to a sensible length
- Keep `storyRead`, set to true when the story completes or is skipped

New actions (guarded, like the existing reducer): `STORY_START`, `QUIZ_ANSWER`, `PACK_TOGGLE`, `PACK_CONFIRM`, `SERVE_MATCH`, `FIND_ITEM`, `POSTCARD_SET`, `CHAPTER_COMPLETE`, `STORY_SKIP`. `CHECKOUT` is allowed only when `bites === 4` (story complete or skipped). Remove or bypass the 5-second meal clock for this flow.

## Flow and dialogue

Each chapter follows the same 4 steps: **story card (a real fact) → one quick question → activity → reward (stamp + one bite)**. Map pins unlock in order, and a dotted route line draws between pins as chapters complete.

### Opening (starts automatically when the meal starts)

- Host: "Buon appetito! Take your time, there's no rush here."
- *Animation: a postcard falls off the noticeboard onto the table.*
- Host: "Ah, mamma mia, that one always falls. It's from the very start of our story."
- Host: "Help me pin it back? It goes somewhere on the map."
- Button: [Let's see →]. This opens the map with Bari glowing and the other pins locked.

### Chapter 1: Bari, "Where it began"

- Story card (from the reporting): "Felice Bracco grew up in Bari, in southern Italy, before coming to London."
- Question. Host: "Quick one. Where did our founder grow up?" Options: [Bari ✓] [Milan] [Rome]
  - Right: "Esatto! Bari, by the sea."
  - Wrong: "Close, but look at the card again." (The player can retry.)
- Activity, **Pack the suitcase.** Host: "Imagine you're moving from Bari to London. Your suitcase only fits three things. What do you take?" Pick exactly 3 of 6 items. Each item has a host reaction when picked:
  - Coffee pot: "Smart. Good coffee is hard to leave behind."
  - Football scarf: "Of course. You can't leave home without your team."
  - Family photo: "The most important thing in the suitcase."
  - Recipe notebook: "Ah, the real treasure."
  - Umbrella: "Ha! You've heard about London weather."
  - Sunglasses: "Hmm… optimistic."
- Reward. Host: "Perfetto. Bari stamp! Now take a bite, the journey to London is long." Bite 1, and the route draws from Bari to London.

### Chapter 2: Soho, 1987, "The first little café"

- Story card (from the reporting): "In 1987, he opened the first Italia Uno in Soho, together with a business partner."
- Question. Host: "Where did the very first Italia Uno open?" Options: [Soho ✓] [Charlotte Street] [Naples]
  - Right: "Bravo! Charlotte Street came later."
- Activity, **The first morning rush.** Host: "Opening day in Soho. Three customers, three orders. Can you serve them right?" Three customers show picture bubbles (espresso, cappuccino, panino); the player taps the matching item from the counter.
  - If `packed` includes the coffee pot: "Look, that coffee pot from Bari came in handy!"
  - Wrong item: "Oops, that's not what they ordered. Try again."
  - All served: "Three happy customers. That's how a café begins: one cup at a time."
- Reward: Soho stamp and bite 2. Host: "Nine years later, it was time to move…"

### Chapter 3: Charlotte Street, 1996, "A new home"

- Story card (from the reporting): "In 1996, Italia Uno moved to 91 Charlotte Street, where coffee, sandwiches and football brought people together. The family-run café became a gathering place for London's Napoli supporters." Show both Fitzrovia News links.
- Question. Host: "Which football fans made this café their London meeting spot?" Options: [Napoli ✓] [Juventus] [Arsenal]
  - Right: "Forza! A little piece of Naples in Fitzrovia."
- Activity, **Matchday.** Host: "It's matchday! The café's full. Find 5 things hidden around the room before kick-off." A hidden-object search in the existing café or football-wall art for a scarf, a ball, a coffee cup, a flag and a panino. Each item is a focusable button with an accessible name. There is no timer.
  - If `packed` includes the football scarf: "Hey, that's your scarf from Bari up there!"
  - Last item found: a "GOAL!" cheer, with a sound via the existing `onSound` or music system (respect mute).
- Reward: Charlotte Street stamp and bite 3.

### Finale: "A seat at the family table"

- Host: "So that's our little story. From one table in Bari to a café full of friends."
- Host: "The reporting says it's a family-run place. But here, family is whoever you share a table with."
- Host: "Last bite. Who would you bring here with you?" Options: [Mum] [Dad] [Sibling] [Partner] [Best friend] [Flatmate] [Type a name…]
- Activity, **Pin your postcard.** The player picks a sticker (panino, espresso, football, heart) and writes a short note, pre-filled as "Dear {name}, let's go to Italia Uno together." The postcard is pinned on the noticeboard next to the fallen postcard.
  - If `packed` includes the family photo: "Your family photo from Bari? Let's pin it right next to your postcard."
- Bite 4. Host: "Clean plate! Now that's a compliment. Ready for the bill?" Button: [Checkout →]

## Receipt and postcard

- New receipt rows (in both the on-screen and downloadable SVG versions): "Journey stamps: Bari ✓ Soho ✓ Charlotte Street ✓", "You packed: …" and "Postcard for: …".
- **Save postcard** downloads an SVG image (same approach as `lib/receipt.mjs`): the hand-drawn style, the sticker, the note, and "Italia Uno · 91 Charlotte Street", with the Google Maps link already used in `app/customer-visit.tsx`.
- If `navigator.share` exists, also offer **Share**. Otherwise hide that button.

## Visuals

Reuse the existing hand-drawn palette and fonts from `app/handdrawn.css`: indigo ink, warm paper, Caveat or Leckerli One headings. The plate on the table (in `lib/visit-vignettes.mjs`) should visibly empty as bites increase. Stamps are hand-drawn circles. Keep the existing scene from being covered on mobile.

## Tests (add to `tests/`, run with `npm test`)

- Reducer: chapter order is enforced, the quiz must be correct to continue, exactly 3 items are packed, the serve and find activities complete correctly, bites go 0→4, checkout is blocked until bites = 4, skip works only after chapter 1, and old saves normalise safely.
- Receipt: the new rows appear with the right content.
- Locales: every new English string has an Italian entry (follow the existing `tests/locales.test.mjs`).

## Done when

- `npm test`, `npm run typecheck` and `npm run build` all pass.
- The full flow works on desktop and on a narrow phone width, in EN, IT and 中文.
- The existing journey, owner mode and receipt still work.
- No fact appears that isn't in the list under Rules.
