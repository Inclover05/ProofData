# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
import time
from genlayer import *

class TimeCanary(gl.Contract):
    def __init__(self):
        self.last_time: int = 0

    @gl.public.write
    def record_time(self) -> None:
        self.last_time = int(time.time())

    @gl.public.view
    def get_time(self) -> int:
        return self.last_time
