# ProofData Phase 4B — Research Log

Use this file to record any technical decision that depends on current external documentation.

## Entry template

### Decision
What are we trying to confirm?

### Date checked
YYYY-MM-DD

### Official source
Current official documentation/repository.

### Finding
What is explicitly supported?

### Uncertainty
What remains unverified?

### Decision
What will we implement or test?

---

## Initial research priorities
Before implementation, verify against current official GenLayer material:

1. Recommended project boilerplate/setup.
2. Current Python/Node/tooling requirements.
3. Current Intelligent Contract storage patterns.
4. Current web retrieval pattern.
5. Current structured LLM-output pattern.
6. Current equivalence/consensus testing pattern.
7. Current direct/mock testing framework.
8. Current Studio/integration workflow.
9. Current timestamp/transaction context mechanism for expiry.
10. Current Bradbury deployment path if the spike reaches network validation.

Do not fill these entries from model memory. Research them when the relevant milestone begins.

---

### Decision
Update the project's Antigravity skills with current official GenLayer development practices to avoid using outdated instructions or breaking environmental constraints.

### Date checked
2026-09-10 (Current Session)

### Official source
https://github.com/genlayerlabs/skills (Specifically `genlayer-dev` skills plugin)

### Finding
Official skills include:
- `write-contract`: Outlines equivalence principles (strict_eq, custom validators), error classifications, and the requirement to pin runner versions (no `test` or `latest` alias permitted).
- `genvm-lint`: CLI for AST and SDK validation. `--json` output available to prevent Windows console encoding crashes (e.g. checkmarks causing cp1252 errors).
- `direct-tests`: Fast in-memory tests utilizing pytest fixtures (`direct_vm`, `direct_deploy`). Windows `os.unlink()` issues noted during cleanup of temporary files.
- `integration-tests`: Testing against GLSim or Studio (`gltest`). Differentiates between transaction lifecycle states (`ACCEPTED`/`FINALIZED`) and execution success.
- `genlayer-cli`: Commands for deploying and querying contracts (`genlayer deploy`, `genlayer call`, `genlayer network set`).

### Uncertainty
- Compatibility of `genlayer-test` direct testing on Windows due to the known `[WinError 32]` file locking bug during temporary stdin file cleanup.
- Stability of `genvm-lint` visual output on Windows without explicitly using `--json`.

### Decision
Created Antigravity-compatible skills in `.agents/skills/` (`write-contract`, `genvm-lint`, `direct-tests`, `integration-tests`, `genlayer-cli`) adapted from the official GenLayer source. Integrated project-specific rules (`beginner-teacher`, `test-before-progress`, etc.) into each skill. Did not install Claude-specific plugins.

### Decision
Confirm whether native Windows is compatible with GenLayer testing tools genlayer-test 0.30.0rc2 and 0.29.2.

### Date checked
2026-09-11

### Official source
GenLayer genlayer-project-boilerplate and genlayer-test source code.

### Finding
**Native Windows is completely incompatible with GenLayer testing.** Both Direct Mode and GLSim/Studionet integrations deadlock indefinitely due to a POSIX-only file locking assumption in gltest/direct/loader.py (\os.unlink\ on an open temp file).

### Uncertainty
Whether GenLayer Labs will patch the \os.unlink()\ POSIX-only assumption for Windows support in the future.

### Decision
Native Windows execution failed M0 (Environment smoke test). The user has restricted automatic installation of WSL/Docker. Await user decision on whether to proceed with WSL, apply a local monkey-patch, or pursue another environment setup.

### Decision
Confirm whether the GenLayer test framework functions correctly when executed in a Linux environment (Ubuntu WSL2) rather than native Windows.

### Date checked
2026-09-11

### Official source
GenLayer genlayer-project-boilerplate (`pytest tests/direct/`, `glsim`, `gltest tests/integration/`)

### Finding
The test framework successfully executes on Linux without the `[WinError 32]` deadlock. Both `direct-tests` (in-memory mock) and `integration-tests` (against a background `glsim` server) pass flawlessly. Additionally, the `studionet` hosted GenLayer network is accessible and usable from the CLI.

### Uncertainty
None regarding basic test functionality; WSL2 provides a reliable POSIX layer for GenLayer development.

### Decision
Proceed with Linux (WSL2) as the primary execution environment for ProofData Phase 4B tests.

### Decision
Confirm current GenLayer persistent storage rules and types before designing the Reliance Warrant data model in M1.

### Date checked
2026-09-11

### Official source
GenLayer official SDK documentation (docs.genlayer.com), `genlayer-project-boilerplate` examples (`football_bets.py`), and project Skills repository (`write-contract`).

### Finding
- **Persistent scalar types:** Standard Python primitives (e.g., `str`, `bool`) and specialized numeric types (`u256`, `i256`, `u32`, etc.).
- **Collections:** Native Python `dict` and `list` are prohibited for persistent storage. Must use GenLayer's `TreeMap[K, V]` and `DynArray[T]`.
- **Custom structures:** Must be defined as a standard Python `@dataclass` combined with the GenLayer `@allow_storage` decorator.
- **Contract fields:** Persistent storage variables must be defined as class-level type annotations (e.g., `warrants: TreeMap[str, RelianceWarrant]`), not initialized in the `__init__` constructor.
- **Mutability:** New fields should only be appended at the end of storage classes.
- **Methods:** Modifying state requires the `@gl.public.write` decorator; reading state requires `@gl.public.view`.

### Uncertainty
None regarding basic storage types. We will need to decide whether the `RelianceWarrant` uses a nested `TreeMap` or a single flat structure during M1.

### Decision
The M1 provisional architecture will strictly adhere to `@allow_storage`, `@dataclass`, `TreeMap`, and `DynArray` for the `RelianceWarrant` state model.
