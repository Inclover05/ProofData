# Hackathon Demo Plan

**Target Duration**: 3 minutes.
**Goal**: The audience must understand the exact value proposition (Same Evidence + Different Risk = Different Outcome) within 60 seconds.

## 1. The Hook (0:00 - 0:30)
- **Visual**: Show the ProofData homepage.
- **Script**: "Provenance tells you an image or document is authentic. But it doesn't tell you if it's safe to act on. ProofData is a Decentralized Reliance Layer that binds evidence to your intended action, and uses GenLayer consensus to tell you if you should proceed."

## 2. Create Low-Risk Warrant (0:30 - 1:15)
- **Action**: Navigate to `/create`. Paste a stable JSON API URL (e.g., a mock market volatility index showing moderate levels).
- **Inputs**: 
  - Purpose: "Draft an internal exploratory memo about market conditions."
  - Risk: `LOW`
- **Action**: Click "Create" and sign the transaction. 
- **Script**: "We are asking GenLayer if this data is safe for a low-risk internal memo."
- **Visual**: The UI shows "Awaiting GenLayer Consensus..." (simulate briefly or rely on live if fast enough).

## 3. The Result (1:15 - 1:45)
- **Visual**: The Warrant Dossier appears.
- **Focus**: Point out the `WARRANTED` green stamp. Highlight the Evidence Hash (`0xabc123...`).
- **Script**: "GenLayer consensus agrees: for a low-risk memo, this evidence is completely sufficient."

## 4. The Contrast / Reliance Compare (1:45 - 2:30)
- **Action**: Navigate to the `/compare` screen. (This screen will have the high-risk scenario pre-computed or executed side-by-side).
- **Visual**: 
  - LEFT: The Low-Risk Warrant we just made (`WARRANTED`).
  - RIGHT: A High-Risk Warrant using the EXACT SAME URL. Purpose: "Autonomously execute a $10M liquidation of tier-1 assets." Result: `NOT_WARRANTED`.
- **Action**: Draw a visual line connecting the two identical Evidence Hashes.
- **Script**: "Here is the magic. Exact same evidence. Exact same hash. But GenLayer validators correctly determined that moderate market data is NOT sufficient justification to dump $10 million in assets. Reliance is contextual."

## 5. Agent Use Case (2:30 - 2:50)
- **Visual**: Show the `/developers` screen with the 5-line code snippet.
- **Script**: "Because this is on-chain, an AI Trading Agent can simply call `warrant.status` before executing a trade. We just built an Epistemic Firewall for autonomous agents."

## 6. Closing Line (2:50 - 3:00)
- **Script**: "ProofData. Don't just verify your data. Verify your decisions."

## Fallback Strategy
If Studionet is congested or slow during the live pitch, the `/compare` screen will act as the primary fallback. It will load pre-finalized warrants instantly via `get_warrant.call()`, allowing the pitch to proceed seamlessly without waiting for live consensus.
