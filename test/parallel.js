var Parallel = require('../library/Parallel.js');
var http = require('http')
var p = new Parallel();
p.task( function (done) {
    http.get('http://www.baidu.com/',done.bind(null,null)).on('error', done);
}).task( function (done) {
    http.get('http://www.baidu.com/',done.bind(null,null)).on('error', done);
}).done(function (err, results) {
    console.log(err);
}).run();