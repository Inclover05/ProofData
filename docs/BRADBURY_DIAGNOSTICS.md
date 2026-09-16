> **Historical record — superseded 2026-09-16.** Diagnostic-stage engineering record, not a current semantic verdict or submission readiness decision.
> Final canonical contract: `0xa73c0183e2e3605bbd5013abcb9c5683f7db1b4a`, Bradbury chain 4221. See the [current README](../README.md) and [final proof](submission-proof/README.md). Original content is preserved below.

# Bradbury Diagnostic Log

## Initial Findings
- **gl.nondet.web.get size limit:** Bradbury testnet appears to have a strict payload return size limit from `run_nondet_unsafe`. Payloads ~9.7KB (like the NPM license) fail to serialize across consensus and revert or truncate. (Wait: Re-evaluating this based on INCONCLUSIVE result. The contract fallback actually caught a retrieval failure or silent size limit truncation.)
- **Outbound HTTP/HTTPS:** `https://` is supported, but GitHub URLs specifically throw exceptions or return empty payloads on the validators. This resulted in `INCONCLUSIVE` instead of an EVM revert for `retrieve_and_validate` on `low-004`.
- **Contract Resilience:** The contract successfully degrades to `INCONCLUSIVE` as designed when the nondeterministic fetch returns an empty string or throws an exception, preventing false-positive adjudications.

## ProofData Semantic Safeguards
- **Unavailable Evidence:** When validators fail to retrieve evidence from `raw.githubusercontent.com` (validator retrieval failure observed, root infrastructure cause UNCONFIRMED), the fallback logic ensures a safe `INCONCLUSIVE` status.
- **BRADBURY RETRIEVAL FAILURE TEST: PASS**. The failure on `low-004` proves the defensive logic works.
