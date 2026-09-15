import { Wallet, keccak256 } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { createClient, createAccount, chains } from '../../frontend/node_modules/genlayer-js/dist/index.js';

// BRADBURY CLI #402 TRANSPORT WORKAROUND
const origFetch = global.fetch;
global.fetch = async (url, options) => {
    if (options && options.body) {
        let body;
        try { body = JSON.parse(options.body as string); } catch(e){}
        if (body && body.method === "eth_estimateGas") {
            const res = await origFetch(url, options);
            const clone = res.clone();
            const data = await clone.json();
            const est = parseInt(data.result, 16);
            let safeGas = Math.ceil(est * 1.5);
            if (safeGas < 2000000) safeGas = 2000000;
            console.log(`\nDiagnostics:`);
            console.log(`  Estimated gas: ${est}`);
            console.log(`  Chosen outer gas limit: ${safeGas}`);
            console.log(`  Destination: ${body.params[0].to}`);
            console.log(`  Value: ${body.params[0].value || '0x0'}`);
            console.log(`  Calldata hash: ${keccak256(body.params[0].data)}`);
            data.result = "0x" + safeGas.toString(16);
            return new Response(JSON.stringify(data), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        } else if (body && body.method === "eth_sendRawTransaction") {
             // Print the outer EVM hash which is the response
             const res = await origFetch(url, options);
             const clone = res.clone();
             const data = await clone.json();
             console.log(`  OUTER EVM HASH: ${data.result}`);
             return res;
        }
    }
    return origFetch(url, options);
};

async function main() {
    const method = process.argv[2];
    const contract = process.argv[3];
    const warrant_id = process.argv[4];
    if (!method || !contract || !warrant_id) throw new Error("Usage: tsx send-safe-write.ts <method> <contract> <warrant_id>");

    const keystorePath = path.join(os.homedir(), '.genlayer', 'keystores', 'programmatic.json');
    const json = fs.readFileSync(keystorePath, 'utf8');
    const wallet = await Wallet.fromEncryptedJson(json, "mypassword");
    
    const account = createAccount(wallet.privateKey);
    const client = createClient({
        chain: chains.testnetBradbury, // Chain ID 4221
        endpoint: "https://rpc-bradbury.genlayer.com",
        account
    });
    
    console.log(`  Public sender: ${account.address}`);

    let args, value = 0n, fees = 10000000000000000n;
    
    if (method === "retrieve_and_validate") {
        args = [warrant_id, 0];
    } else if (method === "adjudicate") {
        args = [warrant_id];
    } else if (method === "create_warrant") {
        const riskLevel = warrant_id.includes("high") ? "HIGH" : "LOW";
        const purpose = riskLevel === "HIGH" 
            ? "Use this evidence to authorize an autonomous treasury allocation of significant value." 
            : "Use this evidence for an internal research summary.";
            
        args = [
            warrant_id,
            "https://unpkg.com/npm@10.8.1/LICENSE",
            "d31880ae9181571d18323e1817597e4dcc2d5fb312920a662d1696bb9d7ae0ac",
            purpose,
            riskLevel,
            [],
            1893456000
        ];
    } else {
        throw new Error("Unknown method");
    }

    console.log(`Sending ${method}...`);
    try {
        const genlayerTxId = await client.writeContract({
            address: contract as `0x${string}`,
            functionName: method,
            args,
            value,
            fees
        });
        console.log(`  GENLAYER TX ID: ${genlayerTxId}\n`);
    } catch (e) {
        console.error("Error:", (e as any).message);
    }
}

main().catch(console.error);
