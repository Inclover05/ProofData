import { createReadClient, PROOFDATA_CONTRACT } from "./config.ts";

export interface WarrantDTO {
  id: string; status: string; evidence_ref: string; expected_hash: string;
  purpose: string; risk_level: string; requirements: string[]; requester: string; expires_at: number;
}
export async function readWarrant(warrantId: string): Promise<WarrantDTO> {
  const result = await createReadClient().readContract({ address: PROOFDATA_CONTRACT, functionName: "get_warrant", args: [warrantId] });
  if (!result || typeof result !== "object" || !("status" in result) || !("id" in result)) throw new Error("Contract returned an invalid warrant record.");
  return result as unknown as WarrantDTO;
}
export async function checkWarrantStatus(warrantId: string): Promise<string | null> {
  try { return (await readWarrant(warrantId)).status; } catch { return null; }
}
