import { PROOFDATA_CHAIN } from "./config.ts";

export interface ProviderRequest {
  method: string;
  params?: readonly unknown[] | object;
}

export interface BrowserProvider {
  request(args: ProviderRequest): Promise<unknown>;
  on?(event: string, listener: (...args: unknown[]) => void): void;
  removeListener?(event: string, listener: (...args: unknown[]) => void): void;
}

export const BRADBURY_OUTER_GAS_FLOOR = 2_000_000n;
export const BRADBURY_CHAIN_HEX = `0x${PROOFDATA_CHAIN.id.toString(16)}`;

export function selectWalletProvider(explicit: BrowserProvider | undefined, legacy: BrowserProvider | undefined) {
  return explicit ?? legacy;
}

function walletRequestRejected(error: unknown) {
  const code = (error as { code?: number })?.code;
  const message = error instanceof Error ? error.message : String(error);
  return code === 4001 || /user rejected|user denied|request rejected/i.test(message);
}

export async function ensureBradburyNetwork(provider: BrowserProvider) {
  const isBradbury = async () => BigInt(String(await provider.request({ method: "eth_chainId" }))) === BigInt(PROOFDATA_CHAIN.id);
  if (await isBradbury()) return;

  // First ask the selected EVM wallet to switch. If Bradbury is not already
  // installed, wallets do not all return the exact same "unknown chain" code,
  // so fall back to the standard wallet_addEthereumChain request unless the
  // user explicitly rejected the switch.
  try {
    await provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId: BRADBURY_CHAIN_HEX }] });
    if (await isBradbury()) return;
  } catch (error) {
    if (walletRequestRejected(error)) throw error;
  }

  await provider.request({ method: "wallet_addEthereumChain", params: [{
    chainId: BRADBURY_CHAIN_HEX,
    chainName: PROOFDATA_CHAIN.name,
    rpcUrls: PROOFDATA_CHAIN.rpcUrls.default.http,
    nativeCurrency: PROOFDATA_CHAIN.nativeCurrency,
  }] });

  // Some wallets switch to a newly-added chain automatically; others require
  // a second explicit switch request. Support both behaviors.
  if (!await isBradbury()) {
    try {
      await provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId: BRADBURY_CHAIN_HEX }] });
    } catch (error) {
      if (walletRequestRejected(error)) throw error;
      if (!await isBradbury()) throw error;
    }
  }

  if (!await isBradbury()) throw new Error("Wrong network. Switch the selected wallet to Bradbury (4221).");
}

// This adapter belongs only to the ProofData SDK client. The wallet is unchanged.
export function withBradburyGasHeadroom(provider: BrowserProvider, onOuterHash: (hash: string) => void): BrowserProvider {
  return {
    async request(request) {
      const tx = Array.isArray(request.params) ? request.params[0] as Record<string, unknown> | undefined : undefined;
      const relevant = request.method === "eth_sendTransaction" && tx &&
        tx.chainId !== undefined && String(tx.to).toLowerCase() === PROOFDATA_CHAIN.consensusMainContract?.address.toLowerCase() &&
        BigInt(String(tx.chainId)) === BigInt(PROOFDATA_CHAIN.id);
      if (!relevant) return provider.request(request);

      // Keep all SDK payload/signing/fee fields. Change only the outer gas limit.
      const estimate = tx.gas === undefined ? 0n : BigInt(String(tx.gas));
      const buffered = (estimate * 3n + 1n) / 2n;
      const gas = buffered < BRADBURY_OUTER_GAS_FLOOR ? BRADBURY_OUTER_GAS_FLOOR : buffered;
      const hash = await provider.request({ ...request, params: [{ ...tx, gas: `0x${gas.toString(16)}` }] });
      if (typeof hash === "string") onOuterHash(hash);
      return hash;
    },
    on: provider.on?.bind(provider),
    removeListener: provider.removeListener?.bind(provider),
  };
}

export function walletErrorMessage(error: unknown) {
  const code = (error as { code?: number })?.code;
  const message = error instanceof Error ? error.message : String(error);
  if (code === 4001 || /user rejected|user denied/i.test(message)) return "Wallet authorization was declined. No new request will be sent automatically.";
  return message || "Wallet request failed.";
}
