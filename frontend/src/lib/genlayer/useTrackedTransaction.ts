"use client";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { PROOFDATA_STORAGE_PREFIX } from "./config.ts";
import { transactionTracker, TransactionStatusInfo } from "./transaction-lifecycle.ts";
import { checkWarrantStatus } from "./warrant-reader.ts";

export interface TrackedTransaction { txHash: string; outerTxHash?: string; warrantId: string; }

export function useTrackedTransaction(key: string) {
  const searchParams = useSearchParams();
  const compareRole = searchParams.get("compareRole");
  const evidenceHash = searchParams.get("hash") || "";
  const comparisonScope = key === "create" && (compareRole === "LOW" || compareRole === "HIGH")
    ? `:${compareRole}:${evidenceHash.slice(0, 24) || "no-hash"}`
    : "";
  const storageKey = PROOFDATA_STORAGE_PREFIX + key + comparisonScope;

  const [tracked, setTracked] = useState<TrackedTransaction | null>(null);
  const [info, setInfo] = useState<TransactionStatusInfo>({ state: "IDLE" });
  const [warrantStatus, setWarrantStatus] = useState<string | null>(null);

  useEffect(() => {
    // LOW and HIGH comparison pages can reuse the same client component instance.
    // Clear the visible tracker before restoring the transaction for the new scope.
    setTracked(null);
    setInfo({ state: "IDLE" });
    setWarrantStatus(null);

    let mounted = true;
    const restore = setTimeout(() => {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved && mounted) {
          const tx = JSON.parse(saved) as TrackedTransaction;
          if (/^0x[0-9a-f]{64}$/i.test(tx.txHash) && typeof tx.warrantId === "string") setTracked(tx);
        }
      } catch { /* An invalid tracking record never triggers a write. */ }
    }, 0);
    return () => { mounted = false; clearTimeout(restore); };
  }, [storageKey]);

  useEffect(() => {
    if (!tracked) return;
    let canceled = false;
    let timer: ReturnType<typeof setTimeout>;

    async function poll() {
      const next = await transactionTracker.getTransactionStatus(tracked!.txHash, tracked!.outerTxHash);
      if (canceled) return;
      setInfo(next);

      if (["DECIDED", "FINALIZED_SUCCESS"].includes(next.state)) {
        const status = await checkWarrantStatus(tracked!.warrantId);
        if (!canceled) setWarrantStatus(status);
      }

      if (canceled) return;
      if (transactionTracker.isTerminal(next.state)) localStorage.removeItem(storageKey);
      else timer = setTimeout(poll, 5000);
    }

    void poll();
    return () => { canceled = true; clearTimeout(timer); };
  }, [tracked, storageKey]);

  const startTracking = useCallback((tx: TrackedTransaction) => {
    localStorage.setItem(storageKey, JSON.stringify(tx));
    setTracked(tx);
    setInfo({ state: "SUBMITTED" });
  }, [storageKey]);

  return { tracked, info, warrantStatus, startTracking, setInfo };
}
