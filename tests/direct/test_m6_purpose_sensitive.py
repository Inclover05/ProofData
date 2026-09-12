import pytest
import json
from eth_utils import keccak

def get_hash(text: str) -> str:
    return keccak(text.encode('utf-8')).hex()

def test_m6_purpose_sensitive_mocked(direct_vm, direct_deploy, direct_alice):
    contract = direct_deploy("contracts/reliance_warrant.py")
    direct_vm.sender = direct_alice
    
    payload = "Hello World. This is my evidence."
    expected_hash = get_hash(payload)
    url = "https://example.com"
    
    # Warrant 1: Low risk
    direct_vm.mock_web(r".*", {"status": 200, "body": payload})
    direct_vm.mock_llm(r".*Just summarizing the text.*", json.dumps({"status": "WARRANTED", "reason": "Simple"}))
    
    contract.create_warrant("w1", url, expected_hash, "Just summarizing the text", "LOW", [], 100)
    contract.retrieve_and_validate("w1", 50)
    contract.adjudicate("w1")
    assert contract.get_warrant("w1").status == "WARRANTED"
    
    # Warrant 2: High risk
    direct_vm.clear_mocks()
    direct_vm.mock_web(r".*", {"status": 200, "body": payload})
    direct_vm.mock_llm(r".*Making a \$1M investment.*", json.dumps({"status": "NOT_WARRANTED", "reason": "No financials"}))
    
    contract.create_warrant("w2", url, expected_hash, "Making a $1M investment", "HIGH", [], 100)
    contract.retrieve_and_validate("w2", 50)
    contract.adjudicate("w2")
    assert contract.get_warrant("w2").status == "NOT_WARRANTED"
