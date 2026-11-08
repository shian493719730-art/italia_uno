# Gemini × Italia Uno — reusable creative workflow

[Agent log](../../docs/GEMINI_AGENT_LOG.md) · [Brand-book page](../../docs/GEMINI_BRAND_BOOK_PAGE.md) · [Prompt pack](PROMPTS.md) · [Evidence](evidence.json) · [Decisions](DECISIONS.csv) · [Demo media](../../docs/DEMO_MEDIA.md)

This workflow packages three genuine Gemini discussions and an independently checked source map. Gemini leads the drafting/critique stage; people supply the brief, constraints, references and decisions. It is a **retrospective reconstruction around an existing game**, not a newly invented historical development transcript.

## Read in this order

1. [Whole-project walkthrough](https://share.gemini.google/6HcePfZERAVp): the principal Gemini record, with illustrative subsystem/code discussion and a factual correction.
2. [Toolkit dialogue](https://share.gemini.google/1ol6yl0YbhvM): the clearest visible feedback turn, from a narrow summary to a complete toolkit/hand-in narrative.
3. [Detailed agent log](../../docs/GEMINI_AGENT_LOG.md): actual scope, corrected paths/colours and the separate repository product pivot.
4. [Demo media and supplemental explanation](../../docs/DEMO_MEDIA.md): four recordings, provenance and earlier UI references.
5. [One-page copy](../../docs/GEMINI_BRAND_BOOK_PAGE.md): a compact brand-book spread.

## Repeatable loop

| Stage | Input | Gemini's proposed role | Human decision / output |
| --- | --- | --- | --- |
| Frame | Existing prototype, cause/business, brief and reference photos | Ask focused strategy and audience questions; compare possible positions | Approve the proposed purpose and boundaries; do not invent audience research. |
| Inspect | A pinned source snapshot | Produce a subsystem map and identify missing evidence | Check every path, quantity, colour and tool claim against source. |
| Propose | Brand constraints and current journey | Draft voice, visual rules, experience priorities and alternative directions | Accept, reject or revise proposals; record the reason and an evidence link. |
| Prototype | Approved tasks and current game | Break changes into reviewable modules and acceptance criteria | Implementation tools make scoped changes; preserve their real attribution. |
| Critique | Screenshots, actual behaviour and test output | Evaluate clarity, consistency and mobile use | Choose changes and preserve important interactions. |
| Verify | Saved code, test logs and public links | Help identify contradictions or gaps | Execute checks separately; do not turn an AI statement into a claimed test result. |
| Package | Actual conversations, source and decisions | Draft the agent log and presentation story | Keep observed work, reconstruction and proposals visibly distinct. |

These are reusable stages. Only the three linked conversations and checked repository artifacts are claimed as observed here.

## Creative toolkit map

| Tool | Concrete role it could support | Evidence status |
| --- | --- | --- |
| Gemini app | Strategy/naming/voice exploration, critique, feedback and workflow writing | Current drafting/revision sessions verified; earlier project-wide use is not established. |
| Canva | Organise a 12-page, 1920×1080 brand book; create post/story and another campaign asset | Proposed; no reviewed Canva export in this package. |
| Nano Banana | Explore moodboards or campaign visual treatments | Proposed; no generated image is claimed as a shipped game asset. |
| Gems | Store a reusable brand context and voice brief | Proposed; no created Gem is claimed. |
| Canva Brand Kit | Keep logo, colour and type rules consistent | Proposed; no populated kit is claimed. |
| Canva Magic Studio | Adapt approved layouts to campaign formats | Proposed; no tool execution is claimed. |
| Google Fonts | Research compatible type; retain actual font licences | Bundled font assets verified; the research workflow is proposed. |
| React/Vite/Canvas, npm and GitHub Actions | Implement, test, build and deploy the game | Files/configuration verified; individual executions require separate logs. |

## Four hand-ins

The linked conversation quotes the supplied brief: a Canva brand book (1920×1080, 12 required pages, up to 15), launch campaign (Instagram post, story and one chosen asset), agent log (Gemini share link plus a brand-book page), and a 3-minute pitch plus 2-minute Q&A. Treat this as the team's supplied brief, not an independently checked current rules page.

This package completes the **agent-log documentation and evidence links**. It supplies a brand-book page plan. It does not claim to complete the full Canva deck, campaign or live pitch. The documented rubric is strategy 25%, identity 25%, campaign 20%, creative partnership 15%, fit for cause 15%; attach actual deliverables rather than treating a plan as completion.

## Media hand-off

Use the [demo index](../../docs/DEMO_MEDIA.md) and `demo-media.json` to preserve filenames, hashes, viewing order and review scope. Original recordings live in the local ZIP rather than Git history. This media delivery does not claim a new edited film or a new gameplay test.

## Package checks

From the repository root:

```sh
node workflows/gemini-creative-track/verify-evidence.mjs
```

The checker validates local source references, share-link structure and manifest completeness. It does not authenticate Google, verify conversation content over the network or run the game tests.

If changing runtime code, run the repository's existing `npm test` and `npm run build`; the existing Pages workflow handles its configured publishing job. This documentation contribution does not change that workflow or automatically post anything to social media.
