from gltest import get_contract_factory
from gltest.assertions import tx_execution_succeeded

def test_storage():
    factory = get_contract_factory("StorageContract")
    contract = factory.deploy(args=[])

    # Write
    tx_receipt = contract.set_data(args=["hello_windows"]).transact()
    
    # Check success
    assert tx_execution_succeeded(tx_receipt)

    # Read
    result = contract.get_data(args=[]).call()
    assert result == "hello_windows"
