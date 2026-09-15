const gl = require("../../frontend/node_modules/genlayer-js");
const client = gl.createClient({ chain: gl.chains.testnetBradbury, endpoint: "https://rpc-bradbury.genlayer.com" });
async function main() {
    const res = await client.readContract({ address: "0x4695cD1886957715687E2Dac0355b84DcC94A62d", functionName: "test_get", args: ["https://cdn.jsdelivr.net/gh/npm/cli@328f63c72dd3d72d7cdc0ded638cd9c6a41e2f31/LICENSE"] });
    console.log("Result:", res);
}
main().catch(console.error);
