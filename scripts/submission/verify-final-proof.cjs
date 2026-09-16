// Public, read-only verification. No wallet account, credentials or write API.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../..');
const gl = require(path.join(root, 'frontend/node_modules/genlayer-js'));
const { keccak256, fromRlp } = require(path.join(root, 'frontend/node_modules/viem'));
const proof = path.join(root, 'docs/submission-proof');
const json = name => JSON.parse(fs.readFileSync(path.join(proof, name), 'utf8'));
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const config = JSON.parse(fs.readFileSync(path.join(root, 'frontend/proofdata.config.json'), 'utf8'));
const deployment = json('deployment.json');
const cases = [json('low.json'), json('high.json'), json('browser-e2e.json')];
const client = gl.createClient({ chain: gl.chains.testnetBradbury });
const rpcUrl = gl.chains.testnetBradbury.rpcUrls.default.http[0];
async function rpc(method, params) {
  const response = await fetch(rpcUrl, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`${method}: HTTP ${response.status}`);
  const value = await response.json();
  if (value.error) throw new Error(`${method}: ${value.error.message}`);
  return value.result;
}
function plain(value) {
  if (value instanceof Map) return Object.fromEntries([...value].map(([k, v]) => [k, plain(v)]));
  if (Array.isArray(value)) return value.map(plain);
  if (typeof value === 'bigint') return value.toString();
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, plain(v)]));
  return value;
}
function outputs(receipt) {
  if (!receipt.eqBlocksOutputs) return [];
  const blocks = fromRlp('0x' + receipt.eqBlocksOutputs.replace(/^0x/, ''), 'hex');
  return blocks.filter(b => typeof b === 'string' && b.startsWith('0x00')).map(block => {
    const bytes = Buffer.from(block.slice(2), 'hex');
    return plain(gl.abi.calldata.decode(bytes.subarray(1)));
  });
}
async function inspect(write, caseEvidence, semanticOutput) {
  const [outer, gen] = await Promise.all([
    rpc('eth_getTransactionReceipt', [write.outerEvmTransaction]),
    rpc('gen_getTransactionReceipt', [{ txId: write.genLayerTransaction }]),
  ]);
  assert(outer && gen, `${write.stage}: missing receipt`);
  assert.equal(outer.status, '0x1', `${write.stage}: outer revert`);
  assert.equal(gen.id.toLowerCase(), write.genLayerTransaction.toLowerCase());
  assert.equal(gen.recipient.toLowerCase(), config.contractAddress);
  assert.equal(gen.status, 7, `${write.stage}: not FINALIZED`);
  assert.equal(gen.result, 1, `${write.stage}: not AGREE`);
  assert.equal(gen.txExecutionResult, 1, `${write.stage}: no FINISHED_WITH_RETURN`);
  const nondeterministicOutputs = outputs(gen);
  if (write.stage === 'validation' || write.stage === 'retrieve_and_validate') {
    assert(nondeterministicOutputs.some(o => o.fetch_status === 'FETCHED' && o.hash === caseEvidence.keccak), 'Validator evidence identity did not match');
  }
  if (write.stage === 'adjudication' || write.stage === 'adjudicate') {
    assert(nondeterministicOutputs.some(o => o.status === semanticOutput.status && o.reason === semanticOutput.reason), 'Consensus semantic output differs from preserved proof');
  }
  return {
    stage: write.stage, outerEvmTransaction: write.outerEvmTransaction,
    genLayerTransaction: write.genLayerTransaction, outerReceiptStatus: outer.status,
    status: 'FINALIZED', consensus: 'AGREE', execution: 'FINISHED_WITH_RETURN',
    validatorRounds: (gen.roundData || []).map(r => ({
      round: r.round, leaderIndex: r.leaderIndex, result: r.result,
      votes: [...Buffer.from(r.validatorVotes || '', 'base64')].map(v => ({ 0: 'NOT_VOTED', 1: 'AGREE', 2: 'DISAGREE', 3: 'TIMEOUT' }[v])),
    })), nondeterministicOutputs,
  };
}
(async () => {
  const source = fs.readFileSync(path.join(root, 'contracts/reliance_warrant.py'));
  assert.equal(sha256(source), deployment.sourceSha256);
  assert.equal(config.contractAddress, deployment.contractAddress);
  assert.equal(config.chainId, 4221);
  assert.equal(gl.chains.testnetBradbury.id, 4221);
  assert.equal(require(path.join(root, 'frontend/node_modules/genlayer-js/package.json')).version, '1.1.8');
  const fixture = fs.readFileSync(path.join(proof, 'fixture/index-BCPb0x30.d.ts'));
  assert.equal(fixture.length, 723);
  assert.equal(keccak256(fixture).slice(2), config.sampleEvidence.keccak);
  const manifestPath = path.join(proof, 'manifest.json');
  let manifestVerified = false;
  if (fs.existsSync(manifestPath)) {
    for (const item of json('manifest.json').files) {
      const absolute = path.resolve(proof, item.path);
      assert(absolute.startsWith(proof + path.sep), 'Manifest path outside proof directory');
      assert.equal(sha256(fs.readFileSync(absolute)), item.sha256, `Artifact checksum: ${item.path}`);
    }
    manifestVerified = true;
  }
  const [chainId, code, deployed, verifiedCases] = await Promise.all([
    rpc('eth_chainId', []),
    rpc('gen_getContractCode', [{ address: config.contractAddress, status: 'finalized' }]),
    inspect(deployment.transaction),
    Promise.all(cases.map(async item => {
      const [state, transactions] = await Promise.all([
        client.readContract({ address: config.contractAddress, functionName: 'get_warrant', args: [item.warrant.id] }),
        Promise.all(item.transactions.map(write => inspect(write, item.evidence, item.semanticOutput))),
      ]);
      const warrant = plain(state);
      for (const key of ['id', 'purpose', 'risk_level', 'evidence_ref', 'expected_hash', 'status', 'expires_at']) {
        assert.equal(String(warrant[key]), String(item.warrant[key]), `${item.warrant.id}: ${key}`);
      }
      assert.deepEqual(warrant.requirements, item.warrant.requirements);
      return { warrant, transactions };
    })),
  ]);
  assert.equal(Number(chainId), 4221);
  assert(Buffer.from(code, 'base64').equals(source), 'Deployed source bytes differ');
  const [low, high] = verifiedCases;
  assert.equal(low.warrant.evidence_ref, high.warrant.evidence_ref);
  assert.equal(low.warrant.expected_hash, high.warrant.expected_hash);
  assert.deepEqual(low.warrant.requirements, high.warrant.requirements);
  assert.notEqual(low.warrant.purpose, high.warrant.purpose);
  assert.notEqual(low.warrant.risk_level, high.warrant.risk_level);
  console.log(JSON.stringify({
    observedAt: new Date().toISOString(), classification: 'PASS', mode: 'public read-only',
    contractAddress: config.contractAddress, chainId: 4221, sourceSha256: sha256(source),
    deployedCodeMatchesSource: true, fixtureLength: fixture.length, fixtureKeccak: keccak256(fixture).slice(2),
    bundleManifestVerified: manifestVerified, deployment: deployed, cases: verifiedCases,
    existingWritesVerified: 10, newTransactionsSubmitted: 0,
  }, null, 2));
})().catch(error => {
  console.error(JSON.stringify({ classification: 'FAIL_OR_RPC_BLOCKED', mode: 'read-only', message: error.message }));
  process.exitCode = 1;
});
