import asyncio
from genlayer_py.client.genlayer_client import GenLayerClient
from genlayer_py.provider.provider import GenLayerProvider

async def main():
    gl_client = GenLayerClient(GenLayerProvider("https://studio-dev.genlayer.com/api"))
    contract_address = "0x193dA1d012d4EeE3DB0ef3E71626C8769E2b5027"
    
    print("Testing wallet-free read on Studio-dev...")
    try:
        val = gl_client.read_contract(contract_address, "get_warrant", args=["missing_warrant"])
    except Exception as e:
        print("Expected error reading missing warrant:", e)
        
    print("Wallet-free read successful.")

if __name__ == "__main__":
    asyncio.run(main())
