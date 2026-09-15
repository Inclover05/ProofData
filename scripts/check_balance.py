import os
from dotenv import load_dotenv
from eth_account import Account
from web3 import Web3

load_dotenv()
priv = os.getenv("ACCOUNT_PRIVATE_KEY_1")
account = Account.from_key(priv)

print("Address:", account.address)
w3 = Web3(Web3.HTTPProvider("https://rpc-bradbury.genlayer.com"))
balance = w3.eth.get_balance(account.address)
print("Balance (GEN):", w3.from_wei(balance, 'ether'))
