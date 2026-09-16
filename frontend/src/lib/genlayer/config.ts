import { chains, createClient } from "genlayer-js";
import submission from "../../../proofdata.config.json" with { type: "json" };

export const PROOFDATA_CHAIN = chains.testnetBradbury;
export const PROOFDATA_RPC_URL = PROOFDATA_CHAIN.rpcUrls.default.http[0];
export const PROOFDATA_CONTRACT = (process.env.NEXT_PUBLIC_PROOFDATA_CONTRACT_ADDRESS || submission.contractAddress) as `0x${string}`;
export const PROOFDATA_STORAGE_PREFIX = `proofdata:${PROOFDATA_CHAIN.id}:${PROOFDATA_CONTRACT}:`;
export const FINAL_PROOF = submission;

if (PROOFDATA_CHAIN.id !== submission.chainId || PROOFDATA_CONTRACT.toLowerCase() !== submission.contractAddress) {
  throw new Error("ProofData submission configuration must target the fixed Bradbury contract on chain 4221.");
}

export function createReadClient() {
  return createClient({ chain: PROOFDATA_CHAIN });
}
