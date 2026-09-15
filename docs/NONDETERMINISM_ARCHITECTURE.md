# ProofData Non-Determinism Architecture

ProofData must remain a genuine GenLayer Intelligent Contract application. Its core thesis relies on combining objective cryptography with subjective semantic consensus. 

It is intentionally designed as a **Deterministic Safety Shell** wrapping a **Non-Deterministic Judgment Core**.

## 1. Deterministic Safety Shell
The contract uses standard deterministic programming logic for:
*   **Warrant Initialization**: `warrant_id`, `requester`, timestamps, enums.
*   **State Machine Transitions**: A warrant must be in `PENDING` to be moved to `PENDING_AI`, and `PENDING_AI` to be adjudged.
*   **Cryptographic Verification**: `genlayer.Keccak256(payload.encode()).hexdigest() == warrant.expected_hash`.
*   **Storage Management**: Persisting the exact string outcome to the `self.warrants` dictionary.

These are objective constraints. They are intentionally not outsourced to LLMs.

## 2. Non-Deterministic Judgment Core
The semantic evaluation is executed via GenLayer's nondeterministic execution engine.

### Implementation in `contracts/reliance_warrant.py`:
1.  **Web Retrieval:**
    `payload_raw = gl.nondet.web.get(warrant.evidence_ref)`
    This reaches out to the external internet at execution time.
2.  **Semantic Evaluation:**
    `result_json = gl.nondet.exec_prompt(prompt)`
    The prompt injects the evidence, the exact user intent (`purpose`), and the declared `risk_level`. The LLM evaluates the fitness-for-purpose and returns a JSON payload containing the `status` enum and `reason`.

### Leader / Validator Independence
The validator does NOT simply rubber-stamp the leader's output formatting. Because GenLayer validators run the *entire* contract function execution (including `gl.nondet.web.get` and `gl.nondet.exec_prompt`), each validator node independently fetches the web page and independently prompts its own LLM. 

Consensus is reached on the final contract state modification (`self.warrants[warrant_id].status`). If different LLMs produce identical semantic statuses (e.g. `WARRANTED`), the validators agree on the state transition, even if the raw text `reason` might be filtered or ignored for the exact state hash. ProofData intentionally projects the LLM decision into a narrow enum to guarantee high consensus rates.

## 3. Strict Front-End and Back-End Boundaries
*   **No Frontend Verdict Engine**: The frontend React code contains zero logic to compute the verdict. It merely reads the `status` string from the network and paints it green, red, or gray.
*   **No Centralized Backend Engine**: There is no Node.js/Python sidecar running the logic. The entire adjudication happens natively on the GenLayer blockchain via `eth_call`/`writeContract`.

## 4. P6 Non-Determinism Proof
The P6 milestone definitively proved this architecture on the live Studionet:
*   **Live Behavioral Proof:** Two warrants with the mathematically identical Keccak256 fingerprint resulted in two opposite outcomes (`WARRANTED` vs `NOT_WARRANTED`). 
*   **Code-Level Proof:** The Python contract strictly calls `gl.nondet.exec_prompt` with the contextual `purpose` and `risk_level` strings, proving the outcome difference was generated dynamically by the GenLayer execution environment, not a hardcoded `if risk == HIGH` branch.
