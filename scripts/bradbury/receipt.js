const gl = require("../../frontend/node_modules/genlayer-js");
const client = gl.createClient({ chain: gl.chains.testnetBradbury, endpoint: "https://rpc-bradbury.genlayer.com" });
async function main() {
    const res = await client.getTransactionReceipt({ hash: "0x6f7deb82c5e38ac2c49afd07977ff99c41e3a67add37998001324b68d637110e" });
    console.log(JSON.stringify(res, null, 2));
}
main().catch(console.error);
