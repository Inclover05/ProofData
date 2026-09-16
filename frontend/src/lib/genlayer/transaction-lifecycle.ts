import { transactionsStatusNumberToName, executionResultNumberToName, transactionResultNumberToName } from "genlayer-js/types";
import { PROOFDATA_RPC_URL } from "./config.ts";

export type NormalizedLifecycleState = "IDLE" | "SUBMITTING" | "SUBMITTED" | "PROCESSING" | "DECIDED" | "FINALIZED_SUCCESS" | "FINALIZED_ERROR" | "NETWORK_ERROR" | "FAILED" | "CANCELED" | "NOT_FOUND";
export interface TransactionStatusInfo {
  state: NormalizedLifecycleState; rawStatus?: string; rawExecutionResult?: string;
  consensus?: string; outerReceiptStatus?: string; errorMessage?: string;
}
export interface BradburyReceipt { status: number; result: number; txExecutionResult: number; recipient?: string; roundData?: unknown[]; }

export async function bradburyRpc<T>(method: string, params: unknown[]): Promise<T> {
  const response = await fetch(PROOFDATA_RPC_URL, {
    method: "POST", headers: { "Content-Type": "application/json" }, cache: "no-store",
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }), signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`Bradbury RPC HTTP ${response.status}`);
  const json = await response.json();
  if (json.error) throw new Error(json.error.message || "Bradbury RPC failed.");
  return json.result as T;
}

export function normalizeBradburyReceipt(tx: BradburyReceipt): TransactionStatusInfo {
  const status = transactionsStatusNumberToName[String(tx.status) as keyof typeof transactionsStatusNumberToName] || "UNKNOWN";
  const execution = executionResultNumberToName[String(tx.txExecutionResult) as keyof typeof executionResultNumberToName] || "UNKNOWN";
  const consensus = transactionResultNumberToName[String(tx.result) as keyof typeof transactionResultNumberToName] || "UNKNOWN";
  const base = { rawStatus: status, rawExecutionResult: execution, consensus };
  if (status === "FINALIZED") {
    const success = execution === "FINISHED_WITH_RETURN" && ["AGREE", "MAJORITY_AGREE"].includes(consensus);
    return { ...base, state: success ? "FINALIZED_SUCCESS" : "FINALIZED_ERROR", errorMessage: success ? undefined : `GenLayer finalized with ${execution} / ${consensus}.` };
  }
  if (status === "CANCELED") return { ...base, state: "CANCELED", errorMessage: "GenLayer transaction was canceled." };
  if (status === "ACCEPTED" || status === "READY_TO_FINALIZE") return { ...base, state: "DECIDED", errorMessage: execution === "FINISHED_WITH_ERROR" ? "Contract execution failed; protocol finalization is pending." : undefined };
  return { ...base, state: "PROCESSING" };
}

export class TransactionTracker {
  private readonly rpc: typeof bradburyRpc;
  constructor(rpc: typeof bradburyRpc = bradburyRpc) { this.rpc = rpc; }
  async getTransactionStatus(hash: string, outerHash?: string): Promise<TransactionStatusInfo> {
    try {
      const [tx, outer] = await Promise.all([
        this.rpc<BradburyReceipt | null>("gen_getTransactionReceipt", [{ txId: hash }]),
        outerHash ? this.rpc<{ status: string } | null>("eth_getTransactionReceipt", [outerHash]) : Promise.resolve(null),
      ]);
      if (outer?.status === "0x0") return { state: "FAILED", outerReceiptStatus: outer.status, errorMessage: "Outer EVM transaction reverted. GenLayer execution was not qualified." };
      if (!tx) return { state: "NOT_FOUND", outerReceiptStatus: outer?.status, errorMessage: "Submitted; waiting for the GenLayer transaction to become available." };
      return { ...normalizeBradburyReceipt(tx), outerReceiptStatus: outer?.status };
    } catch (error) {
      return { state: "NETWORK_ERROR", errorMessage: `Unable to refresh transaction status. No write will be retried. ${error instanceof Error ? error.message : "RPC unavailable."}` };
    }
  }
  isTerminal(state: NormalizedLifecycleState) { return ["FINALIZED_SUCCESS", "FINALIZED_ERROR", "FAILED", "CANCELED"].includes(state); }
}
export const transactionTracker = new TransactionTracker();
