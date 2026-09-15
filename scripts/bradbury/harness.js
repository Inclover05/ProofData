const gl = require("../../frontend/node_modules/genlayer-js");
const { createClient } = gl;

const PRIVATE_KEY = process.env.ACCOUNT_PRIVATE_KEY_1;
const ACCOUNT_ADDRESS = "0x0c3bf46112f0Ea56ecFA4AD186ef0fBB869F2577";
const CONTRACT_ADDRESS = "0x31cD191D9fa7Ee89D770207301A0801207E06A4A";

// Create account
const account = gl.createAccount(PRIVATE_KEY);

const client = createClient({
    chain: gl.chains.testnetBradbury,
    endpoint: "https://rpc-bradbury.genlayer.com",
    account: account
});

async function main() {
    console.log("Reading contract to check gen_call compatibility...");
    try {
        const res = await client.readContract({
            address: CONTRACT_ADDRESS,
            functionName: "get_warrant",
            args: ["invalid"]
        });
        console.log("Read result:", res);
    } catch (e) {
        console.log("Read threw (expected for invalid warrant):", e.message.substring(0, 100));
        if (e.message.includes("Warrant not found")) {
            console.log("gen_call COMPATIBILITY: PASS (Structured response correctly handled by JS client)");
        } else {
            console.error(e);
            throw e;
        }
    }
}

main().catch(console.error);
