# Known Issues

## RESOLVED
- **Integer Sizing Validation:** Standard Python `int` types are rejected by `genvm-lint` for persistent storage in dataclasses. Migrated all timestamp storage to GenVM `u256`.
- **Web Rendering Limitations:** Transient fetch errors across different GenLayer simulation modes. Architected the contract with `try/except` blocks to coerce all transient fetch errors into the safe `INCONCLUSIVE` status.

## WORKAROUND
- **GLSim `Address` Serialization Bug:** `genlayer-test` local JSONRPC serialization fails on dataclasses containing `Address` types in GLSim. 
  - *Workaround*: We retain the `Address` type for internal on-chain state to preserve GenLayer identity semantics, but expose a client-safe `RelianceWarrantDTO` casting the address to `.as_hex` for public RPC compatibility.

## OPEN
- **GLSim Nondeterministic Fetch Failures:** Native GLSim `live_io.py` HTTP fetching with Playwright occasionally fails with 502s depending on local dependencies, causing deterministic hash-mismatches during integration tests.

## FUTURE HARDENING
- **Production Prompt Injection Resistance:** Current constraints successfully bounds prompt injections (e.g. instructing the model to output "HACKED") to safe `INCONCLUSIVE` defaults. However, this is not a formal proof against all semantic jailbreaks.
- **Warrant Revocation:** No current mechanism exists to revoke a warrant before its `expires_at` timestamp.
- **Evidence Lineage:** The current spike binds evidence strictly by content hash, but lacks deep provenance graphs mapping upstream origin points.
