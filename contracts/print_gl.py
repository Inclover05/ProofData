# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
from genlayer import *

class PrintGL(gl.Contract):
    def __init__(self):
        pass
    
    @gl.public.write
    def print_it(self) -> str:
        return "run_nondet_unsafe in gl.vm: " + str(hasattr(gl.vm, "run_nondet_unsafe"))
