var fs = require('fs');
var path = require('path');
var Q = require('q');

var Base = require('./base.js');

var args = process.argv.slice(2);
var file = args[0];
var mode = args[1];
Q.longStackSupport = true;
if (file) {
    importFile(file);
}

function importFile(file) {
    if (fs.statSync(file).isDirectory()) {
        fs.readdirSync(file).forEach(function(name) {
            if (!Base.str.endsWith(name, '.xlsx')) return;
            importApp(path.join(file, name), mode);
        })
    } else {
        importApp(file, mode);
    }
}


function importApp(file, mode) {
    mode = mode || 'image';
    var App = require('../models/App.js')
    Q(file).then(Base.excel.parse).then(Base.image.dump).then(function (app) {
        if (mode == 'image') {
            return 'image mode done'
        }
        return Q.nfcall(App,app);
    }).then(function(app) {
        console.log(app)
    }).catch(function(err) {
        console.log(err)
    })
}


if (require.main == module) {
    importFile('../test/app-data1');
}