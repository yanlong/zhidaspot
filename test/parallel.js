var Parallel = require('../library/Parallel.js');
var http = require('http')
var p = new Parallel();
p.task('task1', function (done) {
    http.get('http://www.baidu.com/',done.bind(null,null)).on('error', done);
}).task('task2', function (done) {
    http.get('http://www.baidu.com/',done.bind(null,null)).on('error', done);
}).done(function (err, results) {
    console.log(err);
}).run();