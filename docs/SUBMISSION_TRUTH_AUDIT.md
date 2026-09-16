# Submission truth audit — 2026-09-16

## Authority

Current source, runtime configuration, finalized transaction evidence and fresh contract reads outrank earlier plans. Final target: **Bradbury Testnet, 4221**, `0xa73c0183e2e3605bbd5013abcb9c5683f7db1b4a`; source SHA-256 `c03894f85ea4afd13a2fe536274589b666e952ef40980a6cfae949bc9fc0dd1d`.

The final P7 pair genuinely adjudicated LOW `WARRANTED` / HIGH `NOT_WARRANTED` using identical evidence and requirements. The real MetaMask E2E finalized all writes and passed cold reload. No experiment was reopened or redeployed for packaging.

## Documentation disposition

| Classification | Files | Action / reason |
| --- | --- | --- |
| Update | Root `README.md`, `frontend/README.md` | Root README was absent; frontend README was boilerplate. Added judge-facing entry points and verified commands. |
| Update | `DEPLOYMENTS.md` | Earlier Bradbury address was incorrectly canonical. Added final deployment and explicitly superseded earlier targets. |
| Update; retain earlier text | `SAME_EVIDENCE_PROOF.md`, `LIVE_DEMO_TEST_PLAN.md` | Replaced current INCOMPLETE/BLOCKED claims with finalized V2 and browser proof; old records remain below historical headings. |
| Update; retain earlier text | `SEMANTIC_ADJUDICATION.md`, `TRANSACTION_LIFECYCLE.md` | Corrected semantic versus infrastructure INCONCLUSIVE, actual execution-result names, separate outer/GenLayer receipts and unsupported advanced RPC. |
| Update by appending | `TEST_LOG.md`, `DECISIONS.md` | Added final engineering authority without deleting earlier observations. |
| Explicitly mark historical | Root `PROOFDATA-FINAL-THESIS-REPORT.md`, `PROOFDATA-P7-B1-TX-REPORT.md` | Old contract was presented as canonical and unverified LLM explanations were stated as fact. Notices reject those interpretations as unsupported. Skipped adjudication cannot prove semantic execution. |
| Explicitly mark historical | Root P7 B1 fix/close reports, `README_START_HERE.md` | Useful earlier transport/hardening/onboarding checkpoints; not current submission instructions. |
| Explicitly mark historical | `ARCHITECTURE.md`, `PRODUCT_ARCHITECTURE.md`, `NONDETERMINISM_ARCHITECTURE.md` | Feasibility/Studionet descriptions and some behavior/security claims differ from final source. New submission architecture is precise. |
| Explicitly mark historical | `FINAL_SYSTEM_AUDIT.md`, `FINAL_RISK_REGISTER.md`, `CROSS_LAYER_TEST_MATRIX.md` | Old address, unproven differential, NOT RUN browser and blocked migration entries are superseded. Untested branches are not promoted to PASS. |
| Explicitly mark historical | `FINAL_DIFFERENTIAL_FIXTURE.md` | `networks.mdx` is abandoned evidence, not the final artifact. V2 is the pinned 723-byte declaration. |
| Explicitly mark historical | `NETWORK_PROMOTION_PLAN.md`, `MIGRATION_BASELINE.md`, `BUILD_PLAN.md`, `DEMO_PLAN.md`, `KNOWN_ISSUES.md`, `BRADBURY_DIAGNOSTICS.md` | Preserve earlier planning/diagnostic context; no longer current readiness claims. |
| Explicitly mark historical | `STUDIO_DEV_DEPLOYMENT_MANIFEST.md`, `P7_RC_BLOCKER.md`, `P7_RC_RESEARCH.md`, `P7_RS_MIGRATION.md`, `TOOLING_EXCEPTION_P7.md` | Abandoned tooling/RC track; does not direct deployment or SDK changes now. |
| Archive/reference only; leave files in place | Root and docs M11 reports, `TEST_PLAN.md`, `MILESTONES.md`, `RESEARCH_LOG.md`, earlier Bradbury research/review/diff reports, `TEST_FIXTURES.md`, `PRODUCT_RESEARCH.md`, `USER_FLOWS.md`, `SUPPORT_CONTEXT.md`, root `GEMINI.md` and `BOOTSTRAP_PROMPT.md` | Stage-specific history, experiments, feasibility instructions and future research. Current submission claims come from the README and compact proof, not these records. |
| Safe to leave untouched | `FINAL_DIFFERENTIAL_FIXTURE_V2.md` | Exact URL, bytes/hash and LOW/HIGH inputs already agree with finalized evidence. |
| Safe to leave untouched | Product/spike PRDs, design docs, learning notes/plans and scoped agent governance | Scope/design/history, not final deployment authority. No PDF or visual redesign undertaken. |

Paths without a root prefix in the table are under `docs/`. No historical record was deleted or moved. Historical notices preserve the original body. Large local evidence trees are referenced, not copied into the submission bundle.

## Source and configuration

`frontend/proofdata.config.json` is the public source of truth. SDK is pinned to `1.1.8`, Next.js to `16.3.5`, React to `19.2.8`. Runtime source contains no Studionet/61999/historical-contract target. The existing storage-boundary repair checkpoint remains unchanged.

The public verifier checks the deployed bytes, shared fixture and all ten existing finalized write IDs. It requires no account. The fixture URL/hash, purposes, risk values, requirements and semantic implementation are preserved.

## Git hygiene

The frontend migration and submission package belong in separate focused commits. The pre-existing `scripts/bradbury/send-safe-write.ts` modification and dirty `scratch/genlayer-skills-repo` submodule are left untouched. Local diagnostics, transaction artifacts and browser helpers remain preserved outside the compact committed bundle; they are not disposable.

Targeted ignores prevent environment files, dependency directories, venvs, browser cache and `docs/visual-reviews/` artifacts from accidental staging. No blanket scratch ignore, clean, reset, broad staging, contract redeployment, force-push or remote publication is performed.

## Scope limits retained

Expiry is enforced at retrieval, not rechecked by adjudication. The contract stores status but not semantic reason; JSON reasons in the bundle originate from consensus output. This is a testnet prototype and demonstration, not a formal security proof or autonomous treasury authorization mechanism.
