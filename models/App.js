var models = require('../library/mongo.js');

module.exports = function (info, cb) {
    var app = new models.App(info);
    app.save(cb);
}