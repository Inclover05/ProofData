# ProofData submission copy — draft, not submitted

## Short description

ProofData turns exact evidence and an intended action into a validator-backed Reliance Warrant on GenLayer Bradbury Testnet.

## Medium description

Evidence can be accurate and still be insufficient for the action someone wants to take. ProofData — The Reliance Layer makes that distinction explicit. A Reliance Warrant records an evidence URL, cryptographic identity, purpose, risk, requirements and expiry. The intelligent contract controls lifecycle and identity checks, while GenLayer validators retrieve evidence, execute semantic adjudication and compare the resulting verdict.

Our finalized demonstration uses the same 723-byte GenLayerJS declaration artifact for two purposes. An internal technical note about Bradbury support receives WARRANTED. Using that evidence alone to authorize an autonomous $250,000 treasury allocation receives NOT_WARRANTED. Contract, evidence identity, requirements and implementation remain identical; purpose and risk change.

The Next.js product supports wallet-free exploration, explicit EIP-6963 wallet selection and authoritative readback. A fresh MetaMask browser lifecycle also finalized on Bradbury and survived cold reload without signer or tracker state. ProofData is a testnet prototype demonstrating action-relative evidence sufficiency, not a production financial authorization system.

## Problem

Finding evidence does not establish whether relying on it is justified. Sufficiency depends on intended action, consequences and declared requirements.

## Solution

A Reliance Warrant binds exact evidence to purpose and risk. Deterministic execution controls identity and lifecycle; validator-backed semantic adjudication produces a scoped on-chain verdict clients can read.

## Why GenLayer

ProofData uses GenVM web access and `exec_prompt` inside explicit nondeterministic execution. Validators independently execute the same path and compare status, while deterministic execution controls storage and transitions. The frontend supplies inputs and displays state; it is not the semantic authority.

## Key innovation

Action-relative evidence sufficiency: the same artifact can warrant one reliance context and fail another. Reliance Warrants combine evidence identity, intended use and consequence level in an inspectable decision record.

## Technical achievement

- Live Bradbury deployment, chain 4221, deployed source verified against SHA-256.
- Validator-backed semantic adjudication with Keccak-256 evidence identity.
- Finalized same-evidence LOW `WARRANTED` / HIGH `NOT_WARRANTED` differential.
- Real MetaMask create → validate → adjudicate browser lifecycle; all writes finalized.
- Cold readback without signer/tracker state and live `/compare` reads.
- Minimal storage-to-memory repair resolving nondeterministic persistent-storage access without changing semantic behavior.

## Demo instructions

Run the product using the root README. Explore `/`, inspect `/create`, open `/warrant/warrant-4905a143-4d22-4603-9763-c15e87166a47`, then visit `/compare`. No wallet is required to inspect finalized records. The three-minute script and proof bundle are linked from the README.

## Submission facts

- Product: ProofData — The Reliance Layer.
- Network: Bradbury Testnet; chain 4221.
- Contract: `0xa73c0183e2e3605bbd5013abcb9c5683f7db1b4a`.
- Source SHA-256: `c03894f85ea4afd13a2fe536274589b666e952ef40980a6cfae949bc9fc0dd1d`.
- Evidence: pinned `genlayer-js@1.1.8` declaration, 723 bytes.
- Transactions, reasons, votes and E2E: [submission-proof](submission-proof/README.md).

## Publication fields

Use actual repository, hosted-demo and video URLs if the form requests them. This package claims neither a public hosted URL nor a recorded video. These drafts do not submit, publish, upload or transact.
