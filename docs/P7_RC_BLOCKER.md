> **Historical record — superseded 2026-09-16.** Historical RC tooling blocker; final submission uses the existing Bradbury deployment and stable browser SDK.
> Final canonical contract: `0xa73c0183e2e3605bbd5013abcb9c5683f7db1b4a`, Bradbury chain 4221. See the [current README](../README.md) and [final proof](submission-proof/README.md). Original content is preserved below.

# P7 RC Blocker: Direct Mode calldata decoding error

**Environment:**
- `genlayer-test` version: `0.30.0rc2`
- `genlayer-py` version: `0.19.0rc2`
- Python version: `3.12.3`

**Full Error:**
```python
ImportError: Failed to load contract: unexpected end of memory
...
genlayer.py.calldata.DecodingError: unexpected end of memory
```

**Minimal Reproduction:**
Deploying any contract, even a trivial zero-argument canary like:
```python
import genlayer as gl
class StorageZero(gl.Contract):
    def __init__(self):
        pass
```
fails with `genlayer.py.calldata.DecodingError: unexpected end of memory` inside `_inject_message_to_fd0(vm)`.

**Minimal-canary result:** FAIL
**Zero-arg result:** FAIL
**Constructor matrix:** Fails for all (string, integer, none) because the failure occurs at module import time before constructor evaluation.
**ProofData result:** FAIL
**RC1 control result:** NOT AVAILABLE (Dependency conflict prevents installation)
**RC2 result:** FAIL

**Upstream Issue/PR Research:**
Matching Issue: `genlayerlabs/genlayer-testing-suite#113` "direct_deploy fails with calldata decoding error on 0.30.0rc2 (regression from 0.29.2)". Confirmed upstream bug.

**Studio-dev canary result:** NOT ATTEMPTED (Blocked by lack of credentials/instructions for CLI deploy).
**Fee-profile capability:** NOT RUN

**Classification:**
`UPSTREAM_DIRECT_MODE_BUG_CONFIRMED`

**Recommended Resolution:**
Wait for a fix in `genlayer-test` / `genlayer-py` or apply for Tooling Exception Gate (P7-TEG) if we can verify correctness via Studio-dev or another mechanism.
