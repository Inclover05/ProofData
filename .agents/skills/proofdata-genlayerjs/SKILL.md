---
name: proofdata-genlayerjs
description: Frontend integration guardrail for the already-validated ProofData Intelligent Contract.
---
# ProofData GenLayerJS

## Purpose
Frontend integration guardrail for the already-validated ProofData Intelligent Contract.

Do not invent technical guidance from memory.

When used, first consult CURRENT official GenLayerJS documentation and the validated ProofData architecture.

## Governance
It governs:
- Studionet configuration
- contract reads
- wallet-signed writes
- fee estimation
- transaction lifecycle
- decision/finalization waiting
- wallet connection
- Reliance Warrant DTO parsing
- public requester string representation
- error states.

It must never modify the validated Intelligent Contract merely because frontend integration is inconvenient.
