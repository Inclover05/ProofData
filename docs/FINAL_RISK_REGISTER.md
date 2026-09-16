> **Historical record — superseded 2026-09-16.** Pre-fix risk snapshot. Differential proof and frontend migration/E2E blockers listed below have been resolved.
> Final canonical contract: `0xa73c0183e2e3605bbd5013abcb9c5683f7db1b4a`, Bradbury chain 4221. See the [current README](../README.md) and [final proof](submission-proof/README.md). Original content is preserved below.

# ProofData Final Risk Register

| Risk | Description | Severity | Impact |
|---|---|---|---|
| **P7-D1: Differential Demo Fixture** | NPM license evidence caused identical LLM responses (`INCONCLUSIVE`). A context-sensitive fixture is required. | CRITICAL | BLOCKS DEMO, BLOCKS SUBMISSION |
| **P7-FEE: Frontend Fee Adapter** | JS SDK lacks native `estimateTransactionFeesForWrite`. | HIGH | BLOCKS FRONTEND |
| **P7-NET: Network Config Migration** | Frontend is hardcoded to Studionet 61999. | HIGH | BLOCKS FRONTEND |
| **P7-GAS: CLI #402 Transport Bug** | Standard `addTransaction` writes fail via CLI and SDK due to tight gas estimation. | HIGH | BLOCKS FRONTEND (requires wrapper fix) |
| **P7-TEST: Blocked Runner CDN** | Pinned runner artifact `1jb45aa...` is `404 Not Found`, blocking local Direct Tests. | MEDIUM | BLOCKS CONTRACT (Regression), DOES NOT BLOCK FRONTEND |
| **P7-GLTEST: Python integration incompat** | `genlayer-test` fails to parse struct returns from `genlayer-py`. | LOW | DOES NOT BLOCK |
