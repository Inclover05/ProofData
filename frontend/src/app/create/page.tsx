"use client";

import { useState } from "react";
import Link from "next/link";
import { useWallet } from "@/lib/genlayer/useWallet";
import { transactionTracker } from "@/lib/genlayer/transaction-lifecycle";
import { useTrackedTransaction } from "@/lib/genlayer/useTrackedTransaction";
import { FINAL_PROOF } from "@/lib/genlayer/config";

export default function CreateWarrant() {
  const { 
    address, 
    isConnecting, 
    error: walletError, 
    network, 
    providers,
    hasLegacyEthereum,
    connectToProvider, 
    writeWarrant 
  } = useWallet();

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [risk, setRisk] = useState("LOW");
  const [url, setUrl] = useState(FINAL_PROOF.sampleEvidence.url);
  const [expectedHash, setExpectedHash] = useState(FINAL_PROOF.sampleEvidence.keccak);
  const [action, setAction] = useState("Use this evidence to prepare an internal developer note listing the declared GenLayerJS testnet network exports.");
  const [reqs, setReqs] = useState("");

  const { tracked, info, warrantStatus, startTracking, setInfo } = useTrackedTransaction("create");
  const txHash = tracked?.txHash || null;
  const lifecycleState = info.state;
  const rawStatus = info.rawStatus;
  const rawExecutionResult = info.rawExecutionResult;
  const [submitError, setSubmitError] = useState<string | null>(null);
  const trackingError = submitError || info.errorMessage;
  const [showWalletSelector, setShowWalletSelector] = useState(false);
  const [generatedWarrantId] = useState(() => `warrant-${typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now()}`);

  const invalidateEstimate = () => {
    setSubmitError(null);
  };

  const handleConnectClick = () => {
    if (providers.length > 1) {
      setShowWalletSelector(true);
    } else if (providers.length === 1) {
      connectToProvider(providers[0]);
    } else if (hasLegacyEthereum) {
      connectToProvider(null);
    } else {
      setSubmitError("No compatible browser wallet detected.");
    }
  };

  const getArgs = () => [
    generatedWarrantId,
    url,
    expectedHash,
    action,
    risk,
    reqs.split('\n').filter(r => r.trim().length > 0),
    Math.floor(Date.now() / 1000) + 86400 * 7
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      handleConnectClick();
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      setInfo({ state: 'SUBMITTING' });
      
      const result = await writeWarrant(getArgs());
      
      if (result.error) {
        setSubmitError(`Unable to prepare this transaction: ${result.error}`);
        setInfo({ state: 'IDLE' });
        if (result.rawError) {
          console.error("Technical details:", result.rawError);
        }
      } else if (result.txHash) {
        startTracking({ txHash: result.txHash, outerTxHash: result.outerTxHash, warrantId: generatedWarrantId });
      }
    } catch (err: unknown) {
      setSubmitError("Unable to prepare this transaction.");
      setInfo({ state: 'IDLE' });
      console.error("Technical details:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderLifecycleUI = () => {
    const isTerminal = transactionTracker.isTerminal(lifecycleState);

    return (
      <div className="protocol-panel mb-8">
        <h2 className="editorial border-b border-rules pb-4">
          RELIANCE REQUEST
        </h2>
        
        <div className="space-y-4 font-mono text-sm mb-8">
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${lifecycleState === 'SUBMITTING' ? 'bg-accent animate-pulse' : 'bg-positive'}`}></div>
            <div className={lifecycleState === 'SUBMITTING' ? 'text-white' : 'text-text-secondary'}>{lifecycleState === "SUBMITTING" ? "Awaiting wallet authorization / submission" : "Submitted"}</div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${['SUBMITTING', 'SUBMITTED', 'NOT_FOUND'].includes(lifecycleState) ? 'bg-bg-deep-graphite' : lifecycleState === 'PROCESSING' ? 'bg-accent animate-pulse' : 'bg-positive'}`}></div>
            <div className={['SUBMITTING', 'SUBMITTED', 'NOT_FOUND'].includes(lifecycleState) ? 'text-text-secondary/50' : lifecycleState === 'PROCESSING' ? 'text-white' : 'text-text-secondary'}>Processing</div>
          </div>

          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${!['DECIDED', 'FINALIZED_SUCCESS', 'FINALIZED_ERROR'].includes(lifecycleState) ? 'bg-bg-deep-graphite' : lifecycleState === 'DECIDED' ? 'bg-accent animate-pulse' : 'bg-positive'}`}></div>
            <div className={!['DECIDED', 'FINALIZED_SUCCESS', 'FINALIZED_ERROR'].includes(lifecycleState) ? 'text-text-secondary/50' : lifecycleState === 'DECIDED' ? 'text-white' : 'text-text-secondary'}>Decision Reached</div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${!isTerminal ? 'bg-bg-deep-graphite' : lifecycleState === 'FINALIZED_SUCCESS' ? 'bg-positive' : 'bg-negative'}`}></div>
            <div className={!isTerminal ? 'text-text-secondary/50' : 'text-white'}>
              {lifecycleState === 'FINALIZED_SUCCESS' ? 'Finalized - Execution Verified' : 
               lifecycleState === 'FINALIZED_ERROR' ? 'Finalized - Execution Failed' : 
               ['FAILED', 'CANCELED'].includes(lifecycleState) ? 'Transaction Failed/Canceled' :
               lifecycleState === 'NETWORK_ERROR' ? 'Network Tracking Error' :
               'Finalized'}
            </div>
          </div>
        </div>

        <div className="bg-bg-deep-graphite p-5 border border-rules text-xs font-mono text-text-secondary space-y-2">
          <div className="break-all"><span className="text-white">GenLayer transaction:</span> {txHash}</div>
          <div className="break-all"><span className="text-white">Outer EVM transaction:</span> {tracked?.outerTxHash || "Not available"}</div>
          <div><span className="text-white">Protocol Status:</span> {rawStatus || 'WAITING'}</div>
          <div><span className="text-white">Execution Result:</span> {rawExecutionResult || 'WAITING'}</div>
        </div>

        {trackingError && (
          <div className="error-notice">
            {trackingError}
            {!isTerminal && (
               <button onClick={() => startTracking(tracked!)} className="block mt-2 underline">Retry Status Check</button>
            )}
          </div>
        )}

        {warrantStatus && (
          <div className="mt-8 p-6 bg-surface-ivory text-text-dark border border-rules-light">
            <div className="text-[10px] uppercase tracking-widest text-text-dark-secondary mb-2">Authoritative Contract State</div>
            <div className="text-lg font-medium">{warrantStatus}</div>
            <div className="text-xs text-text-dark-secondary mt-2">Continue to the warrant to retrieve evidence and request adjudication. GenLayer finalization may take several minutes.</div>
            <Link href={`/warrant/${tracked?.warrantId}`} className="mt-4 block font-mono text-sm text-accent underline">CONTINUE TO WARRANT</Link>
          </div>
        )}
      </div>
    );
  };

  return <div className="container form-container">
    <header className="page-heading form-heading"><div><span className="eyebrow">RELIANCE WARRANT / INITIALIZATION</span><h1 className="editorial">Issue a Reliance Warrant.</h1><p>Bind exact evidence to the action you intend to take. The contract controls the lifecycle; GenLayer validators determine the verdict.</p></div><span className="draft-label">{txHash ? lifecycleState.replace('_', ' ') : 'DRAFTING'}</span></header>
        {/* Wallet Bar */}
        <div className="wallet-bar" id="wallet">
          <div className="metadata">
            {network ? `NETWORK: ${network}` : 'WALLET DISCONNECTED'}<p>Explore first. Connect when you’re ready to issue.</p>
          </div>
          <div>
            {!address ? (
              <div className="relative">
                <button 
                  type="button" 
                  onClick={handleConnectClick} 
                  disabled={isConnecting}
                  className="wallet-button"
                >
                  {isConnecting ? 'CONNECTING...' : 'CONNECT WALLET'}
                </button>
                {showWalletSelector && (
                  <div className="wallet-menu">
                    <div className="p-3 border-b border-rules metadata uppercase">Select Wallet</div>
                    {providers.map(p => (
                      <button 
                        key={p.info.uuid}
                        onClick={() => {
                          setShowWalletSelector(false);
                          connectToProvider(p);
                        }}
                        className="wallet-option"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.info.icon} alt="" className="w-5 h-5" />
                        {p.info.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs font-mono text-white bg-bg-deep-graphite px-4 py-2 border border-rules-light/10">
                {address.substring(0, 6)}...{address.substring(address.length - 4)}
              </div>
            )}
          </div>
        </div>

        {walletError && (
          <div className="error-notice">
            {walletError}
          </div>
        )}


    {txHash ? renderLifecycleUI() : <form onSubmit={handleSubmit} className="glass instrument-form">
      {submitError && <div className="error-notice" role="alert">{trackingError}</div>}
      <section className="form-stage"><header className="form-stage-header"><h2><span className="form-stage-number">01 /</span> Evidence</h2><span className="metadata">EXACT SOURCE + CRYPTOGRAPHIC IDENTITY</span></header>
        <div className="field-group"><label htmlFor="evidenceUrl">Resource URI</label><input id="evidenceUrl" type="url" required value={url} onChange={(e) => { setUrl(e.target.value); invalidateEstimate(); }} className="form-input form-input--technical" placeholder="https://example.com/api/data"/></div>
        <div className="field-group"><label htmlFor="expectedHash">Expected Keccak256 Hash</label><input id="expectedHash" type="text" required value={expectedHash} onChange={(e) => { setExpectedHash(e.target.value); invalidateEstimate(); }} className="form-input form-input--technical" placeholder="Expected exact-byte Keccak-256"/></div>
        <p className="form-hint">The evidence must match this exact hash before semantic adjudication can begin.</p>
      </section>
      <section className="form-stage"><header className="form-stage-header"><h2><span className="form-stage-number">02 /</span> Intended reliance</h2><span className="metadata">ACTION-RELATIVE SUFFICIENCY</span></header>
        <div className="field-group"><label htmlFor="action">Proposed Action — what action will rely on this evidence?</label><textarea id="action" required value={action} onChange={(e) => { setAction(e.target.value); invalidateEstimate(); }} rows={3} className="form-input purpose-input"/></div>
      </section>
      <section className="form-stage"><header className="form-stage-header"><h2><span className="form-stage-number">03 /</span> Risk</h2><span className="metadata">CONSEQUENCE SEVERITY</span></header>
        <div className="risk-grid" role="group" aria-label="Consequence severity">{[
          { id: 'LOW', label: 'Low', desc: 'Reversible, informational' },
          { id: 'MEDIUM', label: 'Medium', desc: 'Moderate financial risk' },
          { id: 'HIGH', label: 'High', desc: 'Irreversible, high value' }
        ].map((level) => <button key={level.id} type="button" onClick={() => { setRisk(level.id); invalidateEstimate(); }} className="risk-option" aria-pressed={risk === level.id}><span>{level.id}</span><small>{level.desc}</small></button>)}</div>
      </section>
      <section className="form-stage"><header className="form-stage-header"><h2><span className="form-stage-number">04 /</span> Requirements</h2><span className="metadata">OPTIONAL / ONE PER LINE</span></header>
        <div className="field-group"><label htmlFor="requirements">Specific Criteria</label><textarea id="requirements" value={reqs} onChange={(e) => { setReqs(e.target.value); invalidateEstimate(); }} rows={2} className="form-input"/></div>
        <p className="form-hint">Leave blank if there are no additional requirements.</p>
      </section>
      <section className="form-stage issue-stage"><div><header className="form-stage-header"><h2><span className="form-stage-number">05 /</span> Issue warrant</h2></header><p className="form-hint">Your selected wallet signs. The contract decides.</p></div><button type="submit" disabled={isSubmitting || !url || !action} className="button button--primary">{isSubmitting ? 'AWAITING WALLET / SUBMITTING...' : 'ISSUE RELIANCE WARRANT'}<span aria-hidden="true">↗</span></button></section>
    </form>}
  </div>;
}
