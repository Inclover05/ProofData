# { "Depends": "py-genlayer:test" }

from genlayer import *

class StorageContract(gl.Contract):
    data: str

    def __init__(self):
        pass

    @gl.public.write
    def set_data(self, value: str) -> None:
        self.data = value

    @gl.public.view
    def get_data(self) -> str:
        return self.data
