# seed-rand
Generate random number with seed.

# Usage

## Install
```
npm install seed-rand
```

## Init
```
var SeedRand = require('seed-rand');
```

## Generate numbers
```
// Create instance with a seed.
var sr = new SeedRand(88);

// Generator a random number.
sr.rand(); // 0.9830273366068241
sr.rand(); // 0.18128009577139892
sr.rand(); // 0.18505417784945166
```

## Generate numbers in specified scope
```
var sr = new SeedRand(8, 100);
sr.rand(); // 58
sr.rand(); // 12
sr.rand(); // 5
```

## Generate a batch of numbers
```
sr.batch(5); // [ 68, 45, 72, 72, 78 ], reduplicate numbers are allowed
sr.batch(5, true); // [ 98, 18, 47, 37, 66 ], reduplicate numbers are NOT allowed
```
