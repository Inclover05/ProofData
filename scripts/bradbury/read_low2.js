const gl = require("../../frontend/node_modules/genlayer-js");
const client = gl.createClient({ chain: gl.chains.testnetBradbury, endpoint: "https://rpc-bradbury.genlayer.com" });
async function main() {
    const res = await client.readContract({ address: "0x31cD191D9fa7Ee89D770207301A0801207E06A4A", functionName: "get_warrant", args: ["low-008"] });
    console.log("State:", res.status);
}
main().catch(console.error);
