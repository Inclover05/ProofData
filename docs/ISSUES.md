# ProofData Issues Tracker

## P7-H1 — TRUSTED EXPIRY TIME HARDENING
- **Status:** READY FOR RUNNER-COMPATIBILITY REVIEW
- **Description:** `current_time` is currently a caller-supplied argument in `retrieve_and_validate`, allowing potential circumvention of the `expires_at` threshold. The next milestone must verify that our pinned Bradbury runner supports the documented deterministic transaction-time behavior (`time.time()`, `datetime.now()`) before replacing caller-supplied `current_time`.

## BRADBURY-TRANSACTIONS — GENLAYER CLI GAS MISMATCH
- **Status:** WORKAROUND APPLIED (upstream tracking #402)
- **Description:** GenLayer CLI `0.39.2` fails to apply sufficient gas headroom to outer EVM transactions, causing block inclusion reverts without any explicit CLI error or GenVM execution. A safe transport helper (`scripts/bradbury/send-safe-write.ts`) handles Bradbury programmatic writes using intercepted `viem` requests to enforce a `2,000,000` minimum gas limit. Do not rely on CLI writes for complex state changes until CLI `0.40.0` is stable.
