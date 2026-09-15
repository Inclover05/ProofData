"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useWallet } from "@/lib/genlayer/useWallet";
import { transactionTracker, NormalizedLifecycleState } from "@/lib/genlayer/transaction-lifecycle";

interface AdjudicateActionProps {
  warrantId: string;
}

export function AdjudicateAction({ warrantId }: AdjudicateActionProps) {
  const { 
    address, 
    isConnecting, 
    error: walletError,
    providers,
    hasLegacyEthereum,
    connectToProvider, 
    client
  } = useWallet();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showWalletSelector, setShowWalletSelector] = useState(false);

  const [lifecycleState, setLifecycleState] = useState<NormalizedLifecycleState>('IDLE');
  const [rawStatus, setRawStatus] = useState<string | null>(null);
  const [rawExecutionResult, setRawExecutionResult] = useState<string | null>(null);
  const [needsReload, setNeedsReload] = useState(false);

  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const maxPolls = 60; // 5 mins
  const pollCount = useRef(0);

  const stopTracking = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  const startTracking = useCallback((hash: string) => {
    stopTracking();
    setLifecycleState('SUBMITTED');
    pollCount.current = 0;

    pollingRef.current = setInterval(async () => {
      pollCount.current += 1;
      if (pollCount.current > maxPolls) {
        stopTracking();
        setLifecycleState('NETWORK_ERROR');
        setSubmitError('Tracking timed out. The transaction may still be finalizing on the network.');
        return;
      }

      const info = await transactionTracker.getTransactionStatus(hash);
      
      if (info.state === 'NOT_FOUND') {
        setLifecycleState('SUBMITTING');
      } else {
        setLifecycleState(info.state);
        setRawStatus(info.rawStatus || null);
        setRawExecutionResult(info.rawExecutionResult || null);
        
        if (info.errorMessage) {
          setSubmitError(info.errorMessage);
        } else {
          setSubmitError(null);
        }

        if (transactionTracker.isTerminal(info.state)) {
          stopTracking();
          localStorage.removeItem(`proofdata_adj_tx_${warrantId}`);
          
          if (info.state === 'FINALIZED_SUCCESS') {
            setNeedsReload(true);
          }
        }
      }
    }, 5000);
  }, [stopTracking, warrantId]);

  useEffect(() => {
    const savedTx = localStorage.getItem(`proofdata_adj_tx_${warrantId}`);
    
    let isMounted = true;
    if (savedTx && lifecycleState === 'IDLE') {
       setTimeout(() => {
         if (isMounted) {
           setTxHash(savedTx);
           startTracking(savedTx);
         }
       }, 0);
    }

    return () => {
      isMounted = false;
      stopTracking();
    };
  }, [lifecycleState, startTracking, stopTracking, warrantId]);

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
    
    if (!client) {
      setSubmitError("Wallet client not initialized.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const contractAddress = process.env.NEXT_PUBLIC_PROOFDATA_CONTRACT_ADDRESS as `0x${string}`;
      setLifecycleState('SUBMITTING');
      
      const hash = await client.writeContract({
        address: contractAddress,
        functionName: "adjudicate",
        args: [warrantId],
      });
      
      setTxHash(hash);
      localStorage.setItem(`proofdata_adj_tx_${warrantId}`, hash);
      startTracking(hash);
    } catch (err: unknown) {
      setSubmitError(`Unable to prepare this transaction: ${(err as Error).message}`);
      setLifecycleState('IDLE');
      console.error("Technical details:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (needsReload) {
    return (
      <div className="mt-12 p-6 bg-[#EBF4FF] border border-[#2B5CFF] text-[#0A0E17] text-center">
        <h3 className="font-bold text-lg mb-2">Adjudication Complete</h3>
        <p className="text-sm mb-4">The semantic verdict has been successfully finalized.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-[#2B5CFF] text-white px-6 py-2 text-sm font-mono tracking-widest uppercase hover:bg-blue-600 transition-colors"
        >
          View Verdict
        </button>
      </div>
    );
  }

  const isTerminal = transactionTracker.isTerminal(lifecycleState);

  // Derive visual states cleanly
  const submittedComplete = ['SUBMITTED', 'PROCESSING', 'DECIDED', 'FINALIZED_SUCCESS', 'FINALIZED_ERROR'].includes(lifecycleState);
  const submittedActive = lifecycleState === 'SUBMITTING';

  const processingComplete = ['DECIDED', 'FINALIZED_SUCCESS', 'FINALIZED_ERROR'].includes(lifecycleState);
  const processingActive = lifecycleState === 'PROCESSING' || lifecycleState === 'SUBMITTED';

  const decisionComplete = ['FINALIZED_SUCCESS', 'FINALIZED_ERROR'].includes(lifecycleState);
  const decisionActive = lifecycleState === 'DECIDED';

  const finalizedSuccess = lifecycleState === 'FINALIZED_SUCCESS';
  const finalizedError = lifecycleState === 'FINALIZED_ERROR' || lifecycleState === 'FAILED';

  return (
    <div className="mt-12 p-8 border border-rules-light bg-surface-pale-gray">
      <h3 className="text-xs uppercase tracking-widest font-mono text-text-dark-secondary mb-6 border-b border-rules-light pb-2">
        Semantic Adjudication
      </h3>

      {walletError && (
        <div className="mb-4 p-4 border border-[#800010]/20 bg-[#FEE7EA] text-[#800010] text-xs font-mono">
          {walletError}
        </div>
      )}

      {submitError && (
        <div className="mb-4 p-4 border border-[#800010]/20 bg-[#FEE7EA] text-[#800010] text-xs font-mono">
          {submitError}
          {!isTerminal && txHash && (
             <button onClick={() => startTracking(txHash)} className="block mt-2 underline">Retry Status Check</button>
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
            {isSubmitting ? "PREPARING..." : !address ? "CONNECT WALLET TO ADJUDICATE" : "ADJUDICATE WARRANT"}
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
                  <img src={p.info.icon} alt={p.info.name} className="w-5 h-5" />
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
            <div className={submittedActive ? 'text-text-dark' : submittedComplete ? 'text-text-dark-secondary' : 'text-text-dark-secondary/50'}>Submitted</div>
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
          
          <div className="bg-white p-4 border border-rules-light text-xs font-mono text-text-dark-secondary mt-4 space-y-2">
            <div className="break-all"><span className="text-text-dark font-semibold">Tx Hash:</span> {txHash}</div>
            <div><span className="text-text-dark font-semibold">Status:</span> {rawStatus || 'WAITING'}</div>
            <div><span className="text-text-dark font-semibold">Execution:</span> {rawExecutionResult || 'WAITING'}</div>
          </div>
        </div>
      )}
    </div>
  );
}
