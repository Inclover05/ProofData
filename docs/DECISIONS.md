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
