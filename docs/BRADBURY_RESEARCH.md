# Bradbury Testnet Research

## A. Current Bradbury network identity
- **SOURCE:** `npx genlayer network info testnet-bradbury`
- **DATE:** 2026-09-14
- **FINDING:** Network: Genlayer Bradbury Testnet, Chain ID: 4221, RPC: https://rpc-bradbury.genlayer.com, Explorer: https://explorer-bradbury.genlayer.com/
- **PROOFDATA IMPLICATION:** Bradbury is a separate distinct network from Studio-dev (Chain 61997) and Studionet (Chain 61999).

## B. Current supported CLI version
- **SOURCE:** Local `npx genlayer --version` / Official docs
- **DATE:** 2026-09-14
- **FINDING:** The currently resolved default is `0.39.2` (stable track).
- **PROOFDATA IMPLICATION:** The stable CLI is natively aware of Bradbury.

## C & D. Current supported genlayer-py and genlayer-test version
- **SOURCE:** Official integration-tests SKILL.md
- **DATE:** 2026-09-14
- **FINDING:** The official integration tests skill documents `get_contract_factory()` and `.transact()` syntax, which aligns with recent stable `genlayer-test` versions.
- **PROOFDATA IMPLICATION:** Our stable ProofData toolchain can potentially target Bradbury natively.

## E. Current supported GenVM runner/header expectations
- **SOURCE:** Architecture assumption
- **DATE:** 2026-09-14
- **FINDING:** The broken v0.6 RC GenVM runner is specific to Studio-dev. Bradbury represents a more stable network environment.
- **PROOFDATA IMPLICATION:** We do not inherit the `invalid_contract runner malformed` bug automatically.

## F. Current supported genlayer-js version
- **SOURCE:** Official JS exports / chains
- **DATE:** 2026-09-14
- **FINDING:** `genlayer-js` exports `testnetBradbury` in its `chains` configuration natively.
- **PROOFDATA IMPLICATION:** The frontend can be directed to Bradbury without custom RPC configurations.

## G & H. Fee semantics and explicit FeesDistribution
- **SOURCE:** GenLayer CLI `genlayer account` and Official CLI SKILL.md
- **DATE:** 2026-09-14
- **FINDING:** "For testnets (Bradbury, Asimov), fund the account before deploying or writing... The faucet uses Cloudflare Turnstile."
- **PROOFDATA IMPLICATION:** Bradbury requires a GEN balance. We must configure funded private keys.

## I. Current transaction-success semantics
- **SOURCE:** Official integration-tests SKILL.md
- **DATE:** 2026-09-14
- **FINDING:** "`ACCEPTED` and `FINALIZED` are transaction lifecycle states, not proof that contract execution succeeded. Always assert `tx_execution_succeeded(receipt)`."
- **PROOFDATA IMPLICATION:** Success validation on Bradbury requires deep receipt inspection, not just EVM finality.

## J. Funding/account requirements
- **SOURCE:** Official CLI SKILL.md
- **DATE:** 2026-09-14
- **FINDING:** Requires a funded programmatic account (e.g. `ACCOUNT_PRIVATE_KEY_1`) via the official Faucet (https://testnet-faucet.genlayer.foundation/).
- **PROOFDATA IMPLICATION:** Local testing requires safe injection of `.env` variables containing a funded private key.

## K & L. Deploy and integration-test syntax
- **SOURCE:** Official skills
- **DATE:** 2026-09-14
- **FINDING:** CLI: `genlayer deploy --contract ...`. Python: `gltest tests/integration/ -v -s --network testnet_bradbury`.
- **PROOFDATA IMPLICATION:** Standard stable tooling workflow applies.
