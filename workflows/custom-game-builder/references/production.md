# Production loop for the specified game

## Brief to rules

Extract the player's repeated action, goal, state changes and end conditions. Name the important states/actions before decorating. Choose mechanics for the current genre; do not force resource allocation, four rounds, a shop or two endings onto unrelated briefs. Record unresolved assumptions and only ask about consequential gaps.

For a new game, work in a new project directory. For an extension, inspect existing instructions/source and isolate changes where appropriate. Honour the selected engine and output requirements. A single offline HTML deliverable must not quietly rely on a CDN, remote font or separate unbundled runtime.

## Playable implementation

Build one complete loop first. Use data for levels/content and separate important rules from rendering where this makes testing useful. Complete the requested experience, including failure/retry and a meaningful ending. Show immediate feedback after actions; do not hide costs or change final rules only during settlement.

Use the art-direction reference for a coherent visual system. Keep useful scene information visible. Adapt phone controls and text density to actual input/readability needs; preserve important separate interaction pages if the design needs them. Do not use automatic scrolling as a substitute for a usable composition.

## Verification selected by mechanics

- **Every game:** start, play, ending, restart, supported controls, readable feedback and basic viewport fit.
- **Stateful game:** save/hydration if present, duplicate actions, timers and returns from panels.
- **Resource/balance requirements:** verify arithmetic and any explicitly requested reachability/optimality property using a suitable solver or exhaustive model when tractable. A past game's tested values do not transfer.
- **Narrative/puzzle game:** required progress is reachable, choices retain state, solutions/endings follow the current rules and optional content does not accidentally block the core route.
- **Arcade/spatial game:** input responsiveness, collision/score boundaries, pause/restart and touch/keyboard behaviour where supported.
- **External services:** leave disabled in ordinary development unless configured and authorised; use offline fixtures and report the limit.

Run the smallest meaningful checks first. Once they pass, expand only for a material concern, changed scope or remaining requirement. Use the environment's supported browser tools for real UI inspection when available. Do not invent screenshots, execution logs or passing results.

## Handoff

Deliver runnable source, required assets and licences, commands or opening instructions, the current brief and a concise evidence/decision log. Record incomplete checks and unsupported targets. Keep prior contributors credited. For a requested publication, use the available repository/hosting workflow and verify the actual destination; a local build is not an online deployment.
