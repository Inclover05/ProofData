# ProofData Support Context

Update this file whenever you want help from an external Gemini/ChatGPT session.

## Project
ProofData Phase 4B — Reliance Layer feasibility spike.

## Current milestone
P1.6 (Frontend Visual Polish) Complete.

## Current goal
Freeze frontend design foundation.

## Current architecture
Frontend architecture defined (Next.js 16, React 19, Tailwind v4).
P1.6 visual enhancements merged. Material hierarchy established.

## Expected result
Next is P2: GenLayerJS read integration.

## Actual result / error
None.

## Last known passing tests
P1.6 Visual QA (`visual-qa.sh P1.6`), lint, typecheck, build passed.

## Relevant files
`frontend/src/app/page.tsx`
`frontend/src/app/create/page.tsx`
`frontend/src/app/warrant/[id]/page.tsx`
`frontend/src/app/compare/page.tsx`

## Important rules
- No pass → no progress.
- Current official GenLayer docs override remembered information.
- User-controlled evidence is untrusted.
- Do not redesign unrelated parts to fix one local issue.
- User is a beginner; explanations should be simple.

## [Frontend Environment - 2026-09-12]
- Node environment configured for Next.js 16.3.5 / React 19.2.8.
- Development server running on port 3000.
# Support Context
P3 implements an EIP-1193 wallet integration using GenLayerJS. We rely on the user's injected `window.ethereum`.

### EIP-6963 and Multi-Wallet
P3-F adds robust EIP-6963 support, ensuring users with multiple wallet extensions (e.g. MetaMask, Rabby, Coinbase Wallet) do not experience race conditions.
ProofData maintains strict provider binding, meaning the exact selected `provider` object is used for fee estimation, connection, chain switching, and the final `writeContract` submission.

### Multi-Wallet Compatibility
If users report connection failures with non-MetaMask wallets, do NOT call `client.connect()` in `genlayer-js` v1.1.8 as it unconditionally triggers `wallet_getSnaps` against `window.ethereum` and forces MetaMask-specific logic. Handle standard EIP-1193 chain switching and RPC directly on the selected EIP-6963 provider.

### Future UI Revamp
A major visual revamp featuring interaction bubbles (liquid hover lens) and atmospheric color depth is planned but deferred until the core GenLayer lifecycle (write -> finalize -> read) is fully proven. See `UI_DESIGN.md`.

### Future Network Promotion (Studio-dev / v0.6 RC)
A strict migration plan (`NETWORK_PROMOTION_PLAN.md`) governs our future promotion from Studionet to Studio-dev. Do NOT mix `genlayer-js@1.1.8` logic with v0.6 RC infrastructure. Any upcoming migration will require explicit generation of `fee-profile.json` using `gltest`.
