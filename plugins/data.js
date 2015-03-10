var Models = require('../library/models.js');
var config = require('../conf');
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

function SeedRand(seed, mode) {
    this.seed = seed || 1;
    this.mode = mode || 1;
}

SeedRand.prototype.rand = function () {
    var x = Math.sin(this.seed) * 10000;
    this.seed += 10;
    var y = x - Math.floor(x);
    return this.mode ? Math.floor(y*this.mode) : y;
}

SeedRand.prototype.batch = function (num, unique) {
    unique = unique === undefined ? false: unique;
    if (unique && this.mode && num > this.mode) {
        throw new Error('Exceed mode limit');
    }
    var count = num;
    var map = {};
    var values = [];
    while (count) {
        var value = this.rand();
        if (unique && (value in map)) continue;
        map[value] = true;
        values.push(value);
        count--;
    }
    return values;
}


if (require.main == module) {

    console.log(genImageUrl(45))
    console.log(genImageUrl(46))
    console.log(genImageUrl(47))
    console.log(genImageUrl(48))
}