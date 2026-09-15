import { createClient, chains } from 'genlayer-js';

export async function checkWarrantStatus(warrantId: string): Promise<string | null> {
  try {
    const client = createClient({ chain: chains.studionet });
    const contractAddress = process.env.NEXT_PUBLIC_PROOFDATA_CONTRACT_ADDRESS as `0x${string}`;
    
    const result = await client.readContract({
      address: contractAddress,
      functionName: 'get_warrant',
      args: [warrantId]
    });
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (result && typeof result === 'object' && 'status' in (result as any)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (result as any).status;
    }
    return 'UNKNOWN';
  } catch (e) {
    console.warn("Warrant read failed or not found:", e);
    return null;
  }
}
