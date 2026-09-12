import pytest
from eth_utils import keccak

def get_hash(text: str) -> str:
    return keccak(text.encode('utf-8')).hex()

def test_missing_evidence_inconclusive(direct_vm, direct_deploy, direct_alice):
    contract = direct_deploy("contracts/reliance_warrant.py")
    direct_vm.sender = direct_alice
    
    expected_hash = get_hash("doesn't matter")
    
    # Python SDK throws an exception if domain doesn't exist, which we catch
    # and map to INCONCLUSIVE. If we just don't mock it, GenLayer wasi_mock throws MockNotFoundError
    # which simulates network failure.
    
    contract.create_warrant("w1", "https://does-not-exist.com", expected_hash, "P", "L", [], 100)
    contract.retrieve_and_validate("w1", 50)
    
    assert contract.get_warrant("w1").status == "INCONCLUSIVE"
