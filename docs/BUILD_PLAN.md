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
