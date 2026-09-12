# ProofData: Full Product PRD (Hackathon MVP)

## 1. Executive Summary
ProofData is a Decentralized Reliance Layer built on GenLayer. It allows humans and AI agents to determine whether a specific piece of evidence is sufficient to justify a specific, consequential action. The MVP will showcase the "Reliance Warrant" primitive through a clean, forensic-styled web application and an explicit side-by-side demo proving that the same evidence yields different consensus-backed outcomes based on risk.

## 2. Problem
"Provenance tells you where information came from. ProofData tells you whether you should act on it." Cryptography can prove an image wasn't manipulated or that a document was signed by a specific key. However, provenance alone cannot determine if the contents of that document logically justify executing a $1M autonomous trade or publishing a medical article. 

## 3. Why Now
AI agents are beginning to take autonomous, consequential actions. They currently lack a decentralized, consensus-based mechanism to semantically evaluate subjective constraints before acting. Concurrently, GenLayer's introduction of Intelligent Contracts uniquely allows smart contracts to perform semantic adjudication via decentralized LLM consensus.

## 4. Product Thesis
Reliance is contextual. The exact same evidence can legitimately be safe enough for exploratory research but entirely insufficient for autonomous financial action. The evaluation of evidence fitness MUST be bound to the intended consequence.

## 5. What ProofData Is
- A decentralized protocol for issuing structured Reliance Warrants.
- A human-facing interface for creating and reviewing these warrants.
- An agent-facing primitive for gating autonomous actions based on decentralized consensus.

## 6. What ProofData is NOT
- NOT a general truth oracle ("Is this article true?").
- NOT a generic AI chatbot/dashboard.
- NOT an escrow or payment gateway.
- NOT a tokenized marketplace for data.

## 7. Human Users
Researchers, analysts, journalists, and operators who need a verifiable, forensic trail proving *why* they chose to rely on specific evidence for a specific decision.

## 8. Agent Users
AI agents and smart applications that require a machine-readable, strictly-formatted (`WARRANTED` | `NOT_WARRANTED`) reliance decision before proceeding with an irreversible on-chain or API-driven action.

## 9. Jobs to be Done
- **When** I am an AI agent about to execute a trade, **I want to** programmatically request a Reliance Warrant based on my research data, **so I can** ensure decentralized consensus agrees the data is sufficient before I risk capital.
- **When** I am a human reviewing a controversial market report, **I want to** visually compare the evidence against high and low risk profiles, **so I can** understand exactly where the reliance boundaries lie.

## 10. Reliance Warrant Primitive
A structured object binding:
- Exact evidence identity (Keccak256 Hash + Retrieval URL)
- Intended Purpose
- Risk / Consequence Level
- GenLayer Semantic Adjudication Result (`status` + `reason`)

## 11. Four Verdicts
1. `WARRANTED`: Evidence fully justifies the action.
2. `CONDITIONAL`: Evidence is partially sufficient; proceed with constraints or human review.
3. `NOT_WARRANTED`: Evidence contradicts the requirements or is insufficient for the risk.
4. `INCONCLUSIVE`: Execution failed, URL was unreachable, or consensus was lost.

## 12. Core User Journey
1. **Provide Evidence**: Paste a URL pointing to stable public text/JSON.
2. **Declare Action**: State what the evidence will be used for.
3. **Select Risk**: Choose LOW, MEDIUM, or HIGH.
4. **Create Warrant**: Sign the transaction.
5. **View Result**: See the final structured Reliance Warrant with forensic fingerprints.

## 13. Detailed Feature Requirements
- **Wallet Connection**: Prompted only when necessary (Explore First, Connect Later).
- **Transaction State Tracking**: UI must elegantly handle GenLayer consensus delays (10-60s) without faking instant results.
- **Forensic Warrant Viewer**: Displays the hash, the exact prompt/requirements, the URL, and the consensus status.

## 14. Same-Evidence Comparison Feature ("Reliance Compare")
The killer demo mode. Two warrants are displayed side-by-side evaluating the *exact same evidence hash*. 
- **Left**: Low-consequence purpose -> `WARRANTED`
- **Right**: High-consequence purpose -> `NOT_WARRANTED`

## 15. Agent/Developer Interface
A dedicated section in the UI showing a 5-line code snippet (e.g., `if warrant.status === 'WARRANTED' { execute() }`). It demonstrates that ProofData is an API primitive, not just a human UI.

