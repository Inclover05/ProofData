# Final semantic adjudication behavior

`PENDING` records inputs; `retrieve_and_validate` performs the HTTPS/runtime-expiry/fetch/hash gate; `PENDING_AI` permits adjudication. The repaired adjudication snapshots storage into memory, refetches and checks text identity, executes the unchanged JSON prompt, independently compares validator status, then writes contract status.

`WARRANTED`, `CONDITIONAL`, `NOT_WARRANTED` and `INCONCLUSIVE` are application statuses, separate from protocol finalization. An agreed, finalized `INCONCLUSIVE` may come from infrastructure rather than semantic reasoning. The broad `Fetch error` label covers the whole leader path and cannot identify failure source alone. Verify actual execution output before calling a result semantic. Reasons are not stored by `get_warrant`.

The final LOW/HIGH pair genuinely reached LLM execution and returned `WARRANTED` / `NOT_WARRANTED`. See [architecture](SUBMISSION_ARCHITECTURE.md) and [proof](submission-proof/README.md).

## Earlier description — historical reference only

# Semantic Adjudication State Machine

## Warrant Application Lifecycle

ProofData separates the network transaction lifecycle from the application-level Warrant Status. The application state machine flows through the following states defined by the intelligent contract:

1. **PENDING (DRAFT)**
   - The warrant is newly created.
   - At this stage, it holds the expected identity (hash) and semantic requirements (purpose, risk) but has not yet retrieved the real-world evidence payload.
   
2. **PENDING_AI (AWAITING ADJUDICATION)**
   - Triggered by `retrieve_and_validate`.
   - The GenLayer node has successfully retrieved the payload via HTTP, hashed it, and confirmed that it matches `expected_hash`.
   - The warrant is now legally eligible for semantic adjudication.

3. **FINAL VERDICTS**
   Triggered by `adjudicate`, where the validator network runs a nondeterministic LLM evaluation (Optimistic Democracy).

   - **WARRANTED**: The evidence fulfills the purpose given the risk level.
   - **CONDITIONAL**: The evidence is sufficient but with reservations (e.g. requires manual fallback review or temporary limits).
   - **NOT_WARRANTED**: The evidence definitively fails to support the purpose/action.
   - **INCONCLUSIVE**: The AI was unable to parse the payload, the format was rejected, an unexpected error occurred, or the validators failed to reach consensus.

## Network Failures vs Application Failures

- If a transaction to call `adjudicate` fails at the network level (e.g. EVM signature error, `EXECUTION ERROR` due to incorrect starting state), the application state **remains in its previous state** (`PENDING_AI`).
- An `INCONCLUSIVE` application state means the transaction *succeeded*, but the semantic processing failed to produce a confident output. It is a valid terminal application state.
