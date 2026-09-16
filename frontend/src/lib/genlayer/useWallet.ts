"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "genlayer-js";
import { PROOFDATA_CHAIN, PROOFDATA_CONTRACT } from "./config.ts";
import { BrowserProvider, ensureBradburyNetwork, selectWalletProvider, withBradburyGasHeadroom, walletErrorMessage } from "./browser-provider.ts";

declare global { interface Window { ethereum?: BrowserProvider; } }
export interface EIP6963ProviderInfo { uuid: string; name: string; icon: string; rdns: string; }
export interface EIP6963ProviderDetail { info: EIP6963ProviderInfo; provider: BrowserProvider; }
export type WarrantWriteMethod = "create_warrant" | "retrieve_and_validate" | "adjudicate";
export interface WalletWriteResult { txHash?: string; outerTxHash?: string; error?: string; rawError?: Error; }

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
  const hasLegacyEthereum = typeof window !== "undefined" && !!window.ethereum;

  useEffect(() => {
    const announce = (event: Event) => {
      const detail = (event as CustomEvent<EIP6963ProviderDetail>).detail;
      if (detail?.info?.uuid && typeof detail.provider?.request === "function") {
        setProviders(previous => previous.some(p => p.info.uuid === detail.info.uuid) ? previous : [...previous, detail]);
      }
    };
    window.addEventListener("eip6963:announceProvider", announce);
    window.dispatchEvent(new Event("eip6963:requestProvider"));
    return () => window.removeEventListener("eip6963:announceProvider", announce);
  }, []);

  const setupClientWithProvider = useCallback((accountAddress: string, provider: BrowserProvider) => {
    const adapted = withBradburyGasHeadroom(provider, hash => { outerHashRef.current = hash; });
    const newClient = createClient({ chain: PROOFDATA_CHAIN, account: accountAddress as `0x${string}`, provider: adapted });
    setAddress(accountAddress);
    setClient(newClient);
    return newClient;
  }, []);

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
      const provider = selectWalletProvider(detail?.provider, window.ethereum);
      if (!provider) throw new Error("No compatible browser wallet detected.");
      setSelectedProviderDetail(detail);
      setActiveProvider(provider);
      const accounts = await provider.request({ method: "eth_requestAccounts" });
      if (!Array.isArray(accounts) || typeof accounts[0] !== "string") throw new Error("No wallet account was authorized.");
      await ensureBradburyNetwork(provider);
      setupClientWithProvider(accounts[0], provider);
      setNetwork("BRADBURY (4221)");
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
