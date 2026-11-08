# Production and open-source workflow

## Human brief and decisions

**Co-creator: [Zhiang Wang](https://github.com/z48gdcngbf-jpg)** — human creative direction, reference selection, interaction and art-direction feedback, and submission decisions. Project home: [z48gdcngbf-jpg/italia_uno](https://github.com/z48gdcngbf-jpg/italia_uno).

The project is a Creative Track prototype for discovering a small real café through a game. The human-provided material included restaurant photographs, blackboard menus, a shopfront/interior sketch, interface wireframes, an art-direction PDF and a proposed logo. These inputs shaped the street → café → order → meal/story → receipt → real-world invitation sequence.

Human feedback directed the separate interior page, full menu, owner-management side game, scene-aware cheerful Italian cinema/jazz atmosphere, visitor and owner keepsake receipts, three-language selection, detailed art, logo-consistent wide brush typography, independent phone layout, non-overlapping welcome copy, and drawn arrows instead of system emoji. These were iterative product decisions, not conclusions generated from research statistics.

## AI assistance

Codex assisted with task decomposition, original Canvas/SVG/CSS drawing code, React integration, deterministic game models, procedural Web Audio, translations, source research, regression checks, browser QA and packaging. Bounded agents assisted selected UI, localisation and art/code subtasks during development. No external game sprites or source were copied. The delivered artwork uses code, not generated raster media; the score is synthesized in the browser, not a borrowed recording.

The [Gemini prompt showcase](../workflows/gemini-creative-track/PROMPTS.md#prompt-showcase) cites three separate shared conversations. The [supplementary agent log](GEMINI_AGENT_LOG.md) records their later drafting and critique contribution. Canva brand-book/campaign plans remain separate deliverables; a completed export is not claimed. Contributor roles from the earlier Cambridge Pledge project are not silently assigned to this new project.

## Reusable steps

1. Gather the brief and reference material. Separate public facts, supplied creative references and fictional game mechanics.
2. Specify customer states, owner-game resources and receipt arithmetic before decorating the UI.
3. Build the full playable loop; preserve the interior as an independently returnable page.
4. Encode the menu as data and label virtual prices. Source real history without inventing owner quotes or endorsements.
5. Draw scenery and fictional host with Canvas, and use SVG/CSS for small icons and interface surfaces.
6. Add original Web Audio, user-controlled sound and scene changes.
7. Separate desktop and phone compositions. Use large touch targets, smaller readable prompts and progressive disclosure.
8. Test guarded transitions, duplicate actions, timer visibility, receipt persistence and locale coverage. Inspect representative real UI interactions.
9. Save an exact source snapshot and production build. Keep previous versions recoverable.
10. For open-source distribution, remove hosting/account wrappers and private paths; add standalone tooling, license notices, documentation and a clean installation check.

## Useful prompt patterns from the project

- “Preserve the game rules, full menu, animations and saved progress; change only the presentation.”
- “Keep the complete café interior as a separate page; moving between pages must retain the order and receipt.”
- “The scene should dominate; dialogue must have its own space and must not cover the host or entrance.”
- “On phones: less simultaneous information, larger touchable cards and smaller prompts.”
- “Use source-linked facts for the story; clearly distinguish creative dialogue and invented prices.”
- “Use one drawn SVG arrow rather than a character that the operating system may render as an emoji.”

These are reusable summaries of the design instructions, not fabricated verbatim transcripts of an external agent session.

## Verification and provenance

The open-source package starts from deployed Site **version 18** (`4a8a3314b9a8c3b2d8ee30f7043b99b8b7ce5904`). React game components, Canvas art, CSS layers, menu, translations, state models, receipts and music are retained. Packaging changes replace the Sites/Vinext wrapper with a static Vite entry, make the logo path respect the deployment base, and remove two machine-local reference-photo paths. No private Git history, credentials, user saves, reference photographs or private PDFs are published.

Tests are in `tests/`. Exact publication/install/build results are recorded in `docs/RELEASE_CHECKS.json`. Source and factual limitations are in `docs/SOURCES.json`; the menu transcription and owner-game design notes remain available beside it.
