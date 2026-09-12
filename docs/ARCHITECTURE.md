# VALIDATED FEASIBILITY ARCHITECTURE

## 1. Core Primitive
**Reliance Warrant.**
The protocol determines whether exact evidence is sufficiently fit to justify a specific declared action under predefined reliance requirements.

## 2. Core Thesis
**PROVEN**: Same evidence can validly receive different reliance outcomes depending on purpose and consequence.
Experimentally demonstrated example:
- Same evidence
- Low-consequence purpose → `WARRANTED`
- High-consequence purpose → `NOT_WARRANTED`

## 3. Persistent State
The current on-chain state representation is as follows:
- **Root storage**: `warrants: TreeMap[str, RelianceWarrant]`
- **RelianceWarrant fields**:
  - `id: str`
  - `requester: Address`
  - `evidence_ref: str` (URL/pointer)
  - `expected_hash: str` (Keccak256 hash of the exact expected payload)
  - `purpose: str`
  - `risk_level: str`
  - `requirements: DynArray[str]`
  - `expires_at: u256`
  - `status: str`

## 4. Public ABI
The read/write interface for clients retrieving warrants:
- **Internal requester**: `Address`
- **Public requester representation**: `string` (via `RelianceWarrantDTO` `.as_hex` casting)
- **Reason**: Cross-client/RPC compatibility (resolves a GLSim JSONRPC serialization crash) while retaining native GenVM address semantics internally.

## 5. Deterministic Validation
Before semantic judgment, the contract deterministically enforces:
- Field validation (No duplicate IDs, existence checks).
- Evidence-reference validation (Must start with `https://`).
- State-transition validation (`PENDING` -> `PENDING_AI` -> Final).
- Expiry behavior (Rejects interactions past `expires_at`).
- Evidence hashing/identity verification (Exact byte-level Keccak256 hash match required).
- Allowed verdict processing (Only accepts `WARRANTED`, `CONDITIONAL`, `NOT_WARRANTED`, `INCONCLUSIVE`).

## 6. Evidence Identity
**PROVEN MODEL**:
- **URL/reference**: Functions purely as a retrieval pointer.
- **Content hash**: Binds the Reliance Warrant to the exact retrieved evidence body.
If the retrieved content hash does not match the `expected_hash`, the process deterministically bypasses semantic adjudication and returns `NOT_WARRANTED` / `INCONCLUSIVE`.

## 7. Semantic Adjudication
The GenLayer nondeterministic flow for semantic decisions:
- **Leader execution**: The leader validator retrieves the evidence, formats the requirements and task, and runs a nondeterministic LLM prompt (`gl.nondet.exec_prompt`) requesting a JSON response with a strict status format.
- **Validator independent execution**: Validators independently retrieve the evidence and execute the same prompt.
- **Decision-bearing status field**: The decision relies purely on the `status` enum string.
- **Allowed nondeterminism**: Natural-language reasoning (`reason` field) can differ among validators. The smart contract tolerates reasoning divergence.

## 8. Equivalence Strategy
**Validator Strategy**:
- Every validator independently re-evaluates the prompt using the same inputs.
- The `status` field strictly MUST agree among validators.
- The `reason` field is ALLOWED to differ (non-comparative in the consensus function).
- If validators do not agree on the `status` field, the transaction consensus fails, and the fallback state is coerced to `INCONCLUSIVE`.

## 9. Reliance Outcomes
Current structured outcomes:
- `WARRANTED`: Evidence is sufficient for the purpose and risk level.
- `CONDITIONAL`: Evidence is partially sufficient, requiring human review or secondary checks.
- `NOT_WARRANTED`: Evidence is insufficient, contradictory, or identity validation failed.
- `INCONCLUSIVE`: Execution failed, URL was unreachable, consensus was lost, or the LLM failed to produce a valid status.

## 10. Expiry
Implemented and tested expiry behavior:
- Warrants record an `expires_at` Unix timestamp limit.
- Any attempt to retrieve evidence or adjudicate past the expiry timestamp deterministically aborts and coerces the status to `NOT_WARRANTED` or `INCONCLUSIVE`.

## 11. Security Boundary
- **External evidence is untrusted**: Treated strictly as raw text bytes.
- **Prompt-injection containment**: Adversarial testing demonstrated that when evidence payloads contain prompt injection commands (e.g., instructing the LLM to output "HACKED"), the contract securely catches the invalid schema/enum and bounds it to `INCONCLUSIVE` without corrupting state.
- **Hash mismatch**: Deterministically aborts adjudication, entirely neutralizing bait-and-switch evidence attacks.
- *Explicit disclaimer*: Current adversarial testing demonstrates useful containment but DOES NOT constitute a formal proof that every semantic prompt-injection attack is impossible.

## 12. Testing Architecture
The validated testing ladder used to prove the architecture:
- **GenVM lint**: Fast syntax and contract rule validation.
- **Direct Mode**: Fast logic iteration and deterministic environment isolation.
- **Adversarial/mocked Direct tests**: Controlled injection of bad payloads and LLM reasoning.
- **GLSim with mock validators + mock web**: Local RPC/state/multi-validator integration using deterministic mocks (via `transaction_context` injection) without requiring paid API keys.
- **Studionet**: Live hosted consensus, state persistence, and real nondeterministic behavior testing across decentralized GenLayer nodes.

## 13. Proven Environment Compatibility Issue
- **Discovered Limitation**: GLSim / `genlayer-py` nested `Address` serialization incompatibility.
- **Architectural Response**: The persistent `Address` is safely retained, while the client-facing representation is converted to a primitive `string` using a DTO pattern. This is an integration fix, not a ProofData protocol failure.

## 14. Kill-Test Result
The central ProofData thesis survived.
**Observed Result**: Identical evidence payload successfully produced a reproducible and explainable difference in reliance outcome (`WARRANTED` vs `NOT_WARRANTED`) strictly because the intended use and consequence risk differed.

## 15. Remaining Unknowns
The following future questions are intentionally separated from the validated spike feasibility:
- Production-grade risk taxonomy
- Production-grade purpose taxonomy
- Sophisticated requirement schemas
- Evidence lineage and provenance graphs
- Warrant revocation
- Broader evidence types (images, large documents, datasets)
- Agent action-gating APIs
- Economics/payment model
- Production security hardening and formal prompt-injection resilience
- Scaling/performance
