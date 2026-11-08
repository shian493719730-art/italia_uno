# Custom Game Builder · 定制游戏制作工作流

**Co-created and directed by [Zhiang Wang / Team Snapper](https://github.com/z48gdcngbf-jpg).** A reusable AI-assisted workflow for a user's specified game: brief → rules → art direction → playable implementation → review → tested source delivery.

This is part of the existing [Italia Uno repository](https://github.com/z48gdcngbf-jpg/italia_uno). **You can copy this folder alone and use it for a different game.** It has no imports from the café game, no required café assets and no required email or social account. Italia Uno remains a case study, not a template that every new game must resemble.

## What this provides

- A [requirements template](BRIEF.template.json) and [short intake guide](INTAKE.md).
- A [master prompt](PROMPT.md) for an AI coding assistant, with plan/build/extend modes.
- An installable [Codex skill](SKILL.md), plus production, art and optional-integration references.
- A dependency-free [workspace preparer](scripts/prepare-project.mjs) that turns a JSON brief into a fresh handoff folder.
- A [space-puzzle example](examples/orbit-parcel.json), unrelated to the café.

The assistant running the workflow needs appropriate code/file/test tools to build and verify a game. This package is a workflow and preparation tool, not a hosted AI API or a promise of one-click production for every engine. No new game has been built merely by adding the workflow.

## Start with another game

1. Describe the game using [INTAKE.md](INTAKE.md), or fill [BRIEF.template.json](BRIEF.template.json). Choose a genre and core loop, goals, controls, art direction, language and output format. Optional integrations default off.
2. Give the brief and [PROMPT.md](PROMPT.md) to an AI coding assistant. Choose **build** to request runnable implementation, **plan** for documentation only, or **extend** for a selected existing project.
3. The assistant creates the core loop, applies the visual direction, tests the important mechanics and provides the source/run instructions. A build-mode task should continue through implementation; a design proposal is not a playable game.

### Optional preparation script

Requires Node.js 18+ and no npm packages. From a copied `custom-game-builder/` folder:

```sh
node scripts/prepare-project.mjs --brief examples/orbit-parcel.json --out ../orbit-parcel-handoff
```

The destination must not already exist. The output contains `brief.json`, `START_HERE.md`, `BUILD_PROMPT.md`, `ART_DIRECTION.md`, `QA_PLAN.md`, `WORKFLOW_LOG.md`, `SOURCE_REGISTER.md` and `STATUS.json`. Give these to the coding assistant in your chosen project workspace. **The script prepares the assignment; it does not generate game code or call an AI service.**

Use your own JSON brief in place of the example. Nothing is written into the original game. Strings from the brief are treated as document content, not shell commands. Existing destination files are never overwritten.

### Optional Codex installation

Copy this whole folder into your personal skill directory as `custom-game-builder/`, preserving its references and scripts. Then invoke:

```text
Use $custom-game-builder to build the game described in my brief.
Implement it, run appropriate checks, and give me the runnable source.
```

For another AI assistant, use the master prompt and brief directly. A particular provider, Gemini share link or API key is not required by this workflow package; the assistant's own access requirements depend on the environment you choose.

## End-to-end outputs

| Stage | Concrete output | Completion signal |
| --- | --- | --- |
| Intake | Brief, constraints and stated assumptions | Core request can be implemented without guessing its purpose. |
| Design | Rules/state model and art direction | Goals, actions, feedback and end conditions are explicit. |
| Build | Playable core loop, then finished presentation | Start → play → ending → restart works. |
| Review | Responsive interface and meaningful checks | Results are tied to actual code and observed behaviour. |
| Handoff | Runnable source, licences, run steps and evidence | The recipient can run the delivered game. |
| Optional release | Requested repository/host destination | Publication is confirmed by that destination. |

Only select features that fit the new game. A narrative mystery, arcade game, puzzle or simulation can share the workflow without sharing rules or visuals. Larger 3D/native projects may need a different engine and toolchain; define a feasible prototype scope rather than promising unsupported exports.

## Optional modules, independently selected

See [optional-integrations.md](references/optional-integrations.md). Mailbox setup, email results/receipts and social publishing are opt-in. Documentation and offline examples can be prepared without accounts. Account setup or live service use starts only when explicitly requested.

The existing repository contains fuller case modules for [mailbox setup](https://github.com/z48gdcngbf-jpg/italia_uno/tree/main/workflows/email-setup), [order email](https://github.com/z48gdcngbf-jpg/italia_uno/tree/main/workflows/order-email) and [social publishing](https://github.com/z48gdcngbf-jpg/italia_uno/tree/main/workflows/instagram-publishing). Those are optional case references, not dependencies of this portable folder.

## Check the preparation tool

From this folder, run `node --test tests/prepare-project.test.mjs`. The checks copy the package away from the café repository, prepare two different genres, preserve extra brief fields, reject invalid input and refuse to overwrite existing work. They verify the helper, not a newly generated game. See [VALIDATION.json](VALIDATION.json) for the actual package-check record.

## Provenance and licence

This newly authored workflow generalises lessons from the project. It does not present the three existing Gemini conversations as historical evidence that arbitrary new games were built. Keep real human contributions, AI outputs, sources and actual checks in the next project's own log.

The folder includes its own MIT [LICENSE](LICENSE). No original restaurant imagery, logos, third-party fonts or game assets are copied into its generated handoffs. New assets need their own usage rights.

## 中文快速使用

把这一个文件夹复制到新项目即可，不必复制 Italia Uno 游戏。填写主题、玩法循环、目标、风格、语言和交付格式，再把需求与 `PROMPT.md` 一起交给有编程工具的 AI。选择 `build` 时，工作流要求完成可玩实现、测试和源码交付；选择 `plan` 时只准备方案。

准备脚本只生成任务资料，不会自动调用模型或生成游戏。邮箱、邮件发送和社媒都按需启用，默认关闭。整个工作流仍在原 GitHub 仓库中维护。
