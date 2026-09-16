# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

from dataclasses import dataclass
from typing import List, Dict
from genlayer import *
import json
import genlayer

@allow_storage
@dataclass
class RelianceWarrant:
    id: str
    requester: Address
    evidence_ref: str
    expected_hash: str
    purpose: str
    risk_level: str
    requirements: DynArray[str]
    expires_at: u256
    status: str

@dataclass
class RelianceWarrantDTO:
    id: str
    requester: str
    evidence_ref: str
    expected_hash: str
    purpose: str
    risk_level: str
    requirements: DynArray[str]
    expires_at: u256
    status: str

class ProofDataRelianceLayer(gl.Contract):
    warrants: TreeMap[str, RelianceWarrant]
    
    def __init__(self):
        self.warrants = TreeMap()

    @gl.public.write
    def create_warrant(
        self,
        warrant_id: str,
        evidence_ref: str,
        expected_hash: str,
        purpose: str,
        risk_level: str,
        requirements: list[str],
        expires_at: int
    ) -> None:
        if warrant_id in self.warrants:
            raise gl.vm.UserError("Warrant ID already exists")

        self.warrants[warrant_id] = RelianceWarrant(
            id=warrant_id,
            requester=gl.message.sender_address,
            evidence_ref=evidence_ref,
            expected_hash=expected_hash,
            purpose=purpose,
            risk_level=risk_level,
            requirements=requirements,
            expires_at=u256(expires_at),
            status="PENDING"
        )

    @gl.public.write
    def retrieve_and_validate(self, warrant_id: str, current_time: int) -> None:
        # NOTE: `current_time` is retained for LEGACY COMPATIBILITY INPUT.
        # It is strictly untrusted. Expiry logic now relies on deterministic `transaction_time`.
        
        if warrant_id not in self.warrants:
            raise gl.vm.UserError("Warrant not found")
        
        warrant = self.warrants[warrant_id]
        
        if warrant.status != "PENDING":
            raise gl.vm.UserError("Warrant not in PENDING state")
            
        if not warrant.evidence_ref.startswith("https://"):
            warrant.status = "NOT_WARRANTED"
            return
            
        import time
        transaction_time = int(time.time())
        if transaction_time >= warrant.expires_at:
            warrant.status = "NOT_WARRANTED"
            return
            
        evidence_ref = warrant.evidence_ref

        def leader_fn() -> dict:
            try:
                response = gl.nondet.web.get(evidence_ref)
                
                if isinstance(response, str):
                    body_bytes = response.encode("utf-8")
                else:
                    body = response.body
                    if isinstance(body, bytes):
                        body_bytes = body
                    elif isinstance(body, str):
                        body_bytes = body.encode("utf-8")
                    else:
                        return {
                            "fetch_status": "UNAVAILABLE",
                            "hash": "",
                        }
                        
                evidence_hash = genlayer.Keccak256(body_bytes).hexdigest()
                
                return {
                    "fetch_status": "FETCHED",
                    "hash": evidence_hash,
                }
            except Exception:
                return {
                    "fetch_status": "UNAVAILABLE",
                    "hash": "",
                }

        def validator_fn(leader_result) -> bool:
            if not isinstance(leader_result, gl.vm.Return):
                return False

            try:
                leader_data = dict(leader_result.calldata)
            except Exception:
                return False

            leader_status = leader_data.get("fetch_status")
            leader_hash = leader_data.get("hash")

            if leader_status not in ("FETCHED", "UNAVAILABLE"):
                return False

            if not isinstance(leader_hash, str):
                return False

            if leader_status == "FETCHED":
                if len(leader_hash) != 64:
                    return False
            else:
                if leader_hash != "":
                    return False

            try:
                my_response = gl.nondet.web.get(evidence_ref)
                
                if isinstance(my_response, str):
                    my_body_bytes = my_response.encode("utf-8")
                else:
                    my_body = my_response.body
                    if isinstance(my_body, bytes):
                        my_body_bytes = my_body
                    elif isinstance(my_body, str):
                        my_body_bytes = my_body.encode("utf-8")
                    else:
                        my_status, my_hash = "UNAVAILABLE", ""
                        my_body_bytes = None
                        
                if my_body_bytes is not None:
                    my_hash = genlayer.Keccak256(my_body_bytes).hexdigest()
                    my_status = "FETCHED"
            except Exception:
                my_status, my_hash = "UNAVAILABLE", ""

            return (
                leader_status == my_status
                and leader_hash == my_hash
            )

        result = gl.vm.run_nondet_unsafe(leader_fn, validator_fn)
        
        try:
            result_data = dict(result)
        except Exception:
            warrant.status = "INCONCLUSIVE"
            return

        if result_data.get("fetch_status") != "FETCHED":
            warrant.status = "INCONCLUSIVE"
            return
            
        actual_hash = result_data.get("hash")
        
        if not isinstance(actual_hash, str) or len(actual_hash) != 64:
            warrant.status = "INCONCLUSIVE"
            return
            
        if actual_hash != warrant.expected_hash:
            warrant.status = "NOT_WARRANTED"
            return
            
        warrant.status = "PENDING_AI"

    @gl.public.write
    def adjudicate(self, warrant_id: str) -> None:
        if warrant_id not in self.warrants:
            raise gl.vm.UserError("Warrant not found")
            
        storage_warrant = self.warrants[warrant_id]
        
        if storage_warrant.status != "PENDING_AI":
            raise gl.vm.UserError("Warrant not in PENDING_AI state")

        # Nondeterministic execution may only read the in-memory snapshot.
        warrant = gl.storage.copy_to_memory(storage_warrant)

        def leader_fn() -> dict:
            try:
                payload_raw = gl.nondet.web.get(warrant.evidence_ref)
                if isinstance(payload_raw, str):
                    payload = payload_raw
                else:
                    body = payload_raw.body
                    payload = body.decode("utf-8") if isinstance(body, bytes) else str(body)
                
                if genlayer.Keccak256(payload.encode()).hexdigest() != warrant.expected_hash:
                    return {"status": "INCONCLUSIVE", "reason": "Hash mismatch during adjudicate"}
                
                reqs = "\n".join([f"- {req}" for req in warrant.requirements])
                task = f"""
You are a strict Reliance Layer adjudicator.
Evaluate the following evidence is sufficient for the PURPOSE given the RISK LEVEL.
PURPOSE: {warrant.purpose}
RISK: {warrant.risk_level}
REQUIREMENTS:
{reqs}

EVIDENCE:
{payload}

Determine the reliance status strictly as one of: WARRANTED, CONDITIONAL, NOT_WARRANTED, INCONCLUSIVE.
Return valid JSON exactly in this format:
{{
    "status": str,
    "reason": str
}}
"""
                result = gl.nondet.exec_prompt(task, response_format="json")
                if result.get("status") not in ["WARRANTED", "CONDITIONAL", "NOT_WARRANTED", "INCONCLUSIVE"]:
                    result["status"] = "INCONCLUSIVE"
                return result
            except Exception as e:
                return {"status": "INCONCLUSIVE", "reason": f"Fetch error: {e}"}

        def validator_fn(leader_result) -> bool:
            if not isinstance(leader_result, gl.vm.Return):
                return False
            my_result = leader_fn()
            
            lr = dict(leader_result.calldata)
            if lr.get("status") == my_result.get("status"):
                return True
                
            return False

        result = gl.vm.run_nondet_unsafe(leader_fn, validator_fn)
        storage_warrant.status = dict(result).get("status", "INCONCLUSIVE")

    @gl.public.view
    def get_warrant(self, warrant_id: str) -> RelianceWarrantDTO:
        if warrant_id not in self.warrants:
            raise gl.vm.UserError("Warrant not found")
        w = self.warrants[warrant_id]
        return RelianceWarrantDTO(
            id=w.id,
            requester=w.requester.as_hex,
            evidence_ref=w.evidence_ref,
            expected_hash=w.expected_hash,
            purpose=w.purpose,
            risk_level=w.risk_level,
            requirements=w.requirements,
            expires_at=w.expires_at,
            status=w.status
        )
