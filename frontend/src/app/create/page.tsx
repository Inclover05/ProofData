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
      <div className="bg-bg-cool-slate border border-rules p-8 md:p-10 mb-8">
        <h2 className="text-2xl text-white mb-6 font-light border-b border-rules pb-4">
          RELIANCE REQUEST
        </h2>
        
        <div className="space-y-4 font-mono text-sm mb-8">
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${lifecycleState === 'SUBMITTING' ? 'bg-accent animate-pulse' : 'bg-green-500'}`}></div>
            <div className={lifecycleState === 'SUBMITTING' ? 'text-white' : 'text-text-secondary'}>{lifecycleState === "SUBMITTING" ? "Awaiting wallet authorization / submission" : "Submitted"}</div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${['SUBMITTING', 'SUBMITTED', 'NOT_FOUND'].includes(lifecycleState) ? 'bg-bg-deep-graphite' : lifecycleState === 'PROCESSING' ? 'bg-accent animate-pulse' : 'bg-green-500'}`}></div>
            <div className={['SUBMITTING', 'SUBMITTED', 'NOT_FOUND'].includes(lifecycleState) ? 'text-text-secondary/50' : lifecycleState === 'PROCESSING' ? 'text-white' : 'text-text-secondary'}>Processing</div>
          </div>

          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${!['DECIDED', 'FINALIZED_SUCCESS', 'FINALIZED_ERROR'].includes(lifecycleState) ? 'bg-bg-deep-graphite' : lifecycleState === 'DECIDED' ? 'bg-accent animate-pulse' : 'bg-green-500'}`}></div>
            <div className={!['DECIDED', 'FINALIZED_SUCCESS', 'FINALIZED_ERROR'].includes(lifecycleState) ? 'text-text-secondary/50' : lifecycleState === 'DECIDED' ? 'text-white' : 'text-text-secondary'}>Decision Reached</div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${!isTerminal ? 'bg-bg-deep-graphite' : lifecycleState === 'FINALIZED_SUCCESS' ? 'bg-green-500' : 'bg-red-500'}`}></div>
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
          <div className="mt-6 p-4 border border-[#800010]/20 bg-[#FEE7EA] text-[#800010] text-sm font-mono">
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

  return (
    <div className="flex-1 flex flex-col relative w-full items-center bg-bg-dark-slate font-sans">
      <div className="absolute inset-0 z-0 opacity-40 reliance-field pointer-events-none"></div>
      
      <div className="max-w-4xl px-6 py-20 w-full relative z-10">
        
        {/* Wallet Bar */}
        <div className="mb-8 flex justify-between items-center bg-bg-cool-slate border border-rules p-4">
          <div className="text-xs font-mono text-text-secondary">
            {network ? `NETWORK: ${network}` : 'NOT CONNECTED'}
          </div>
          <div>
            {!address ? (
              <div className="relative">
                <button 
                  type="button" 
                  onClick={handleConnectClick} 
                  disabled={isConnecting}
                  className="text-xs font-mono uppercase bg-text-dark text-white px-4 py-2 hover:bg-black transition-colors"
                >
                  {isConnecting ? 'CONNECTING...' : 'CONNECT WALLET'}
                </button>
                {showWalletSelector && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-bg-deep-graphite border border-rules shadow-2xl z-50">
                    <div className="p-3 border-b border-rules text-xs font-mono text-text-secondary uppercase">Select Wallet</div>
                    {providers.map(p => (
                      <button 
                        key={p.info.uuid}
                        onClick={() => {
                          setShowWalletSelector(false);
                          connectToProvider(p);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-white hover:bg-bg-cool-slate flex items-center gap-3 transition-colors"
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
          <div className="mb-8 p-4 border border-[#800010]/20 bg-[#FEE7EA] text-[#800010] text-sm font-mono">
            {walletError}
          </div>
        )}

        <div className="mb-12 border-b border-rules pb-12 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-text-secondary font-mono mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent"></div>
              Warrant Initialization
            </div>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-4">Reliance Dossier</h1>
            <p className="text-text-secondary leading-relaxed font-light max-w-xl">
              Assemble the evidence and decision context. The GenLayer network will determine if the exact evidence is sufficient to authorize your intended action.
            </p>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-text-secondary font-mono mb-1">Status</div>
            <div className="text-sm font-mono text-white bg-bg-midnight-navy px-3 py-1 border border-rules inline-block uppercase">
              {txHash ? lifecycleState.replace('_', ' ') : 'DRAFTING'}
            </div>
          </div>
        </div>

        {txHash ? renderLifecycleUI() : (
          <form onSubmit={handleSubmit} className="space-y-8">
            

            {submitError && (
              <div className="p-4 border border-[#800010]/20 bg-[#FEE7EA] text-[#800010] text-sm font-mono">
                {trackingError}
              </div>
            )}

            <div className="bg-bg-cool-slate border border-rules relative">
              <div className="absolute -left-3 top-6 w-6 h-6 bg-accent text-white flex items-center justify-center text-xs font-mono rounded-sm shadow-[0_0_10px_rgba(43,92,255,0.4)]">1</div>
              <div className="p-8 md:p-10">
                <h2 className="text-xl font-medium text-white mb-8 border-b border-rules pb-4 flex justify-between items-end">
                  <span>Evidence Source</span>
                  <span className="text-[10px] font-mono text-text-secondary font-normal tracking-widest uppercase">Target Identity</span>
                </h2>
                
                <div className="grid gap-6">
                  <div>
                    <label htmlFor="evidenceUrl" className="text-xs font-mono uppercase tracking-widest text-text-secondary block mb-3">Resource URI</label>
                    <input 
                      id="evidenceUrl"
                      type="url" 
                      required
                      value={url}
                      onChange={(e) => {
                        setUrl(e.target.value);
                        invalidateEstimate();
                      }}
                      className="w-full bg-bg-deep-graphite border border-rules px-5 py-4 font-mono text-sm text-white focus:outline-none focus:border-accent transition-colors placeholder:text-text-secondary/30"
                      placeholder="https://example.com/api/data"
                    />
                  </div>
                  <div>
                    <label htmlFor="expectedHash" className="text-xs font-mono uppercase tracking-widest text-text-secondary block mb-3">Expected Keccak256 Hash</label>
                    <input 
                      id="expectedHash"
                      type="text" 
                      required
                      value={expectedHash}
                      onChange={(e) => {
                        setExpectedHash(e.target.value);
                        invalidateEstimate();
                      }}
                      className="w-full bg-bg-deep-graphite border border-rules px-5 py-4 font-mono text-sm text-white focus:outline-none focus:border-accent transition-colors placeholder:text-text-secondary/30"
                      placeholder="d31880ae9181571d18323e1817597e4dcc2d5fb312920a662d1696bb9d7ae0ac"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-surface-ivory text-text-dark border border-rules-light relative shadow-xl">
              <div className="absolute -left-3 top-6 w-6 h-6 bg-text-dark text-white flex items-center justify-center text-xs font-mono rounded-sm">2</div>
              <div className="p-8 md:p-10">
                <h2 className="text-xl font-medium text-text-dark mb-8 border-b border-rules-light pb-4 flex justify-between items-end">
                  <span>Decision Context</span>
                  <span className="text-[10px] font-mono text-text-dark-secondary font-normal tracking-widest uppercase">Intended Action</span>
                </h2>
                
                <div className="grid gap-8">
                  <div>
                    <label htmlFor="action" className="text-xs font-mono uppercase tracking-widest text-text-dark-secondary block mb-3">Proposed Action</label>
                    <textarea 
                      id="action"
                      required
                      value={action}
                      onChange={(e) => {
                        setAction(e.target.value);
                        invalidateEstimate();
                      }}
                      rows={3}
                      className="w-full bg-surface-pale-gray border border-rules-light px-5 py-4 text-sm text-text-dark focus:outline-none focus:border-text-dark transition-colors placeholder:text-text-dark-secondary/50 resize-y"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono uppercase tracking-widest text-text-dark-secondary block mb-3">Consequence Severity</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'LOW', label: 'Low', desc: 'Reversible, informational' },
                        { id: 'MEDIUM', label: 'Medium', desc: 'Moderate financial risk' },
                        { id: 'HIGH', label: 'High', desc: 'Irreversible, high value' }
                      ].map((level) => (
                        <button
                          key={level.id}
                          type="button"
                          onClick={() => {
                            setRisk(level.id);
                            invalidateEstimate();
                          }}
                          className={`text-left p-4 border transition-all ${
                            risk === level.id 
                              ? 'border-text-dark bg-white shadow-[inset_2px_0_0_0_#0A0E17]' 
                              : 'border-rules-light bg-surface-pale-gray hover:border-text-dark-secondary text-text-dark-secondary'
                          }`}
                        >
                          <span className={`font-mono tracking-wider text-xs font-semibold block mb-2 ${risk === level.id ? 'text-text-dark' : ''}`}>{level.id}</span>
                          <span className="text-xs">{level.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-bg-midnight-navy border border-rules relative">
              <div className="absolute -left-3 top-6 w-6 h-6 bg-bg-deep-graphite border border-rules text-text-secondary flex items-center justify-center text-xs font-mono rounded-sm">3</div>
              <div className="p-8 md:p-10">
                <h2 className="text-xl font-medium text-text-primary mb-6 border-b border-rules pb-4 flex justify-between items-end">
                  <span>Validation Bounds</span>
                  <span className="text-[10px] font-mono text-text-secondary font-normal tracking-widest uppercase">Optional</span>
                </h2>
                <div className="grid gap-3">
                  <label htmlFor="requirements" className="text-xs font-mono uppercase tracking-widest text-text-secondary mb-1 block">Specific Criteria</label>
                  <textarea 
                    id="requirements"
                    value={reqs}
                    onChange={(e) => {
                      setReqs(e.target.value);
                      invalidateEstimate();
                    }}
                    rows={2}
                    className="w-full bg-bg-deep-graphite/50 border border-rules px-5 py-3 text-sm text-white focus:outline-none focus:border-text-secondary transition-colors placeholder:text-text-secondary/30 resize-y"
                  />
                </div>
              </div>
            </div>

            <div className="pt-8 flex justify-end gap-4">
              <button 
                type="submit" 
                disabled={isSubmitting || !url || !action}
                className="group relative px-12 py-5 bg-accent text-white font-mono tracking-widest uppercase text-sm transition-all hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed border border-accent"
              >
                {isSubmitting ? 'AWAITING WALLET / SUBMITTING...' : 'ISSUE RELIANCE WARRANT'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
