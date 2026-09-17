import { EvidenceIdentity, Fingerprint, VerdictBadge } from "@/components/presentation/Evidence";
import { CopyValue } from "@/components/presentation/CopyValue";
import { RecordedConsensus, recordedProof } from "@/components/presentation/RecordedConsensus";
import Link from "next/link";
import { FINAL_PROOF } from "@/lib/genlayer/config";
import { readWarrant } from "@/lib/genlayer/warrant-reader";

export const dynamic = "force-dynamic";
import { AdjudicateAction } from "@/components/AdjudicateAction";

type WarrantStatus = "PENDING" | "WARRANTED" | "CONDITIONAL" | "NOT_WARRANTED" | "INCONCLUSIVE" | "PENDING_AI";

interface WarrantData {
  id: string;
  status: WarrantStatus;
  evidenceUrl: string;
  evidenceHash: string;
  intendedAction: string;
  riskLevel: string;
  requester: string;
  timestamp: string;
  reason: string;
  requirements: string[];
}

export default async function WarrantPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ compareRole?: string | string[]; compareSession?: string | string[] }>;
}) {
  const resolvedParams = await params;
  const query = await searchParams;
  const compareRole = query.compareRole === "LOW" || query.compareRole === "HIGH" ? query.compareRole : null;
  const compareSession = typeof query.compareSession === "string" ? query.compareSession : "";

  let data: WarrantData | null = null;
  let errorMsg = null;
  const warrantId = resolvedParams.id === "demo-low" ? FINAL_PROOF.lowWarrantId : resolvedParams.id.startsWith("demo") ? FINAL_PROOF.highWarrantId : resolvedParams.id;
  try {
    const w = await readWarrant(warrantId);
    data = { id: w.id, status: w.status as WarrantStatus, evidenceUrl: w.evidence_ref,
      evidenceHash: w.expected_hash, intendedAction: w.purpose, riskLevel: w.risk_level,
      requester: w.requester, timestamp: String(w.expires_at),
      reason: "This contract stores the verdict only; it does not store the adjudication reason.", requirements: w.requirements };
  } catch {
    errorMsg = "Unable to read this warrant from Bradbury. It may not exist, or the network may be unavailable.";
  }

  if (errorMsg || !data) {
    return <div className="empty-state glass"><span className="eyebrow">BRADBURY / READ UNAVAILABLE</span><h1>Warrant unavailable</h1><p>{errorMsg || "UNKNOWN ERROR"}</p><p className="metadata">{resolvedParams.id}</p><Link href="/warrant/demo" className="button button--secondary">View Final HIGH Proof</Link></div>;
  }

  const proof = recordedProof({ id: data.id, status: data.status, evidence_ref: data.evidenceUrl, expected_hash: data.evidenceHash, purpose: data.intendedAction, risk_level: data.riskLevel, requester: data.requester, expires_at: Number(data.timestamp), requirements: data.requirements });
  const knownFixture = data.evidenceUrl === FINAL_PROOF.sampleEvidence.url && data.evidenceHash === FINAL_PROOF.sampleEvidence.keccak;
  const pending = ["PENDING", "PENDING_AI"].includes(data.status);
  const isFinal = ["WARRANTED", "CONDITIONAL", "NOT_WARRANTED", "INCONCLUSIVE"].includes(data.status);
  const compareHref = compareRole ? `/compare${compareSession ? `?session=${encodeURIComponent(compareSession)}` : ""}` : "/compare";

  return <div className="container form-container">
    <div className="page-heading"><span className="eyebrow">THE RELIANCE LAYER / FORENSIC CASE FILE</span><p>Exact evidence, declared reliance and an authoritative contract verdict.</p></div>
    {compareRole && <div className="mb-6 p-4 border border-rules-light bg-surface-ivory text-text-dark"><span className="eyebrow">COMPARISON MODE / {compareRole}</span><p className="form-hint mt-2">This is the {compareRole} warrant from your current comparison. Finish this lifecycle, then return to Compare and continue with the other side.</p></div>}
    <article className="case-shell glass">
      <header className="case-header"><div><span className="eyebrow">RELIANCE WARRANT / BRADBURY 4221</span><h1>{data.status === "PENDING" ? "Pending evidence validation" : data.status === "PENDING_AI" ? "Awaiting adjudication" : <VerdictBadge status={data.status} large/>}</h1><div className="metadata">{data.id}</div></div><div className="case-stamp"><Fingerprint/><span className="eyebrow">EXACT EVIDENCE IDENTITY</span></div></header>
      <div className="case-body"><div className="case-main">
        <section className="case-section"><span className="eyebrow">01 / SOURCE INTEGRITY</span><h2>Evidence identity</h2><EvidenceIdentity url={data.evidenceUrl} hash={data.evidenceHash} knownFixture={knownFixture}/>{proof && <p className="analyst-source">VERIFIED · Recorded validator retrieval matched the exact expected hash.</p>}</section>
        <section className="case-section"><span className="eyebrow">02 / RELIANCE CONTEXT</span><h2>What this evidence is asked to support.</h2><span className="field-label">PURPOSE</span><p className="case-purpose">{data.intendedAction}</p><div className="shared-meta"><span className="metadata">RISK / {data.riskLevel}</span><span className="metadata">REQUIREMENTS / {JSON.stringify(data.requirements)}</span></div></section>
        {!pending && <section className="case-section"><span className="eyebrow">03 / ANALYST NOTE</span><h2>Adjudication reason</h2><blockquote className="analyst-note">{proof?.semanticOutput.reason || data.reason}</blockquote><p className="analyst-source">{proof ? "Recorded GenLayer consensus execution output. The contract persists the verdict, not this reason. No frontend-generated reasoning." : "No recorded semantic output is available for this warrant. The displayed state comes from a live contract read."}</p></section>}
        {proof && <RecordedConsensus proof={proof}/>}
        {["PENDING", "PENDING_AI"].includes(data.status) && <AdjudicateAction key={data.status} warrantId={data.id} method={data.status === "PENDING" ? "retrieve_and_validate" : "adjudicate"}/>}
        {compareRole && isFinal && <div className="mt-8 p-5 border border-rules-light bg-surface-ivory text-text-dark"><span className="eyebrow">THIS SIDE IS FINAL</span><p className="form-hint mt-2">Return to Compare. ProofData will keep this warrant attached to the {compareRole} side.</p><Link href={compareHref} className="button button--primary mt-4">RETURN TO COMPARISON →</Link></div>}
      </div><aside className="case-sidebar"><span className="eyebrow">EXECUTION RECORD</span><h2>Warrant lifecycle</h2>
        {proof ? <ol className="lifecycle-records">{proof.transactions.map(tx => <li key={tx.stage}>{tx.stage === "create" ? "CREATED" : ["validation", "retrieve_and_validate"].includes(tx.stage) ? "RETRIEVED / HASH VERIFIED" : "VALIDATOR JUDGMENT"}<span className="metadata">{tx.status} / {tx.consensus}</span></li>)}</ol> : <p className="analyst-source">Current stored state: {data.status}. Intermediate execution records are not available in this view.</p>}
        {proof && "lifecycle" in proof && <p className="analyst-source">OBSERVED CONTRACT STATES<br/>{proof.lifecycle.join(" → ")}</p>}<dl className="case-metadata"><div><dt className="field-label">AUTHORITATIVE STATE</dt><dd>{data.status}</dd></div><div><dt className="field-label">RISK LEVEL</dt><dd>{data.riskLevel}</dd></div><div><dt className="field-label">REQUESTER</dt><dd>{data.requester}</dd></div><div><dt className="field-label">EXPIRES / UTC</dt><dd>{new Date(Number(data.timestamp) * 1000).toISOString().replace('T', ' ').replace('.000Z', ' UTC')}</dd></div><div><dt className="field-label">PROTOCOL</dt><dd>GenLayer (Bradbury, chain 4221)</dd></div><div><dt className="field-label">FINAL CONTRACT</dt><dd><CopyValue label="contract address" value={FINAL_PROOF.contractAddress}/></dd></div></dl>
      </aside></div>
    </article>
    <div className="hero-actions">
      {compareRole ? <Link href={compareHref} className="button button--secondary">Return to Compare →</Link> : <><Link href={`/warrant/${FINAL_PROOF.lowWarrantId}`} className="button button--secondary">Final LOW proof</Link><Link href={`/warrant/${FINAL_PROOF.highWarrantId}`} className="button button--secondary">Final HIGH proof</Link><Link href="/compare" className="button button--secondary">Compare reliance →</Link></>}
    </div>
  </div>;
}
