# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
from dataclasses import dataclass
from genlayer import *

@allow_storage
@dataclass
class MinData:
    sender: Address

class MinAddress(gl.Contract):
    data: MinData

    def __init__(self):
        self.data = MinData(sender=gl.message.sender_address)

    @gl.public.view
    def get_data(self) -> MinData:
        return self.data
