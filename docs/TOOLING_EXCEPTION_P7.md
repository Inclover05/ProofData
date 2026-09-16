> **Historical record — superseded 2026-09-16.** Historical tooling exception; do not reopen this migration to demonstrate the finalized project.
> Final canonical contract: `0xa73c0183e2e3605bbd5013abcb9c5683f7db1b4a`, Bradbury chain 4221. See the [current README](../README.md) and [final proof](submission-proof/README.md). Original content is preserved below.

# ProofData Tooling Exception — P7 RC Migration

## Situation
The canonical local testing strategy (`genlayer-test` + `direct_deploy`) is completely broken in `0.30.0rc2` / `0.19.0rc2`.
Any attempt to deploy a contract locally throws a fatal WASM memory decoding error during initialization (`genlayer.py.calldata.DecodingError: unexpected end of memory`).

This was isolated to an upstream framework regression (Issue #113) and has nothing to do with ProofData's logic. 

## Exception Granted
To avoid blocking the hackathon migration on an upstream test harness defect, we authorized a **Tooling Exception Gate (P7-TEG)**.

The exception permits substituting the broken `direct_mode` local tests with **real integration tests directly against `studio_devnet`**.

## Integration Proof
We wrote custom integration scripts bypassing `direct_deploy` and using `gl_client.deploy_contract` against the live `studio_devnet`.

### Discovered Network Requirements
1. **Fees Distribution:** Unlike local tests, `studio_devnet` requires accurate fee estimation. We successfully mapped this using `gl_client.estimate_transaction_fees()` for deploys and `gl_client.estimate_transaction_fees_for_write()` for mutations.
2. **Account Funding:** We successfully utilized the SDK's faucet (`gl_client.fund_account(..., 10**18)`).
3. **Receipt Finalization:** We successfully handled the asynchronous network lifecycle by awaiting `gl_client.wait_for_transaction_receipt(..., wait_until='finalized')` and extracting the `contract_address` from `receipt['data']['contract_address']`.

### Ephemeral Lifecycle Execution
We successfully deployed an ephemeral copy of the `ProofDataRelianceLayer` contract to `studio_devnet`, executed `create_warrant`, and successfully triggered semantic `adjudicate`.

## Outcome
**P7-TEG: PASS**

The Tooling Exception is granted. The upstream local testing bug is formally bypassed. We have proven that the ProofData contract executes correctly on the RC `studio_devnet` runtime. 

We may now proceed to **P7-RS (Controlled Studio-dev Migration Resume)**.
