> **Historical record — superseded 2026-09-16.** Studionet/Studio-dev planning record, not current network configuration.
> Final canonical contract: `0xa73c0183e2e3605bbd5013abcb9c5683f7db1b4a`, Bradbury chain 4221. See the [current README](../README.md) and [final proof](submission-proof/README.md). Original content is preserved below.

# Network Promotion Plan

## 1. Current Stable Environment
- **Network**: Studionet
- **Purpose**: Stable functional baseline
- **Chain ID**: `0xf22f` (61999)
- **RPC**: `https://studio.genlayer.com/api`
- **ProofData Role**: Proven contract deployment, real storage, wallet integration, and successful browser-originated P3 writes.

## 2. Current Transaction Proof (Studionet)
- **P3 Real Warrant**: `warrant-cb5653e5-76f4-4dcd-9ae4-d22f81786fea`
- **Transaction Hash**: `0x3b359bc5bda475acd79da158212b094cd968454a0d8d974d4d9a144a65b6b23f`
- **Canonical Studionet Contract**: `0xE8B906DA3Bc2E2c40e9B2C3A8450B50a96f20d89`

## 3. Package Versions (Stable Baseline)
- **genlayer-js**: 1.1.8
- **genlayer-py**: Compatible with Studionet (v0.18.x range)
- **CLI**: Stable Studionet-compatible version

## 4. Official Network Research & Agent Tank
- **Agent Tank Requirements**: NONE FOUND explicitly defining a mandatory network.
- **Studio-dev**: Release-candidate (RC) preview for Consensus v0.6. Features new fee profiles and newer SDKs. High reset risk.
- **Bradbury**: Persistent public testnet. Currently lags behind v0.6 RC preview.

## 5. Version Compatibility Matrix (Migration to Studio-dev)
| Component | Current (Studionet) | Target (Studio-dev) | Breaking Change |
| --- | --- | --- | --- |
| Consensus | Stable | v0.6 RC | Yes (State, networking) |
| genlayer-js | v1.1.8 | v2.0 RC | Yes (Write flow, fee params) |
| genlayer-py | Stable | v0.19 RC | Yes (SDK syntax updates) |
| CLI | Stable | v0.40 RC | Yes (Config, targets) |
| gltest | Stable | v0.6-compatible | Yes (Fee profiling) |

*Rule: Do NOT mix stable and RC components.*

## 6. Fee Migration Requirements
- **Studionet**: Standard EVM gas estimation (`client.estimateTransactionGas`) maps dynamically to validator consensus without manual frontend fee arrays.
- **Studio-dev (v0.6)**: Requires explicitly generated `fee-profile.json` using `gltest --fee-profile`. The frontend SDK (`genlayer-js` v2.0 RC) will likely require specific `feeValue` or allocations derived from this profile during `writeContract`.

## 7. P4 Prerequisite
P4 (Transaction Lifecycle Tracking) MUST be completed on the current stable Studionet environment using the P3 transaction fixture before any migration begins.

## 8. Studio-dev Entry Gate (`NETWORK-G0`)
Migration begins **only if**:
- P4 stable lifecycle PASSES.
- Target environment and coherent RC versions are verified.
- Upgrade impact and fee-profile requirements are understood.
- Rollback path exists.
- Stable Studionet baseline (this document) is preserved.

## 9. Studio-dev Migration Checklist (`NETWORK-M1`)
1. Create a migration branch.
2. Install exact matching RC family.
3. Configure `studioDevnet` RPC (never overwrite `studionet`).
4. Resolve incompatibilities and generate `fee-profile.json`.
5. Deploy unchanged contract to Studio-dev and record the new canonical address.
6. Run full regression (read, write, EIP-6963, QA).

## 10. Reset/Recovery Strategy (Studio-dev)
Studio-dev is subject to resets. We must:
- Keep scripts for reproducible deployments.
- Maintain deterministic evidence fixtures.
- Preserve Studionet as the durable historical artifact backup.

## 11. Bradbury Criteria
- **Bradbury Status**: RECHECK AT NETWORK-G0 / MIGRATION TIME
- Compatible v0.6 stack has been fully promoted to Bradbury.
- Agent Tank rules actively reward/allow it.
- Time permits a safe rollout.

## 12. Final Target Decision
- **FINAL HACKATHON TARGET**: PROVISIONAL — TO BE DECIDED AT NETWORK-G0 USING CURRENT OFFICIAL REQUIREMENTS AND CURRENT NETWORK COMPATIBILITY.
- **Reason**: Agent Tank typically favors demonstrating the latest GenVM capabilities. Since no explicit rule binds us to Bradbury yet, Studio-dev provides the most accurate environment to test the incoming v0.6 standard. 
- **Confidence**: MEDIUM (Depends on timeline of the hackathon vs v0.6 stabilization).
- RC Direct Mode bug identified (#113). Network promotion paused.
