# Final deployment — 2026-09-16

Canonical submission target: **Bradbury Testnet, chain 4221**.

- Contract: `0xa73c0183e2e3605bbd5013abcb9c5683f7db1b4a`.
- Source SHA-256: `c03894f85ea4afd13a2fe536274589b666e952ef40980a6cfae949bc9fc0dd1d`.
- Storage-boundary repair checkpoint: `35c0b3865a6d8a455556c110f005fb1561141e7d`.
- Deployment outer EVM: `0xd1595219d09786f16c07c959733083075c8bad2a415fa819edf6e9bfefe7daa5`.
- Deployment GenLayer: `0x97691f5fd33ad0daaaefa67570a785a3a5af9a56e1724605fcf7547a49089f6d`.
- Finalization: `FINALIZED / AGREE / FINISHED_WITH_RETURN`, five AGREE votes, outer receipt `0x1`.
- Deployed code verified byte-for-byte against `contracts/reliance_warrant.py`.
- Browser SDK: `genlayer-js@1.1.8`, `testnetBradbury`.

[Compact deployment proof](submission-proof/deployment.json) records the full runner dependency and consensus. Runtime configuration: [frontend/proofdata.config.json](../frontend/proofdata.config.json).

## Historical pre-fix hardened deployment

`0xb0557237CcEB48cAB5c32e4DAd5C087CB9126e0B` is preserved as pre-fix engineering evidence. Its adjudication dereferenced persistent storage inside nondeterministic execution and failed before web/LLM execution. It is not canonical and must not be used for new product flows.

## Earlier deployment records

The following values are retained for provenance; their historical status labels do not describe the final submission target.

# ProofData Deployments

## STUDIONET
- Network: `studionet`
- Contract: `0xE8B906DA3Bc2E2c40e9B2C3A8450B50a96f20d89`
- Source Checksum: `89f44de856700c2ea1f47e0967aaeb2e227e64c56a48f122cb5747fe33b9d4a6`
- Status: FROZEN BASELINE

## Historical earlier Bradbury deployment (superseded)
- Network: `testnet-bradbury` (Chain ID: 4221)
- Contract: `0x31cD191D9fa7Ee89D770207301A0801207E06A4A`
- Source Checksum: `89f44de856700c2ea1f47e0967aaeb2e227e64c56a48f122cb5747fe33b9d4a6`
- Deployment Tx: `0x57a89409feead3d07cf1f572dff4536f9fd29e9fb838c2738fd4e53d67df644d`
- Status: ACTIVE TARGET at the historical checkpoint; superseded
