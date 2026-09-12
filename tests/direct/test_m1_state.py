from tests.direct.conftest import to_hex

def test_deployment(direct_vm, direct_deploy):
    contract = direct_deploy("contracts/reliance_warrant.py")
    assert contract is not None

def test_create_and_read_warrant(direct_vm, direct_deploy, direct_alice):
    contract = direct_deploy("contracts/reliance_warrant.py")
    direct_vm.sender = direct_alice
    
    contract.create_warrant(
        "warrant_1",
        "https://example.com/report.json",
        "0000",
        "Market Research",
        "LOW",
        ["Check author credibility"],
        9999999999
    )
    
    warrant = contract.get_warrant("warrant_1")
    assert warrant.id == "warrant_1"
    assert warrant.requester == to_hex(direct_alice)
    assert warrant.evidence_ref == "https://example.com/report.json"
    assert warrant.expected_hash == "0000"
    assert warrant.purpose == "Market Research"
    assert warrant.risk_level == "LOW"
    assert list(warrant.requirements) == ["Check author credibility"]
    assert warrant.expires_at == 9999999999
    assert warrant.status == "PENDING"

def test_multiple_warrants_independence(direct_vm, direct_deploy, direct_alice, direct_bob):
    contract = direct_deploy("contracts/reliance_warrant.py")
    
    direct_vm.sender = direct_alice
    contract.create_warrant("warrant_a", "ev_a", "0", "purp_a", "LOW", ["req_a"], 999)
    
    direct_vm.sender = direct_bob
    contract.create_warrant("warrant_b", "ev_b", "0", "purp_b", "HIGH", ["req_b"], 999)
    
    warrant_a = contract.get_warrant("warrant_a")
    assert warrant_a.requester == to_hex(direct_alice)
    assert warrant_a.purpose == "purp_a"
    
    warrant_b = contract.get_warrant("warrant_b")
    assert warrant_b.requester == to_hex(direct_bob)
    assert warrant_b.purpose == "purp_b"

def test_persistence_overwrite_fails(direct_vm, direct_deploy, direct_alice):
    contract = direct_deploy("contracts/reliance_warrant.py")
    direct_vm.sender = direct_alice
    
    contract.create_warrant("warrant_1", "ev_1", "0", "purp_1", "LOW", ["req_1"], 999)
    
    with direct_vm.expect_revert("Warrant ID already exists"):
        contract.create_warrant("warrant_1", "ev_2", "0", "purp_2", "HIGH", ["req_2"], 999)
