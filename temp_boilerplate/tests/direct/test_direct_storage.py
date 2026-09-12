def test_storage(direct_vm, direct_deploy, direct_alice):
    contract = direct_deploy("contracts/storage.py")
    direct_vm.sender = direct_alice

    contract.set_data("hello_windows")
    assert contract.get_data() == "hello_windows"
