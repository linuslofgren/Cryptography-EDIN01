#!/usr/bin/env python3

from collections import deque
from operator import mul
from itertools import starmap, islice

def de_bruijn(taps, characteristic):
    """Generate de Bruijn sequence via a nonlinear LFSR
    
    taps -- list of taps (length decides LFSR length) with output to the right
    [-c1, ..., -cL] --> s_j
    """
    start = [1]+[0]*(len(taps)-1)
    register = deque(start)
    zero_return = True
    
    while True:
        if zero_return:
            zero_return = False
            yield 0
            continue
        
        register.appendleft(sum(starmap(mul, zip(register, taps))) % characteristic)

        yield register.pop()
        zero_return = list(register) == start

# # de Bruijn over Z_10 via the mapping 5*Z_2+Z_5 --> Z_10
# for n, m in islice(zip(de_bruijn([0,0,-1,-1], 2), de_bruijn([0,-4,-4,-2], 5)), 10003):
#     print(5*n+m, end='')

# print()