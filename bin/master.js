/**
 * Module dependencies.
 */
global.config = require('../conf');
global.logger = require('../models/Logger');

var cluster = require('cluster');
cluster.setupMaster({
    exec: 'bin/worker'
})

var restartHistory = [];
var restartLimit = 10;
var restartDuring = 60000;
var restartLimitCheck = function() {
    var time = Date.now();
    var len = restartHistory.push(time);
    if (len > restartLimit) {
        restartHistory = restartHistory.slice(restartLimit * -1);
        len = restartLimit;
        if (restartHistory[len - 1] - restartHistory[0] < restartDuring) {
            // Restart too often
            logger.fatal('Restart workers too often!!! Master shutdown!!!');
            process.exit(1);
        }
    }
};

function forkOne() {
    var worker = cluster.fork();
    logger.info('Start worker process: ' + worker.process.pid);
    worker.on('message', function(msg) {
        if (msg.action == 'suicide') {
            forkOne();
            restartLimitCheck();
        }
    })
}
var workers = config.app.workers || require('os').cpus().length;
for (var i = 0; i < workers; i++) {
    forkOne();
}
cluster.on('exit', function(worker, code, signal) {
    logger.warn('worker ' + worker.process.pid + ' died');
    if (!hasWorker()) {
        logger.warn('master '+process.pid+' died');
        process.exit();
    }
});

function eachWorker(callback) {
    for (var id in cluster.workers) {
        callback(cluster.workers[id]);
    }
}

function hasWorker() {
    for (var id in cluster.workers) {
        return true;
    }
    return false;
}

process.on('SIGHUP', function() {
    eachWorker(function (worker) {
        worker.send('stop');
    })
    logger.info('[SIGHUP] Stopping workers');
});

process.on('SIGUSR1', function() {
    eachWorker(function (worker) {
        worker.send('stop');
    })
    logger.info('[SIGUSR1] Stopping workers');
});
