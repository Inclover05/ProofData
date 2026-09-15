# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
import genlayer
import json

@genlayer.contract
class DiagnosticStore:
    def __init__(self):
        self.last_result = "NONE"
        self.last_raw = "NONE"

    @genlayer.write
    def test_prompt(self, payload: str, purpose: str, risk: str) -> None:
        prompt = f"""
You are a Reliance Adjudicator.
Evaluate if the EVIDENCE TEXT is sufficient to support the INTENDED PURPOSE.

INTENDED PURPOSE:
{purpose}

RISK LEVEL:
{risk}

REQUIREMENTS:
[]

You must respond in valid JSON format exactly matching this schema:
{{
  "status": "WARRANTED" | "NOT_WARRANTED" | "CONDITIONAL" | "INCONCLUSIVE",
  "reason": "..."
}}

EVIDENCE TEXT:
{payload}
"""
        try:
            self.last_raw = genlayer.nondet.exec_prompt(prompt)
        except Exception as e:
            self.last_raw = f"Error: {e}"

    @genlayer.read
    def get_last_raw(self) -> str:
        return self.last_raw
