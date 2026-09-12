def test_print(direct_vm, direct_deploy):
    direct_vm.mock_web(r".*", {"status": 200, "body": "mocked content"})
    contract = direct_deploy("contracts/print_gl.py")
    res = contract.print_it()
    print("\nWEB:", res)
