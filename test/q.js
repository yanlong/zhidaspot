var Q = require('q');
var http = require('http')

function step1 () {
    var defer = Q.defer();
    http.get('http://www.baidu.com', function (res) {
        var code = res.statusCode;
        if (code != 200) return defer.reject('error:'+1);
        console.log('success1');
        defer.resolve('success:'+1);
    })
    return defer.promise;
}

function step2 () {
    var defer = Q.defer();
    http.get('http://www.baidu.com', function (res) {
        var code = res.statusCode;
        if (code != 200) return defer.reject('error:'+2);
        console.log('success2');
        defer.resolve('success:'+2);
    })
    return defer.promise;
}
// var out = step1().then(function (body) {
//     console.log(body)
//     throw 'error'
// }).catch(function (err) {
//     console.log(err)
//     return 'x233'
// })

// out.then(function (v) {
//     console.log(v)
// }, function (err) {
//     console.log(err)
// })

// Q.all([step1(), step2()]).then(function (r1, r2) {
//     console.log(r1)
//     console.log(r2)
// }, function (err) {
//     console.log(err)
// })
function all(promises) {
    finalPromise = promises.reduce(function(prevPromise, promise, i) {
        return prevPromise.then(function(results) {
            return promise.then(function(result) {
                results.push(result);
                return results;
            })
        });
    }, Q.fcall(function () {
        return [];
    })); // a Promise that resolved with []

    return finalPromise;
}

all([step1(), step2()]).then(function (results) {
    // console.log(results)
})
