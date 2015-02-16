module.exports = function (req, res, next) {
    if (/^\/internal/.test(req.path) && !req.user.uid) {
        return next(new Error('Auth failed.'));
    };
    next();
}