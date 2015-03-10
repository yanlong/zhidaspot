var Models = require('../library/models.js');
var config = require('../conf');
var SeedRand = require('seed-rand')
module.exports = function (req, res, next) {
    req.query.appid = req.query.appid || config.app.defaultAppid;
    if (req.query.appid) {
        Models.App.findById(req.query.appid).populate('news product promotion contact attracting company').exec(function (err, doc) {
            if (err) return next(err);
            req.data = doc;
            req.data.company.images = genImageUrl(doc._id);
            next();
        })
    } else {
        next();
    }
}

function genImageUrl(id) {
    return new SeedRand(id, 40).batch(3,true).map(function (v) {
        return '/img/slider/'+(v+1)+'.jpg';
    });
}

if (require.main == module) {

    console.log(genImageUrl(45))
    console.log(genImageUrl(46))
    console.log(genImageUrl(47))
    console.log(genImageUrl(48))
}