import pytest
import json
from eth_utils import keccak

def get_hash(text: str) -> str:
    return keccak(text.encode('utf-8')).hex()

def setup_mocks(vm, url, payload, expected_status):
    vm.mock_web(
        f".*{url}.*",
        {"status": 200, "body": payload}
    )
    vm.mock_llm(
        r".*Evaluate the following evidence.*",
        json.dumps({"status": expected_status, "reason": "Test reason"})
    )

def test_adjudicate_warranted(direct_vm, direct_deploy, direct_alice):
    contract = direct_deploy("contracts/reliance_warrant.py")
    direct_vm.sender = direct_alice
    
    payload = "strong evidence"
    expected_hash = get_hash(payload)
    
    setup_mocks(direct_vm, "valid.com", payload, "WARRANTED")
    
    contract.create_warrant("w1", "https://valid.com", expected_hash, "P", "L", [], 100)
    
    # Manually transition to PENDING_AI since retrieve_and_validate does it
    contract.retrieve_and_validate("w1", 50)
    assert contract.get_warrant("w1").status == "PENDING_AI"
    
    # Adjudicate!
    contract.adjudicate("w1")
    
    assert contract.get_warrant("w1").status == "WARRANTED"

def test_adjudicate_conditional(direct_vm, direct_deploy, direct_alice):
    contract = direct_deploy("contracts/reliance_warrant.py")
    direct_vm.sender = direct_alice
    
    payload = "partial evidence"
    expected_hash = get_hash(payload)
    
    setup_mocks(direct_vm, "valid.com", payload, "CONDITIONAL")
    
    contract.create_warrant("w1", "https://valid.com", expected_hash, "P", "L", [], 100)
    contract.retrieve_and_validate("w1", 50)
    contract.adjudicate("w1")
    
    assert contract.get_warrant("w1").status == "CONDITIONAL"

def test_adjudicate_hash_changed_fails(direct_vm, direct_deploy, direct_alice):
    contract = direct_deploy("contracts/reliance_warrant.py")
    direct_vm.sender = direct_alice
    
    payload = "valid evidence"
    expected_hash = get_hash(payload)
    
    # First mock for retrieve_and_validate on valid.com
    direct_vm.mock_web(r".*valid.com.*", {"status": 200, "body": payload})
    
    contract.create_warrant("w1", "https://valid.com", expected_hash, "P", "L", [], 100)
    contract.retrieve_and_validate("w1", 50)
    assert contract.get_warrant("w1").status == "PENDING_AI"
    
    # Change web payload before adjudicate!
    # Instead of valid.com which is already mocked, I'll clear mocks!
    direct_vm.clear_mocks()
    direct_vm.mock_web(r".*valid.com.*", {"status": 200, "body": "hacked evidence"})
    
    # LLM should not even be called, but we mock it just in case
    direct_vm.mock_llm(r".*", json.dumps({"status": "WARRANTED", "reason": "Test reason"}))
    
    contract.adjudicate("w1")
    
    assert contract.get_warrant("w1").status == "INCONCLUSIVE"
