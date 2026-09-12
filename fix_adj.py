with open("contracts/reliance_warrant.py", "r") as f:
    text = f.read()

import re
text = re.sub(r'payload = gl\.nondet\.web\.get\(warrant\.evidence_ref\)\n\s+reqs =',
r"""payload_raw = gl.nondet.web.get(warrant.evidence_ref)
                payload = payload_raw if isinstance(payload_raw, str) else payload_raw.body.decode("utf-8")
                
                reqs =""", text)

with open("contracts/reliance_warrant.py", "w") as f:
    f.write(text)
