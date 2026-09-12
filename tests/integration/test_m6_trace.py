from gltest import get_contract_factory
import time
from eth_utils import keccak

def get_hash(text: str) -> str:
    return keccak(text.encode('utf-8')).hex()

def test_trace():
    factory = get_contract_factory("ProofDataRelianceLayer")
    contract = factory.deploy(args=[])
    url = "https://httpbin.org/base64/SGVsbG8gV29ybGQuIFRoaXMgaXMgbXkgZXZpZGVuY2Uu" 
    expected_hash = get_hash("Hello World. This is my evidence.")
    
    contract.create_warrant(args=["w1", url, expected_hash, "purp", "LOW", [], int(time.time())+10000]).transact()
    contract.retrieve_and_validate(args=["w1", int(time.time())]).transact()
    w1 = contract.get_warrant(args=["w1"]).call()
    print("\nDEBUG INFO:", w1.get("debug"))
