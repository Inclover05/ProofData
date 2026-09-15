# PROOFDATA P7-B0 OFFICIAL BRADBURY REPORT

## Executive Summary
The ProofData canary successfully deployed, read, and wrote to the official Bradbury testnet using the **GenLayer CLI (0.39.2)** and the **stable v0.14/v0.18 contract syntax**. 
However, the stable **Python integration toolchain (`genlayer-test 0.29.2` / `genlayer-py 0.18.0`)** is partially incompatible with Bradbury due to recent RPC changes.

**Status:** PARTIAL PASS / INTEGRATION BLOCKED

## Toolchain Compatibility Answer
> Can the current validated ProofData stable toolchain target Bradbury directly?

**No, not completely.**
The CLI toolchain (`npx genlayer 0.39.2`) **can** deploy and interact with contracts on Bradbury.
However, `gltest` (`genlayer-test 0.29.2` + `genlayer-py 0.18.0`) **cannot** run integration tests against Bradbury because the testnet RPC endpoint for `gen_call` now returns a JSON object (dictionary) instead of a raw hex string, crashing the stable `genlayer-py` client with `TypeError: can only concatenate str (not "dict") to str`.

## Validated Canary Facts
1. **Contract Requirements:** Bradbury enforces a strict GenVM runner header. The canary must include `# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }` at the top of the file. Without it, GenVM fails execution with `absent_runner_comment`.
2. **Syntax:** The canary successfully utilized the `class Storage(gl.Contract):` syntax paired with `from genlayer import *`.
3. **CLI Arguments:** The `genlayer` CLI variadic `--args` parameter must be passed as explicitly quoted JSON strings (e.g., `--args '"initial"'`). Incorrect quoting causes `AttributeError: 'list' object has no attribute 'encode'` during instantiation on GenVM.
4. **Fees:** Write operations require explicit `--fee-value` (e.g., `--fee-value 10000000000000000`) on the CLI because the stable `genlayer-js` cannot derive dynamic fees on Bradbury.

## Lifecycle Verification
- **Network:** `testnet_bradbury` (Chain ID 4221)
- **Account:** Generated programmatic wallet funded via faucet.
- **Canary Deploy:** Transaction `0xed87fdbfac8a7315fc659b86895d523d446dd564fa8398fcea5602c5b95c88ff` completed with `txExecutionResultName: 'FINISHED_WITH_RETURN'`.
- **Canary Initial Read:** CLI returned `"initial"`.
- **Canary Write:** Executed `update_storage("updated")` via transaction `0x5797ef2006f216afa61515de9a29474021b8bd4643398441b4ba66c6daaa0252`. Trace verified real network processing (`FINISHED_WITH_RETURN` and 5 validators).
- **Canary Updated Read:** CLI returned `"updated"`.
- **Integration Test (`gltest`):** FAILED. Blocked by RPC dictionary format mismatch in `genlayer-py`.

## Next Actions
Since `gltest` is blocked by RPC incompatibility on Bradbury, we must choose whether to:
1. Temporarily bypass `gltest` for Bradbury and rely on CLI/frontend integrations for testing.
2. Upgrade exclusively `genlayer-py` to a newer RC version that supports the dictionary RPC schema, while maintaining `genlayer-test` stability.
3. Migrate to the full v0.6 RC stack (which failed Studio-dev but might be functional against Bradbury).
