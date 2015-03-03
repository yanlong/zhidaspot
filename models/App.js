var Models = require('../library/models.js');
var _ = require('underscore');
var Parallel = require('../library/Parallel');
module.exports = function(info, callback) {
    var p = new Parallel();
    var app = _.clone(info);
    _.each(Models, function(Model, name) {
        name = name.toLowerCase();
        if (name == 'app' || name == 'user') return;
        var tasks = [];
        if (name in {
                news: true,
                product: true,
                promotion: true
            }) {
            app[name] = [];
            info[name].forEach(function(v, index) {
                p.task(name+index, function (done) {
                    new Model(v).save(function (err, doc) {
                        if (err) return done(err);
                        app[name].push(doc._id);
                        return done(null, doc);
                    })
                })
            })
        } else {
            p.task(name, function (done) {
                new Model(info[name]).save(function (err, doc) {
                    if (err) return done(err);
                    app[name] = doc._id;
                    return done(null, doc);
                });
            })
        }
    })
    p.done(function(err, results) {
        if (err) return callback(err);
        var inst = new Models.App(app)
        inst.save(function(err,doc) {
            if (err) return callback(err);
            Models.App.findOne({
                _id: doc._id,
            }).populate('news products promotion contact attracting company').exec(callback)
        })
    }).run();
}
