---
name: genvm-lint
description: Validate GenLayer intelligent contracts with the GenVM linter.
---

# GenVM Lint

Validate intelligent contracts for safety, correctness, and SDK compliance.

**PROJECT SPECIFIC RULES:**
- **Test-Before-Progress**: Always lint before testing. If linting fails, stop and fix it before progressing.
- **Beginner Teaching**: Explain lint errors and how to fix them to the user.

## Setup
Requires `genvm-linter` (included in `requirements.txt`).

## Workflow
Run `genvm-lint check` after writing or modifying a contract. Fix all errors before running tests.
```bash
genvm-lint check contracts/my_contract.py
```

## Commands
- `genvm-lint check <file>`: Runs both lint (AST safety) and validate (SDK semantics) in one pass.
- `genvm-lint schema <file>`: Extract ABI.
- `genvm-lint typecheck <file>`: Runs Pyright.

## Output formats
If parsing in scripts, use `--json`. Note that on Windows, human output might crash due to Unicode characters (e.g., `cp1252` encoding). Use `--json` to bypass console encoding crashes if needed.

## Agent Workflow
When fixing lint errors iteratively:
1. Run `genvm-lint check contract.py --json`
2. Parse JSON for specific errors
3. Fix each error in the contract
4. Re-run check until `"ok": true`
5. Proceed to tests
