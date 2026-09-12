with open("contracts/reliance_warrant.py", "r") as f:
    text = f.read()

import re
text = re.sub(r'requirements=DynArray\[str\]\(\),\n.*?\)\n.*?self.warrants\[warrant_id\].requirements.extend\(requirements\)',
"""requirements=requirements,
            expires_at=u256(expires_at),
            status="PENDING"
        )""", text, flags=re.DOTALL)

with open("contracts/reliance_warrant.py", "w") as f:
    f.write(text)
