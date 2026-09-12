import pytest
import json
from eth_utils import keccak

def get_hash(text: str) -> str:
    return keccak(text.encode('utf-8')).hex()

def test_equivalence_agrees(direct_vm, direct_deploy, direct_alice):
    contract = direct_deploy("contracts/reliance_warrant.py")
    direct_vm.sender = direct_alice
    
    payload = "strong evidence"
    expected_hash = get_hash(payload)
    
    direct_vm.mock_web(r".*", {"status": 200, "body": payload})
    direct_vm.mock_llm(r".*", json.dumps({"status": "WARRANTED", "reason": "Test reason"}))
    
    contract.create_warrant("w1", "https://valid.com", expected_hash, "P", "L", [], 100)
    contract.retrieve_and_validate("w1", 50)
    
    # Leader runs adjudicate
    contract.adjudicate("w1")
    assert contract.get_warrant("w1").status == "WARRANTED"
    
    # Run validator with same mock, should return True (consensus reached)
    assert direct_vm.run_validator() is True

def test_equivalence_disagrees_on_llm_status(direct_vm, direct_deploy, direct_alice):
    contract = direct_deploy("contracts/reliance_warrant.py")
    direct_vm.sender = direct_alice
    
    payload = "strong evidence"
    expected_hash = get_hash(payload)
    
    direct_vm.mock_web(r".*", {"status": 200, "body": payload})
    # Leader gets WARRANTED
    direct_vm.mock_llm(r".*", json.dumps({"status": "WARRANTED", "reason": "Test reason"}))
    
    contract.create_warrant("w1", "https://valid.com", expected_hash, "P", "L", [], 100)
    contract.retrieve_and_validate("w1", 50)
    contract.adjudicate("w1")
    
    # Change LLM mock for validator to CONDITIONAL
    direct_vm.clear_mocks()
    direct_vm.mock_web(r".*", {"status": 200, "body": payload})
    direct_vm.mock_llm(r".*", json.dumps({"status": "CONDITIONAL", "reason": "Different test reason"}))
    
    # Validator should disagree
    assert direct_vm.run_validator() is False

def test_equivalence_agrees_despite_reason_change(direct_vm, direct_deploy, direct_alice):
    contract = direct_deploy("contracts/reliance_warrant.py")
    direct_vm.sender = direct_alice
    
    payload = "strong evidence"
    expected_hash = get_hash(payload)
    
    direct_vm.mock_web(r".*", {"status": 200, "body": payload})
    direct_vm.mock_llm(r".*", json.dumps({"status": "WARRANTED", "reason": "First reason"}))
    
    contract.create_warrant("w1", "https://valid.com", expected_hash, "P", "L", [], 100)
    contract.retrieve_and_validate("w1", 50)
    contract.adjudicate("w1")
    
    # Change LLM mock for validator to same STATUS but different REASON
    direct_vm.clear_mocks()
    direct_vm.mock_web(r".*", {"status": 200, "body": payload})
    direct_vm.mock_llm(r".*", json.dumps({"status": "WARRANTED", "reason": "Completely different reason"}))
    
    # Validator should AGREE, proving our run_nondet_unsafe logic works!
    assert direct_vm.run_validator() is True
