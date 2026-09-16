# ProofData judge demo — approximately three minutes

Start the production app at `http://localhost:3035` using the root README. Keep `/compare` ready in a second app tab. No wallet connection or new transaction is needed; the records below are finalized contract state.

## 0:00–0:20 — Homepage

Open `/`. Say: “ProofData asks whether exact evidence is sufficient for the action you intend to take. Finding evidence is only the first step; deciding whether to rely on it depends on what happens next.”

Point out wallet-free exploration. The homepage illustration is labeled; the following records are live reads.

## 0:20–0:50 — Warrant inputs

Open `/create`. Show the URL, expected Keccak, purpose, risk and requirements. Say: “A Reliance Warrant binds an exact artifact to an intended use. The browser prepares the inputs; validators decide the verdict.”

Do not click create or connect during the short pitch. Real wallet writes were verified separately; finalization latency need not consume the demo.

## 0:50–1:30 — Existing finalized warrant

Open `/warrant/warrant-4905a143-4d22-4603-9763-c15e87166a47`. Show `WARRANTED`, the stored developer-note purpose, LOW risk and Keccak. Reload.

Say: “This fresh browser test was signed through MetaMask on Bradbury. Creation, evidence validation and adjudication all finalized. Reloading reads the contract again; no signer or saved tracker is needed to display it.”

[Browser proof](submission-proof/browser-e2e.json) contains both layers of transaction IDs and votes. The UI shows stored status; the semantic reason is in transaction evidence because it is not persisted on the warrant.

## 1:30–2:30 — Compare: the thesis

Open `/compare`. Point to **SAME EVIDENCE VERIFIED**, shared URL/hash and requirements `[]`.

LOW: `storage-fix-low-diag-001`, internal technical note about Bradbury support, **WARRANTED**.

HIGH: `thesis2-high-001`, authorize an autonomous $250,000 treasury allocation from that evidence alone, **NOT_WARRANTED**.

Say: “The evidence did not change. The consequence did. A library declaration can support a developer note while providing no basis for a large autonomous financial action.”

Both were genuine semantic adjudications on the same contract. No verdict was forced or retried for appearance.

## 2:30–3:00 — Architecture and close

Show [the architecture diagram](SUBMISSION_ARCHITECTURE.md), or describe its three parts.

Say: “GenLayer lets validators reason over nondeterministic evidence while the deterministic contract controls lifecycle and authoritative state.”

Close: “ProofData — The Reliance Layer. Same evidence, different intended action, different authoritative verdict.”

## Network contingency

If Bradbury reads are unavailable, show the [committed proof bundle](submission-proof/README.md). Identify it as a recorded finalized snapshot, not a current live read. Never replace failed reads with fabricated UI verdicts.
