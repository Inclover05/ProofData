with open("contracts/reliance_warrant.py", "r") as f:
    text = f.read()

import re

safe_code = """                payload_raw = gl.nondet.web.get(warrant.evidence_ref)
                if isinstance(payload_raw, str):
                    payload = payload_raw
                else:
                    body = payload_raw.body
                    payload = body.decode("utf-8") if isinstance(body, bytes) else str(body)"""

text = re.sub(r'payload_raw = gl.nondet.web.get\(warrant.evidence_ref\)\s+payload = payload_raw if isinstance\(payload_raw, str\) else payload_raw.body.decode\("utf-8"\)', safe_code, text)

with open("contracts/reliance_warrant.py", "w") as f:
    f.write(text)
