# ProofData — The Reliance Layer

Validator-backed judgments about whether exact evidence is sufficient for the action you intend to take.

## The Problem

Evidence alone does not establish whether relying on it is justified. A library declaration can support an internal technical note without justifying an autonomous $250,000 treasury allocation. Sufficiency depends on the intended action and its consequences.

## The Reliance Warrant

A warrant records an evidence URL, declared purpose, risk, requirements, expected Keccak-256 evidence identity, requester, expiry and lifecycle status. GenLayer validators retrieve the evidence and adjudicate whether it supports that reliance context. The final verdict is contract state; the frontend displays it.

## The Core Result

One **723-byte TypeScript declaration artifact**, two reliance contexts, one deployed contract:

| Context | Purpose | Authoritative verdict |
| --- | --- | --- |
| LOW | Internal technical note stating that GenLayerJS supports Bradbury as a testnet network for dApp clients | `WARRANTED` |
| HIGH | Use that evidence alone to authorize an autonomous $250,000 treasury allocation for a production deployment on Bradbury | `NOT_WARRANTED` |

**SAME EVIDENCE → DIFFERENT RELIANCE CONTEXT → DIFFERENT AUTHORITATIVE VERDICT**

Both transactions finalized after genuine semantic adjudication. They used the same contract, URL, raw evidence identity, hash, empty requirements, semantic implementation and validator architecture. Purpose and risk changed; no result-shopping occurred.

LOW: `storage-fix-low-diag-001`. HIGH: `thesis2-high-001`. Open `/compare` to read both from the final contract. The [proof bundle](docs/submission-proof/README.md) contains transaction IDs, votes and original semantic reasons.

## Why GenLayer

ProofData combines a **deterministic safety shell + nondeterministic judgment core + validator consensus**. The contract controls lifecycle, evidence identity and state updates. GenVM executes web access and semantic prompts; validators independently execute and compare the decision-bearing status. Natural-language reasons may differ. The browser neither supplies nor infers the authoritative verdict.

## How It Works

1. `create_warrant` records reliance inputs in `PENDING`.
2. `retrieve_and_validate` checks the HTTPS reference and runtime-time expiry, then retrieves evidence through validator nondeterministic execution.
3. Validators compare fetch status and exact-byte Keccak-256. A matching expected hash permits `PENDING_AI`.
4. `adjudicate` copies the persistent warrant to memory before entering nondeterministic execution.
5. Validators refetch evidence, check its identity and execute the purpose/risk/requirements prompt with JSON output.
6. Validators compare semantic status, and GenLayer resolves consensus.
7. The contract stores the resulting status. The client tracks outer EVM inclusion separately from GenLayer finalization.

## Verdicts

| Verdict | Meaning |
| --- | --- |
| `WARRANTED` | Adjudication found evidence sufficient for the declared purpose and risk. |
| `CONDITIONAL` | Adjudication judged reliance conditional on reservations or additional checks. |
| `NOT_WARRANTED` | Reliance was not justified, or a deterministic retrieval gate rejected it. |
| `INCONCLUSIVE` | A usable judgment was not established; this can reflect semantic uncertainty or infrastructure/parsing failure. |

These are scoped judgments, not guarantees of truth, security or permission to transfer funds. Transaction success alone does not prove semantic reasoning occurred; the final pair includes that proof.

## Final Deployment

| Field | Final value |
| --- | --- |
| Network | Bradbury Testnet |
| Chain ID | `4221` |
| Contract | `0xa73c0183e2e3605bbd5013abcb9c5683f7db1b4a` |
| Source SHA-256 | `c03894f85ea4afd13a2fe536274589b666e952ef40980a6cfae949bc9fc0dd1d` |
| Repair checkpoint | `35c0b3865a6d8a455556c110f005fb1561141e7d` |
| Browser SDK | `genlayer-js@1.1.8`, `testnetBradbury` |

The pinned runner and deployment hashes are in [deployment.json](docs/submission-proof/deployment.json). Public runtime configuration lives in [frontend/proofdata.config.json](frontend/proofdata.config.json). Earlier deployments are preserved in [deployment history](docs/DEPLOYMENTS.md), not used for product flows.

## Product Routes

- `/` — explore without connecting a wallet.
- `/create` — specify evidence identity and reliance context.
- `/warrant/[id]` — read contract state and continue eligible lifecycle steps.
- `/compare` — read the finalized LOW/HIGH proof pair.

## Browser Wallet

**Explore first, connect later.** Reads need no wallet. Writes use the explicitly selected EIP-6963 provider, with a legacy fallback only when none is selected. Bradbury switching is checked before writing; MetaMask signed the live browser E2E. A client-scoped adapter supplies outer EVM gas headroom while preserving SDK payload and fee fields. No private-key signer is included in frontend code.

## Repository Structure

```text
contracts/reliance_warrant.py   Final intelligent contract source
frontend/                     Next.js product and wallet tests
scripts/submission/           Public, read-only proof verification
docs/submission-proof/        Compact final evidence bundle
docs/SUBMISSION_ARCHITECTURE.md
docs/SUBMISSION_DEMO.md
docs/SUBMISSION_COPY.md
scratch/bradbury_canary/       Preserved local engineering evidence
```

## Running Locally

Use Node.js 24 (tested with 24.21.0) and npm. From the repository root:

```bash
cd frontend
npm ci
npm run dev -- --webpack -p 3035
```

Open `http://localhost:3035`. Public configuration needs no private environment values. Internet access is needed for Bradbury reads and build-time font downloads. Wallet writes require an authorized account with Bradbury testnet funds; browsing and the finalized demo do not.

For production, from the repository root in a separate terminal/session:

```bash
cd frontend
npm run build
npm run start -- -p 3035
```

The build explicitly uses Next.js's supported Webpack option.

## Verification / Testing

The final engineering gate passed lint, TypeScript checking, production Webpack build, 12 frontend unit checks, browser acceptance and a real MetaMask Bradbury lifecycle. Fresh warrant `warrant-4905a143-4d22-4603-9763-c15e87166a47` followed **`PENDING → PENDING_AI → WARRANTED`**. All three outer receipts succeeded; all three GenLayer transactions finalized with `AGREE / FINISHED_WITH_RETURN`. Its result survived cold reload without signer or tracker state.

```bash
cd frontend
npm run lint
npm run typecheck
npm test
npm run build
```

From the repository root, verify existing proof transactions and contract state without signing or submitting anything:

```bash
node scripts/submission/verify-final-proof.cjs
```

[Verification evidence](docs/submission-proof/verification.json) distinguishes live execution, read-only browser acceptance and simulated failure-path checks. Historical Python Bradbury tooling blocks are not reported as passing contract tests.

## Development Story / Important Fix

Bradbury diagnostics isolated a storage boundary violation: a storage-backed warrant captured by the nondeterministic closure caused `6: forbidden` before web or LLM execution. The final source calls `gl.storage.copy_to_memory(storage_warrant)` before adjudication. Prompt, hashing, verdict schema, validator comparison, risk inputs, runtime-time expiry behavior and runner remained unchanged. The repaired deployment produced the genuine LOW/HIGH differential and browser E2E.

## Hackathon Status

Bradbury **Testnet** submission prototype with demonstrated validator-backed semantic adjudication and browser-wallet integration. It is not a production security certification. [Architecture](docs/SUBMISSION_ARCHITECTURE.md), [three-minute demo](docs/SUBMISSION_DEMO.md) and [submission copy](docs/SUBMISSION_COPY.md) accompany the proof bundle. Older investigations are indexed in the [documentation truth audit](docs/SUBMISSION_TRUTH_AUDIT.md).
