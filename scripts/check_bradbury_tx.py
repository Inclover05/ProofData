import os
from dotenv import load_dotenv
from genlayer_py.client.genlayer_client import GenLayerClient

load_dotenv()
client = GenLayerClient("https://rpc-bradbury.genlayer.com")
receipt = client.get_transaction_receipt("0x5a7414d00479ff2e5a7418eb1589a0a45405f83dcc09ef7e3ebf7bd26a3b052e")
print(receipt)
