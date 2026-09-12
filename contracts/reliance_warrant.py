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
        if warrant_id not in self.warrants:
            raise gl.vm.UserError("Warrant not found")
        
        warrant = self.warrants[warrant_id]
        
        if warrant.status != "PENDING":
            raise gl.vm.UserError("Warrant not in PENDING state")
            
        if not warrant.evidence_ref.startswith("https://"):
            warrant.status = "NOT_WARRANTED"
            return
            
        if current_time >= warrant.expires_at:
            warrant.status = "NOT_WARRANTED"
            return

        def leader_fn() -> str:
            try:
                payload_raw = gl.nondet.web.get(warrant.evidence_ref)
                if isinstance(payload_raw, str):
                    return payload_raw
                else:
                    body = payload_raw.body
                    return body.decode("utf-8") if isinstance(body, bytes) else str(body)
            except Exception:
                return ""

        def validator_fn(leader_result) -> bool:
            if not isinstance(leader_result, gl.vm.Return):
                return False
            my_result = leader_fn()
            return genlayer.Keccak256(leader_result.calldata.encode()).hexdigest() == genlayer.Keccak256(my_result.encode()).hexdigest()

        result = gl.vm.run_nondet_unsafe(leader_fn, validator_fn)
        
        if not result:
            warrant.status = "INCONCLUSIVE"
            return
            
        actual_hash = genlayer.Keccak256(result.encode()).hexdigest()
        
        if actual_hash != warrant.expected_hash:
            warrant.status = "NOT_WARRANTED"
            return
            
        warrant.status = "PENDING_AI"

    @gl.public.write
    def adjudicate(self, warrant_id: str) -> None:
        if warrant_id not in self.warrants:
            raise gl.vm.UserError("Warrant not found")
            
        warrant = self.warrants[warrant_id]
        
        if warrant.status != "PENDING_AI":
            raise gl.vm.UserError("Warrant not in PENDING_AI state")

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
        warrant.status = dict(result).get("status", "INCONCLUSIVE")

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
