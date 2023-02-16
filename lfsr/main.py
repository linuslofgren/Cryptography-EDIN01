#!/usr/bin/env python3

from itertools import islice
from de_bruijn import de_bruijn
from lfsr import lfsr as lfsr
import collections
from scipy.spatial.distance import hamming
from operator import itemgetter


def sliding_window(iterable, n):
    it = iter(iterable)
    window = collections.deque(islice(it, n), maxlen=n)
    if len(window) == n:
        yield tuple(window)
    for x in it:
        window.append(x)
        yield tuple(window)


def from_poly(*orders):
    res = []
    for i in range(max(orders)):
        res.append(-1 if i+1 in orders else 0)
    return res


z_str = "0111010010011000001101010100111100101111000011010101000001011001000010100111001110110000011000110101101101000001111011011010011001111001000111100101011000101000010011111101010100011111100100010"
z_known = list(map(int, list(z_str)))
L = len(z_known)

all_combinations_z_13 = list(sliding_window(
    islice(de_bruijn([0, 0, 0, 0, 0, 0, 0, 0, -1, -1, 0, -1, -1], 2), 2**13), 13))
all_combinations_z_15 = list(sliding_window(islice(
    de_bruijn([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1], 2), 2**15), 15))
all_combinations_z_17 = list(sliding_window(islice(de_bruijn(
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0, -1], 2), 2**17), 17))

print("Searching for k_1...")
K_1 = max(
    [
        (abs(1/2-hamming(list(islice(lfsr(from_poly(1, 2, 4, 6, 7, 10, 11, 13), 2, start=u), L)), z_known)), u)
        for u in all_combinations_z_13
    ],
    key=itemgetter(0))[1]

print("Searching for k_2...")
K_2 = max(
    [
        (abs(1/2-hamming(list(islice(lfsr(from_poly(2, 4, 6, 7, 10, 11, 13, 15), 2, start=u), L)), z_known)), u)
        for u in all_combinations_z_15
    ],
    key=itemgetter(0))[1]

print("Searching for k_3...")
K_3 = max(
    [
        (abs(1/2-hamming(list(islice(lfsr(from_poly(2, 4, 5, 8, 10, 13, 16, 17), 2, start=u), L)), z_known)), u)
        for u in all_combinations_z_17
    ],
    key=itemgetter(0))[1]

z_try = islice(map(lambda l: 1 if sum(l) > 1 else 0, zip(
    lfsr(from_poly(1, 2, 4, 6, 7, 10, 11, 13), 2, start=K_1),
    lfsr(from_poly(2, 4, 6, 7, 10, 11, 13, 15), 2, start=K_2),
    lfsr(from_poly(2, 4, 5, 8, 10, 13, 16, 17), 2, start=K_3)
)), L)

print("K:", K_1, K_2, K_3)
print(f"Accuracy: {1-hamming(list(z_try), z_known):.0%}")
