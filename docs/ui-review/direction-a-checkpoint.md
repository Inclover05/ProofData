# Direction A production checkpoint

Presentation implementation for ProofData — The Reliance Layer, based on the single reference at `docs/ui-reference/direction-a.png`.

The four existing routes retain the proven Bradbury product flow: `/`, `/create`, `/warrant/[id]` and `/compare`. The design uses smoked architectural glass, a mineral environment, editorial typography, an abstract evidence specimen, cryptographic fingerprints and branching reliance contexts. The final fidelity pass changed only CSS and three decorative SVG paths.

## Authoritative product invariants

- Canonical contract: `0xa73c0183e2e3605bbd5013abcb9c5683f7db1b4a`.
- Bradbury chain 4221; GenLayerJS `testnetBradbury`, SDK 1.1.8.
- Contract source SHA-256: `c03894f85ea4afd13a2fe536274589b666e952ef40980a6cfae949bc9fc0dd1d`.
- Explicit EIP-6963 wallet selection, MetaMask signing, the scoped browser gas adapter, transaction payloads, lifecycle tracking and contract read implementation are unchanged.
- Displayed verdicts come from live contract reads. Recorded execution evidence supplies attributed reasons and consensus details only when its warrant inputs/status match that live read.
- LOW `storage-fix-low-diag-001` is WARRANTED. HIGH `thesis2-high-001` is NOT_WARRANTED. The shared 723-byte fixture, URL/hash, requirements and deployed semantics are unchanged.
- Existing browser warrant `warrant-4905a143-4d22-4603-9763-c15e87166a47` remains WARRANTED after reload.

## Verification before integration

All checks passed: ESLint, TypeScript, production Webpack build, 12 wallet/lifecycle tests, 17 golden-source preservation checks, 17 read-only browser regression checks, 44 visual/browser acceptance checks and the isolated wrong-network presentation harness.

All four routes were reviewed at desktop 1920/1440, laptop 1280, tablet 820 and mobile 390 pixels. Home and compare were reviewed beside Direction A; warrant, create and mobile captures were also inspected. Reduced motion, keyboard focus, full hash copying, disconnected/error states and real validator vote counts were checked.

No contract deployment or blockchain write was made for the redesign. The existing real MetaMask lifecycle proof remains in `docs/submission-proof/`.

## Scope of this checkpoint

Production pages/CSS, three reusable presentation components, the loading view, the two optimized runtime WebP assets (157,230 bytes combined), read-only browser selectors, the single visual reference (1,995,255 bytes), and this note.

Generated review screenshots and larger local review boards remain preserved locally under `docs/ui-review/direction-a-v2/` and `docs/ui-review/direction-a-final/`; they are intentionally excluded from repository history. Unrelated Bradbury helper changes, scratch work, dirty submodule contents, caches, dependencies and environment files are not part of this checkpoint.

Golden submission history is preserved: contract repair `35c0b3865a6d8a455556c110f005fb1561141e7d`, browser lifecycle `9c2901cd2dcc37a9b9d06abbf57354de22755484`, submission package `164e9002114b787633d45fca6666891a2813e55a`.
