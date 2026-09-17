import { Suspense } from "react";
import Link from "next/link";
import { FINAL_PROOF } from "@/lib/genlayer/config";
import { readWarrant } from "@/lib/genlayer/warrant-reader";
import { EvidenceScene, Fingerprint, VerdictBadge } from "@/components/presentation/Evidence";

export const dynamic = "force-dynamic";

function readFinalPair() {
  return Promise.allSettled([readWarrant(FINAL_PROOF.lowWarrantId), readWarrant(FINAL_PROOF.highWarrantId)]);
}

async function LiveEvidence({ reads }: { reads: ReturnType<typeof readFinalPair> }) {
  const [low, high] = await reads;
  return <EvidenceScene left={low.status === "fulfilled" ? low.value : null} right={high.status === "fulfilled" ? high.value : null}/>;
}

async function LiveVerdict({ reads, side }: { reads: ReturnType<typeof readFinalPair>; side: 0 | 1 }) {
  const read = (await reads)[side];
  return <VerdictBadge status={read.status === "fulfilled" ? read.value.status : "READ UNAVAILABLE"} large/>;
}

export default function Home() {
  // Stream the two existing public reads; browsing and navigation render immediately.
  const reads = readFinalPair();
  return <div className="container">
    <section className="hero-shell glass" aria-labelledby="hero-title">
      <div className="hero-copy"><span className="eyebrow">THE RELIANCE LAYER</span>
        <h1 className="hero-title editorial" id="hero-title"><span>Evidence</span>{" "}<span>is not enough.</span></h1>
        <p className="hero-description">The same evidence may justify one action while failing to justify another. ProofData asks whether it is enough for the decision you intend to make.</p>
        <div className="hero-actions"><Link href="/create" className="button button--primary">Create a Reliance Warrant <span aria-hidden="true">↗</span></Link><Link href="/compare" className="button button--secondary">See the Proof <span aria-hidden="true">→</span></Link></div>
        <p className="hero-note"><svg width="15" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" aria-hidden="true"><path d="M10 2l7 3v5c0 5-7 8-7 8s-7-3-7-8V5z"/><path d="M6 10l3 3 5-6"/></svg>Explore first. Connect later. Judgment belongs to the contract.</p>
      </div>
      <Suspense fallback={<EvidenceScene left={null} right={null} loading/>}><LiveEvidence reads={reads}/></Suspense>
      <div className="hero-bottom"><span className="metadata">EXACT EVIDENCE. DECLARED PURPOSE. VALIDATOR CONSENSUS.</span><span className="metadata">BRADBURY TESTNET / 4221</span></div>
    </section>
    <section className="section" aria-labelledby="thesis-heading">
      <div className="section-heading"><div><span className="eyebrow">01 / THE CORE PROOF</span><h2 className="editorial" id="thesis-heading">The evidence didn’t change.<br/>The consequence did.</h2></div><p>A 723-byte network declaration can support an internal note. It cannot, by itself, justify a high-consequence treasury decision. These are real contract-backed results.</p></div>
      <div className="glass thesis-shell"><div className="thesis-shared"><Fingerprint/><div><span className="eyebrow">ONE SHARED EVIDENCE IDENTITY</span><p>genlayer-js@1.1.8 / testnetBradbury declaration</p></div><span className="metadata">KECCAK / {FINAL_PROOF.sampleEvidence.keccak.slice(0, 12)}…{FINAL_PROOF.sampleEvidence.keccak.slice(-8)}</span></div>
        <div className="thesis-contexts"><article><span className="eyebrow">LOW / INTERNAL RELIANCE</span><h3>Prepare an internal<br/>technical note.</h3><Suspense fallback={<VerdictBadge status="READING CONTRACT" large/>}><LiveVerdict reads={reads} side={0}/></Suspense></article><article><span className="eyebrow">HIGH / AUTONOMOUS RELIANCE</span><h3>Authorize a $250,000<br/>treasury allocation.</h3><Suspense fallback={<VerdictBadge status="READING CONTRACT" large/>}><LiveVerdict reads={reads} side={1}/></Suspense></article></div>
      </div><p><Link href="/compare" className="thesis-link">Inspect the same-evidence proof <span aria-hidden="true">↗</span></Link></p>
    </section>
    <section className="section" aria-labelledby="architecture-heading"><div className="section-heading"><div><span className="eyebrow">02 / THE RELIANCE PROTOCOL</span><h2 className="editorial" id="architecture-heading">Reasoning, with a safety shell.</h2></div><p>The interface presents the evidence. GenLayer validators perform the judgment. The contract stores the authoritative state.</p></div>
      <div className="protocol-rail"><article className="protocol-stage"><span className="eyebrow">01 / DETERMINISTIC</span><h3>Safety Shell</h3><p>Evidence identity, expiry and lifecycle transitions establish the boundaries of each warrant.</p></article><article className="protocol-stage"><span className="eyebrow">02 / NONDETERMINISTIC</span><h3>Judgment Core</h3><p>Evidence is retrieved and interpreted against a declared purpose, risk and requirements.</p></article><article className="protocol-stage"><span className="eyebrow">03 / VALIDATOR-BACKED</span><h3>Consensus</h3><p>Validators independently execute and compare results. Final judgment is stored on Bradbury.</p></article></div>
    </section>
  </div>;
}
