# ProofData Support Context

Update this file whenever you want help from an external Gemini/ChatGPT session.

## Project
ProofData Phase 4B — Reliance Layer feasibility spike.

## Current milestone
M1 Complete.

## Current goal
Prove that GenLayer can issue a reliable purpose-bound, time-bounded Reliance Warrant for a specific evidence artifact.

## Current architecture
Provisional architecture defined.
State model implemented: `RelianceWarrant` (@dataclass, @allow_storage) stored inside `TreeMap[str, RelianceWarrant]`.

## Expected result
Next is M2: Deterministic warrant validation.

## Actual result / error
None.

## Last known passing tests
M1 Direct Mode tests passed.

## Relevant files
`contracts/reliance_warrant.py`
`tests/direct/test_m1_state.py`

## Important rules
- No pass → no progress.
- Current official GenLayer docs override remembered information.
- User-controlled evidence is untrusted.
- Do not redesign unrelated parts to fix one local issue.
- User is a beginner; explanations should be simple.

## [Frontend Environment - 2026-09-12]
- Node environment configured for Next.js 16.3.5 / React 19.2.8.
- Development server running on port 3000.
