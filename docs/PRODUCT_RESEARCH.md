# Product Research Log

**SOURCE**: GenLayer Official Documentation / Architecture / SDK
**DATE**: 2026-09-13
**CURRENT VERSION**: `genlayer-js` 1.1.8, Studionet (chain 61999)

**WHAT IT CONFIRMS**:
- Intelligent Contract nondeterministic execution works via Optimistic Democracy. A leader node executes the LLM prompt (`gl.nondet.exec_prompt`), and validator nodes verify that the outcome matches.
- The state transition is determined by the `validator_fn` confirming the `leader_fn`'s exact output state (in our case, the semantic verdict string).
- Finalization requires the consensus rotation to complete.
- A transaction can be successfully `FINALIZED` in the protocol but fail internally during execution (`EXECUTION ERROR`), e.g., if a constraint like `status != "PENDING_AI"` fails. 
- Currently on Studionet, fees are simulated or 0, but signatures are strictly required for write paths via EIP-1193. 

**PROOFDATA IMPLICATION**:
- The semantic workflow must separate "Transaction Success" (the network reached consensus that the code ran) from "Warrant Status" (the LLM/validators returned `WARRANTED`).
- Adjudication must be triggered via `writeContract` and polled via `getTransaction`.
- ProofData must respect the nondeterministic limitations: returning strict JSON formats and mapping any unpredictable outcome to `INCONCLUSIVE`.

