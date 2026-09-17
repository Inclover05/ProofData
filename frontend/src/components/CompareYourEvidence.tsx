"use client";

import { useMemo, useState } from "react";

interface PreparedEvidence {
  url: string;
  hash: string;
  bytes: number;
  contentType: string;
}

export function CompareYourEvidence() {
  const [url, setUrl] = useState("");
  const [lowAction, setLowAction] = useState("Use this evidence to decide whether I should take a small, reversible next step.");
  const [highAction, setHighAction] = useState("Use this evidence alone to make a high-value or hard-to-reverse decision.");
  const [requirements, setRequirements] = useState("");
  const [prepared, setPrepared] = useState<PreparedEvidence | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [leftId, setLeftId] = useState("");
  const [rightId, setRightId] = useState("");

  const encodedRequirements = useMemo(() => encodeURIComponent(requirements), [requirements]);

  const prepare = async () => {
    setLoading(true);
    setError(null);
    setPrepared(null);
    try {
      const response = await fetch("/api/evidence/prepare", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to prepare this evidence.");
      setPrepared(data);
      setUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to prepare this evidence.");
    } finally {
      setLoading(false);
    }
  };

  const createHref = (risk: "LOW" | "HIGH", action: string) => {
    if (!prepared) return "/create";
    const params = new URLSearchParams({
      evidence: prepared.url,
      hash: prepared.hash,
      action,
      risk,
      requirements,
    });
    return `/create?${params.toString()}`;
  };

  const compareHref = leftId.trim() && rightId.trim()
    ? `/compare?left=${encodeURIComponent(leftId.trim())}&right=${encodeURIComponent(rightId.trim())}`
    : "";

  return (
    <section className="glass instrument-form" aria-labelledby="compare-your-evidence-title">
      <header className="form-stage-header">
        <div>
          <span className="eyebrow">TRY PROOFDATA YOURSELF</span>
          <h2 id="compare-your-evidence-title" className="editorial">Compare your own evidence.</h2>
        </div>
        <span className="metadata">ONE LINK · TWO DECISIONS</span>
      </header>

      <section className="form-stage">
        <div className="field-group">
          <label htmlFor="compareEvidenceUrl">Paste a public evidence link</label>
          <input
            id="compareEvidenceUrl"
            className="form-input form-input--technical"
            type="url"
            placeholder="https://example.com/product-or-property-page"
            value={url}
            onChange={event => {
              setUrl(event.target.value);
              setPrepared(null);
            }}
          />
        </div>
        <button type="button" className="button button--secondary" onClick={prepare} disabled={loading || !url.trim()}>
          {loading ? "CHECKING EVIDENCE..." : "PREPARE EVIDENCE"}
        </button>
        <p className="form-hint">ProofData fetches the page twice. If the exact bytes stay stable, it creates the cryptographic identity for you.</p>
        {error && <div className="error-notice">{error}</div>}
        {prepared && (
          <div className="bg-white p-4 border border-rules-light text-xs font-mono text-text-dark-secondary mt-4 space-y-2">
            <div><span className="text-text-dark font-semibold">Evidence ready:</span> {prepared.bytes.toLocaleString()} bytes</div>
            <div className="break-all"><span className="text-text-dark font-semibold">Keccak-256:</span> {prepared.hash}</div>
            <div><span className="text-text-dark font-semibold">Type:</span> {prepared.contentType || "text"}</div>
          </div>
        )}
      </section>

      <section className="form-stage">
        <div className="field-group">
          <label htmlFor="lowAction">LOW reliance — what small or reversible action might you take?</label>
          <textarea id="lowAction" className="form-input purpose-input" rows={3} value={lowAction} onChange={event => setLowAction(event.target.value)} />
        </div>
        <div className="field-group">
          <label htmlFor="highAction">HIGH reliance — what serious action might you take using this evidence alone?</label>
          <textarea id="highAction" className="form-input purpose-input" rows={3} value={highAction} onChange={event => setHighAction(event.target.value)} />
        </div>
        <div className="field-group">
          <label htmlFor="compareRequirements">Extra requirements (optional, one per line)</label>
          <textarea id="compareRequirements" className="form-input" rows={2} value={requirements} onChange={event => setRequirements(event.target.value)} />
        </div>
      </section>

      <section className="form-stage">
        <header className="form-stage-header"><h3>Run both real warrants</h3></header>
        <p className="form-hint">Create the LOW warrant first, finish its validation and adjudication, then create the HIGH warrant with the same evidence. Copy each warrant ID when finished.</p>
        <div className="hero-actions">
          <a className={`button button--primary ${!prepared ? "pointer-events-none opacity-50" : ""}`} href={createHref("LOW", lowAction)}>CREATE LOW WARRANT ↗</a>
          <a className={`button button--secondary ${!prepared ? "pointer-events-none opacity-50" : ""}`} href={createHref("HIGH", highAction)}>CREATE HIGH WARRANT ↗</a>
        </div>
      </section>

      <section className="form-stage">
        <header className="form-stage-header"><h3>Open your final comparison</h3></header>
        <div className="field-group">
          <label htmlFor="leftWarrant">LOW warrant ID</label>
          <input id="leftWarrant" className="form-input form-input--technical" value={leftId} onChange={event => setLeftId(event.target.value)} placeholder="warrant-..." />
        </div>
        <div className="field-group">
          <label htmlFor="rightWarrant">HIGH warrant ID</label>
          <input id="rightWarrant" className="form-input form-input--technical" value={rightId} onChange={event => setRightId(event.target.value)} placeholder="warrant-..." />
        </div>
        {compareHref ? <a className="button button--primary" href={compareHref}>COMPARE MY WARRANTS →</a> : <button type="button" className="button button--primary" disabled>COMPARE MY WARRANTS →</button>}
      </section>
    </section>
  );
}
