import pytest
from eth_utils import keccak

def get_hash(text: str) -> str:
    return keccak(text.encode('utf-8')).hex()

def test_retrieval_success(direct_vm, direct_deploy, direct_alice):
    contract = direct_deploy("contracts/reliance_warrant.py")
    direct_vm.sender = direct_alice
    
    payload = "valid evidence"
    expected_hash = get_hash(payload)
    
    direct_vm.mock_web(r".*valid.com.*", {"status": 200, "body": payload})
    
    contract.create_warrant("w1", "https://valid.com", expected_hash, "P", "L", [], 100)
    contract.retrieve_and_validate("w1", 50)
    
    assert contract.get_warrant("w1").status == "PENDING_AI"

def test_retrieval_hash_mismatch(direct_vm, direct_deploy, direct_alice):
    contract = direct_deploy("contracts/reliance_warrant.py")
    direct_vm.sender = direct_alice
    
    payload = "valid evidence"
    expected_hash = get_hash(payload)
    
    # Mock web returning DIFFERENT payload!
    direct_vm.mock_web(r".*valid.com.*", {"status": 200, "body": "altered evidence"})
    
    contract.create_warrant("w1", "https://valid.com", expected_hash, "P", "L", [], 100)
    contract.retrieve_and_validate("w1", 50)
    
    assert contract.get_warrant("w1").status == "NOT_WARRANTED"

def test_retrieval_fetch_error(direct_vm, direct_deploy, direct_alice):
    contract = direct_deploy("contracts/reliance_warrant.py")
    direct_vm.sender = direct_alice
    
    payload = "valid evidence"
    expected_hash = get_hash(payload)
    
    # Mock web throwing error or returning 404/500? The python SDK might throw an exception on non-200.
    # Let's mock a 404 to see if it causes an exception.
    direct_vm.mock_web(r".*valid.com.*", {"status": 404, "body": "Not found"})
    
    contract.create_warrant("w1", "https://valid.com", expected_hash, "P", "L", [], 100)
    contract.retrieve_and_validate("w1", 50)
    
    # If 404 throws, it returns INCONCLUSIVE. If not, hash mismatches and it returns NOT_WARRANTED.
    status = contract.get_warrant("w1").status
    assert status in ["INCONCLUSIVE", "NOT_WARRANTED"]

def test_retrieval_expired(direct_vm, direct_deploy, direct_alice):
    contract = direct_deploy("contracts/reliance_warrant.py")
    direct_vm.sender = direct_alice
    
    payload = "valid evidence"
    expected_hash = get_hash(payload)
    
    direct_vm.mock_web(r".*valid.com.*", {"status": 200, "body": payload})
    
    contract.create_warrant("w1", "https://valid.com", expected_hash, "P", "L", [], 100)
    contract.retrieve_and_validate("w1", 150) # Expired!
    
    assert contract.get_warrant("w1").status == "NOT_WARRANTED"
