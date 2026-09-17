"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useWallet } from "@/lib/genlayer/useWallet";
import { transactionTracker } from "@/lib/genlayer/transaction-lifecycle";
import { useTrackedTransaction } from "@/lib/genlayer/useTrackedTransaction";
import { FINAL_PROOF } from "@/lib/genlayer/config";

interface PreparedEvidence {
  url: string;
  hash: string;
  bytes: number;
  contentType: string;
}

export default function CreateWarrant() {
  const searchParams = useSearchParams();
  const {
    address,
    isConnecting,
    error: walletError,
    network,
    providers,
    hasLegacyEthereum,
    connectToProvider,
    writeWarrant,
  } = useWallet();

  const initialUrl = searchParams.get("evidence") || "";
  const initialHash = searchParams.get("hash") || "";
  const initialAction = searchParams.get("action") || "";
  const initialRisk = searchParams.get("risk") || "LOW";
  const initialRequirements = searchParams.get("requirements") || "";
  const compareRole = searchParams.get("compareRole") === "LOW" || searchParams.get("compareRole") === "HIGH"
    ? searchParams.get("compareRole") as "LOW" | "HIGH"
    : null;
  const compareSession = searchParams.get("compareSession") || "";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [risk, setRisk] = useState(compareRole || initialRisk);
  const [url, setUrl] = useState(initialUrl);
  const [expectedHash, setExpectedHash] = useState(initialHash);
  const [action, setAction] = useState(initialAction);
  const [reqs, setReqs] = useState(initialRequirements);
  const [prepared, setPrepared] = useState<PreparedEvidence | null>(initialUrl && initialHash ? { url: initialUrl, hash: initialHash, bytes: 0, contentType: "prepared evidence" } : null);
  const [isPreparingEvidence, setIsPreparingEvidence] = useState(false);
  const [evidenceError, setEvidenceError] = useState<string | null>(null);

  const { tracked, info, warrantStatus, startTracking, setInfo } = useTrackedTransaction("create");
  const txHash = tracked?.txHash || null;
  const lifecycleState = info.state;
  const rawStatus = info.rawStatus;
  const rawExecutionResult = info.rawExecutionResult;
  const [submitError, setSubmitError] = useState<string | null>(null);
  const trackingError = submitError || info.errorMessage;
  const [showWalletSelector, setShowWalletSelector] = useState(false);
  const [generatedWarrantId] = useState(() => `warrant-${typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Date.now()}`);
  const effectiveRisk = compareRole || risk;

  const invalidate = () => setSubmitError(null);

  const prepareEvidence = async () => {
    if (compareRole) return;
    setIsPreparingEvidence(true);
    setEvidenceError(null);
    setPrepared(null);
    setExpectedHash("");
    try {
      const response = await fetch("/api/evidence/prepare", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to prepare this evidence.");
      setUrl(data.url);
      setExpectedHash(data.hash);
      setPrepared(data);
    } catch (error) {
      setEvidenceError(error instanceof Error ? error.message : "Unable to prepare this evidence.");
    } finally {
      setIsPreparingEvidence(false);
    }
  };

  const loadReferenceExample = () => {
    if (compareRole) return;
    setUrl(FINAL_PROOF.sampleEvidence.url);
    setExpectedHash(FINAL_PROOF.sampleEvidence.keccak);
    setAction("Use this evidence to prepare an internal developer note listing the declared GenLayerJS testnet network exports.");
    setRisk("LOW");
    setReqs("");
    setPrepared({ url: FINAL_PROOF.sampleEvidence.url, hash: FINAL_PROOF.sampleEvidence.keccak, bytes: 723, contentType: "text/plain" });
    setEvidenceError(null);
  };

  const handleConnectClick = () => {
    if (providers.length > 1) setShowWalletSelector(true);
    else if (providers.length === 1) connectToProvider(providers[0]);
    else if (hasLegacyEthereum) connectToProvider(null);
    else setSubmitError("No compatible browser wallet detected.");
  };

  const getArgs = () => [
    generatedWarrantId,
    url,
    expectedHash,
    action,
    effectiveRisk,
    reqs.split("\n").map(value => value.trim()).filter(Boolean),
    Math.floor(Date.now() / 1000) + 86400 * 7,
  ];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!prepared || !expectedHash) {
      setEvidenceError("Prepare the evidence first so ProofData can lock its exact identity.");
      return;
    }
    if (!address) {
      handleConnectClick();
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      setInfo({ state: "SUBMITTING" });
      const result = await writeWarrant(getArgs());
      if (result.error) {
        setSubmitError(`Unable to prepare this transaction: ${result.error}`);
        setInfo({ state: "IDLE" });
        if (result.rawError) console.error("Technical details:", result.rawError);
      } else if (result.txHash) {
        if (compareRole && typeof window !== "undefined") {
          const key = compareRole === "LOW" ? "proofdata:compare-low-id" : "proofdata:compare-high-id";
          localStorage.setItem(key, JSON.stringify({ sessionId: compareSession, warrantId: generatedWarrantId }));
        }
        startTracking({ txHash: result.txHash, outerTxHash: result.outerTxHash, warrantId: generatedWarrantId });
      }
    } catch (error) {
      setSubmitError("Unable to prepare this transaction.");
      setInfo({ state: "IDLE" });
      console.error("Technical details:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderLifecycleUI = () => {
    const isTerminal = transactionTracker.isTerminal(lifecycleState);
    const activeWarrantId = tracked?.warrantId || generatedWarrantId;
    const compareQuery = compareRole
      ? `?compareRole=${compareRole}${compareSession ? `&compareSession=${encodeURIComponent(compareSession)}` : ""}`
      : "";

    return <div className="protocol-panel mb-8">
      <h2 className="editorial border-b border-rules pb-4">RELIANCE REQUEST</h2>
      {compareRole && <div className="mb-6 p-4 bg-surface-ivory text-text-dark border border-rules-light"><span className="eyebrow">COMPARISON MODE / {compareRole}</span><p className="text-sm mt-2">This is the {compareRole} side of your comparison. Its evidence, requirements and risk level are locked to the comparison you started. The other side can run independently.</p></div>}
      <div className="space-y-4 font-mono text-sm mb-8">
        <div className="flex items-center gap-4"><div className={`w-3 h-3 rounded-full ${lifecycleState === "SUBMITTING" ? "bg-accent animate-pulse" : "bg-positive"}`}></div><div className={lifecycleState === "SUBMITTING" ? "text-white" : "text-text-secondary"}>{lifecycleState === "SUBMITTING" ? "Awaiting wallet authorization / submission" : "Submitted"}</div></div>
        <div className="flex items-center gap-4"><div className={`w-3 h-3 rounded-full ${["SUBMITTING", "SUBMITTED", "NOT_FOUND"].includes(lifecycleState) ? "bg-bg-deep-graphite" : lifecycleState === "PROCESSING" ? "bg-accent animate-pulse" : "bg-positive"}`}></div><div className={["SUBMITTING", "SUBMITTED", "NOT_FOUND"].includes(lifecycleState) ? "text-text-secondary/50" : lifecycleState === "PROCESSING" ? "text-white" : "text-text-secondary"}>Processing</div></div>
        <div className="flex items-center gap-4"><div className={`w-3 h-3 rounded-full ${!["DECIDED", "FINALIZED_SUCCESS", "FINALIZED_ERROR"].includes(lifecycleState) ? "bg-bg-deep-graphite" : lifecycleState === "DECIDED" ? "bg-accent animate-pulse" : "bg-positive"}`}></div><div className={!["DECIDED", "FINALIZED_SUCCESS", "FINALIZED_ERROR"].includes(lifecycleState) ? "text-text-secondary/50" : lifecycleState === "DECIDED" ? "text-white" : "text-text-secondary"}>Decision Reached</div></div>
        <div className="flex items-center gap-4"><div className={`w-3 h-3 rounded-full ${!isTerminal ? "bg-bg-deep-graphite" : lifecycleState === "FINALIZED_SUCCESS" ? "bg-positive" : "bg-negative"}`}></div><div className={!isTerminal ? "text-text-secondary/50" : "text-white"}>{lifecycleState === "FINALIZED_SUCCESS" ? "Finalized - Execution Verified" : lifecycleState === "FINALIZED_ERROR" ? "Finalized - Execution Failed" : ["FAILED", "CANCELED"].includes(lifecycleState) ? "Transaction Failed/Canceled" : lifecycleState === "NETWORK_ERROR" ? "Network Tracking Error" : "Finalized"}</div></div>
      </div>
      <div className="bg-bg-deep-graphite p-5 border border-rules text-xs font-mono text-text-secondary space-y-2">
        <div className="break-all"><span className="text-white">Warrant ID:</span> {activeWarrantId}</div>
        <div className="break-all"><span className="text-white">GenLayer transaction:</span> {txHash}</div>
        <div className="break-all"><span className="text-white">Outer EVM transaction:</span> {tracked?.outerTxHash || "Not available"}</div>
        <div><span className="text-white">Protocol Status:</span> {rawStatus || "WAITING"}</div>
        <div><span className="text-white">Execution Result:</span> {rawExecutionResult || "WAITING"}</div>
      </div>
      {trackingError && <div className="error-notice">{trackingError}{!isTerminal && tracked && <button onClick={() => startTracking(tracked)} className="block mt-2 underline">Retry Status Check</button>}</div>}
      {warrantStatus && <div className="mt-8 p-6 bg-surface-ivory text-text-dark border border-rules-light">
        <div className="text-[10px] uppercase tracking-widest text-text-dark-secondary mb-2">Authoritative Contract State</div>
        <div className="text-lg font-medium">{warrantStatus}</div>
        <div className="text-xs text-text-dark-secondary mt-2">Your warrant exists on Bradbury. Continue to verify the evidence, then request the validator judgment.</div>
        <Link href={`/warrant/${activeWarrantId}${compareQuery}`} className="mt-4 block font-mono text-sm text-accent underline">CONTINUE TO WARRANT</Link>
        {compareRole && <Link href="/compare" className="mt-3 block font-mono text-sm underline">RETURN TO COMPARISON</Link>}
      </div>}
    </div>;
  };

  return <div className="container form-container">
    <header className="page-heading form-heading"><div><span className="eyebrow">RELIANCE WARRANT / INITIALIZATION</span><h1 className="editorial">Check evidence before you rely on it.</h1><p>Paste a public link, tell ProofData what you want to do with it, and let GenLayer validators decide whether that evidence is enough for that action.</p></div><span className="draft-label">{txHash ? lifecycleState.replace("_", " ") : "DRAFTING"}</span></header>

    <div className="wallet-bar" id="wallet"><div className="metadata">{network ? `NETWORK: ${network}` : "WALLET DISCONNECTED"}<p>You can prepare the evidence first. Connect only when you are ready to put the warrant on-chain.</p></div><div>{!address ? <div className="relative"><button type="button" onClick={handleConnectClick} disabled={isConnecting} className="wallet-button">{isConnecting ? "CONNECTING..." : "CONNECT WALLET"}</button>{showWalletSelector && <div className="wallet-menu"><div className="p-3 border-b border-rules metadata uppercase">Select Wallet</div>{providers.map(provider => <button key={provider.info.uuid} onClick={() => { setShowWalletSelector(false); connectToProvider(provider); }} className="wallet-option">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={provider.info.icon} alt="" className="w-5 h-5" />{provider.info.name}</button>)}</div>}</div> : <div className="text-xs font-mono text-white bg-bg-deep-graphite px-4 py-2 border border-rules-light/10">{address.substring(0, 6)}...{address.substring(address.length - 4)}</div>}</div></div>
    {walletError && <div className="error-notice">{walletError}</div>}

    {txHash ? renderLifecycleUI() : <form onSubmit={handleSubmit} className="glass instrument-form">
      {submitError && <div className="error-notice" role="alert">{trackingError}</div>}

      {compareRole && <div className="p-4 border-b border-rules-light bg-surface-ivory text-text-dark"><span className="eyebrow">COMPARISON SIDE / {compareRole}</span><p className="form-hint mt-2">The shared evidence and requirements are locked here so the comparison stays controlled. You can still edit this side's intended action before issuing it.</p></div>}

      <section className="form-stage"><header className="form-stage-header"><h2><span className="form-stage-number">01 /</span> Paste your evidence</h2><span className="metadata">PUBLIC HTTPS LINK</span></header>
        <div className="field-group"><label htmlFor="evidenceUrl">Link to the page, document, product, listing, or other public text evidence</label><input id="evidenceUrl" type="url" required value={url} disabled={!!compareRole} onChange={event => { setUrl(event.target.value); setExpectedHash(""); setPrepared(null); setEvidenceError(null); invalidate(); }} className="form-input form-input--technical" placeholder="https://example.com/property-listing"/></div>
        {!compareRole && <><div className="hero-actions"><button type="button" className="button button--secondary" disabled={!url.trim() || isPreparingEvidence} onClick={prepareEvidence}>{isPreparingEvidence ? "CHECKING EVIDENCE..." : "PREPARE EVIDENCE"}</button><button type="button" className="button button--secondary" onClick={loadReferenceExample}>LOAD REFERENCE EXAMPLE</button></div><p className="form-hint">You do not need to calculate a hash. ProofData does that for you and checks that the page is stable before you spend a transaction. Pages that change on every request are rejected before you sign.</p></>}
        {compareRole && <p className="form-hint">This evidence identity came from Compare and cannot be changed on only one side.</p>}
        {evidenceError && <div className="error-notice">{evidenceError}</div>}
        {prepared && <div className="bg-white p-4 border border-rules-light text-xs font-mono text-text-dark-secondary mt-4 space-y-2"><div><span className="text-text-dark font-semibold">Evidence ready</span>{prepared.bytes ? ` · ${prepared.bytes.toLocaleString()} bytes` : ""}</div><div className="break-all"><span className="text-text-dark font-semibold">Exact identity:</span> {expectedHash}</div><div className="break-all"><span className="text-text-dark font-semibold">Resolved URL:</span> {url}</div></div>}
      </section>

      <section className="form-stage"><header className="form-stage-header"><h2><span className="form-stage-number">02 /</span> What are you about to do?</h2><span className="metadata">INTENDED RELIANCE</span></header>
        <div className="field-group"><label htmlFor="action">Describe the decision this evidence would support</label><textarea id="action" required value={action} onChange={event => { setAction(event.target.value); invalidate(); }} rows={3} className="form-input purpose-input" placeholder="Example: Use this property listing to decide whether to book an in-person viewing."/></div>
      </section>

      <section className="form-stage"><header className="form-stage-header"><h2><span className="form-stage-number">03 /</span> How serious is the decision?</h2><span className="metadata">CONSEQUENCE SEVERITY</span></header>
        <div className="risk-grid" role="group" aria-label="Consequence severity">{[
          { id: "LOW", desc: "Small, reversible, informational" },
          { id: "MEDIUM", desc: "Meaningful cost or moderate consequence" },
          { id: "HIGH", desc: "High value, sensitive, or hard to reverse" },
        ].map(level => <button key={level.id} type="button" disabled={!!compareRole} onClick={() => { setRisk(level.id); invalidate(); }} className="risk-option" aria-pressed={effectiveRisk === level.id}><span>{level.id}</span><small>{level.desc}</small></button>)}</div>
        {compareRole && <p className="form-hint">Risk is fixed to {compareRole} for this comparison side.</p>}
      </section>

      <section className="form-stage"><header className="form-stage-header"><h2><span className="form-stage-number">04 /</span> Anything that must be proven?</h2><span className="metadata">OPTIONAL</span></header>
        <div className="field-group"><label htmlFor="requirements">Extra requirements, one per line</label><textarea id="requirements" value={reqs} disabled={!!compareRole} onChange={event => { setReqs(event.target.value); invalidate(); }} rows={3} className="form-input" placeholder={"Example:\nMust establish ownership\nMust establish inspection status"}/></div>
        <p className="form-hint">{compareRole ? "Shared requirements are locked so LOW and HIGH are judged against the same conditions." : "Leave this blank if you do not have extra conditions."}</p>
      </section>

      <section className="form-stage issue-stage"><div><header className="form-stage-header"><h2><span className="form-stage-number">05 /</span> Ask the validators</h2></header><p className="form-hint">Your wallet creates the warrant. The contract and validators decide the result.</p></div><button type="submit" disabled={isSubmitting || !url || !action || !prepared || !expectedHash} className="button button--primary">{isSubmitting ? "AWAITING WALLET / SUBMITTING..." : address ? `ISSUE ${compareRole || effectiveRisk} RELIANCE WARRANT` : "CONNECT WALLET & ISSUE WARRANT"}<span aria-hidden="true">↗</span></button></section>
    </form>}
  </div>;
}
