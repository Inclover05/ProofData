with open("contracts/reliance_warrant.py", "r") as f:
    text = f.read()

import re

safe_code = """                payload_raw = gl.nondet.web.get(warrant.evidence_ref)
                if isinstance(payload_raw, str):
                    payload = payload_raw
                else:
                    body = payload_raw.body
                    payload = body.decode("utf-8") if isinstance(body, bytes) else str(body)
                
                if genlayer.Keccak256(payload.encode()).hexdigest() != warrant.expected_hash:
                    return {"status": "INCONCLUSIVE", "reason": "Hash mismatch during adjudicate"}
"""

text = re.sub(r'payload_raw = gl.nondet.web.get\(warrant.evidence_ref\).*?payload = body.decode\("utf-8"\) if isinstance\(body, bytes\) else str\(body\)', safe_code, text, flags=re.DOTALL)

with open("contracts/reliance_warrant.py", "w") as f:
    f.write(text)
