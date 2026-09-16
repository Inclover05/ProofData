"use client";

import { useState } from "react";
import { useWallet } from "@/lib/genlayer/useWallet";
import { transactionTracker } from "@/lib/genlayer/transaction-lifecycle";

import { useTrackedTransaction } from "@/lib/genlayer/useTrackedTransaction";

interface AdjudicateActionProps {
  warrantId: string;
  method: "retrieve_and_validate" | "adjudicate";
}

export function AdjudicateAction({ warrantId, method }: AdjudicateActionProps) {
  const { 
    address, 
    isConnecting, 
    error: walletError,
    providers,
    hasLegacyEthereum,
    connectToProvider, 
    writeContract
  } = useWallet();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { tracked, info, startTracking, setInfo, warrantStatus } = useTrackedTransaction(`${method}:${warrantId}`);
  const txHash = tracked?.txHash || null;
  const lifecycleState = info.state;
  const rawStatus = info.rawStatus;
  const rawExecutionResult = info.rawExecutionResult;
  const needsReload = lifecycleState === "FINALIZED_SUCCESS";
  const isRetrieval = method === "retrieve_and_validate";
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showWalletSelector, setShowWalletSelector] = useState(false);

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

  const handleAdjudicate = async () => {
    if (!address) {
      handleConnectClick();
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      setInfo({ state: "SUBMITTING" });
      const result = await writeContract(method, isRetrieval ? [warrantId, 0] : [warrantId]);
      if (result.error || !result.txHash) throw new Error(result.error || "No GenLayer transaction was created.");
      startTracking({ txHash: result.txHash, outerTxHash: result.outerTxHash, warrantId });
    } catch (err: unknown) {
      setSubmitError(`Unable to prepare this transaction: ${(err as Error).message}`);
      setInfo({ state: 'IDLE' });
      console.error("Technical details:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isTerminal = transactionTracker.isTerminal(lifecycleState);
  const trackingError = submitError || info.errorMessage;

  // Derive visual states cleanly
  const submittedComplete = ['SUBMITTED', 'PROCESSING', 'DECIDED', 'FINALIZED_SUCCESS', 'FINALIZED_ERROR'].includes(lifecycleState);
  const submittedActive = lifecycleState === 'SUBMITTING';

  const processingComplete = ['DECIDED', 'FINALIZED_SUCCESS', 'FINALIZED_ERROR'].includes(lifecycleState);
  const processingActive = lifecycleState === 'PROCESSING' || lifecycleState === 'SUBMITTED';

  const decisionComplete = ['FINALIZED_SUCCESS', 'FINALIZED_ERROR'].includes(lifecycleState);
  const decisionActive = lifecycleState === 'DECIDED';

  const finalizedSuccess = lifecycleState === 'FINALIZED_SUCCESS';
  const finalizedError = ['FINALIZED_ERROR', 'FAILED', 'CANCELED'].includes(lifecycleState);

  return (
    <div className="mt-12 p-8 border border-rules-light bg-surface-pale-gray">
      <h3 className="text-xs uppercase tracking-widest font-mono text-text-dark-secondary mb-6 border-b border-rules-light pb-2">
        {isRetrieval ? "Evidence Retrieval / Hash Validation" : "Semantic Adjudication"}
      </h3>

      {walletError && (
        <div className="mb-4 p-4 border border-[#800010]/20 bg-[#FEE7EA] text-[#800010] text-xs font-mono">
          {walletError}
        </div>
      )}

      {trackingError && (
        <div className="mb-4 p-4 border border-[#800010]/20 bg-[#FEE7EA] text-[#800010] text-xs font-mono">
          {trackingError}
          {!isTerminal && txHash && (
             <button onClick={() => startTracking(tracked!)} className="block mt-2 underline">Retry Status Check</button>
          )}
        </div>
      )}

      {!txHash ? (
        <div className="relative">
          <button
            onClick={handleAdjudicate}
            disabled={isSubmitting || (isConnecting && !address)}
            className="w-full bg-[#0A0E17] text-white py-4 font-mono text-sm tracking-widest uppercase hover:bg-black transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "AWAITING WALLET / SUBMITTING..." : !address ? "CONNECT WALLET TO CONTINUE" : isRetrieval ? "RETRIEVE AND VALIDATE EVIDENCE" : "ADJUDICATE WARRANT"}
          </button>

          {showWalletSelector && !address && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-rules-light shadow-xl z-50">
              <div className="p-3 border-b border-rules-light text-xs font-mono text-text-dark-secondary uppercase">Select Wallet</div>
              {providers.map(p => (
                <button 
                  key={p.info.uuid}
                  onClick={() => {
                    setShowWalletSelector(false);
                    connectToProvider(p);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-text-dark hover:bg-surface-pale-gray flex items-center gap-3 transition-colors"
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
        <div className="space-y-4 font-mono text-sm">
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${submittedActive ? 'bg-[#2B5CFF] animate-pulse' : submittedComplete ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <div className={submittedActive ? 'text-text-dark' : submittedComplete ? 'text-text-dark-secondary' : 'text-text-dark-secondary/50'}>{submittedActive ? "Awaiting wallet authorization / submission" : "Submitted"}</div>
          </div>
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${processingActive ? 'bg-[#2B5CFF] animate-pulse' : processingComplete ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <div className={processingActive ? 'text-text-dark' : processingComplete ? 'text-text-dark-secondary' : 'text-text-dark-secondary/50'}>Processing</div>
          </div>
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${decisionActive ? 'bg-[#2B5CFF] animate-pulse' : decisionComplete ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <div className={decisionActive ? 'text-text-dark' : decisionComplete ? 'text-text-dark-secondary' : 'text-text-dark-secondary/50'}>Decision Reached</div>
          </div>
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${finalizedSuccess ? 'bg-green-500' : finalizedError ? 'bg-red-500' : 'bg-gray-300'}`}></div>
            <div className={finalizedSuccess || finalizedError ? 'text-text-dark font-bold' : 'text-text-dark-secondary/50'}>
              {finalizedSuccess ? 'Finalized - Execution Verified' : 
               finalizedError ? 'Finalized - Execution Failed' : 
               lifecycleState === 'NETWORK_ERROR' ? 'Network Tracking Error' :
               'Finalized'}
            </div>
          </div>
          
          {warrantStatus && <div>Authoritative contract state: {warrantStatus}</div>}
          {(lifecycleState === "DECIDED" || needsReload) && <button onClick={() => window.location.reload()} className="text-accent underline">{needsReload ? "Read finalized contract state" : "Read contract state — protocol finalization pending"}</button>}
          <div className="bg-white p-4 border border-rules-light text-xs font-mono text-text-dark-secondary mt-4 space-y-2">
            <div className="break-all"><span className="text-text-dark font-semibold">GenLayer transaction:</span> {txHash}</div>
            <div className="break-all"><span className="text-text-dark font-semibold">Outer EVM transaction:</span> {tracked?.outerTxHash || "Not available"}</div>
            <div><span className="text-text-dark font-semibold">Consensus:</span> {info.consensus || "WAITING"}</div>
            <div><span className="text-text-dark font-semibold">Status:</span> {rawStatus || 'WAITING'}</div>
            <div><span className="text-text-dark font-semibold">Execution:</span> {rawExecutionResult || 'WAITING'}</div>
          </div>
        </div>
      )}
    </div>
  );
}
