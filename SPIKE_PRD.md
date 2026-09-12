# SPIKE PRD — ProofData Reliance Layer

## Status
TECHNICAL FEASIBILITY SPIKE: COMPLETE
(M0-M10 Verified and Architecture Frozen)

## Spike Conclusion
The ProofData feasibility spike has successfully proven the core technical thesis: GenLayer can reliably process identical evidence and reach differentiated, consensus-backed reliance outcomes based purely on declared purpose and risk consequence.
The architecture successfully handles deterministic pre-validation, nondeterministic evaluation, adversarial prompt injection containment, and expiry.

ProofData is AUTHORIZED to proceed to full product development.

## Project
ProofData

## Product category
Decentralized Reliance Layer

## Core user
Human or AI agent requiring evidence before consequential action

## Core problem
Provenance/availability alone does not prove evidence is fit for a particular use. "Provenance tells you where information came from. ProofData tells you whether you should act on it."

## Core primitive
Reliance Warrant. A structured object that binds:
1. Evidence/artifact identity
2. Intended purpose/action
3. Risk/consequence profile
4. Required evidence criteria
5. Freshness/time requirements
6. GenLayer adjudication result
7. Expiry/validity period
8. Structured reasons/conditions

## Exact GenLayer adjudication moment
"Is this exact body of evidence sufficient to justify this exact declared action under these predefined reliance requirements?"

## Why one centralized LLM is insufficient
The decision is not purely deterministic and involves risk. Validators must interpret evidence, context, and declared purpose, then reach decentralized consensus on a structured outcome, minimizing single-model hallucination or bias.

## Human use case
A researcher wants to know whether an AI-generated market report is sufficient to publish or make a business recommendation.

## Agent use case
An autonomous purchasing/trading/research agent needs to determine whether evidence is strong enough to permit a consequential automated action.

## MVP scope
- The core Reliance Warrant primitive.
- Created/read by a human-facing application (or script).
- Queried programmatically by an agent or downstream application.
- Small JSON documents and/or small stable public web evidence.

## Explicit non-MVP scope
- NO polished frontend yet.
- NO marketplace.
- NO token.
- NO reputation network.
- NO Nansen requirement.
- NO giant backend.
- NO payments/escrow (unless proving consequence).
- NO broad epistemic-supply-chain implementation.
- NO Reliance Lineage / Epistemic Firewall (roadmap material).

## Deterministic checks
- Required fields exist
- Minimum record count
- Evidence/artifact hash matches
- Timestamps correctly formatted
- Explicit expiry calculations
- Required URLs exist

## Judgment-based checks
- Evidence meaningfully supports a claim
- Sources are sufficiently credible under the warrant criteria
- Information is materially complete for the intended purpose
- Contradictions materially undermine reliance
- Evidence quality is sufficient relative to the consequence
- Limitations require CONDITIONAL rather than full WARRANTED status

## Evidence inputs
Small JSON documents and/or small stable public web evidence. User-controlled evidence is treated as UNTRUSTED EVIDENCE. Must investigate supported ways to bind evaluated evidence to intended artifact (e.g., URL + content hash).

## Structured outputs
Outcomes must be strictly one of:
- WARRANTED
- CONDITIONAL
- NOT_WARRANTED
- INCONCLUSIVE

## Expiry behavior
Explicit expiry calculations based on freshness requirements (time-bounded). 

## Security requirements
- Must use structured prompts, bounded output schemas, deterministic preprocessing.
- Explicit separation between instructions and untrusted evidence.
- Must test prompt-injection attempts.
- Changing evidence between validator requests must be treated as a serious failure mode.

## Failure outcomes
If evidence cannot be reliably obtained or evaluated, outcome is INCONCLUSIVE.
If evidence is insufficient for the risk, outcome is NOT_WARRANTED or CONDITIONAL.

## Testing requirements
Must successfully test varying outcomes for the same evidence based on purpose/risk, adversarial inputs, missing evidence, validator disagreement, and expiry. Tests should run in Direct Mode and GLSim/Studionet.

## Definition of Done
The spike is done when the test plan passes, specifically proving the central originality demonstration: SAME EVIDENCE + LOW-CONSEQUENCE PURPOSE -> WARRANTED, while SAME EVIDENCE + HIGH-CONSEQUENCE PURPOSE -> NOT_WARRANTED or CONDITIONAL. 

## Kill conditions
If the central distinction between purposes cannot be made reliable, explainable, and testable on GenLayer, the central product thesis has failed and the project must pivot.
