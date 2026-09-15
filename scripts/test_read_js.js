const { createClient, chains } = require("genlayer-js");

async function main() {
    const client = createClient({
        chain: chains.studioDevnet
    });
    
    const contractAddress = "0x193dA1d012d4EeE3DB0ef3E71626C8769E2b5027";
    
    console.log("Reading contract...", contractAddress);
    try {
        const result = await client.readContract({
            address: contractAddress,
            functionName: "get_warrant",
            args: ["missing_warrant"]
        });
        console.log("Result:", result);
    } catch (err) {
        console.log("Error:", err.message);
    }
}
main();
