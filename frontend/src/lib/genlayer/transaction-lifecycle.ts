import { chains } from 'genlayer-js';

export type NormalizedLifecycleState = 
  | 'IDLE'
  | 'SUBMITTING'
  | 'SUBMITTED'
  | 'PROCESSING'
  | 'DECIDED'
  | 'FINALIZED_SUCCESS'
  | 'FINALIZED_ERROR'
  | 'NETWORK_ERROR'
  | 'FAILED'
  | 'CANCELED'
  | 'NOT_FOUND';

export interface TransactionStatusInfo {
  state: NormalizedLifecycleState;
  rawStatus?: string;
  rawExecutionResult?: string;
  errorMessage?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractStableTransactionStatus(tx: any): string {
  if (!tx) return 'UNKNOWN';
  if (tx.statusName) return String(tx.statusName).toUpperCase();
  if (tx.status) return String(tx.status).toUpperCase();
  return 'UNKNOWN';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractStableExecutionResult(tx: any): string | undefined {
  if (!tx) return undefined;
  
  if (tx.execution_result) return String(tx.execution_result).toUpperCase();
  if (tx.txExecutionResult) return String(tx.txExecutionResult).toUpperCase();
  
  if (tx.consensus_data?.leader_receipt?.[0]?.execution_result) {
    return String(tx.consensus_data.leader_receipt[0].execution_result).toUpperCase();
  }
  
  if (tx.consensus_history?.consensus_results?.[0]?.leader_result?.[0]?.execution_result) {
    return String(tx.consensus_history.consensus_results[0].leader_result[0].execution_result).toUpperCase();
  }
  
  if (tx.data) {
    if (Array.isArray(tx.data) && tx.data[0] && typeof tx.data[0] === 'object' && tx.data[0].execution_result) {
      return String(tx.data[0].execution_result).toUpperCase();
    }
    
    // Sometimes raw RPC responds with stringified JSON or encoded data inside tx.data
    if (typeof tx.data === 'string') {
       try {
          const parsed = JSON.parse(tx.data);
          if (parsed && typeof parsed === 'object' && parsed.execution_result) {
             return String(parsed.execution_result).toUpperCase();
          }
       } catch (e) {
          // ignore parse errors for raw hex/base64 strings
       }
    }
  }
  
  return undefined;
}

function normalizeLifecycle(statusName: string, execResult: string | undefined): NormalizedLifecycleState {
  if (statusName === 'FINALIZED') {
    if (execResult === 'SUCCESS' || execResult === '1') {
      return 'FINALIZED_SUCCESS';
    } else {
      return 'FINALIZED_ERROR';
    }
  } 
  
  if (statusName === 'ACCEPTED') {
    return 'DECIDED';
  } 
  
  if (statusName === 'PENDING' || statusName === 'PROPOSED') {
    return 'PROCESSING';
  } 
  
  if (statusName === 'CANCELED' || statusName === 'REVERTED') {
    return 'FAILED';
  } 
  
  if (statusName === 'ERROR') {
    return 'FINALIZED_ERROR';
  }

  return 'PROCESSING'; // default fallback for in-flight states
}

export class TransactionTracker {
  public async getTransactionStatus(hash: string): Promise<TransactionStatusInfo> {
    try {
      const rpcUrl = chains.studionet.rpcUrls.default.http[0];
      const res = await fetch(rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_getTransactionByHash',
          params: [hash]
        })
      });
      
      const json = await res.json();
      const tx = json.result;
      
      if (!tx) {
        return { state: 'NOT_FOUND', errorMessage: 'Transaction not found.' };
      }

      const statusName = extractStableTransactionStatus(tx);
      const execResult = extractStableExecutionResult(tx);
      const normalized = normalizeLifecycle(statusName, execResult);

      return {
        state: normalized,
        rawStatus: statusName,
        rawExecutionResult: execResult || 'UNKNOWN',
      };
    } catch (err: unknown) {
      console.error("Error fetching transaction:", err);
      const msg = (err as Error).message || '';
      if (msg.includes('not found') || msg.includes('does not exist')) {
         return { state: 'NOT_FOUND', errorMessage: 'Transaction not found on the network yet.' };
      }
      return { 
        state: 'NETWORK_ERROR', 
        errorMessage: 'Unable to refresh transaction status. The request may still be processing.' 
      };
    }
  }

  public isTerminal(state: NormalizedLifecycleState): boolean {
    return [
      'FINALIZED_SUCCESS', 
      'FINALIZED_ERROR', 
      'FAILED', 
      'CANCELED',
    ].includes(state);
  }
}

export const transactionTracker = new TransactionTracker();
