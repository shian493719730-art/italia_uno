# Prompt pack

The first section summarises prompts visible in the real shared sessions. It is not a verbatim export. The reusable prompts below are newly assembled for this workflow and must not be presented as messages from a historical conversation.

## Recorded prompt progression

| Shared session | Human request / correction | Visible result |
| --- | --- | --- |
| [Toolkit](https://share.gemini.google/1ol6yl0YbhvM) | Start with a source-grounded one-page design summary. | Outcome-focused initial draft. |
| Same session | Redirect attention to the whole toolkit, required hand-ins and the agent log. | Broader workflow and presentation structure. |
| Same session | Distinguish current dialogue, source artifacts and proposed external tool use. | Explicit provenance/status labels and narrower authorship language. |
| [Walkthrough](https://share.gemini.google/6HcePfZERAVp) | Explain how an agent could assist across the whole existing game, using real modules and snippets. | An illustrative development walkthrough. |
| Same session | Remove unsupported historical authorship, inspection and successful-execution claims. | Revised hypothetical workflow, with implementation history kept separate. |

## Reusable prompt 1 — project context

```text
Act as my lead creative drafting and critique partner for Italia Uno.
We have an existing public prototype: https://github.com/z48gdcngbf-jpg/italia_uno
First distinguish what you can actually inspect from what I supply as context.
Map the customer visit, menu, receipt, optional postcard, owner simulation,
drawn space, music, localisation and responsive interface.
Ask focused questions about the intended audience and brand purpose.
Offer proposals as proposals. Do not invent research, owner testimony,
past tool usage or authorship of existing code.
```

## Reusable prompt 2 — brand and journey critique

```text
Keep the current café identity, menu and independent interaction pages.
Evaluate whether the proposed brand makes the real place feel approachable
and gives a visitor a reason to move from a virtual visit to the real café.
Give three priorities and alternatives, with a clear human decision point.
Use source values from app/bistro.css and the actual locale structure.
Do not replace the current game with a generic restaurant directory.
```

## Reusable prompt 3 — implementation handoff

```text
Translate the approved direction into scoped tasks for an implementation agent.
For each task list the exact existing files, expected behaviour and useful checks.
Preserve the customer state guards, saved receipt, 65-item catalogue,
optional postcard/meal separation, owner game, music and translations.
Any suggested code is a proposal until applied and checked.
Keep actual implementation tools and contributors credited separately.
```

## Reusable prompt 4 — creative-partner review

```text
Compare the first draft with my feedback and the revised output.
Explain the change in direction in a before → feedback → revision sequence.
Separate our current conversational turning point from the product pivot
recorded by the repository's replaced story spec and commit f7b1d81.
Do not invent why the historical product pivot happened.
```

## Reusable prompt 5 — final submission package

```text
Prepare an agent log, a one-page brand-book copy/layout plan and an evidence index.
Use the two real Gemini share links provided by the team. Map each major claim
to the visible conversation or a pinned source file/commit.
Label Canva, Nano Banana, Gems, Brand Kit and Magic Studio uses as proposed
unless I provide actual artifacts. A workflow file is not proof of a run.
List outstanding hand-ins plainly; do not call a plan a completed campaign.
```
