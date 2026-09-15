import pytest
import asyncio
import os
import hashlib
from eth_account import Account
from gltest.fixtures import gl_client, default_account

@pytest.mark.asyncio
async def test_deploy_canonical(gl_client):
    # Checksum computation
    with open("contracts/reliance_warrant.py", "rb") as f:
        code_bytes = f.read()
    code_str = code_bytes.decode('utf-8')
    checksum = hashlib.sha256(code_bytes).hexdigest()
    print("Contract checksum:", checksum)
    
    # Use a specific local account for deployment
    account = Account.create()
    print("Generated Deployer Address:", account.address)
    
    # Funding
    print("Funding account...")
    gl_client.fund_account(account.address, 10**18)
    
    print("Estimating fees...")
    fees = gl_client.estimate_transaction_fees()
    print("Fees estimate:", fees)
    
    print("Deploying canonical contract to Studio-dev...")
    tx_hash = gl_client.deploy_contract(code_str, account=account, fees=fees)
    print("Deployment transaction hash:", tx_hash)
    
    print("Waiting for finalization...")
    receipt = gl_client.wait_for_transaction_receipt(tx_hash, wait_until='finalized')
    
    contract_addr = receipt['data']['contract_address']
    print("\n=================================")
    print("CANONICAL DEPLOYMENT SUCCESS")
    print("Network: Studio-dev")
    print("Contract Address:", contract_addr)
    print("Checksum:", checksum)
    print("=================================")
    
    # Save manifest info
    manifest_path = "docs/STUDIO_DEV_DEPLOYMENT_MANIFEST.md"
    with open(manifest_path, "w") as f:
        f.write(f"# Studio-Dev Deployment Manifest\n\n")
        f.write(f"- Network: Studio-dev\n")
        f.write(f"- Chain ID: 61997\n")
        f.write(f"- RPC: https://studio-dev.genlayer.com/api\n")
        f.write(f"- Contract source checksum: {checksum}\n")
        f.write(f"- Deployment transaction: {tx_hash}\n")
        f.write(f"- Contract address: {contract_addr}\n")
        f.write(f"- Fee profile/version: RC measured estimate\n")
    print(f"Manifest written to {manifest_path}")

