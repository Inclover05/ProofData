> **Historical record — superseded 2026-09-16.** Phase 4B onboarding; submission entry point is now README.md.
> Final canonical contract: `0xa73c0183e2e3605bbd5013abcb9c5683f7db1b4a`, Bradbury chain 4221. See the [current README](README.md) and [final proof](docs/submission-proof/README.md). Original content is preserved below.

# ProofData Phase 4B — Start Here

This folder is a **technical feasibility spike**, not the full hackathon product.

Your job right now is only to prove whether the core ProofData Reliance Layer can work reliably on current GenLayer tooling.

## What you should do

1. Extract this folder somewhere easy to find on your computer.
2. Open **Antigravity IDE**.
3. Open this folder as the project/workspace.
4. Do **not** ask Antigravity to build the full product.
5. Paste the bootstrap prompt from `BOOTSTRAP_PROMPT.md` into the Antigravity Agent panel.
6. Let Antigravity read the files first.
7. Do not approve product-code work until it explains Milestone 0 and how it will verify the environment.

## Project files

- `SPIKE_PRD.md` — what this spike must prove.
- `GEMINI.md` — persistent project context for Gemini-compatible tools.
- `.agents/AGENTS.md` — how Antigravity should behave.
- `.agents/skills/` — project-specific behavior skills.
- `docs/TEST_PLAN.md` — pass/fail tests for the spike.
- `docs/MILESTONES.md` — exact development order.
- `docs/RESEARCH_LOG.md` — current-docs verification record.
- `docs/SUPPORT_CONTEXT.md` — compact context to send to Gemini/ChatGPT with screenshots or errors.
- `BOOTSTRAP_PROMPT.md` — the first prompt to paste into Antigravity.

## Golden rule

**NO PASS → NO PROGRESS.**

A feature is not working because code exists. It is working only when the expected observable result has been produced and verified.
