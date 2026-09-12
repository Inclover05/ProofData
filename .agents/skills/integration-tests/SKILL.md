---
name: integration-tests
description: Write and run integration tests against a GenLayer environment.
---

# Integration Tests

Run contracts against a real GenLayer environment (GLSim, Studio, or testnet) with full consensus validation.

**PROJECT SPECIFIC RULES:**
- **Test-Before-Progress**: Do not advance until integration tests pass if required by the milestone.
- **Beginner Teaching**: Explain how integration tests differ from direct tests (consensus validation vs in-memory mock).

## Running Tests
```bash
gltest tests/integration/ -v -s
gltest tests/integration/ -v -s --network localnet
gltest tests/integration/ -v -s --network studionet
```

## Test Pattern
```python
from gltest import get_contract_factory
from gltest.assertions import tx_execution_succeeded

def test_full_flow():
    factory = get_contract_factory("MyContract")
    contract = factory.deploy(args=[])

    # Write methods return transaction receipts
    tx_receipt = contract.set_data(args=["hello"]).transact()
    assert tx_execution_succeeded(tx_receipt)

    # Read methods return values directly
    result = contract.get_data(args=[contract.address]).call()
    assert result == "hello"
```

## Execution Success vs Transaction Lifecycle
`ACCEPTED` and `FINALIZED` are transaction lifecycle states, not proof that contract execution succeeded. 
Always assert `tx_execution_succeeded(receipt)` before reading state or assuming the code worked.

## Write vs Read Calls
- **Write methods**: `contract.method().transact()`
- **Read methods**: `contract.method().call()`

## Environments
- **GLSim**: `glsim --port 4000 --validators 5` (lightweight, no Docker)
- **Studio local**: `genlayer up` (Docker required)
- **StudioNet**: `studio.genlayer.com` (Gasless, no funding needed, rate-limited)
