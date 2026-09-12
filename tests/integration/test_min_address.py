from gltest import get_contract_factory
def test_min_address():
    factory = get_contract_factory("MinAddress")
    contract = factory.deploy(args=[])
    data = contract.get_data().call()
    print("RETURNED DATA:", data)
