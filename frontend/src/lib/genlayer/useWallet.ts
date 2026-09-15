"use client";
import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient, chains } from 'genlayer-js';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum?: any;
    dispatchEvent: (event: Event) => boolean;
  }
}

export interface EIP6963ProviderInfo {
  uuid: string;
  name: string;
  icon: string;
  rdns: string;
}

export interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  provider: any;
}

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [client, setClient] = useState<any>(null);
  const [providers, setProviders] = useState<EIP6963ProviderDetail[]>([]);
  const [selectedProviderDetail, setSelectedProviderDetail] = useState<EIP6963ProviderDetail | null>(null);

  const hasLegacyEthereum = typeof window !== 'undefined' && !!window.ethereum;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const activeProviderRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onAnnounceProvider = (event: any) => {
      const detail = event.detail as EIP6963ProviderDetail;
      if (detail && detail.info && detail.provider) {
        setProviders(prev => {
          if (prev.some(p => p.info.uuid === detail.info.uuid)) return prev;
          return [...prev, detail];
        });
      }
    };

    window.addEventListener('eip6963:announceProvider', onAnnounceProvider);
    window.dispatchEvent(new Event('eip6963:requestProvider'));

    return () => {
      window.removeEventListener('eip6963:announceProvider', onAnnounceProvider);
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setupClientWithProvider = useCallback(async (accountAddress: string, provider: any) => {
    setAddress(accountAddress);
    try {
      const newClient = createClient({
        chain: chains.studionet,
        account: accountAddress as `0x${string}`,
        provider
      });
      setClient(newClient);
      setNetwork('STUDIONET'); 
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to setup client');
    }
  }, []);

  useEffect(() => {
    if (!activeProviderRef.current) return;
    const provider = activeProviderRef.current;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        setupClientWithProvider(accounts[0], provider);
      } else {
        setAddress(null);
        setClient(null);
        setNetwork(null);
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    const handleDisconnect = () => {
      setAddress(null);
      setClient(null);
      setNetwork(null);
    };

    if (provider.on) {
      provider.on('accountsChanged', handleAccountsChanged);
      provider.on('chainChanged', handleChainChanged);
      provider.on('disconnect', handleDisconnect);
    }

    return () => {
      if (provider.removeListener) {
        provider.removeListener('accountsChanged', handleAccountsChanged);
        provider.removeListener('chainChanged', handleChainChanged);
        provider.removeListener('disconnect', handleDisconnect);
      }
    };
  }, [selectedProviderDetail, setupClientWithProvider]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ensureNetwork = async (provider: any) => {
    const targetChainId = `0x${chains.studionet.id.toString(16)}`;
    try {
      const currentChainId = await provider.request({ method: 'eth_chainId' });
      if (currentChainId !== targetChainId) {
        try {
          await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: targetChainId }],
          });
        } catch (switchError: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
          if (switchError.code === 4902) {
            await provider.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: targetChainId,
                  chainName: chains.studionet.name,
                  rpcUrls: chains.studionet.rpcUrls.default.http,
                  nativeCurrency: chains.studionet.nativeCurrency,
                },
              ],
            });
          } else {
            throw switchError;
          }
        }
      }
    } catch (err: unknown) {
      console.warn("Failed to switch/add network. Wallet might not support it natively.", err);
      throw new Error("This wallet does not support the network/signing method required by ProofData.");
    }
  };

  const connectToProvider = async (providerDetail: EIP6963ProviderDetail | null) => {
    setIsConnecting(true);
    setError(null);
    try {
      const provider = providerDetail ? providerDetail.provider : window.ethereum;
      if (!provider) {
        throw new Error('No provider available.');
      }
      
      activeProviderRef.current = provider;
      setSelectedProviderDetail(providerDetail);

      await ensureNetwork(provider);

      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        await setupClientWithProvider(accounts[0], provider);
      }
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((err as any).code === 4001) {
        setError('Transaction was not signed.'); 
      } else {
        setError((err as Error).message || 'Failed to connect');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const writeWarrant = async (contractAddress: string, args: any[]): Promise<{ txHash?: string, error?: string, rawError?: Error }> => {
    if (!client) return { error: 'Wallet not connected' };
    try {
      const txHash = await client.writeContract({
        address: contractAddress,
        functionName: 'create_warrant',
        args,
        value: BigInt(0),
      });
      return { txHash };
    } catch (err: unknown) {
      const msg = (err as Error).message || '';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const code = (err as any).code;
      if (msg.includes('User rejected') || code === 4001) {
        return { error: 'Transaction was not signed.', rawError: err as Error };
      }
      if (msg.includes('wrong chain') || msg.includes('network')) {
        return { error: 'Wrong network. Switch to Studionet.', rawError: err as Error };
      }
      return { error: msg || 'Transaction failed', rawError: err as Error };
    }
  };

  return {
    address,
    isConnecting,
    error,
    network,
    providers,
    hasLegacyEthereum,
    selectedProviderDetail,
    connectToProvider,
    writeWarrant,
    client,
  };
}
