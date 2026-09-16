# Architectural Decisions

## Decision 1: DynArray Initialization in Dataclasses
**Date:** 2026-09-11
**Context:** GenLayer persistent storage requires the use of `DynArray[T]` instead of Python's native `list[T]` for array fields.
**Observation:** Attempting to instantiate `DynArray[str]()` directly within the contract constructor raises `TypeError: this class can't be instantiated by user`.
**Decision:** When constructing an `@allow_storage` dataclass, pass a standard Python `list` to the constructor. The GenLayer serialization engine handles the internal conversion to `DynArray` automatically. The field must still be explicitly annotated as `DynArray[T]` in the class definition.

## Decision 2: Workspace Normalization
**Date:** 2026-09-11
**Context:** M1 was accidentally developed in a disposable environment testing repository (`genlayer-linux-test`).
**Decision:** All development must occur in the canonical `ProofData` workspace. Created a localized virtual environment, pulled over the contract code, configured `pyproject.toml`, and reproduced test runs successfully to prevent coupling to transient test environments.

## Final submission authority — 2026-09-16

Canonical target is Bradbury 4221, `0xa73c0183e2e3605bbd5013abcb9c5683f7db1b4a`, source SHA-256 `c03894f85ea4afd13a2fe536274589b666e952ef40980a6cfae949bc9fc0dd1d`. The pre-fix hardened deployment remains historical. The final same-evidence LOW/HIGH result and real browser E2E are authoritative; no rerun, redeployment or frontend verdict generation is required. README and docs/submission-proof are the submission entry points. Prior plans and diagnoses are preserved and explicitly marked where superseded.
