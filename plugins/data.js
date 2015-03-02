var Models = require('../library/models.js');
module.exports = function (req, res, next) {
    if (req.query.appid) {
        Models.App.findById(req.query.appid).populate('news product promotion contact attracting company').exec(function (err, doc) {
            if (err) return next(err);
            req.data = doc;
            next();
        })
    } else {
        next();
    }
}