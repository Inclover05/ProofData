"use client";

import { useEffect, useState } from "react";

interface PreparedEvidence {
  url: string;
  hash: string;
  bytes: number;
  contentType: string;
  snapshot?: boolean;
  originalUrl?: string;
}

interface ComparisonDraft {
  url: string;
  lowAction: string;
  highAction: string;
  requirements: string;
  prepared: PreparedEvidence | null;
  snapshotText: string;
  sessionId: string;
}

interface SavedWarrantRef {
  sessionId: string;
  warrantId: string;
}

const LOW_KEY = "proofdata:compare-low-id";
const HIGH_KEY = "proofdata:compare-high-id";
const DRAFT_KEY = "proofdata:compare-draft";
const DEFAULT_LOW = "Use this evidence to decide whether I should take a small, reversible next step.";
const DEFAULT_HIGH = "Use this evidence alone to make a high-value or hard-to-reverse decision.";

function newSessionId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `comparison-${Date.now()}`;
}

function readSavedWarrant(key: string, sessionId: string) {
  const raw = localStorage.getItem(key);
  if (!raw) return "";

  try {
    const parsed = JSON.parse(raw) as SavedWarrantRef;
    if (parsed?.sessionId === sessionId && typeof parsed.warrantId === "string") return parsed.warrantId;
    return "";
  } catch {
    // Migrate the previous plain-string format only when a comparison draft exists.
    if (raw.startsWith("warrant-") && sessionId) {
      localStorage.setItem(key, JSON.stringify({ sessionId, warrantId: raw }));
      return raw;
    }
    return "";
  }
}

