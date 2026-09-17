"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "genlayer-js";
import { PROOFDATA_CHAIN, PROOFDATA_CONTRACT } from "./config.ts";
import { BrowserProvider, ensureBradburyNetwork, selectWalletProvider, withBradburyGasHeadroom, walletErrorMessage } from "./browser-provider.ts";

declare global { interface Window { ethereum?: BrowserProvider; okxwallet?: BrowserProvider; } }
export interface EIP6963ProviderInfo { uuid: string; name: string; icon: string; rdns: string; }
export interface EIP6963ProviderDetail { info: EIP6963ProviderInfo; provider: BrowserProvider; }
export type WarrantWriteMethod = "create_warrant" | "retrieve_and_validate" | "adjudicate";
export interface WalletWriteResult { txHash?: string; outerTxHash?: string; error?: string; rawError?: Error; }

type LegacyInjectedProvider = BrowserProvider & {
  providers?: BrowserProvider[];
  isMetaMask?: boolean;
  isCoinbaseWallet?: boolean;
  isRabby?: boolean;
  isBraveWallet?: boolean;
  isTrust?: boolean;
  isOkxWallet?: boolean;
};

const WALLET_SELECTION_KEY = "proofdata:selected-wallet";
const GENERIC_WALLET_ICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' rx='10' fill='%23101f29'/%3E%3Cpath d='M10 13h20v14H10z' fill='none' stroke='%239fd7e8' stroke-width='2'/%3E%3Ccircle cx='27' cy='20' r='2' fill='%239fd7e8'/%3E%3C/svg%3E";

function legacyProviderName(provider: BrowserProvider, index: number) {
  const candidate = provider as LegacyInjectedProvider;
  if (candidate.isRabby) return "Rabby";
  if (candidate.isCoinbaseWallet) return "Coinbase Wallet";
  if (candidate.isBraveWallet) return "Brave Wallet";
  if (candidate.isTrust) return "Trust Wallet";
  if (candidate.isOkxWallet) return "OKX Wallet";
  if (candidate.isMetaMask) return "MetaMask";
  return index === 0 ? "Browser Wallet" : `Browser Wallet ${index + 1}`;
}

