var http = require('http');


http.createServer(function (req, res) {
    // return res.end(''+(res instanceof require('stream').Writable));
    // return res.end(''+(res instanceof http.ServerResponse));
    return res.end(require('util').inspect(res.constructor));
    var count = 5;
    ~function loop() {
        if (--count) {
            res.cork();
            res.write('ffffffffffff<br>');
            // res.uncork();
            // res.cork();
            res.write('ffffffffffff<br>');
            // res.uncork();
            // res.cork();
            res.write('ffffffffffff<br>');
            // res.uncork();
            setTimeout(loop, 1000);
        } else {
            res.end();
        }
    }();
}).listen(8303);