export function CompareYourEvidence() {
  const [url, setUrl] = useState("");
  const [lowAction, setLowAction] = useState(DEFAULT_LOW);
  const [highAction, setHighAction] = useState(DEFAULT_HIGH);
  const [requirements, setRequirements] = useState("");
  const [prepared, setPrepared] = useState<PreparedEvidence | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [snapshotRecommended, setSnapshotRecommended] = useState(false);
  const [snapshotText, setSnapshotText] = useState("");
  const [snapshotLoading, setSnapshotLoading] = useState(false);
  const [leftId, setLeftId] = useState("");
  const [rightId, setRightId] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    let restoredSession = newSessionId();
    let hasDraft = false;

    if (saved) {
      try {
        const draft = JSON.parse(saved) as ComparisonDraft;
        hasDraft = true;
        restoredSession = typeof draft.sessionId === "string" && draft.sessionId ? draft.sessionId : restoredSession;
        setUrl(typeof draft.url === "string" ? draft.url : "");
        setLowAction(typeof draft.lowAction === "string" && draft.lowAction ? draft.lowAction : DEFAULT_LOW);
        setHighAction(typeof draft.highAction === "string" && draft.highAction ? draft.highAction : DEFAULT_HIGH);
        setRequirements(typeof draft.requirements === "string" ? draft.requirements : "");
        setSnapshotText(typeof draft.snapshotText === "string" ? draft.snapshotText : "");
        if (draft.prepared?.url && draft.prepared?.hash) setPrepared(draft.prepared);
      } catch {
        localStorage.removeItem(DRAFT_KEY);
      }
    }

    setSessionId(restoredSession);
    if (hasDraft) {
      setLeftId(readSavedWarrant(LOW_KEY, restoredSession));
      setRightId(readSavedWarrant(HIGH_KEY, restoredSession));
    } else {
      localStorage.removeItem(LOW_KEY);
      localStorage.removeItem(HIGH_KEY);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || !sessionId) return;
    const draft: ComparisonDraft = { url, lowAction, highAction, requirements, prepared, snapshotText, sessionId };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [hydrated, url, lowAction, highAction, requirements, prepared, snapshotText, sessionId]);

  useEffect(() => {
    if (!hydrated || !sessionId) return;
    if (leftId.trim()) localStorage.setItem(LOW_KEY, JSON.stringify({ sessionId, warrantId: leftId.trim() }));
    else localStorage.removeItem(LOW_KEY);
    if (rightId.trim()) localStorage.setItem(HIGH_KEY, JSON.stringify({ sessionId, warrantId: rightId.trim() }));
    else localStorage.removeItem(HIGH_KEY);
  }, [hydrated, sessionId, leftId, rightId]);

  const clearComparisonIds = () => {
    setLeftId("");
    setRightId("");
    localStorage.removeItem(LOW_KEY);
    localStorage.removeItem(HIGH_KEY);
  };

  const clearSide = (side: "LOW" | "HIGH") => {
    if (side === "LOW") {
      setLeftId("");
      localStorage.removeItem(LOW_KEY);
    } else {
      setRightId("");
      localStorage.removeItem(HIGH_KEY);
    }
  };

  const resetComparisonIdentity = () => {
    setSessionId(newSessionId());
    clearComparisonIds();
  };

  const prepare = async () => {
    setLoading(true);
    setError(null);
    setPrepared(null);
    setSnapshotRecommended(false);
    try {
      const response = await fetch("/api/evidence/prepare", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      if (!response.ok) {
        if (data.snapshotRecommended) setSnapshotRecommended(true);
        throw new Error(data.error || "Unable to prepare this evidence.");
      }
      setPrepared(data);
      setUrl(data.url);
      resetComparisonIdentity();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to prepare this evidence.");
    } finally {
      setLoading(false);
    }
  };

  const createSnapshot = async () => {
    setSnapshotLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/evidence/snapshot", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sourceUrl: url, text: snapshotText }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to create a fixed evidence snapshot.");
      setPrepared(data);
      setSnapshotRecommended(false);
      resetComparisonIdentity();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create a fixed evidence snapshot.");
    } finally {
      setSnapshotLoading(false);
    }
  };

  const startOver = () => {
    setUrl("");
    setLowAction(DEFAULT_LOW);
    setHighAction(DEFAULT_HIGH);
    setRequirements("");
    setPrepared(null);
    setError(null);
    setSnapshotRecommended(false);
    setSnapshotText("");
    resetComparisonIdentity();
    localStorage.removeItem(DRAFT_KEY);
  };

  const createHref = (risk: "LOW" | "HIGH", action: string) => {
    if (!prepared) return "/create";
    const params = new URLSearchParams({
      evidence: prepared.url,
      hash: prepared.hash,
      action,
      risk,
      requirements,
      compareRole: risk,
      compareSession: sessionId,
    });
    return `/create?${params.toString()}`;
  };

  const lowQuery = `?compareRole=LOW${sessionId ? `&compareSession=${encodeURIComponent(sessionId)}` : ""}`;
  const highQuery = `?compareRole=HIGH${sessionId ? `&compareSession=${encodeURIComponent(sessionId)}` : ""}`;
  const lowHref = leftId.trim() ? `/warrant/${encodeURIComponent(leftId.trim())}${lowQuery}` : createHref("LOW", lowAction);
  const highHref = rightId.trim() ? `/warrant/${encodeURIComponent(rightId.trim())}${highQuery}` : createHref("HIGH", highAction);
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
              setError(null);
              setSnapshotRecommended(false);
              resetComparisonIdentity();
            }}
          />
        </div>
        <div className="hero-actions">
          <button type="button" className="button button--secondary" onClick={prepare} disabled={loading || !url.trim()}>
            {loading ? "CHECKING EVIDENCE..." : "PREPARE EVIDENCE"}
          </button>
          {(url || prepared || leftId || rightId) && <button type="button" className="button button--secondary" onClick={startOver}>START OVER</button>}
        </div>
        <p className="form-hint">ProofData first tries to lock the exact page bytes. If the site blocks automated retrieval or changes on every request, you can create a fixed snapshot from the visible listing text instead.</p>
        {error && <div className="error-notice">{error}</div>}

        {snapshotRecommended && !prepared && (
          <div className="mt-5 p-5 border border-rules-light bg-white text-text-dark">
            <span className="eyebrow">FIXED SNAPSHOT FALLBACK</span>
            <h3 className="mt-2 text-lg font-medium">This webpage cannot be locked directly.</h3>
            <p className="form-hint mt-2">Open the original page in your browser, copy the visible listing details you want evaluated, and paste them below. ProofData will create a stable evidence URL containing that exact text. The snapshot records the original source URL but does not claim the website itself was independently verified.</p>
            <div className="field-group mt-4">
              <label htmlFor="snapshotText">Visible evidence from the listing</label>
              <textarea
                id="snapshotText"
                className="form-input purpose-input"
                rows={10}
                value={snapshotText}
                onChange={event => setSnapshotText(event.target.value)}
                placeholder={"Example:\nProperty title\nPrice\nLocation\nBedrooms / bathrooms\nSeller description\nClaims about condition, title, inspection, ownership, etc."}
              />
            </div>
            <button type="button" className="button button--primary" onClick={createSnapshot} disabled={snapshotLoading || !snapshotText.trim()}>
              {snapshotLoading ? "CREATING SNAPSHOT..." : "CREATE FIXED EVIDENCE SNAPSHOT"}
            </button>
          </div>
        )}

        {prepared && (
          <div className="bg-white p-4 border border-rules-light text-xs font-mono text-text-dark-secondary mt-4 space-y-2">
            <div><span className="text-text-dark font-semibold">Evidence ready:</span> {prepared.bytes.toLocaleString()} bytes {prepared.snapshot ? "· FIXED SNAPSHOT" : ""}</div>
            <div className="break-all"><span className="text-text-dark font-semibold">Keccak-256:</span> {prepared.hash}</div>
            <div className="break-all"><span className="text-text-dark font-semibold">Locked URL:</span> {prepared.url}</div>
            {prepared.originalUrl && <div className="break-all"><span className="text-text-dark font-semibold">Original source:</span> {prepared.originalUrl}</div>}
            <div><span className="text-text-dark font-semibold">Type:</span> {prepared.contentType || "text"}</div>
          </div>
        )}
      </section>

      <section className="form-stage">
        <div className="field-group">
          <label htmlFor="lowAction">LOW reliance — what small or reversible action might you take?</label>
          <textarea id="lowAction" className="form-input purpose-input" rows={3} value={lowAction} onChange={event => { setLowAction(event.target.value); if (leftId) clearSide("LOW"); }} />
          {leftId && <p className="form-hint">Editing this action will require a new LOW warrant.</p>}
        </div>
        <div className="field-group">
          <label htmlFor="highAction">HIGH reliance — what serious action might you take using this evidence alone?</label>
          <textarea id="highAction" className="form-input purpose-input" rows={3} value={highAction} onChange={event => { setHighAction(event.target.value); if (rightId) clearSide("HIGH"); }} />
          {rightId && <p className="form-hint">Editing this action will require a new HIGH warrant.</p>}
        </div>
        <div className="field-group">
          <label htmlFor="compareRequirements">Extra requirements (optional, one per line)</label>
          <textarea id="compareRequirements" className="form-input" rows={2} value={requirements} onChange={event => { setRequirements(event.target.value); if (leftId || rightId) clearComparisonIds(); }} />
          {(leftId || rightId) && <p className="form-hint">Changing shared requirements requires new LOW and HIGH warrants.</p>}
        </div>
      </section>

      <section className="form-stage">
        <header className="form-stage-header"><h3>Run both real warrants</h3></header>
        <p className="form-hint">LOW and HIGH are separate warrants. You can create either one first, and one does not replace the other. Finish both validator flows before opening the final comparison.</p>
        <div className="hero-actions">
          <a className={`button button--primary ${!prepared && !leftId ? "pointer-events-none opacity-50" : ""}`} href={lowHref}>{leftId ? "OPEN LOW WARRANT ↗" : "CREATE LOW WARRANT ↗"}</a>
          <a className={`button button--secondary ${!prepared && !rightId ? "pointer-events-none opacity-50" : ""}`} href={highHref}>{rightId ? "OPEN HIGH WARRANT ↗" : "CREATE HIGH WARRANT ↗"}</a>
        </div>
        {(leftId || rightId) && <p className="form-hint mt-3">{leftId ? "LOW created. " : ""}{rightId ? "HIGH created. " : ""}A saved warrant opens its own lifecycle instead of creating a duplicate.</p>}
      </section>

      <section className="form-stage">
        <header className="form-stage-header"><h3>Open your final comparison</h3></header>
        <p className="form-hint">ProofData remembers the two warrant IDs from this comparison. Open each saved warrant above and finish it before comparing the final results.</p>
        <div className="field-group">
          <label htmlFor="leftWarrant">LOW warrant ID</label>
          <input id="leftWarrant" className="form-input form-input--technical" value={leftId} onChange={event => setLeftId(event.target.value)} placeholder="warrant-..." />
        </div>
        <div className="field-group">
          <label htmlFor="rightWarrant">HIGH warrant ID</label>
          <input id="rightWarrant" className="form-input form-input--technical" value={rightId} onChange={event => setRightId(event.target.value)} placeholder="warrant-..." />
        </div>
        {compareHref ? <a className="button button--primary" href={compareHref}>CHECK COMPARISON STATUS →</a> : <button type="button" className="button button--primary" disabled>CREATE BOTH WARRANTS TO COMPARE</button>}
      </section>
    </section>
  );
}
