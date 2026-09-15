import pytest
import asyncio
from eth_account import Account
from gltest.fixtures import gl_client

@pytest.mark.asyncio
async def test_canary(gl_client):
    code_str = """
class Canary:
    def __init__(self):
        self.state = 1
"""
    account = Account.create()
    gl_client.fund_account(account.address, 10**18)
    fees = gl_client.estimate_transaction_fees()
    tx_hash = gl_client.deploy_contract(code_str, account=account, fees=fees)
    receipt = gl_client.wait_for_transaction_receipt(tx_hash, wait_until='finalized')
    print("Execution Result:", receipt.get('txExecutionResultName', receipt.get('result_name', receipt.get('result'))))
    if 'data' in receipt and 'error' in receipt['data']:
        print("Error:", receipt['data']['error'])
