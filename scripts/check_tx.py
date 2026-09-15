import pytest
import json
from gltest.fixtures import gl_client

@pytest.mark.asyncio
async def test_check_tx(gl_client):
    receipt = gl_client.get_transaction("0x674bf36f23e3a7969c0520272551b8e0cde95639d05f04e8fbf6307591a74f52")
    with open("receipt.json", "w") as f:
        json.dump(receipt, f, indent=2)
