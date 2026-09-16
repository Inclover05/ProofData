> **Historical record — superseded 2026-09-16.** Studionet-era product description; final browser configuration uses Bradbury 4221 and the repaired deployment.
> Final canonical contract: `0xa73c0183e2e3605bbd5013abcb9c5683f7db1b4a`, Bradbury chain 4221. See the [current README](../README.md) and [final proof](submission-proof/README.md). Original content is preserved below.

# Product Architecture

## Overview
ProofData adopts a "Thick Smart Contract, Thin Client" architecture. There is NO centralized backend database, no user accounts system, and no proprietary API gateway. The GenLayer network serves as the complete backend, database, and execution engine.

## Conceptual Structure

```text
[ Browser / Wallet (MetaMask) ]
          ↓
[ Next.js Frontend (React/Tailwind) ]
          ↓
[ GenLayerJS (RPC Calls) ]
          ↓
[ GenLayer Studionet RPC (studio.genlayer.com) ]
          ↓
[ Intelligent Contract: ProofDataRelianceLayer ]
          ↓
[ GenVM Validator Nondeterministic Consensus ]
          ↓
[ Persistent On-Chain Warrant State ]
```

## Layers

### 1. Browser / Frontend
A Next.js App Router application served statically or via serverless edge functions. It handles route management, rendering the UI, and constructing the GenLayerJS calls. It relies on standard browser wallet injection (EVM compatible) to sign transactions.

### 2. GenLayerJS (Integration Layer)
The frontend uses the official `genlayer-js` library to interact with Studionet.
- **Reads**: Instant queries to `get_warrant`.
- **Writes**: Constructing transactions for `create_warrant` and `adjudicate`, prompting the wallet for signature, and tracking the transaction receipt until finalization.

### 3. ProofDataRelianceLayer (Execution Layer)
The validated M11 Python GenVM contract. It strictly enforces:
- Evidence hashing and URL integrity.
- Structuring the nondeterministic LLM prompt.
- Parsing the LLM JSON output to enforce the strict `status` enum.
- Bounding failures to `INCONCLUSIVE` or `NOT_WARRANTED`.

### 4. Storage Layer
The contract uses `TreeMap[str, RelianceWarrant]` to store all warrants immutably on Studionet. The frontend merely queries this map.

## Explicit Decisions
- **No Backend**: We explicitly reject adding a Node.js/Postgres backend. All Warrants are public and stored on-chain. This minimizes hackathon scope and maximizes the demonstration of GenLayer's capabilities as a standalone decentralized infrastructure.
