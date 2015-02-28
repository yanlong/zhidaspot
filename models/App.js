var Models = require('../library/models.js');
var _ = require('underscore');
var Parallel = require('../library/Parallel');
module.exports = function(info, cb) {
    var p = new Parallel();
    var app = {};
    _.each(Models, function(Model, name) {
        name = name.toLowerCase();
        if (name == 'app' || name == 'user') return;
        var tasks = [];
        if (name in {
                news: true,
                product: true,
                promotion: true
            }) {
            info[name].forEach(function(v, index) {
                p.task(name+index, function (done) {
                    new Model(v).save(function (err, doc) {
                        if (err) return done(err);
                        app[name] = app[name] || [];
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
        if (err) return console.log(err);
        var name = 'yanlong' + Math.floor(Math.random() * 10000);
        app.name = name;
        var inst = new Models.App(app)
        inst.save(function(err) {
            if (err) return console.log(err);
            Models.App.findOne({
                name: name
            }).populate('news products promotion contact attracting company').exec(function(err, apps) {
                console.log(apps)
            })
        })
    }).run();
}