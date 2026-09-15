# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
import genlayer
import json

@genlayer.contract
class PromptTester:
    def __init__(self):
        pass

    @genlayer.write
    def test_prompt(self, payload: str, purpose: str, risk: str) -> str:
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
            return genlayer.nondet.exec_prompt(prompt)
        except Exception as e:
            return f"Error: {e}"
