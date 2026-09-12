---
name: direct-tests
description: Write and run fast direct mode tests for GenLayer intelligent contracts.
---

# Direct Mode Tests

Write fast, in-memory tests for intelligent contracts. No server, no Docker — tests run in ~30-50ms.

**PROJECT SPECIFIC RULES:**
- **Test-Before-Progress**: Do not claim success until direct tests pass. If a test fails, investigate and document it.
- **Documentation-First Verification**: Ensure the test commands match the official `pytest tests/direct/ -v` usage.

## Running Tests
```bash
pytest tests/direct/ -v
```

## Fixtures
Available from `genlayer-test` pytest plugin:
`direct_vm`, `direct_deploy`, `direct_alice`, `direct_bob`, `direct_owner`, etc.

## Basic Test Pattern
```python
def test_set_and_get(direct_vm, direct_deploy, direct_alice):
    contract = direct_deploy("contracts/my_contract.py")
    direct_vm.sender = direct_alice

    contract.set_data("hello")
    assert contract.get_data(direct_alice) == "hello"
```

## Mocking
Direct tests must mock web and LLM nondeterministic calls.
```python
# Web
direct_vm.mock_web(r".*api\.example\.com/prices.*", {"status": 200, "body": '{"price": 42.5}'})

# LLM
direct_vm.mock_llm(r".*Extract the match result.*", '{"score": "2:1"}')

# Reset
direct_vm.clear_mocks()
```

## Cheatcodes
- `direct_vm.sender = direct_alice`
- `with direct_vm.expect_revert("error"): ...`
- `with direct_vm.prank(direct_bob): ...`

**Warning**: There is a known bug in `genlayer-test` on Windows regarding temporary file deletion during direct mode tests (`[WinError 32]`). Do not modify tests just to silence this without understanding it.