## 16. GenLayer Necessity
A standard smart contract cannot semantically evaluate text. A centralized LLM can, but introduces single-point-of-failure bias and hallucination risk. GenLayer is strictly required because it allows multiple independent nodes to execute the subjective evaluation and reach an immutable on-chain consensus, creating a trustless Reliance Layer.

## 17. Technical Architecture Summary
- **Frontend**: Next.js App Router (React)
- **RPC/Integration**: GenLayerJS + standard browser wallets (MetaMask).
- **Backend**: None. The frontend talks directly to the GenLayer Studionet RPC.
- **Smart Contract**: The validated M11 `ProofDataRelianceLayer` GenVM contract.

## 18. Evidence Identity Model
The URL is merely a pointer. The Keccak256 hash of the content is the true identity. The smart contract deterministically asserts that the retrieved payload matches the hash before allowing semantic LLM evaluation.

## 19. Security Model
External evidence is untrusted text. Prompt injection attempts are contained by the strict JSON schema validation enforced by the leader node and verified by consensus nodes. Hash mismatches abort execution entirely.

## 20. Transaction Lifecycle
- `PENDING`: Transaction submitted, waiting for inclusion.
- `EVALUATING`: Leader is running the web fetch and LLM evaluation.
- `CONSENSUS`: Validators are replicating the execution.
- `FINALIZED`: The warrant status is permanently written to state.

## 21. Wallet Strategy
Lowest friction possible: users can view the homepage, read the explainer, and view the "Reliance Compare" demo without a wallet. Creating a warrant triggers a standard injected provider request to connect to Studionet.

## 22. Information Architecture
1. `/` - Home / Explainer / Demo CTA
2. `/compare` - The Killer Demo Mode
3. `/create` - Warrant Creation Form
4. `/warrant/[id]` - Individual Forensic Warrant View
5. `/developers` - Agent use-case snippet

## 23. Screen Specifications
- **Home**: Minimalist typography, clear value prop, CTA buttons.
- **Create**: Clean form. URL input, Purpose text area, Risk dropdown.
- **Result**: "Certificate" or "Dossier" styling. Status prominently stamped. 

## 24. Visual Design Principles
Forensic, credible, precise, restrained. 
- Avoid: Purple AI gradients, glassmorphism, generic SaaS.
- Use: Monospace fonts for hashes/IDs, distinct status stamps, clean borders, high-contrast typography, "evidence dossier" aesthetics.

## 25. Demo Scenario
- **Evidence**: A simple JSON API response from a mock weather/market station showing moderate wind speeds or average market volatility.
- **Low Risk Purpose**: "Draft an internal exploratory memo about market conditions." -> `WARRANTED`
- **High Risk Purpose**: "Autonomously execute a $10M liquidation of tier-1 assets based on confirmed severe market collapse." -> `NOT_WARRANTED`

## 26. Hackathon Demo Flow (2-4 Mins)
1. **Hook (0:30)**: "Provenance isn't enough. Should your agent act on this data?"
2. **Creation (1:00)**: Show the creation of the low-risk warrant. 
3. **Compare (1:30)**: Flip to the `/compare` screen showing the pre-computed side-by-side result. Point out the hashes are IDENTICAL.
4. **Vision (0:30)**: Show the Developer snippet. "This is a primitive for Agentic actions."

## 27. Success Criteria
- The application successfully interacts with Studionet.
- The "Reliance Compare" demo visibly proves the core thesis.
- The UI feels technically premium and distinctly non-generic.

## 28. Non-Goals
- Marketplace, tokens, reputation scoring, PDF parsing, massive dataset integration.

## 29. Known Limitations
- Production-grade taxonomy of risk requires industry standardization.
- Current evidence is limited to small text/JSON via HTTP GET.
- Reliance Warrants cannot currently be revoked before their natural expiry.

## 30. Future Roadmap
- **Epistemic Firewall**: Native router contracts that automatically block downstream agent transactions if a warrant fails.
- **Reliance Lineage**: Directed acyclic graphs (DAGs) showing how complex reports inherit reliance from base data warrants.

## 31. Analytics/Telemetry
- Unnecessary for the MVP. Out of scope.

## 32. Definition of Done
The MVP is complete when a user can navigate the frontend, execute the exact Demo Flow, and view the Reliance Compare screen reading live data from Studionet, with no fake backend components.
