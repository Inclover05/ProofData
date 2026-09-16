# Final ProofData proof bundle

This directory is a compact recorded proof of the final Bradbury deployment, thesis and real browser lifecycle. It contains no wallet secrets, generated review tree or dependency directory. The product itself reads live contract state; these files are evidence snapshots.

## Result

| Record | Warrant | Authoritative verdict |
| --- | --- | --- |
| LOW thesis | `storage-fix-low-diag-001` | `WARRANTED` |
| HIGH thesis | `thesis2-high-001` | `NOT_WARRANTED` |
| Fresh MetaMask E2E | `warrant-4905a143-4d22-4603-9763-c15e87166a47` | `WARRANTED` |

All ten writes (deployment and three lifecycles) finalized `AGREE / FINISHED_WITH_RETURN`, with successful outer receipts. LOW/HIGH used the same evidence and implementation; purpose and risk changed. No result-shopping occurred.

## Exact artifacts

- [deployment.json](deployment.json): address, network, source checksum, runner, deployment IDs and votes.
- [low.json](low.json): exact inputs, all three writes, semantic reason and consensus.
- [high.json](high.json): exact inputs, all three writes, semantic reason and consensus.
- [same-evidence.json](same-evidence.json): shared identity/implementation and changed reliance context.
- [fixture/index-BCPb0x30.d.ts](fixture/index-BCPb0x30.d.ts): the exact 723-byte published evidence artifact.
- [browser-e2e.json](browser-e2e.json): real MetaMask writes, intermediate readbacks, final state and cold reload evidence.
- [verification.json](verification.json): measured checks and distinctions between live and simulated acceptance.
- [verification-live.json](verification-live.json): fresh public RPC verification of the existing ten writes.
- [verification-browser.json](verification-browser.json): final read-only acceptance against the production build.
- [manifest.json](manifest.json): byte sizes, SHA-256 checksums and provenance of compact artifacts.

Source SHA-256 identifies the deployed Python file. Evidence identity uses **Keccak-256**, not SHA-256. The manifest SHA-256 hashes package files for local integrity; it is not a signature or replacement for on-chain verification.

## Independent verification

Install frontend dependencies using `npm ci` in `frontend/`, then run from the repository root:

```bash
node scripts/submission/verify-final-proof.cjs
```

The script reads public RPCs, verifies finalized deployed bytes, checks all ten existing receipts, reads the three warrants and compares validator hash/semantic output to this bundle. It has no account or write operation. A network outage is a verification blocker, not evidence that a new warrant should be created.

Original larger diagnostics remain under `scratch/bradbury_canary/p7-final-thesis-v2-20260916/` and `scratch/bradbury_canary/frontend-bradbury-migration-20260916/`. These references identify preserved local engineering evidence; the compact files here are sufficient without copying those local trees. Historical pre-fix attempts are not substituted for the final proof.

## Scope

The contract stores status; semantic reasons below are consensus execution output, not a persisted warrant field. `INCONCLUSIVE` can be semantic or infrastructural and must be investigated causally. This bundle demonstrates the specified testnet cases, not production readiness or a universal security guarantee. The [architecture](../SUBMISSION_ARCHITECTURE.md) states the implementation boundaries.
