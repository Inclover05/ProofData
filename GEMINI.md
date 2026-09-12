# Gemini Project Context — ProofData Phase 4B

@./SPIKE_PRD.md
@./docs/TEST_PLAN.md
@./docs/MILESTONES.md
@./docs/RESEARCH_LOG.md

## Project state
This repository is a **technical feasibility spike** for ProofData, a proposed GenLayer Reliance Layer.

Do not turn this repository into the full hackathon product.

## Core rule
RESEARCH → EXPLAIN → IMPLEMENT → LINT → TEST → OBSERVE → DOCUMENT → CONTINUE

NO PASS → NO PROGRESS.

## GenLayer rule
Do not invent GenLayer APIs, SDK methods, GenVM capabilities, deployment behavior or testing commands from memory.

Verify GenLayer-specific implementation details against the current official GenLayer documentation and current official GenLayer repositories/examples before using them.

## Beginner rule
The user has essentially no coding experience.

Before major technical work, explain:
- what you are about to do
- why it is needed
- what files will change
- how the user can verify the result

Afterward explain:
- what changed
- what passed or failed
- what the user should learn from it

Avoid unnecessary theory.

## Scope rule
Do not add features outside `SPIKE_PRD.md`.
Do not build a polished frontend during the spike.
Do not introduce paid dependencies without explicit approval.
Do not silently remove requirements.

## Debug rule
If something fails:
1. capture the exact failure
2. isolate the failing layer
3. check current documentation
4. apply the smallest fix
5. rerun the relevant test
6. document the outcome

If the preferred approach is unsupported, propose a smaller supported Plan B that preserves the core experiment.

## Visual QA rule
After every major frontend visual milestone, do not ask the user to manually take screenshots.
Use Playwright CLI to perform the visual review automatically. Run `./scripts/visual-qa.sh <milestone>` which creates `docs/visual-reviews/<milestone>/` and captures screenshots, accessibility snapshots, console errors, and overflow data for both desktop (1440x1000) and mobile (390x844).
Review the outputs, fill in `VISUAL_REVIEW.md` in that folder (recording PASS/FAIL for each route), and zip the folder into `docs/visual-reviews/<milestone>/proofdata-visual-review.zip`. Do not modify product functionality during QA.
