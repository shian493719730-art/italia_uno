---
name: custom-game-builder
description: Build or revise a specified playable browser game from a user's brief, including mechanics, art direction, testing and source delivery. Also prepare a game brief or implementation plan when explicitly requested. Use for custom games across genres, rather than only reskinning the Italia Uno example.
---

# Custom Game Builder

Use the current user's requested theme, rules, art direction and delivery target. This folder is portable: the example café game and its assets are not dependencies.

## Determine the requested mode

- **Plan:** prepare a brief, art direction and implementation handoff.
- **Build:** implement a playable game and verify its important behaviour; a plan alone is not completion.
- **Extend:** inspect the selected existing project and preserve its state model, assets and behaviour outside the requested change.
- A request to document or package this workflow does not itself request a new game, account registration or publication.

Use `BRIEF.template.json` or natural-language requirements. Ask only for missing information that changes the core game or prevents progress. For reversible implementation choices, state reasonable assumptions and proceed. Record user constraints separately from references and game-balancing numbers.

## Make the specified game

Read [production.md](references/production.md) for the build/review/delivery loop. Start with a playable core loop, then add the selected art and feedback. Choose a stack suitable for the actual target; a simple browser game can use HTML/CSS/JS or Canvas. Honour an existing stack and any explicit single-HTML, offline or engine requirement. Do not promise unsupported native/engine exports.

Read [art-direction.md](references/art-direction.md) when defining or revising visuals. Derive the visual system from this game's brief and authorised references. Do not carry over café settings, colours, languages, resources, round counts or forced-failure rules unless requested. Keep scenes legible and controls separate from important visual details.

Test meaningful game invariants and representative journeys. Report what actually ran, distinguish a preview from a completed build, and inspect the real interface when browser tools are available. Match testing to the mechanics: exhaustive reachability checks are appropriate only when a requested property requires them. Preserve save/reset and repeat-action behaviour during revisions.

Deliver runnable source, assets/licences, run instructions, a brief record of human/AI decisions and verification results. Publish only to a requested destination using the available hosting workflow and current permissions. Treat public business facts and any claims about real people as source-dependent; fictional story material and game parameters should be labelled accordingly.

## Optional integrations

Read [optional-integrations.md](references/optional-integrations.md) only if the brief selects email setup, email receipts or social publishing. These are optional modules and do not define the game genre. A configuration flag does not authorise account creation, credential access, live sending, posting or payment. Keep unavailable integrations clearly unavailable; do not show simulated success as a real external result.

## Helpers

`node scripts/prepare-project.mjs --brief <brief.json> --out <new-directory>` prepares a self-contained handoff folder. It writes documents and evidence placeholders only; it does not run an AI, implement a game or contact a service. It refuses an existing destination. Use the provided master `PROMPT.md` directly when no script is needed.
