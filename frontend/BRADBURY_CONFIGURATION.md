ProofData's public submission target is recorded once in `proofdata.config.json`:
Bradbury chain 4221, final fixed contract
`0xa73c0183e2e3605bbd5013abcb9c5683f7db1b4a`.

`next.config.ts` publishes that address using the existing
`NEXT_PUBLIC_PROOFDATA_CONTRACT_ADDRESS` key, overriding stale local public
deployment settings without editing secret environment files. Rebuild after a
public configuration change. All readers, wallet clients and lifecycle polling
share `src/lib/genlayer/config.ts` and `chains.testnetBradbury`.

The selected EIP-6963 provider signs transactions. A client-local EIP-1193
adapter changes only the outer gas limit for submissions to Bradbury's consensus
contract: the greater of 2,000,000 and the SDK estimate multiplied by 1.5, rounded
up. SDK calldata, destination, value, nonce and gas price are preserved. No fee
deposit is invented. Other provider requests pass through unchanged.

Transaction tracking uses `gen_getTransactionReceipt` and distinguishes
ACCEPTED from FINALIZED. Successful finalization requires consensus agreement
and FINISHED_WITH_RETURN. Persisted tracking is scoped by chain and contract;
reloading resumes reads, never a write. Verdicts come from `get_warrant`.

The production build uses Next.js's supported Webpack option because the current
execution environment blocks the port binding used by Turbopack's CSS worker.
