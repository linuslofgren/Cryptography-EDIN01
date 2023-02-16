## Quadratic Sieve

Build `gaussbin.cpp` with `g++ -lstdc++ gaussbin.cpp -o gaussbin.out`.

```node
const factorsOf = require('./qsa.js')
factorsOf(106565238310234107615313n) // --> 301 862 728 273 · 353 025 492 481 = 106 565 238 310 234 107 615 313
```

## Stream Cipher Correlation Attack (lfsr)

Key to the combined linear shift register from correlation attack:
```
K1 = (1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1)
K2 = (0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0)
K3 = (0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0)
```
