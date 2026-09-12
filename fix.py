with open("contracts/reliance_warrant.py", "r") as f:
    lines = f.readlines()

new_lines = []
skip = False
for line in lines:
    if "def create_warrant(" in line:
        skip = True
        new_lines.append("""    @gl.public.write
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
            requirements=DynArray[str](),
            expires_at=u256(expires_at),
            status="PENDING"
        )
        self.warrants[warrant_id].requirements.extend(requirements)

""")
    elif "def retrieve_and_validate(" in line:
        skip = False
    
    if not skip:
        # Ignore the previous @gl.public.write for create_warrant
        if line.strip() == "@gl.public.write" and "def create_warrant" in lines[lines.index(line)+1]:
            pass
        else:
            new_lines.append(line)

with open("contracts/reliance_warrant.py", "w") as f:
    f.writelines(new_lines)
