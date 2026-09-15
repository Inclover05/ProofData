# ProofData Cross-Layer Test Matrix

| Layer | Environment | Evidence Endpoint | Warrant ID | Execution | Consensus | Evidence Result |
|---|---|---|---|---|---|---|
| gltest (P0) | Mock | Original GitHub | low-000 | SUCCESS | AGREE | WARRANTED (SUPERSEDED) |
| Localnet (P4) | Studio-local | Original GitHub | low-001 | SUCCESS | AGREE | WARRANTED (SUPERSEDED) |
| Studionet (P5) | Studio-devnet | Original GitHub | low-003 | SUCCESS | AGREE | WARRANTED (SUPERSEDED) |
| Bradbury (P7) | Testnet | Original GitHub | low-004 | SUCCESS | AGREE | INCONCLUSIVE (Blocked by network/WAF) |
| Bradbury (P7-E)| Testnet | jsdelivr mirror | low-007 | SUCCESS | AGREE | INCONCLUSIVE (Blocked by GenVM size limits) |
| Bradbury (P7-E)| Testnet | unpkg mirror | low-008 | SUCCESS | AGREE | INCONCLUSIVE (Blocked by GenVM size limits) |

## Final H1 Capability Matrix (0xb0557237CcEB48cAB5c32e4DAd5C087CB9126e0B)

| Capability | CONTRACT UNIT/DIRECT | STATIC/LINT | STUDIONET | BRADBURY CONTRACT | BRADBURY TRANSPORT | BRADBURY JS CLIENT | BROWSER UI | FINAL DEMO |
|---|---|---|---|---|---|---|---|---|
| create warrant | BLOCKED_UPSTREAM | PASS | PASS | PASS | PASS | PASS | NOT RUN | NOT READY |
| read warrant | BLOCKED_UPSTREAM | PASS | PASS | PASS | PASS | PASS | NOT RUN | NOT READY |
| expiry | BLOCKED_UPSTREAM | PASS | PASS | PASS | PASS | PASS | NOT RUN | NOT READY |
| URL validation | BLOCKED_UPSTREAM | PASS | PASS | PASS | PASS | PASS | NOT RUN | NOT READY |
| evidence fetch | BLOCKED_UPSTREAM | PASS | PASS | PASS | PASS | PASS | NOT RUN | NOT READY |
| raw-byte hash | BLOCKED_UPSTREAM | PASS | PASS | PASS | PASS | PASS | NOT RUN | NOT READY |
| hash mismatch | BLOCKED_UPSTREAM | PASS | PASS | PASS | PASS | PASS | NOT RUN | NOT READY |
| unavailable evidence | BLOCKED_UPSTREAM | PASS | PASS | PASS | PASS | PASS | NOT RUN | NOT READY |
| compact consensus boundary | BLOCKED_UPSTREAM | PASS | PASS | PASS | PASS | PASS | NOT RUN | NOT READY |
| semantic LLM | BLOCKED_UPSTREAM | PASS | PASS | PASS | PASS | PASS | NOT RUN | NOT READY |
| validator semantic consensus| BLOCKED_UPSTREAM | PASS | PASS | PASS | PASS | PASS | NOT RUN | NOT READY |
| WARRANTED | BLOCKED_UPSTREAM | PASS | PASS | PASS (older version) | PASS (older version) | NOT RUN | NOT RUN | NOT READY |
| CONDITIONAL | BLOCKED_UPSTREAM | PASS | PASS | NOT RUN | NOT RUN | NOT RUN | NOT RUN | NOT READY |
| NOT_WARRANTED | BLOCKED_UPSTREAM | PASS | PASS | PASS (older version) | PASS (older version) | NOT RUN | NOT RUN | NOT READY |
| INCONCLUSIVE | BLOCKED_UPSTREAM | PASS | PASS | PASS | PASS | PASS | NOT RUN | NOT READY |
| transaction submission | BLOCKED_UPSTREAM | N/A | PASS | PASS | PASS (via helper) | PASS (via helper)| NOT RUN | NOT READY |
| fees | BLOCKED_UPSTREAM | N/A | PASS | PASS | BLOCKED (SDK issue) | BLOCKED (SDK issue)| NOT RUN | NOT READY |
| outer gas | BLOCKED_UPSTREAM | N/A | PASS | PASS | PASS (via helper) | PASS (via helper)| NOT RUN | NOT READY |
| wallet selection | N/A | N/A | N/A | N/A | N/A | N/A | PASS (Mock/Studio) | NOT READY |
| network switching | N/A | N/A | N/A | N/A | N/A | N/A | PASS (Mock/Studio) | NOT READY |
| refresh/resume | N/A | N/A | N/A | N/A | N/A | N/A | PASS (Mock/Studio) | NOT READY |
| same-evidence Compare | BLOCKED_UPSTREAM | PASS | PASS | PASS | PASS | PASS | NOT RUN | NOT READY |

