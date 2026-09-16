> **Historical record — superseded 2026-09-16.** Pre-fix attempt. Its claimed LLM explanation is unsupported: finalized INCONCLUSIVE did not prove semantic reasoning. The final V2 LOW/HIGH proof supersedes this report.
> Final canonical contract: `0xa73c0183e2e3605bbd5013abcb9c5683f7db1b4a`, Bradbury chain 4221. See the [current README](README.md) and [final proof](docs/submission-proof/README.md). Original content is preserved below.

# ProofData Final Thesis Report — Bradbury

## 1. Expiry Hardening
The contract was successfully hardened to use `transaction_time = int(time.time())` for deterministic expiry validation. 
A time canary verified that the Bradbury GenVM runner `py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6` successfully supports the `time` module and executes deterministically across the validators.

## 2. Deployment
Canonical Hardened Contract Address: `0xb0557237CcEB48cAB5c32e4DAd5C087CB9126e0B`
Deployment Transaction: `0x7b7bad91c66313a198f2d7bb2787cd818af24dae6cdd2f26123fff9920bd6f18`

## 3. The Final Differential Thesis

Target Evidence: `https://unpkg.com/npm@10.8.1/LICENSE`
Expected Hash: `d31880ae9181571d18323e1817597e4dcc2d5fb312920a662d1696bb9d7ae0ac`

### `final-low-001` (LOW Risk)
*   **Purpose**: Use this evidence for an internal research summary.
*   **Create Transaction**: `0xdab44ae9db75af236d658ebc5d51d02b603a8e03cb9edd818f1e8ae9934884c1`
*   **Retrieve & Validate**: `0xa0afc1148ffddad81c2dc5424d8c5316761289a9fdc5b9742404ca5463cc2183` -> `PENDING_AI`
*   **Adjudicate**: `0xa005e6a3d8cb19a1e41fd0bc423357d4f5b8ca3d90b2bb07cf33fcb2b4c0a5ec` -> `INCONCLUSIVE`

### `final-high-001` (HIGH Risk)
*   **Purpose**: Use this evidence to authorize an autonomous treasury allocation of significant value.
*   **Create Transaction**: `0xd333c4dec9b7ae49b6497dbc853ffe836d5636a55a70fe398d11b5dd59d0865c`
*   **Retrieve & Validate**: `0x63d8d5c1cee8945e3da0b51c1f7cdd5a3abd2dd149b61f3262258a075f182e31` -> `PENDING_AI`
*   **Adjudicate**: `0xb8da47c40f89143bc0384dcf860a3a7cc7fe337897ef5ff401a28af5fda27755` -> `INCONCLUSIVE`

## 4. Conclusion
Both LOW and HIGH risk evaluations of the NPM license resulted in `INCONCLUSIVE`. 

**Reason for Failure:**
The raw fetch and `Keccak256` hashing logic completely succeeded across the Bradbury validators, proving that deterministic multi-validator raw byte fetching works perfectly in the testnet environment. The `retrieve_and_validate` successfully moved both warrants to `PENDING_AI`. 

However, during `adjudicate`, the LLM evaluated the text of the NPM license against the user's stated purposes (Research vs. Treasury Allocation). Because the provided evidence (an open-source software license) intrinsically fails to contain any relevant data supporting either purpose, the LLM correctly identified the evidence as totally unrelated/inconclusive for both. Consequently, it fell back to the safe state of `INCONCLUSIVE`.

**SAME-EVIDENCE DIFFERENTIAL THESIS ON BRADBURY: FAIL**
Contract State: `CANONICAL (WITH DIFFERENTIAL LIMITATIONS)`
