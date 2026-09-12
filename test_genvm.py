import genlayer.py.types
from genlayer import *

def check():
    print("message:", dir(gl.message))
    print("gl:", dir(gl))
    try:
        print("block:", dir(gl.block))
    except:
        pass
check()
