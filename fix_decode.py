with open("contracts/reliance_warrant.py", "r") as f:
    text = f.read()

import re
text = re.sub(r'payload = payload_raw if isinstance\(payload_raw, str\) else payload_raw.body',
r'payload = payload_raw if isinstance(payload_raw, str) else payload_raw.body.decode("utf-8")', text)

with open("contracts/reliance_warrant.py", "w") as f:
    f.write(text)