function legacyProviderDetails(ethereum?: BrowserProvider, forcedName?: string): EIP6963ProviderDetail[] {
  if (!ethereum) return [];
  const root = ethereum as LegacyInjectedProvider;
  const candidates = Array.isArray(root.providers) && root.providers.length > 0 ? root.providers : [ethereum];
  return candidates
    .filter((provider): provider is BrowserProvider => !!provider && typeof provider.request === "function")
    .map((provider, index) => {
      const name = forcedName ?? legacyProviderName(provider, index);
      return {
        info: {
          uuid: `legacy-${index}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
          name,
          icon: GENERIC_WALLET_ICON,
          rdns: `legacy:${index}:${name.toLowerCase().replace(/[^a-z0-9]+/g, ".")}`,
        },
        provider,
      };
    });
}

function allLegacyProviderDetails(): EIP6963ProviderDetail[] {
  if (typeof window === "undefined") return [];
  const details = [
    ...legacyProviderDetails(window.ethereum),
    ...legacyProviderDetails(window.okxwallet, "OKX Wallet"),
  ];
  return details.filter((detail, index) => details.findIndex(candidate => candidate.provider === detail.provider) === index);
}

function providerStorageKey(detail: EIP6963ProviderDetail) {
  return detail.info.rdns || detail.info.uuid;
}

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [client, setClient] = useState<ReturnType<typeof createClient> | null>(null);
  const [providers, setProviders] = useState<EIP6963ProviderDetail[]>([]);
  const [selectedProviderDetail, setSelectedProviderDetail] = useState<EIP6963ProviderDetail | null>(null);
  const [activeProvider, setActiveProvider] = useState<BrowserProvider | null>(null);
  const outerHashRef = useRef<string | undefined>(undefined);
  const restoredRef = useRef(false);
  const hasLegacyEthereum = typeof window !== "undefined" && (!!window.ethereum || !!window.okxwallet);

  const setupClientWithProvider = useCallback((accountAddress: string, provider: BrowserProvider) => {
    const adapted = withBradburyGasHeadroom(provider, hash => { outerHashRef.current = hash; });
    const newClient = createClient({ chain: PROOFDATA_CHAIN, account: accountAddress as `0x${string}`, provider: adapted });
    setAddress(accountAddress);
    setClient(newClient);
    return newClient;
  }, []);

  const syncNetworkLabel = useCallback(async (provider: BrowserProvider) => {
    try {
      const chainId = await provider.request({ method: "eth_chainId" });
      setNetwork(BigInt(String(chainId)) === BigInt(PROOFDATA_CHAIN.id) ? "BRADBURY (4221)" : "WRONG NETWORK — SWITCH TO BRADBURY");
    } catch {
      setNetwork(null);
    }
  }, []);

  const registerProvider = useCallback((detail: EIP6963ProviderDetail) => {
    setProviders(previous => {
      const index = previous.findIndex(p => p.provider === detail.provider || p.info.uuid === detail.info.uuid);
      if (index === -1) return [...previous, detail];
      const existing = previous[index];
      if (existing.info.rdns.startsWith("legacy:") && !detail.info.rdns.startsWith("legacy:")) {
        const next = [...previous];
        next[index] = detail;
        return next;
      }
      return previous;
    });
  }, []);

  const restoreAuthorizedProvider = useCallback(async (detail: EIP6963ProviderDetail) => {
    if (restoredRef.current) return;
    const saved = window.localStorage.getItem(WALLET_SELECTION_KEY);
    if (saved && saved !== providerStorageKey(detail)) return;
    try {
      const accounts = await detail.provider.request({ method: "eth_accounts" });
      if (!Array.isArray(accounts) || typeof accounts[0] !== "string") return;
      restoredRef.current = true;
      setSelectedProviderDetail(detail);
      setActiveProvider(detail.provider);
      setupClientWithProvider(accounts[0], detail.provider);
      await syncNetworkLabel(detail.provider);
    } catch {
      // Silent restore must never create a wallet prompt or block page rendering.
    }
  }, [setupClientWithProvider, syncNetworkLabel]);

  useEffect(() => {
    for (const detail of allLegacyProviderDetails()) {
      registerProvider(detail);
      void restoreAuthorizedProvider(detail);
    }

    const announce = (event: Event) => {
      const detail = (event as CustomEvent<EIP6963ProviderDetail>).detail;
      if (detail?.info?.uuid && typeof detail.provider?.request === "function") {
        registerProvider(detail);
        void restoreAuthorizedProvider(detail);
      }
    };
    window.addEventListener("eip6963:announceProvider", announce);
    window.dispatchEvent(new Event("eip6963:requestProvider"));
    return () => window.removeEventListener("eip6963:announceProvider", announce);
  }, [registerProvider, restoreAuthorizedProvider]);

  useEffect(() => {
    if (!activeProvider) return;
    const accountsChanged = (...args: unknown[]) => {
      const accounts = args[0];
      if (Array.isArray(accounts) && typeof accounts[0] === "string") setupClientWithProvider(accounts[0], activeProvider);
      else { setAddress(null); setClient(null); setNetwork(null); }
    };
    const chainChanged = (...args: unknown[]) => {
      setNetwork(String(args[0]).toLowerCase() === "0x107d" ? "BRADBURY (4221)" : "WRONG NETWORK — SWITCH TO BRADBURY");
    };
    const disconnect = () => { setAddress(null); setClient(null); setNetwork(null); };
    activeProvider.on?.("accountsChanged", accountsChanged);
    activeProvider.on?.("chainChanged", chainChanged);
    activeProvider.on?.("disconnect", disconnect);
    return () => {
      activeProvider.removeListener?.("accountsChanged", accountsChanged);
      activeProvider.removeListener?.("chainChanged", chainChanged);
      activeProvider.removeListener?.("disconnect", disconnect);
    };
  }, [activeProvider, setupClientWithProvider]);

  const connectToProvider = async (detail: EIP6963ProviderDetail | null) => {
    setIsConnecting(true);
    setError(null);
    try {
      const fallbackDetail = detail ?? allLegacyProviderDetails()[0] ?? null;
      const fallbackProvider = typeof window !== "undefined" ? (window.ethereum ?? window.okxwallet) : undefined;
      const provider = selectWalletProvider(fallbackDetail?.provider, fallbackProvider);
      if (!provider) throw new Error("No compatible browser wallet detected.");
      setSelectedProviderDetail(fallbackDetail);
      setActiveProvider(provider);
      const accounts = await provider.request({ method: "eth_requestAccounts" });
      if (!Array.isArray(accounts) || typeof accounts[0] !== "string") throw new Error("No wallet account was authorized.");
      await ensureBradburyNetwork(provider);
      setupClientWithProvider(accounts[0], provider);
      setNetwork("BRADBURY (4221)");
      restoredRef.current = true;
      if (fallbackDetail) window.localStorage.setItem(WALLET_SELECTION_KEY, providerStorageKey(fallbackDetail));
    } catch (err) { setError(walletErrorMessage(err)); }
    finally { setIsConnecting(false); }
  };

  const writeContract = async (functionName: WarrantWriteMethod, args: NonNullable<Parameters<NonNullable<typeof client>["writeContract"]>[0]["args"]>): Promise<WalletWriteResult> => {
    if (!address || !activeProvider || !client) return { error: "Wallet not connected." };
    outerHashRef.current = undefined;
    try {
      await ensureBradburyNetwork(activeProvider);
      setNetwork("BRADBURY (4221)");
      const txHash: unknown = await client.writeContract({ address: PROOFDATA_CONTRACT, functionName, args, value: BigInt(0) });
      if (typeof txHash !== "string" || !/^0x[0-9a-f]{64}$/i.test(txHash)) throw new Error("Bradbury did not return a valid GenLayer transaction identifier.");
      return { txHash, outerTxHash: outerHashRef.current };
    } catch (err) { return { error: walletErrorMessage(err), outerTxHash: outerHashRef.current, rawError: err instanceof Error ? err : undefined }; }
  };

  const writeWarrant = (args: Parameters<typeof writeContract>[1]) => writeContract("create_warrant", args);
  return { address, isConnecting, error, network, providers, hasLegacyEthereum, selectedProviderDetail, connectToProvider, writeWarrant, writeContract, client };
}
