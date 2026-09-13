# Learning Notes

## WHAT IS SEMANTIC ADJUDICATION?
Semantic adjudication is the process where GenLayer's network validates subjective properties that cannot be coded in deterministic rules (e.g. "Does this document authorize a $10,000 wire transfer?"). Instead of boolean code, an LLM evaluates the evidence against the purpose and risk, returning a semantic verdict.

## WHAT DOES A GENLAYER VALIDATOR DECIDE?
A validator in GenLayer (using Optimistic Democracy) verifies the output produced by the leader node. If the leader's LLM determines the result is "WARRANTED", each validator runs the same prompt. If they reach the same semantic conclusion ("WARRANTED"), consensus is met.

## WHAT IS OPTIMISTIC DEMOCRACY?
It is GenLayer's consensus mechanism where a leader node runs the non-deterministic transaction (LLM prompt/web request) and proposes the result. Validators optimistically verify it by running it themselves and voting on the outcome. If a majority agrees, the result is accepted.

## WHY IS THIS DIFFERENT FROM A NORMAL SMART-CONTRACT IF/ELSE CHECK?
Normal smart contracts (like on Ethereum) are fully deterministic. Given the same inputs, they must exactly produce the same bytes as output, which is why they cannot natively perform web requests or evaluate human language. GenLayer intelligent contracts embrace non-determinism and achieve consensus via equivalence, not exact byte-for-byte matching.

## WHY DOES PROOFDATA USE DETERMINISTIC CHECKS FIRST?
ProofData first uses standard hash matching (`expected_hash` vs. actual fetched data) because deterministic checks are cheaper, faster, and unambiguous. It isolates the non-deterministic AI evaluation entirely to the subjective intent/purpose, minimizing hallucination risk and gas fees.

## WHY DOES IT USE AI/VALIDATOR JUDGMENT ONLY FOR SUBJECTIVE QUESTIONS?
AI struggles with exact string matching or rigid rule enforcement (hallucinations), but excels at contextual evaluation. ProofData uses AI strictly to bridge the gap between "what the data is" (deterministic) and "what the data means for our intended action" (subjective).

## WHAT IS THE DIFFERENCE BETWEEN TRANSACTION EXECUTION SUCCESS AND WARRANTED?
- **Transaction Execution Success**: The network successfully processed the code, paid the gas, reached consensus, and completed the state transition without crashing or reverting.
- **WARRANTED**: The specific application-level state meaning the validators approved the intended action based on the evidence.

## WHY CAN A SUCCESSFUL TRANSACTION PRODUCE NOT_WARRANTED?
A transaction succeeds if the *evaluation* was successfully performed. If a user asks, "Does this library license allow me to launch a nuclear missile?", the execution successfully completes by returning `NOT_WARRANTED`. The process worked flawlessly.

## WHY IS PURPOSE IMPORTANT?
The exact same evidence (e.g. an ID card) might be perfectly valid for buying age-restricted goods, but completely insufficient for authorizing a massive corporate bank transfer. Purpose binds the evidence to the specific context.

## WHY IS RISK IMPORTANT?
Risk acts as the threshold for strictness. A low-risk action (internal research) might be granted leniency by the adjudicating model, while a high-risk action requires undeniable, explicit authorization in the evidence. 

## WHY DOES THE SAME EVIDENCE NOT ALWAYS JUSTIFY THE SAME ACTION?
Because authorization is context-dependent. A passport proves identity, but it doesn't prove you are an employee of Google. The evidence might be mathematically verified (hash match), but semantically irrelevant to the requested action.
