from eth_account import Account
import os

def generate_and_save():
    # Create a new account
    account = Account.create()
    
    # Check if .env exists to append or create
    mode = 'a' if os.path.exists('.env') else 'w'
    with open('.env', mode) as f:
        f.write(f"\nACCOUNT_PRIVATE_KEY_1={account.key.hex()}\n")
        
    print(f"Address: {account.address}")

if __name__ == "__main__":
    generate_and_save()
