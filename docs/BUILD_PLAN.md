# Build Plan

This plan strictly defines the implementation stages for the ProofData MVP.
*Note: P1 through P13 will be executed in a subsequent phase. Do not begin coding.*

## P0 — Product documents approved
- [x] SPIKE_PRD updated
- [x] PRODUCT_PRD created
- [x] UI/UX flows mapped

## P1 — Frontend skeleton
- Initialize Next.js (App Router), TailwindCSS.
- Setup basic routing (`/`, `/create`, `/warrant/[id]`, `/compare`).
- Implement the "Forensic Dossier" typography and color variables.

## P2 — GenLayerJS read integration
- Install `genlayer-js`.
- Configure Studionet RPC provider.
- Implement the read-only fetch for `/warrant/[id]` to display existing warrants.

## P3 — Wallet/write integration
- Integrate basic browser wallet connection (EVM / window.ethereum).
- Implement the transaction signing flow for `create_warrant`.

## P4 — Transaction lifecycle UI
- Build the robust loading state component ("Awaiting Consensus").
- Handle GenLayerJS receipt polling and error coercion.

## P5 — Create Warrant experience
- Build the `/create` form (URL, Purpose, Risk).
- Connect form submission to the P3 write flow.

## P6 — Warrant Result experience
- Polish the `/warrant/[id]` dossier design.
- Implement the distinct Status Stamps (WARRANTED, NOT_WARRANTED, etc.).

## P7 — Reliance Compare
- Build the `/compare` side-by-side view.
- Hardcode or dynamically fetch the primary Hackathon Demo fixtures.
- Visually connect the identical hashes.

## P8 — Agent/Developer demonstration
- Add the compact agent/developer integration snippet to the Home page `/`.

## P9 — Responsive + visual polish
- Ensure mobile layout is functional.
- Refine hover states, borders, and forensic aesthetics.

## P10 — Accessibility/error handling
- Ensure toast notifications work for rejected transactions or RPC failures.
- Verify status colors have structural fallbacks (icons/text).

## P11 — End-to-end Studionet test
- Run the full Demo Plan flow live on Studionet using the UI.

## P12 — Demo hardening
- Seed the contract with the fallback warrants for the live pitch.
- Ensure the `/compare` route is bulletproof.

## P13 — Submission readiness
- Record demo video.
- Finalize GitHub README.

## [Frontend P1 Update - 2026-09-12]
- Successfully implemented the Forensic Liquid Editorial design system using Next.js 15, React 19, and Tailwind CSS v4.
- All 4 routes (/, /create, /warrant/[id], /compare) implemented with zero external component libraries.
- Production build and TypeScript typechecking complete.

## [Frontend P1.6 Update - 2026-09-12]
- Completed Screenshot-Driven Visual Polish and Automated Visual QA (P1.6).
- Improved material hierarchy across all routes (Atmosphere, Evidence, Decision Context, Warrant, Protocol Metadata).
- Transformed Create page into an immersive "Reliance Dossier" form with custom risk selectors.
- Refined Warrant page with meaningful PROOFDATA seal SVG and bolder evidence fingerprint.
- Strengthened Compare page with "SAME EVIDENCE VERIFIED" badge and official decision records.
- Verified visual QA passes on both desktop and mobile without introducing new heavy dependencies.

### P3 (Wallet + Frontend Write Integration)
- Setup EIP-1193 window.ethereum wallet connection.
- Implement createClient with studionet chain and provider.
- Setup writeContract in create/page.tsx mapped precisely to create_warrant signature.
- Preserve account-free read route for /warrant/[id].
- QA and automated testing completed (Human test conditionally required).

### P3-F (Pre-Sign Write + Multi-Wallet Correction)
- Analyzed `genlayer-js` 1.1.8 methods: replaced non-existent `estimateTransactionFeesForWrite` with viem's `estimateContractGas`.
- Added EIP-6963 provider discovery in `useWallet.ts`.
- Integrated explicit validate & estimate pre-flight check on `/create`.
- Disabled estimate reuse if form fields or active wallet changes.
- Added legacy fallback for `window.ethereum` if EIP-6963 is absent.
- Preserved account-free two-client architecture.
- QA: Code linters, direct tests, Playwright visual reviews PASSED.

### P3-F3 (Wallet Provider Compatibility Fix)
- Identified `genlayer-js` `client.connect()` unconditionally calling `wallet_getSnaps` and forcing `window.ethereum`.
- Removed `client.connect()` from frontend to prevent MetaMask Snap enforcement.
- Built explicit EIP-1193 chain switching (`wallet_switchEthereumChain` / `wallet_addEthereumChain`) into `connectToProvider` mapped directly to the selected EIP-6963 provider.
- Documented future frontend revamp (Interaction Bubble + Color/Atmosphere) in `UI_DESIGN.md`. Will not implement until core flow passes.

### P3-C (Real Transaction Closure & Network Plan)
- Successfully verified the first real human-originated P3 transaction.
- Analyzed transaction state via Viem to extract the canonical P3 `warrant_id` (`warrant-cb5653e5-76f4-4dcd-9ae4-d22f81786fea`).
- Researched Agent Tank constraints and GenLayer network topology.
- Generated `NETWORK_PROMOTION_PLAN.md` to safely gate the incoming v0.6 RC upgrade.

### Next: P4 (Transaction Lifecycle)
- Wait/query decision and finalization for the transaction.
- Read execution success/failure and parse the output.
- Map the state to frontend UI gracefully.
