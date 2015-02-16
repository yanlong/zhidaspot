var Models = require('../library/models.js');

module.exports = function (info, cb) {
    var app = new Models.App(info);
    app.save(cb);
}