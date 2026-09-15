import pytest
from unittest.mock import patch
import time

def test_expiry_override(direct_deploy):
    contract = direct_deploy("contracts/reliance_warrant.py")
    
    # Contract expires_at: 1000
    contract.create_warrant("w1", "https://example.com/data", "d31880ae9181571d18323e1817597e4dcc2d5fb312920a662d1696bb9d7ae0ac", "Test", "LOW", [], 1000)
    
    # Test 1: transaction time is 2000 (expired), caller supplies 1
    with patch("time.time", return_value=2000):
        contract.retrieve_and_validate("w1", 1)
    
    # Should be NOT_WARRANTED because transaction_time is 2000 >= 1000
    assert contract.get_warrant("w1").status == "NOT_WARRANTED"

    # Contract expires_at: 5000
    contract.create_warrant("w2", "https://example.com/data", "d31880ae9181571d18323e1817597e4dcc2d5fb312920a662d1696bb9d7ae0ac", "Test", "LOW", [], 5000)
    
    # Mock nondet get so it succeeds
    class MockWebResponse:
        def __init__(self, data):
            self.body = data.encode("utf-8")
    
    with patch("genlayer.nondet.web.get", return_value=MockWebResponse("good data")):
        # Test 2: transaction time is 2000 (not expired), caller supplies 9999999999
        with patch("time.time", return_value=2000):
            contract.retrieve_and_validate("w2", 9999999999)
            
    # Because 2000 < 5000, it proceeds! (But hash is wrong, so it becomes INCONCLUSIVE)
    # Actually "good data" hashes to something else.
    # Wait, if hash is wrong it becomes INCONCLUSIVE. Let's just check it is not NOT_WARRANTED
    status = contract.get_warrant("w2").status
    assert status == "INCONCLUSIVE" or status == "PENDING_AI"

    # Test 3: boundary exactly 5000
    contract.create_warrant("w3", "https://example.com/data", "hash", "Test", "LOW", [], 5000)
    with patch("time.time", return_value=5000):
        contract.retrieve_and_validate("w3", 1)
    assert contract.get_warrant("w3").status == "NOT_WARRANTED"
