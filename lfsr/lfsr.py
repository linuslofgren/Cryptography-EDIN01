from collections import deque
from operator import mul
from itertools import starmap, islice

def lfsr(taps, characteristic, start=None):
    """
    taps -- list of taps (length decides LFSR length) with output to the right
    [-c1, ..., -cL] --> s_j
    C(D)=1+c1D+c2D2 +···+cLDL
    """
    start = ([1]+[0]*(len(taps)-1)) if start is None else start
    register = deque(start)
    
    while True:
        register.appendleft(sum(starmap(mul, zip(register, taps))) % characteristic)
        yield register.pop()    
