# Product Research: GenLayer Frontend Integration

## GenLayerJS & Frontend Stack
* **Source:** Official GenLayer Documentation / Next.js Patterns
* **Date:** 2026-09-12
* **What it confirms:** GenLayer officially supports JavaScript/TypeScript environments via standard RPC abstractions (similar to Viem/Ethers but adapted for GenVM). Standard interaction involves setting an RPC provider (e.g., `https://studio.genlayer.com/api` for Studionet).
* **Product Implication:** We will use a standard Next.js (App Router) + React stack. No complex backend is required; GenLayer acts as the sole backend.

## Browser Wallet Support
* **Source:** GenLayer Network Configuration Guides
* **Date:** 2026-09-12
* **What it confirms:** GenLayer is EVM-compatible at the RPC/Wallet level for transaction signing. Users can add the Studionet custom RPC network to MetaMask or standard browser wallets.
* **Product Implication:** We can rely on standard Web3 connection patterns (`window.ethereum`) to identify the `requester` and prompt for transaction signatures when creating or adjudicating warrants.

## Transaction Lifecycle
* **Source:** GenLayer Protocol Documentation (Consensus & Execution)
* **Date:** 2026-09-12
* **What it confirms:** Writing to a GenLayer contract triggers nondeterministic execution by a leader and validation by multiple nodes. Finalization takes longer than traditional deterministic blockchains due to LLM processing times.
* **Product Implication:** We CANNOT fake an instant "loading..." spinner that resolves in 500ms. We must design a robust "Awaiting Validator Consensus" UI state that handles 10-60 second execution times gracefully.

## Contract Reads vs Writes
* **Source:** GenLayer SDK (`gltest` & Client architecture)
* **Date:** 2026-09-12
* **What it confirms:** `get_warrant` is a `.call()` (read-only, fast, free). `create_warrant`, `retrieve_and_validate`, and `adjudicate` are `.transact()` (state-changing, requires consensus).
* **Product Implication:** The read flow for Agents/Developers is lightning fast. The write flow requires transaction lifecycle management.

## Wallet UX Strategy
* **Product Implication:** We will adopt Strategy B: **Explore First, Connect Later**. The user can browse existing public warrants and read the explainer without connecting a wallet. Wallet connection is only prompted when clicking "Create New Warrant".
