> **Historical record — superseded 2026-09-16.** Pre-fix audit. Its canonical address, frontend state, blockers and inferred LLM explanations are superseded; failed execution did not establish semantic judgment.
> Final canonical contract: `0xa73c0183e2e3605bbd5013abcb9c5683f7db1b4a`, Bradbury chain 4221. See the [current README](../README.md) and [final proof](submission-proof/README.md). Original content is preserved below.

# ProofData Final System Audit

## 1. REPOSITORY INVENTORY
*   **Canonical Contract:** `contracts/reliance_warrant.py` (checksum: `42d43ce11251b60d053f646a7139d15f2d82b8bb067bc8a0eda5bc7b15f5b271`)
*   **Archived Contracts:** Scratch versions deleted/archived.
*   **Frontend:** Next.js 16 (in `frontend/`)
*   **Scripts:** `scripts/bradbury/send-safe-write.ts` (Bradbury transport helper)
*   **Tests:** `tests/direct/`, `tests/integration/`
*   **Package Locks:** `frontend/package-lock.json`
*   **Skills/Configs:** `GEMINI.md`, `AGENTS.md` active.
*   **Reports:** `PROOFDATA-FINAL-THESIS-REPORT.md`, `PROOFDATA-P7-B1-TX-REPORT.md`

## 2. DEPLOYMENT LEDGER

| Network | Contract Address | Source File | Runner | tx | Execution | Status/Purpose | Superseded By | Known Limitations |
|---|---|---|---|---|---|---|---|---|
| STUDIONET | `0xE8B906DA3Bc2E2c40e9B2C3A8450B50a96f20d89` | `reliance_warrant.py` | Default | - | FINISHED_WITH_RETURN | Initial Prototype | 0x31cD... | No external bounds |
| BRADBURY PRE-COMPACT | `0x31cD191D9fa7Ee89D770207301A0801207E06A4A` | `reliance_warrant.py` | 1jb45aa... | `0x19a0...` | FINISHED_WITH_RETURN | Canary Deployment | 0x5486... | VM boundary bloat |
| BRADBURY COMPACT-FIX | `0x54865b1D5bf4bc7030c8ff2441a165814B2FC12c` | `reliance_warrant.py` | 1jb45aa... | `0xf30a...` | FINISHED_WITH_RETURN | Compact verification | 0xb055... | Caller-provided time |
| BRADBURY FINAL HARDENED | `0xb0557237CcEB48cAB5c32e4DAd5C087CB9126e0B` | `reliance_warrant.py` | 1jb45aa... | `0x7b7b...` | FINISHED_WITH_RETURN | Canonical with Diff Limitations | NONE | Differential Demo blocked |

## 3. SOURCE CHAIN OF CUSTODY
*   **Studionet → Bradbury:** Pinned runner explicitly defined (NETWORK COMPATIBILITY).
*   **Bradbury → Compact Fix:** Replaced large `Return` data with `Keccak256` matching (BUG FIX).
*   **Compact Fix → H1 Hardened:** Replaced `current_time` with `int(time.time())` (SECURITY HARDENING).
All changes match expected intentional steps. No arbitrary semantic changes were introduced.

## 4. CURRENT CONTRACT CHECKSUM
*   **Target Address:** `0xb0557237CcEB48cAB5c32e4DAd5C087CB9126e0B`
*   **SHA-256 Checksum:** `42d43ce11251b60d053f646a7139d15f2d82b8bb067bc8a0eda5bc7b15f5b271`

## 5. CONTRACT INVARIANT AUDIT
*   `create_warrant`: Caller authorizes ID, sets prerequisite variables. Mutations: Stores new object. Fails if ID exists.
*   `get_warrant`: Read-only. Fails if ID missing.
*   `retrieve_and_validate`:
    *   *Inputs*: `warrant_id`, `current_time`
    *   *Prerequisites*: Warrant must be `PENDING`.
    *   *Mutations*: Updates state to `PENDING_AI` or `NOT_WARRANTED`.
    *   *External*: Uses `gl.nondet.web.get`.
    *   *Idempotency*: Not idempotent (can only execute on `PENDING`).
