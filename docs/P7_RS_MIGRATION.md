> **Historical record — superseded 2026-09-16.** Historical tooling migration attempt; not the final runtime configuration.
> Final canonical contract: `0xa73c0183e2e3605bbd5013abcb9c5683f7db1b4a`, Bradbury chain 4221. See the [current README](../README.md) and [final proof](submission-proof/README.md). Original content is preserved below.

# PROOFDATA P7-RS — CONTROLLED STUDIO-DEV MIGRATION REPORT

## TEG REVERIFICATION
Upstream RC Direct bug: CONFIRMED
TEG evidence reproducible: YES
Stable Direct: PASS
RC Direct: BLOCKED_UPSTREAM

## CURRENT RC ENVIRONMENT
Research date: 2026-09-14
Studio-dev reachable: YES
Chain: 61997
RPC: https://studio-dev.genlayer.com/api
Consensus: v0.6
genlayer-js: 2.0.0-rc.1
genlayer-py: 0.19.0rc2
CLI: 0.40.0-rc.3
genlayer-test: 0.30.0rc2
GenVM linter: 0.19.0rc2 (via fallback)
Versions coherently pinned: YES

## FEE SYSTEM
Fee workflow:
Measured profile available: NOT REQUIRED BY CURRENT OFFICIAL FLOW
Profile source: N/A
Deploy estimate: PASS
Create estimate: DEFERRED
Adjudicate estimate: DEFERRED
FeesDistribution submitted unchanged from estimate: YES
feeValue submitted correctly: YES

## CANONICAL STUDIO-DEV DEPLOYMENT
Contract source modified: NO
Contract checksum: 89f44de856700c2ea1f47e0967aaeb2e227e64c56a48f122cb5747fe33b9d4a6
Deployment transaction: 0x674bf36f23e3a7969c0520272551b8e0cde95639d05f04e8fbf6307591a74f52
Transaction status: FINALIZED
Execution result: FINISHED_WITH_ERROR (invalid_contract runner malformed)
Canonical Studio-dev contract: NONE
Deployment verified: FAIL
Wallet-free read: FAIL

## LOW BRANCH
Warrant: DEFERRED
Create transaction: DEFERRED
Create status: DEFERRED
Create execution: DEFERRED
Adjudication transaction: DEFERRED
Adjudication status: DEFERRED
Adjudication execution: DEFERRED
Evidence: DEFERRED
Fingerprint: DEFERRED
Purpose: DEFERRED
Risk: DEFERRED
Verdict: DEFERRED

## HIGH BRANCH
Warrant: DEFERRED
Create transaction: DEFERRED
Create status: DEFERRED
Create execution: DEFERRED
Adjudication transaction: DEFERRED
Adjudication status: DEFERRED
Adjudication execution: DEFERRED
Evidence: DEFERRED
Fingerprint: DEFERRED
Purpose: DEFERRED
Risk: DEFERRED
Verdict: DEFERRED

## DIFFERENTIAL
Evidence identical: DEFERRED
Fingerprint identical: DEFERRED
Purpose different: DEFERRED
Risk different: DEFERRED
Semantic outcomes different: DEFERRED
Studio-dev thesis proof: DEFERRED

## FRONTEND RC MIGRATION
genlayer-js v2 RC: PASS
studioDevnet: PASS
Account-free reads: FAIL (Network level revert)
EIP-6963: DEFERRED
wallet_getSnaps: DEFERRED
Fee-aware writes: DEFERRED
v0.6 lifecycle: DEFERRED
Success semantics: DEFERRED
Refresh/resume: DEFERRED
Wallet disconnected reads: DEFERRED
Compare: DEFERRED

## UI ACCEPTANCE
Create: DEFERRED
Lifecycle: DEFERRED
Adjudication: DEFERRED
LOW warrant: DEFERRED
HIGH warrant: DEFERRED
Compare: DEFERRED
Network identity: DEFERRED
Fee UX: DEFERRED
Desktop: DEFERRED
Mobile: DEFERRED
Accessibility: DEFERRED
Console errors: NONE

## TESTING
Stable Direct: PASS
RC Direct: BLOCKED_UPSTREAM
RC GenVM lint: PASS
Same-evidence regression: DEFERRED
Lifecycle regression: DEFERRED
Wallet regression: DEFERRED
Fee regression: DEFERRED
Playwright: DEFERRED

## RECOVERY
Studio-dev recovery plan: PASS
Re-deploy reproducible: YES
Canonical fixtures reproducible: DEFERRED
Deployment manifest complete: YES (But with failed deployment address)

## POST-MIGRATION DECISION
P7-RS: FAIL
Stable Studionet baseline preserved: YES
Studio-dev now canonical RC deployment: NO
Bradbury current state: UNKNOWN (Not Researched)
Bradbury decision: BRADBURY_NOT_READY
Recommended next milestone: P7-WAIT_UPSTREAM
Broad frontend revamp authorized: NO
