const gl = require("../../frontend/node_modules/genlayer-js");
const { createClient } = gl;

const PRIVATE_KEY = "0x" + process.env.ACCOUNT_PRIVATE_KEY_1;
const CONTRACT = "0x31cD191D9fa7Ee89D770207301A0801207E06A4A";

const account = gl.createAccount(PRIVATE_KEY);
const client = createClient({
    chain: gl.chains.testnetBradbury,
    endpoint: "https://rpc-bradbury.genlayer.com",
    account: account
});

const EVIDENCE_REF = "https://raw.githubusercontent.com/npm/cli/328f63c72dd3d72d7cdc0ded638cd9c6a41e2f31/LICENSE";
const HASH = "d31880ae9181571d18323e1817597e4dcc2d5fb312920a662d1696bb9d7ae0ac";

async function doFlow(risk) {
    const wId = `warrant-${risk.toLowerCase()}-${Date.now()}`;
    console.log(`\n--- STARTING FLOW FOR ${risk} ---`);
    console.log(`Creating warrant ${wId}...`);
    
    let createTx = await client.writeContract({
        address: CONTRACT,
        functionName: "create_warrant",
        args: [
            wId,
            EVIDENCE_REF,
            HASH,
            risk === "LOW" ? "Use this evidence for an internal research summary." : "Use this evidence to authorize an autonomous treasury allocation of significant value.",
            risk,
            [],
            1893456000
        ],
        value: 10000000000000000n
    });
    console.log(`Create tx: ${createTx}`);
    
    await new Promise(r => setTimeout(r, 10000));
    let w = await client.readContract({ address: CONTRACT, functionName: "get_warrant", args: [wId] });
    console.log("State:", w.status);
    
    console.log("Retrieving and validating...");
    let rvTx = await client.writeContract({
        address: CONTRACT,
        functionName: "retrieve_and_validate",
        args: [wId, Math.floor(Date.now() / 1000)],
        value: 10000000000000000n
    });
    console.log(`RV tx: ${rvTx}`);
    await new Promise(r => setTimeout(r, 10000));
    w = await client.readContract({ address: CONTRACT, functionName: "get_warrant", args: [wId] });
    console.log("State after RV:", w.status);
    
    if (w.status !== "PENDING_AI") {
        console.log("Failed to reach PENDING_AI");
        return;
    }
    
    console.log("Adjudicating...");
    let adjTx = await client.writeContract({
        address: CONTRACT,
        functionName: "adjudicate",
        args: [wId],
        value: 10000000000000000n
    });
    console.log(`Adj tx: ${adjTx}`);
    await new Promise(r => setTimeout(r, 15000));
    w = await client.readContract({ address: CONTRACT, functionName: "get_warrant", args: [wId] });
    console.log(`FINAL VERDICT FOR ${risk}:`, w.status);
}

async function main() {
    await doFlow("LOW");
    await doFlow("HIGH");
}
main().catch(console.error);
