# Bradbury Compact Boundary Fix

**Old Checksum:** 89f44de856700c2ea1f47e0967aaeb2e227e64c56a48f122cb5747fe33b9d4a6
**New Checksum:** $(shasum -a 256 contracts/reliance_warrant.py | awk '{print $1}')

**Reason:** GenVM imposes an undocumented serialization threshold (somewhere < 9.7KB) for values crossing the `run_nondet_unsafe` boundary. The original architecture passed the full ~9.7KB evidence body across this boundary, which was silently truncated/nullified, resulting in an `INCONCLUSIVE` fallback.

**Specialist Review:** DeepThought @GenLayer confirmed the correct architecture is to fetch, compute the raw-byte hash inside the nondeterministic execution (for both `leader_fn` and `validator_fn`), and return ONLY a compact status/hash tuple (`{"fetch_status": "FETCHED", "hash": "..."}`).

**Exact Diff:**
Only `retrieve_and_validate()` and its nested `_fetch_fingerprint` logic were modified to hash the `response.body` directly using `genlayer.Keccak256(body_bytes).hexdigest()` and return the compact result map.

**Tests:**
- GenVM lint PASSED
- Byte identity (unpkg, jsdelivr) PASSED (d31880ae9181571d18323e1817597e4dcc2d5fb312920a662d1696bb9d7ae0ac)
- Stable Direct suite PASSED
