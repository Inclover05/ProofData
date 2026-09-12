with open("SPIKE_PRD.md", "r") as f:
    text = f.read()

text = text.replace("## Status\nTechnical feasibility spike only. Do not treat this as the final hackathon PRD.",
"""## Status
TECHNICAL FEASIBILITY SPIKE: COMPLETE
(M0-M10 Verified and Architecture Frozen)

## Spike Conclusion
The ProofData feasibility spike has successfully proven the core technical thesis: GenLayer can reliably process identical evidence and reach differentiated, consensus-backed reliance outcomes based purely on declared purpose and risk consequence.
The architecture successfully handles deterministic pre-validation, nondeterministic evaluation, adversarial prompt injection containment, and expiry.

ProofData is AUTHORIZED to proceed to full product development.""")

with open("SPIKE_PRD.md", "w") as f:
    f.write(text)