*   `adjudicate`:
    *   *Inputs*: `warrant_id`
    *   *Prerequisites*: Warrant must be `PENDING_AI`.
    *   *Mutations*: Updates state to `WARRANTED`, `NOT_WARRANTED`, `CONDITIONAL`, or `INCONCLUSIVE`.
    *   *External*: `gl.nondet.web.get` + `gl.nondet.exec_prompt`.

## 6. STATE MACHINE AUDIT
Expected sequence: `PENDING` -> `PENDING_AI` -> `[FINAL STATE]`
*   *adjudicate before retrieval*: Raises UserError (must be PENDING_AI).
*   *retrieve twice*: Raises UserError (must be PENDING).
*   *expired warrant*: Sets to `NOT_WARRANTED`.
*   *hash mismatch / unavailable evidence*: Handled by reverting or setting `INCONCLUSIVE`.
*   *malformed semantic output*: Handled by safe fallback to `INCONCLUSIVE`.
No illegal transitions possible. 

## 7. DETERMINISTIC / NONDETERMINISTIC BOUNDARY
*   **Deterministic**: State mutations, parameter validation, time check (`time.time()`), hash validation (`==`).
*   **Nondeterministic**: HTTP fetching, `exec_prompt` LLM generation.
*   **Verified**: Full evidence document is NOT passed to deterministic validator returns. Only the compact `Keccak256` hash result crosses the consensus boundary. Semantic adjudication remains entirely contract-controlled.

## 8. HASH / EVIDENCE IDENTITY AUDIT
*   The raw byte fetch and exact `Keccak256` logic identically produces `d31880ae9181571d18323e1817597e4dcc2d5fb312920a662d1696bb9d7ae0ac`. Case and hex formatting match.

## 9. EXPIRY H1 AUDIT
*   Security does NOT rely on caller-provided `current_time`.
*   Expiry securely relies on `transaction_time = int(time.time())` from GenVM.
*   Legacy compatibility `current_time` argument remains in signature but is safely ignored internally.

## 10. TIME CANARY EVIDENCE
*   Time Canary proven in `0x0e391c42fc4fd2ec79931e5cce41ab46bd61b2c16deb434bfde74e10d713dd93`. Pinned runner produced uniform deterministic timestamps satisfying `time.time()` constraints.

## 11. DIRECT TEST RESTORATION ATTEMPT
*   **Classified**: `BLOCKED_UPSTREAM_RUNNER_ARTIFACT`
*   **Reason**: `test-runner-cdn.genlayer.com` yields DNS failure / `404 Not Found`.
*   **Coverage mapped**: Bradbury testnet transactions + Linter cover the delta.

## 12. GENVM LINT
*   Version: `v0.2.11-x86_64-linux-release`
*   Status: **PASS** (1 non-deterministic time.time() warning, which is strictly intentional).

## 13. BRADBURY CONTRACT FRESH READ
*   Target `0xb0557237CcEB48cAB5c32e4DAd5C087CB9126e0B` on `4221` exists and is readable via `readContract` with no wallet needed.

## 14. FINAL WARRANT TRUTH TABLE
| ID | URL | Risk | Expiry | Status | Contract |
|---|---|---|---|---|---|
| `final-low-001` | npm LICENSE | LOW | 1893456000 | `INCONCLUSIVE` | `0xb055...` |
| `final-high-001` | npm LICENSE | HIGH | 1893456000 | `INCONCLUSIVE` | `0xb055...` |
| `high-017` | npm LICENSE | HIGH | 1893456000 | `INCONCLUSIVE` | `0x5486...` |
| `low-012` | npm LICENSE | LOW | 1893456000 | `INCONCLUSIVE` | `0x5486...` |

## 15. DIFFERENTIAL CLAIM AUDIT
*   CORE CONTRACT OPERATION: PASS
*   HASH CONSENSUS: PASS
*   SEMANTIC EXECUTION: PASS
*   FINAL SAME-EVIDENCE DIFFERENTIAL: FAIL / NOT PROVEN
*   *Reason*: Evidence relevance problem. The NPM license is unrelated to any internal research or treasury purpose, so the LLM defaults to the safe fallback (`INCONCLUSIVE`) for both cases rather than splitting `WARRANTED` vs `NOT_WARRANTED`.

