import test from "node:test";
import assert from "node:assert/strict";
import { withBradburyGasHeadroom, selectWalletProvider, ensureBradburyNetwork, BRADBURY_CHAIN_HEX } from "../src/lib/genlayer/browser-provider.ts";
import type { BrowserProvider, ProviderRequest } from "../src/lib/genlayer/browser-provider.ts";
import { PROOFDATA_CHAIN } from "../src/lib/genlayer/config.ts";
import { normalizeBradburyReceipt, transactionTracker, TransactionTracker } from "../src/lib/genlayer/transaction-lifecycle.ts";

function recordingProvider(handler: (request: ProviderRequest) => unknown = () => "0x" + "a".repeat(64)) {
  const calls: ProviderRequest[] = [];
  const provider: BrowserProvider = { async request(request) { calls.push(request); return handler(request); } };
  return { provider, calls };
}
const transaction = { from: "0x" + "1".repeat(40), to: PROOFDATA_CHAIN.consensusMainContract!.address,
  data: "0xdeadbeef", chainId: BRADBURY_CHAIN_HEX, value: "0x0", gas: "0x30d40", gasPrice: "0x123", nonce: "0x5", type: "0x0" };

test("explicit EIP-6963 selection takes precedence over legacy injection", () => {
  const selected = recordingProvider().provider, legacy = recordingProvider().provider;
  assert.equal(selectWalletProvider(selected, legacy), selected);
  assert.equal(selectWalletProvider(undefined, legacy), legacy);
});
test("browser gas adapter preserves SDK payload and wallet signer; original request is immutable", async () => {
  const { provider, calls } = recordingProvider(); let outer: string | undefined;
  const adapter = withBradburyGasHeadroom(provider, hash => { outer = hash; });
  const original = { ...transaction };
  await adapter.request({ method: "eth_sendTransaction", params: [original] });
  const sent = (calls[0].params as Record<string, unknown>[])[0];
  assert.equal(sent.gas, "0x1e8480");
  assert.deepEqual({ ...sent, gas: original.gas }, original);
  assert.deepEqual(original, transaction);
  assert.equal(outer, "0x" + "a".repeat(64));
});
test("gas headroom buffers large live estimates with integer precision", async () => {
  const { provider, calls } = recordingProvider();
  await withBradburyGasHeadroom(provider, () => {}).request({ method: "eth_sendTransaction", params: [{ ...transaction, gas: "0x2dc6c1" }] });
  assert.equal(BigInt((calls[0].params as Record<string, string>[])[0].gas), (3_000_001n * 3n + 1n) / 2n);
});
test("unrelated methods, destinations and chains are forwarded unchanged", async () => {
  const { provider, calls } = recordingProvider(); const adapter = withBradburyGasHeadroom(provider, () => assert.fail("unrelated transaction was captured"));
  const requests = [
    { method: "eth_estimateGas", params: [transaction] },
    { method: "eth_sendTransaction", params: [{ ...transaction, to: "0x" + "2".repeat(40) }] },
    { method: "eth_sendTransaction", params: [{ ...transaction, chainId: "0x1" }] },
    { method: "eth_sendTransaction", params: [{ to: transaction.to }] },
  ];
  for (const request of requests) await adapter.request(request);
  requests.forEach((request, index) => assert.equal(calls[index], request));
});
test("wallet rejection propagates without another signing request", async () => {
  const rejection = Object.assign(new Error("User rejected"), { code: 4001 });
  const { provider, calls } = recordingProvider(() => { throw rejection; });
  await assert.rejects(withBradburyGasHeadroom(provider, () => {}).request({ method: "eth_sendTransaction", params: [transaction] }), error => error === rejection);
  assert.equal(calls.length, 1);
});
test("already-correct network requires no account authorization or switching", async () => {
  const { provider, calls } = recordingProvider(() => BRADBURY_CHAIN_HEX);
  await ensureBradburyNetwork(provider);
  assert.deepEqual(calls.map(x => x.method), ["eth_chainId"]);
});
test("unknown Bradbury network is added, switched and independently verified", async () => {
  let chain = "0x1", added = false;
  const { provider, calls } = recordingProvider(request => {
    if (request.method === "eth_chainId") return chain;
    if (request.method === "wallet_addEthereumChain") { added = true; return null; }
    if (!added) throw Object.assign(new Error("Unknown chain"), { code: 4902 });
    chain = BRADBURY_CHAIN_HEX; return null;
  });
  await ensureBradburyNetwork(provider);
  assert.deepEqual(calls.map(x => x.method), ["eth_chainId", "wallet_switchEthereumChain", "wallet_addEthereumChain", "wallet_switchEthereumChain", "eth_chainId"]);
  assert.equal((calls[2].params as { chainId: string }[])[0].chainId, "0x107d");
});
test("network approval denial is preserved", async () => {
  const rejection = Object.assign(new Error("Declined"), { code: 4001 });
  const { provider } = recordingProvider(request => { if (request.method === "eth_chainId") return "0x1"; throw rejection; });
  await assert.rejects(ensureBradburyNetwork(provider), error => error === rejection);
});
test("wallet that ignores switching cannot be treated as connected to Bradbury", async () => {
  const { provider } = recordingProvider(request => request.method === "eth_chainId" ? "0x1" : null);
  await assert.rejects(ensureBradburyNetwork(provider), /Wrong network/);
});
test("finalization requires consensus agreement AND successful GenVM execution", () => {
  assert.equal(normalizeBradburyReceipt({ status: 7, result: 1, txExecutionResult: 1 }).state, "FINALIZED_SUCCESS");
  assert.equal(normalizeBradburyReceipt({ status: 7, result: 1, txExecutionResult: 2 }).state, "FINALIZED_ERROR");
  assert.equal(normalizeBradburyReceipt({ status: 7, result: 2, txExecutionResult: 1 }).state, "FINALIZED_ERROR");
  assert.equal(normalizeBradburyReceipt({ status: 7, result: 0, txExecutionResult: 0 }).state, "FINALIZED_ERROR");
});
test("ACCEPTED and READY_TO_FINALIZE remain nonterminal; tracking exceeds old five-minute limit", () => {
  for (const status of [5, 11]) {
    const info = normalizeBradburyReceipt({ status, result: 1, txExecutionResult: 1 });
    assert.equal(info.state, "DECIDED"); assert.equal(transactionTracker.isTerminal(info.state), false);
  }
});
test("tracker uses GenLayer receipt RPC and detects outer-EVM failure", async () => {
  const requests: { method: string; params: unknown[] }[] = [];
  const tracker = new TransactionTracker(async <T>(method: string, params: unknown[]): Promise<T> => {
    requests.push({ method, params });
    return (method === "eth_getTransactionReceipt" ? { status: "0x0" } : null) as T;
  });
  assert.equal((await tracker.getTransactionStatus("gen-id", "outer-id")).state, "FAILED");
  assert.deepEqual(requests.map(r => [r.method, r.params]), [["gen_getTransactionReceipt", [{ txId: "gen-id" }]], ["eth_getTransactionReceipt", ["outer-id"]]]);
});
