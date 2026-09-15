# Bradbury Specialist Review (DeepThought)

**Date:** 2026-09-14
**Source:** DeepThought @GenLayer

## Conclusions & Recommendations
- **DEPLOY PROOFDATA TO BRADBURY:** GO
- **Recommended Architecture:** Stable Bradbury stack
- **CLI:** 0.39.2
- **genlayer-js:** 1.1.8
- **Runner Pin:** Required (`# { "Depends": "..." }`)
- **Semantic Contract Changes:** None expected. Non-deterministic semantic architecture must remain intact.
- **Migration restrictions:** Do NOT migrate ProofData to the v0.6 RC family. Do NOT mix `genlayer-test 0.29.2` with `genlayer-py 0.19.0rc2`. 
- **gltest on Bradbury:** Recorded as `BLOCKED_TOOLING` due to RPC schema changes (dict vs string on `gen_call`).
- **Validation Harness:** Use real Bradbury execution + JS integration harness as final network validation.

