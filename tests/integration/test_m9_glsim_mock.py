import pytest
import os
import json
from eth_utils import keccak
from gltest import get_contract_factory
from gltest.validators.validator_factory import get_validator_factory
from gltest.types import MockedLLMResponse, MockedWebResponse, MockedWebResponseData

def get_hash(text: str) -> str:
    return keccak(text.encode('utf-8')).hex()

def test_m9_glsim_mock():
    payload = "strong evidence payload"
    expected_hash = get_hash(payload)
    url = "https://mock.com/evidence"
    
    web_mock = {
        "nondet_web_request": {
            url: {
                "method": "GET",
                "status": 200,
                "body": payload
            }
        }
    }
    
    llm_mock_low = {
        "nondet_exec_prompt": {
            "Evaluate the following evidence": json.dumps({
                "status": "WARRANTED",
                "reason": "mock reason low"
            })
        },
        "eq_principle_prompt_comparative": {},
        "eq_principle_prompt_non_comparative": {}
    }
    
    llm_mock_high = {
        "nondet_exec_prompt": {
            "Evaluate the following evidence": json.dumps({
                "status": "NOT_WARRANTED",
                "reason": "mock reason high"
            })
        },
        "eq_principle_prompt_comparative": {},
        "eq_principle_prompt_non_comparative": {}
    }
    
    factory = get_validator_factory()
    
    validators_low = factory.batch_create_mock_validators(
        count=5,
        mock_llm_response=llm_mock_low,
        mock_web_response=web_mock
    )
    ctx_low = {
        "validators": [v.to_dict() for v in validators_low],
        "genvm_datetime": "2024-01-01T00:00:00Z"
    }
    
    print("Deploying contract...")
    contract_factory = get_contract_factory("ProofDataRelianceLayer")
    contract = contract_factory.deploy(transaction_context=ctx_low)
    
    print("Testing SCENARIO A (Low Risk)...")
    contract.create_warrant(
        args=["w_low", url, expected_hash, "low-risk research", "LOW", [], 1000]
    ).transact(transaction_context=ctx_low)
    
    contract.retrieve_and_validate(args=["w_low", 50]).transact(transaction_context=ctx_low)
    w = contract.get_warrant(args=["w_low"]).call()
    assert dict(w)["status"] == "PENDING_AI"
    
    contract.adjudicate(args=["w_low"]).transact(transaction_context=ctx_low)
    w_final_low = contract.get_warrant(args=["w_low"]).call()
    assert dict(w_final_low)["status"] == "WARRANTED"
    
    # SCENARIO B: HIGH RISK (NOT_WARRANTED)
    validators_high = factory.batch_create_mock_validators(
        count=5,
        mock_llm_response=llm_mock_high,
        mock_web_response=web_mock
    )
    ctx_high = {
        "validators": [v.to_dict() for v in validators_high],
        "genvm_datetime": "2024-01-01T00:00:00Z"
    }
    
    print("Testing SCENARIO B (High Risk)...")
    contract.create_warrant(
        args=["w_high", url, expected_hash, "high-risk finance", "HIGH", [], 1000]
    ).transact(transaction_context=ctx_high)
    
    contract.retrieve_and_validate(args=["w_high", 50]).transact(transaction_context=ctx_high)
    w2 = contract.get_warrant(args=["w_high"]).call()
    assert dict(w2)["status"] == "PENDING_AI"
    
    contract.adjudicate(args=["w_high"]).transact(transaction_context=ctx_high)
    w_final_high = contract.get_warrant(args=["w_high"]).call()
    assert dict(w_final_high)["status"] == "NOT_WARRANTED"

    print("GLSim integration with mock validators completely PASSED!")

