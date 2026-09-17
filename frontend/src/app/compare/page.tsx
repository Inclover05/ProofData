import { BranchPaths, ContextPanel, EvidenceIdentity, Fingerprint, Specimen } from "@/components/presentation/Evidence";
import { CopyValue } from "@/components/presentation/CopyValue";
import { CompareYourEvidence } from "@/components/CompareYourEvidence";
import Link from "next/link";
import { FINAL_PROOF } from "@/lib/genlayer/config";
import { readWarrant } from "@/lib/genlayer/warrant-reader";

export const dynamic = "force-dynamic";

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ left?: string | string[]; right?: string | string[] }> }) {
  const query = await searchParams;
  const hasCustomPair = typeof query.left === "string" || typeof query.right === "string";
  const leftId = typeof query.left === "string" ? query.left : FINAL_PROOF.lowWarrantId;
  const rightId = typeof query.right === "string" ? query.right : FINAL_PROOF.highWarrantId;
  const [leftRead, rightRead] = await Promise.allSettled([readWarrant(leftId), readWarrant(rightId)]);
  const leftData = leftRead.status === "fulfilled" ? leftRead.value : null;
  const rightData = rightRead.status === "fulfilled" ? rightRead.value : null;

  return <div className="container compare-page">
    <header className="page-heading">
      <span className="eyebrow">PROOFDATA / RELIANCE COMPARISON</span>
      <h1 className="editorial">Same evidence.<br/>Different reliance.</h1>
      <p>Paste evidence you are actually considering, describe a small decision and a serious decision, then compare the validator-backed results.</p>
    </header>

    <CompareYourEvidence />

    <div className="section-heading" style={{ marginTop: "4rem" }}>
      <div>
        <span className="eyebrow">{hasCustomPair ? "YOUR CONTRACT READS" : "REFERENCE EXAMPLE"}</span>
        <h2 className="editorial">{hasCustomPair ? "Your finished comparison." : "See how a finished comparison looks."}</h2>
      </div>
      <p>{hasCustomPair ? "These records are read from the Bradbury contract." : "This existing finalized pair stays available as a working example while you create your own."}</p>
    </div>

    {!leftData || !rightData ? (
      <div className="empty-state glass">
        <span className="eyebrow">BRADBURY / READ UNAVAILABLE</span><h2>Comparison unavailable</h2>
        <p>Unable to read both warrant IDs. Check the IDs above, or wait until both warrants have been created on Bradbury.</p>
        <p className="metadata">LOW: {leftId} ({leftData ? "FOUND" : "READ UNAVAILABLE"})<br/>HIGH: {rightId} ({rightData ? "FOUND" : "READ UNAVAILABLE"})</p>
        <a href="/compare" className="button button--secondary">Show reference example</a>
      </div>
    ) : <ComparisonResult leftData={leftData} rightData={rightData} />}
  </div>;
}

function ComparisonResult({ leftData, rightData }: { leftData: Awaited<ReturnType<typeof readWarrant>>; rightData: Awaited<ReturnType<typeof readWarrant>> }) {
  const sameRequirements = JSON.stringify(leftData.requirements) === JSON.stringify(rightData.requirements);
  const isSameEvidence = leftData.evidence_ref === rightData.evidence_ref && leftData.expected_hash === rightData.expected_hash;
  const knownFixture = isSameEvidence && leftData.evidence_ref === FINAL_PROOF.sampleEvidence.url && leftData.expected_hash === FINAL_PROOF.sampleEvidence.keccak;

  return <>
    <section className="compare-shell glass" aria-label="Shared evidence and reliance contexts">
      <div className="compare-shared">
        {knownFixture ? <Specimen compact/> : <div className="compare-identity-top"><Fingerprint/><h2>Evidence identity</h2></div>}
        <div className="compare-identity"><div className="compare-identity-top"><div><span className="eyebrow">SHARED EVIDENCE / SINGLE IDENTITY</span><h2>One source. Two decisions.</h2><span className={isSameEvidence ? "verified-label" : "verdict verdict--negative"}>{isSameEvidence ? "SAME EVIDENCE VERIFIED" : "EVIDENCE MISMATCH DETECTED"}</span></div></div>
          <EvidenceIdentity url={leftData.evidence_ref} hash={leftData.expected_hash} knownFixture={knownFixture}/>
          <div className="shared-meta"><span className="metadata">REQUIREMENTS / {JSON.stringify(leftData.requirements)} · {sameRequirements ? "MATCH" : "DIFFER"}</span><span className="metadata">BRADBURY / 4221</span></div>
        </div>
      </div>
      <div className="compare-hub"><Fingerprint/><span className="eyebrow">RELIANCE CONTEXT</span></div><BranchPaths/>
      <div className="context-grid"><ContextPanel warrant={leftData}/><ContextPanel warrant={rightData}/></div>
      <div className="compare-conclusion"><p>{isSameEvidence ? "The evidence didn’t change. The consequence did." : "Different evidence identities. Inspect each warrant."}</p><Link href="/create" className="button button--secondary">Create another warrant <span aria-hidden="true">↗</span></Link></div>
    </section>
    <div className="compare-contract"><span className="field-label">SHARED CONTRACT / AUTHORITATIVE SOURCE</span><CopyValue value={FINAL_PROOF.contractAddress} label="contract address"/></div>
  </>;
}
