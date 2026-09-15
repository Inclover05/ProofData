import { Wallet } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { createClient, createAccount, chains } from '../../frontend/node_modules/genlayer-js/dist/index.js';

async function main() {
    const keystorePath = path.join(os.homedir(), '.genlayer', 'keystores', 'programmatic.json');
    const json = fs.readFileSync(keystorePath, 'utf8');
    const wallet = await Wallet.fromEncryptedJson(json, "mypassword");
    
    const account = createAccount(wallet.privateKey);
    const client = createClient({
        chain: chains.testnetBradbury, // Chain ID 4221
        endpoint: "https://rpc-bradbury.genlayer.com",
        account
    });
    
    console.log(`Public sender: ${account.address}`);
    
    const code = fs.readFileSync("../../contracts/hash_diagnostic.py", "utf8");
    console.log("Deploying hash_diagnostic.py...");
    const genlayerTxId = await client.deployContract({
        code: code,
        args: [],
        value: 0n,
        fees: 10000000000000000n
    });
    console.log(`GENLAYER TX ID: ${genlayerTxId}`);
}
main().catch(console.error);
