# Specialist Review: Bradbury Nondeterministic Boundary

**Specialist:** DeepThought @GenLayer
**Verdict:** MODIFY
**Confidence:** HIGH

**Diagnosis:**
The Bradbury blocker is caused by ProofData returning the entire 9,742 byte external evidence document across the `gl.vm.run_nondet_unsafe(...)` boundary. A 9742-byte raw nondeterministic RETURN failed in our tested Bradbury runner, while compact returns derived from the same successfully fetched 9742-byte document succeeded. 
(Note: No strict documented threshold like 4KB or 9.7KB was established; the empirical fact is simply that 9.7KB fails while <100 bytes succeeds).

**Approved Architecture:**
To fix this, the correct GenLayer-native architecture is:
1. Fetch full evidence inside nondeterministic execution.
2. Raw-byte hashing inside nondeterministic execution.
3. Compact structured fingerprint return crossing the boundary (`{"fetch_status": "FETCHED", "hash": "..."}`).
4. Independent validator re-fetch and re-hash.
5. Deterministic `expected_hash` comparison after consensus.
