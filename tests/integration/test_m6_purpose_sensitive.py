from gltest import get_contract_factory
from gltest.assertions import tx_execution_succeeded
from eth_utils import keccak
import time

def get_hash(text: str) -> str:
    return keccak(text.encode('utf-8')).hex()

def test_purpose_sensitive_adjudication():
    factory = get_contract_factory("ProofDataRelianceLayer")
    contract = factory.deploy(args=[])
    
    url = "https://httpbin.org/base64/SGVsbG8gV29ybGQuIFRoaXMgaXMgbXkgZXZpZGVuY2Uu" 
    payload = "Hello World. This is my evidence."
    expected_hash = get_hash(payload)
    expiry = int(time.time()) + 100000

    w1_id = "w1_low_risk"
    contract.create_warrant(args=[w1_id, url, expected_hash, "Just summarizing the text", "LOW", ["Must be in english"], expiry]).transact()
    contract.retrieve_and_validate(args=[w1_id, int(time.time())]).transact()
    contract.adjudicate(args=[w1_id]).transact()
    
    w2_id = "w2_high_risk"
    contract.create_warrant(args=[w2_id, url, expected_hash, "Making a $1M investment based on Q3 earnings", "HIGH", ["Must contain Q3 earnings figures"], expiry]).transact()
    contract.retrieve_and_validate(args=[w2_id, int(time.time())]).transact()
    tx2_adj = contract.adjudicate(args=[w2_id]).transact()
    
    print("\nTX2 ADJ STATUS:", tx2_adj.get("status"))
    print("\nTX2 ADJ EXECUTION ERROR:", tx2_adj.get("execution_error"))
    
    w1 = contract.get_warrant(args=[w1_id]).call()
    w2 = contract.get_warrant(args=[w2_id]).call()
    
    print(f"\nLow Risk Status: {w1['status']}")
    print(f"High Risk Status: {w2['status']}")
