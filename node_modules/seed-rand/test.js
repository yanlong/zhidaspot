
var SeedRand = require('./index.js');

// Create instance with a seed.
var sr = new SeedRand(88);

// Generator a random number.
console.log(sr.rand()); // 0.9830273366068241
console.log(sr.rand()); // 0.18128009577139892
console.log(sr.rand()); // 0.18505417784945166

var sr = new SeedRand(8, 100);
console.log(sr.rand()); // 58
console.log(sr.rand()); // 12
console.log(sr.rand()); // 5

console.log(sr.batch(5)); // [ 68, 45, 72, 72, 78 ], reduplicate numbers are allowed
console.log(sr.batch(5, true)); // [ 98, 18, 47, 37, 66 ], reduplicate numbers are NOT allowed
