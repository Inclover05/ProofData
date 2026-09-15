const gl = require("../../frontend/node_modules/genlayer-js");
const client = gl.createClient({ chain: gl.chains.testnetBradbury, endpoint: "https://rpc-bradbury.genlayer.com" });
async function main() {
    const res = await client.readContract({ address: "0x31c59f16F805445A7571a5Bc90F471C2A5323aed", functionName: "get_nondet", args: [] });
    console.log("nondet:", res);
}
main().catch(console.error);
