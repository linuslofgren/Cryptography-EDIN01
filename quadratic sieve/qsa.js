const fs = require('fs')
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const factorBase = (bound) => {
    // Creates a factor base with an upper bound
    let a = Array.from({length: bound}, ()=>true)
    for(let i = 2; i < Math.sqrt(bound); i++) {
        console.log("i", i)
        if(a[i]) {
            // Cross out all multiples of i from i^2
            j = i**2
            while(j < bound) {
                console.log(j)
                a[j] = false
                j += i
            }
        }
    }
    return a.flatMap((a, i) => a ? BigInt(i) : undefined).filter(a => a !== undefined).slice(2)
}

const gcd = (a, b) => {
    // Calculates Euclidean Greatest Common Denominator
    if(a == 0) {
        return b
    }
    if(b == 0) {
        return a
    }
    if(a > b) {
        return gcd(a % b, b)
    } else {
        return gcd(a, b % a)
    }
}

const factorOver = (F, r) => {
    // Factors the number r over the factor base F
    let rf = Array.from({length: F.length}, ()=>0)
    if(r == 0) {
        return [false, rf]
    }
    let res = r
    for(let i = F.length-1; i >= 0; i--) {
        while(res%F[i] == 0) {
            rf[i] += 1
            res = res/F[i]
        }
    }
    if(res != 1) {
        return [false, rf]
    }
    return [true, rf]
}


const toFile = (xs) => {
    let out = xs.length + " " + xs[0].length + "\n"
    out += xs.map(x => x.join(" ")).join("\n")
    fs.writeFileSync("linear_system", out)
}

const arrComp = (a, b) => {
    if(a.length != b.length) {
        return false
    }
    for (let i = 0; i < a.length; i++) {
        if(a[i] != b[i]){
            return false
        }
        
    }
    return true
}

const readFile = () => {
    const res = fs.readFileSync("solutions").toString().replaceAll(" ", "").split("\n").slice(1, -1)
    return res.map(r => [...r].map(n => Number(n)))
}

const deDup = (arr) => {
    const res = []
    for (const a of arr) {
        const s = a.oddMatrix.join("-")
        if(!res.some(r => arrComp(r.oddMatrix,s))){
            res.push(a)
        }
    }
    return res
}

const floorSqrt = (x) => { 
    // Binary search integer square root
    let right = x
    let left = 0n
    let mid; 
    while(right - left > 1) { 
          mid = (right + left) >> 1n;
          if(mid * mid > x) {
              right = mid; 
          } 
          else {
              left = mid; 
          }
    } 
    return left; 
}

const generateCandidates = (F, L, N) => {
    let candidates = []
    
    for(let k = 1n; true; k++) {
        for(let j = 1n; j < k; j++) {
            let r = floorSqrt(k*N) + j
            let rSqrd = (r**2n)%N
            let [canFactor, foF] = factorOver(F, rSqrd)
            if(canFactor) {
                candidates.push({r: r, factors: foF, oddMatrix: foF.map(v => v%2?1n:0n)})
                candidates = deDup(candidates);
                console.log("pushed", candidates.length, j, k)
                if(candidates.length >= L+10) {
                    console.log("Hit target of L+10:", L+10)
                    return candidates
                }
            }

        }
    }
    return candidates
}

const testRow = (F, N, relations, row) => {
    let lhs = 1n
    let rhs_factors = Array.from({length: F.length}, ()=>0n)
    for (let i = 0; i < row.length; i++) {
        const include = row[i];
        if(include) {
            lhs *= (relations[i].r)
            rhs_factors = relations[i].factors.map((f, i) => BigInt(f) + rhs_factors[i])
        }
        
    }
    let rhs = rhs_factors.map((f, i) => (F[i])**(f/2n)).reduce((a, c) => a*c, 1n)
    
    lhs = lhs%N
    rhs = rhs%N

    let result = 0
    if(rhs > lhs) {
        result = gcd(rhs-lhs, BigInt(N))    
    } else {
        result = gcd(lhs-rhs, BigInt(N))    
    }
    return result
}

const main = async () => {
    let N = 106565238310234107615313n
    let F = factorBase(2000)
    let L = F+10//2**10
    
    let relations = generateCandidates(F, L, N)
    
    toFile(relations.map(e => e.oddMatrix))
    console.log("Performing Gaussian Elimination")
    await exec('./gaussbin.out linear_system solutions');
    console.log("[DONE] Performing Gaussian Elimination")
    rowsToTest = readFile()

    for (const row of rowsToTest) {
        let result = testRow(F, N, relations, row)
        
        if(result != 1 && result != BigInt(N)) {
            console.log(`${result} * ${BigInt(N)/BigInt(result)} = ${N}`)
            return
        }
    }
    console.log("Failed to find factors")
}

main()