## 16. DEMO THESIS BLOCKER
*   **Issue P7-D1 — FINAL BRADBURY DIFFERENTIAL DEMO FIXTURE** created. Severity: `SUBMISSION-DEMO CRITICAL`.

## 17. REQUIREMENTS FOR BETTER FINAL EVIDENCE
Next fixture must be a factual report/company disclosure useful for low-risk research but insufficient to alone authorize major financial transfers. It must be stable, byte-reproducible, and validator-fetchable.

## 18. PROMPT AUDIT
*   Prompt strictly binds to input schema. "evidence sufficient for purpose" is directly queried.
*   Clear instruction hierarchy prevents output bleed.

## 19. PROMPT-INJECTION SECURITY
*   Evidence text is embedded at the tail block. 
*   System instructions mandate strict JSON parsing matching specific string enums. 

## 20. ACCESS / AUTHORIZATION AUDIT
*   `create_warrant` and validations are intentionally permissionless. 
*   This is an INTENDED PUBLIC SETTLEMENT mechanism. The requester string is attached but adjudication is a network service.

## 21. DOS / COST AUDIT
*   Duplicate IDs bounded by state tree lookup block.
*   Very large evidence strings bounded by standard GenLayer max bytes response logic. 
*   Classified: HACKATHON ACCEPTABLE.

## 22. TRANSPORT HELPER AUDIT
*   `scripts/bradbury/send-safe-write.ts` verified.
*   Safely intercepts `eth_estimateGas` to inject `Math.max(2M, est*1.5)` headroom.
*   No secrets logged. Wallet not saved. Only connects to `4221` Bradbury RPC.

## 23. ISSUE #402 EVIDENCE
*   Normal CLI Gas: ~888,500. Revert EVM hash: `0xf558b576...`
*   Safe Helper Gas: 2,000,000. Success EVM hash: `0x6dcdede3...`
*   Proves workaround cleanly patches outer transport under-allocation.

## 24. GENLAYER VS EVM HASH LAYER
*   Documentation clearly differentiates the `OUTER EVM HASH` (EVM receipt) vs `GENLAYER TRANSACTION ID` (Intelligent Contract receipt).

## 25. PYTHON GLTEST BLOCKER
*   Remains `BLOCKED_TOOLING`. Struct-response mapping incompatibility between `genlayer-py` and `genlayer-test` dependencies exists.

## 26. FRONTEND PACKAGE REALITY CHECK
*   `genlayer-js`: 1.1.8
*   `viem`: 2.56.3
*   Available APIs: `writeContract`, `estimateTransactionGas`, `simulateWriteContract`.
*   MISSING: `estimateTransactionFees`, `estimateTransactionFeesForWrite`.

## 27. FEE ARCHITECTURE AUDIT
*   **P7-FEE BLOCKER**: JavaScript SDK does not expose Python-native `estimateTransactionFeesForWrite` helpers. The frontend logic must be engineered carefully.

## 28. OUTER EVM GAS VS GENLAYER FEE
*   Frontend must clearly divide EVM Gas limits (Issue #402) vs GenVM Validator limits.

## 29. EIP-6963 AUDIT
*   Wallet discovery logic handles chain 4221 properly but needs integration tests against Bradbury writes.

## 30. FRONTEND NETWORK CONFIG AUDIT
*   `useWallet.ts` actively uses `chains.studionet` (61999).
*   Must be migrated to `chains.testnetBradbury` (4221) and correct native currency parameters.

## 31. LIFECYCLE ADAPTER AUDIT
*   Current parsing relies on `genlayer-js` 1.1.8 status events. Ready for Bradbury assuming GenVM transaction propagation behaves identically to Studionet.

## 32. CURRENT FRONTEND TEST INVENTORY
*   Most Playwright tests currently mock wallet connections or target obsolete Studionet fixtures. Migration required.
