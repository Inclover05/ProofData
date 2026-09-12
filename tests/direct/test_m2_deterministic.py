import pytest
from tests.direct.conftest import to_hex

def test_missing_purpose_or_ref(direct_vm, direct_deploy, direct_alice):
    contract = direct_deploy("contracts/reliance_warrant.py")
    direct_vm.sender = direct_alice
    
    contract.create_warrant("w1", "", "0", "", "LOW", [], 100)
    contract.retrieve_and_validate("w1", 50)
    assert contract.get_warrant("w1").status == "NOT_WARRANTED"

def test_invalid_http_prefix(direct_vm, direct_deploy, direct_alice):
    contract = direct_deploy("contracts/reliance_warrant.py")
    direct_vm.sender = direct_alice
    
    contract.create_warrant("w1", "http://unsecure.com", "0", "Purp", "LOW", [], 100)
    contract.retrieve_and_validate("w1", 50)
    assert contract.get_warrant("w1").status == "NOT_WARRANTED"

def test_validate_wrong_state(direct_vm, direct_deploy, direct_alice):
    contract = direct_deploy("contracts/reliance_warrant.py")
    direct_vm.sender = direct_alice
    
    contract.create_warrant("w1", "https://valid.com", "0", "Purp", "LOW", [], 100)
    # Manually transition to NOT_WARRANTED
    contract.retrieve_and_validate("w1", 150) # Expires it
    
    # Try again
    with direct_vm.expect_revert("Warrant not in PENDING state"):
        contract.retrieve_and_validate("w1", 50)
