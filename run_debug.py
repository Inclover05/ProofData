import sys
sys.path.append('.')
from gltest.direct.loader import VMContext
def _deploy(path):
    from gltest.direct.loader import direct_deploy
    import anyio
    return anyio.run(direct_deploy, path)

import anyio
async def test_it():
    from gltest.direct.loader import VMContext
    import json
    from eth_utils import keccak
    def get_hash(text: str) -> str:
        return keccak(text.encode('utf-8')).hex()
        
    direct_vm = VMContext(_sender=b'Alice000000000000000')
    from gltest.direct.loader import direct_deploy
    contract = direct_deploy("contracts/reliance_warrant.py", vm=direct_vm)
    
    payload = "strong evidence"
    expected_hash = get_hash(payload)
    direct_vm.mock_web(r".*", {"status": 200, "body": payload})
    direct_vm.mock_llm(r".*", json.dumps({"status": "WARRANTED", "reason": "Test reason"}))
    
    contract.create_warrant("w1", "https://valid.com", expected_hash, "P", "L", [], 100)
    contract.retrieve_and_validate("w1", 50)
    print("Status after retrieve:", contract.get_warrant("w1").status)
    
    contract.adjudicate("w1")
    print("Status after adjudicate:", contract.get_warrant("w1").status)
    
anyio.run(test_it)
