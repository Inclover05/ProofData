# ProofData Phase 4B — Test Plan

## Testing principle
The spike exists to falsify the idea quickly if current GenLayer cannot support it reliably.

## Required Test Scenarios
The spike must test at minimum:
1. Valid evidence + low-risk action
2. Valid evidence + high-risk action
3. Stale evidence
4. Incomplete evidence
5. Contradictory evidence
6. Missing evidence
7. Unavailable URL/source
8. Malformed evidence
9. Prompt-injection evidence
10. Validator disagreement
11. INCONCLUSIVE outcome
12. Warrant expiry
13. Evidence identity mismatch
14. Same evidence / different-purpose outcome

## Test Categories
Tests should be divided into:

### DETERMINISTIC DIRECT TESTS
Fast in-memory checks for schema, state, deterministic rules (expiry, hash matching) without LLM/web mocks.

### MOCKED WEB/LLM DIRECT TESTS
In-memory tests simulating GenLayer Web and LLM responses to test judgment logic and extraction reliably.

### VALIDATOR/CONSENSUS TESTS
Tests forcing validator disagreement (via mocks) to verify consensus handling.

### GLSIM/INTEGRATION TESTS
Running against the local `glsim` network to prove actual transaction lifecycles and contract execution.

### STUDIONET VALIDATION
Deploying and verifying against the live hosted GenLayer testnet.

### MANUAL STUDIO CHECKS
Where useful, manual verification in GenLayer Studio.

## Spike exit criteria
All core tests must either PASS or have a documented supported architectural replacement. Any failure that destroys reliable purpose-bound adjudication is a NO-GO.
