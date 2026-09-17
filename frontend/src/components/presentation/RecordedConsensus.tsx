import low from "../../../../docs/submission-proof/low.json";
import high from "../../../../docs/submission-proof/high.json";
import browser from "../../../../docs/submission-proof/browser-e2e.json";
import type { WarrantDTO } from "@/lib/genlayer/warrant-reader";
import { CopyValue } from "./CopyValue";

// Recorded execution evidence supplements a live warrant read. It never supplies its verdict.
export function recordedProof(warrant: WarrantDTO) {
  return [low, high, browser].find(proof =>
    proof.warrant.id === warrant.id && proof.warrant.status === warrant.status &&
    proof.warrant.evidence_ref === warrant.evidence_ref && proof.warrant.expected_hash === warrant.expected_hash &&
    proof.warrant.purpose === warrant.purpose && proof.warrant.risk_level === warrant.risk_level &&
    JSON.stringify(proof.warrant.requirements) === JSON.stringify(warrant.requirements)
  );
}

export function RecordedConsensus({ proof }: { proof: NonNullable<ReturnType<typeof recordedProof>> }) {
  const adjudication = proof.transactions.at(-1)!;
  const round = adjudication.validatorRounds.filter(round => round.votes.includes("AGREE")).at(-1);
  return <section className="case-section">
    <span className="eyebrow">RECORDED FINAL ADJUDICATION</span><h2>Validator consensus</h2>
    <div className="validator-traces">{round?.votes.map((vote, index) => <div key={index} className="validator-trace" data-vote={vote}><span>NODE / {String(index + 1).padStart(2, "0")}</span><i aria-hidden="true"/><span>{vote}</span></div>)}</div>
    <div className="consensus-result"><span className="eyebrow">CONSENSUS / {adjudication.consensus}</span><span className="metadata">{adjudication.status}</span></div>
    <p className="analyst-source">{adjudication.execution} · Outer receipt {adjudication.outerReceiptStatus}. Recorded transaction evidence; current warrant verdict is read from the contract.</p>
    <div className="tx-record"><span className="field-label">GENLAYER ADJUDICATION TRANSACTION</span><CopyValue value={adjudication.genLayerTransaction} label="GenLayer adjudication transaction"/><span className="field-label">OUTER EVM TRANSACTION</span><CopyValue value={adjudication.outerEvmTransaction} label="outer adjudication transaction"/></div>
  </section>;
}
