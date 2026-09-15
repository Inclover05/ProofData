# Bradbury Evidence Provenance

**Original repository:** npm/cli
**Original commit:** 328f63c72dd3d72d7cdc0ded638cd9c6a41e2f31
**Original GitHub URL:** https://raw.githubusercontent.com/npm/cli/328f63c72dd3d72d7cdc0ded638cd9c6a41e2f31/LICENSE

**Why original retrieval is unusable on Bradbury:**
Diagnostic canaries proved that while the URL is reachable, the GenVM Nondet execution environment currently imposes a strict return payload size limit. The 9,742 byte text is fetched successfully but truncated/nulled (`padded`) when serialized across consensus by `run_nondet_unsafe`. This forces `result` to be empty, triggering the safe `INCONCLUSIVE` fallback.

**Selected retrieval mirror:** https://unpkg.com/npm@10.8.1/LICENSE
**Original byte length:** 9742
**Mirror byte length:** 9742
**Original fingerprint:** d31880ae9181571d18323e1817597e4dcc2d5fb312920a662d1696bb9d7ae0ac
**Mirror fingerprint:** d31880ae9181571d18323e1817597e4dcc2d5fb312920a662d1696bb9d7ae0ac

**Byte-for-byte identical:** YES
**Bradbury validator retrieval:** FAIL (GenVM size limits truncate the 9.7KB payload identically across all mirrors, resulting in `INCONCLUSIVE`).
