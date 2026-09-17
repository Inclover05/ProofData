import Image from "next/image";
import Link from "next/link";
import { FINAL_PROOF } from "@/lib/genlayer/config";
import type { WarrantDTO } from "@/lib/genlayer/warrant-reader";
import { CopyValue } from "./CopyValue";

export function Fingerprint() {
  return <svg className="fingerprint" viewBox="0 0 140 150" fill="none" aria-hidden="true">
    {Array.from({ length: 13 }, (_, i) => {
      const d = i * 3.4;
      return <path key={i} d={`M${17+d} ${111+d*.15} C${-2+d} ${66+d*.5}, ${19+d} ${18+d}, 70 ${16+d} C${126-d} ${16+d}, ${147-d} ${67+d*.5}, ${116-d} ${116+d*.15}`} stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>;
    })}
    <path d="M67 74c-12 1-15 11-12 23 3 12-3 24-10 28M71 83c-3 14 7 25-6 44" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>;
}

export function VerdictBadge({ status, large = false }: { status: string; large?: boolean }) {
  const tone = status === "WARRANTED" ? "positive" : status === "NOT_WARRANTED" ? "negative" : status === "CONDITIONAL" ? "conditional" : "neutral";
  return <span className={`verdict verdict--${tone}${large ? " verdict--large" : ""}`} data-status={status}><span className="verdict-mark" aria-hidden="true">{tone === "positive" ? "✓" : tone === "negative" ? "×" : "·"}</span>{status.replaceAll("_", " ")}</span>;
}

export function BranchPaths() {
  return <><svg className="branch-paths branch-paths--desktop" viewBox="0 0 600 140" preserveAspectRatio="none" fill="none" aria-hidden="true">
    {[0, 7, 14].map(offset => <g key={offset}><path d={`M${300-offset} 0 V${39+offset} Q${300-offset} ${60+offset} ${260-offset} ${60+offset} H${95-offset} Q${75-offset} ${60+offset} ${75-offset} ${85+offset} V140`} /><path d={`M${300+offset} 0 V${39+offset} Q${300+offset} ${60+offset} ${340+offset} ${60+offset} H${505+offset} Q${525+offset} ${60+offset} ${525+offset} ${85+offset} V140`} /></g>)}
    <path className="path-travel" d="M300 0 V39 Q300 60 260 60 H95 Q75 60 75 85 V140"/>
    <path className="path-travel" d="M300 0 V39 Q300 60 340 60 H505 Q525 60 525 85 V140"/>
  </svg><svg className="branch-paths branch-paths--mobile" viewBox="0 0 600 140" preserveAspectRatio="none" fill="none" aria-hidden="true"><path d="M300 0 V35 Q300 65 270 65 H45 Q20 65 20 90 V140"/><path className="path-travel" d="M300 0 V35 Q300 65 270 65 H45 Q20 65 20 90 V140"/></svg></>;
}

export function Specimen({ compact = false }: { compact?: boolean }) {
  return <div className={`specimen${compact ? " specimen--compact" : ""}`}>
    <Image src="/art/evidence-specimen.webp" width={1200} height={800} alt="" className="specimen-art" priority={!compact} sizes="(max-width: 700px) 100vw, 650px" />
    <div className="specimen-frame" aria-hidden="true"><i/><i/><i/><i/></div>
    <div className="specimen-annotation annotation-left"><span className="eyebrow">EVIDENCE / 01</span><span>genlayer-js@1.1.8</span><span>TypeScript declaration</span><span>723 BYTES</span></div>
    <div className="specimen-annotation annotation-right"><span className="eyebrow">EXACT IDENTITY</span><span>{FINAL_PROOF.sampleEvidence.keccak.slice(0, 8)}…{FINAL_PROOF.sampleEvidence.keccak.slice(-8)}</span><span>KECCAK-256</span></div>
    <div className="specimen-caption">ABSTRACT EVIDENCE SPECIMEN</div>
  </div>;
}

export function EvidenceScene({ left, right, loading = false }: { left: WarrantDTO | null; right: WarrantDTO | null; loading?: boolean }) {
  return <div className="evidence-scene" aria-label="One shared evidence identity branches into two reliance contexts">
    <Specimen />
    <div className="evidence-hub"><Fingerprint/><span className="eyebrow">ONE EVIDENCE IDENTITY</span></div>
    <BranchPaths/>
    <div className="scene-contexts">
      <div className="scene-context"><span className="eyebrow">{left?.risk_level || "LOW"} RELIANCE</span><p>Internal technical note</p><VerdictBadge status={left?.status || (loading ? "READING CONTRACT" : "READ UNAVAILABLE")}/></div>
      <div className="scene-context"><span className="eyebrow">{right?.risk_level || "HIGH"} RELIANCE</span><p>$250,000 treasury allocation</p><VerdictBadge status={right?.status || (loading ? "READING CONTRACT" : "READ UNAVAILABLE")}/></div>
    </div>
    <span className="scene-footnote">VERDICTS READ FROM BRADBURY · CONTRACT AUTHORITY</span>
  </div>;
}

export function EvidenceIdentity({ url, hash, knownFixture = false }: { url: string; hash: string; knownFixture?: boolean }) {
  return <div className="evidence-identity">
    <div className="identity-heading"><span className="eyebrow">CRYPTOGRAPHIC EVIDENCE IDENTITY</span>{knownFixture && <span className="metadata">723 BYTES</span>}</div>
    <div className="identity-row"><span className="field-label">SOURCE URI</span><CopyValue label="evidence URL" value={url} href={url}/></div>
    <div className="identity-row"><span className="field-label">KECCAK-256</span><CopyValue label="evidence hash" value={hash}/></div>
  </div>;
}

export function ContextPanel({ warrant }: { warrant: WarrantDTO }) {
  return <article className={`glass context-panel context-panel--${warrant.risk_level.toLowerCase()}`}>
    <header className="context-header"><span className="eyebrow">{warrant.risk_level} RELIANCE</span><span className="context-mini-verdict">{warrant.status.replaceAll("_", " ")}</span></header>
    <div className="context-body"><span className="field-label">INTENDED ACTION</span><p>{warrant.purpose}</p><div className="context-details"><span className="metadata">RISK / {warrant.risk_level}</span><span className="metadata">REQUIREMENTS / {JSON.stringify(warrant.requirements)}</span></div></div>
    <div className="context-verdict"><span className="field-label">AUTHORITATIVE CONTRACT VERDICT</span><VerdictBadge large status={warrant.status}/></div>
    <Link href={`/warrant/${warrant.id}`} className="case-link"><span>{warrant.id}</span><span aria-hidden="true">↗</span></Link>
  </article>;
}
