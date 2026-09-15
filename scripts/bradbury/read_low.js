const gl = require("../../frontend/node_modules/genlayer-js");
const client = gl.createClient({ chain: gl.chains.testnetBradbury, endpoint: "https://rpc-bradbury.genlayer.com" });

async function main() {
    const res = await client.readContract({
        address: "0x31cD191D9fa7Ee89D770207301A0801207E06A4A",
        functionName: "get_warrant",
        args: ['"low-001"']
    });
    console.log("Raw ID:", res.id);
    console.log("Starts with h:", res.evidence_ref.startsWith("h"));
}
main().catch(console.error);
