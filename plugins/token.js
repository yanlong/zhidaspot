module.exports = function(req, res, next) {
    if (!req.query.appid && req.headers.referer) {
        var referer = require('url').parse(req.headers.referer);
        var referer_query = require('querystring').parse(referer.query);
        req.query.appid = referer_query.appid;
    }
    if (!req.query.appid) {
        // return next(new Error('No appid!')); // fortest
    }
    next();
};
