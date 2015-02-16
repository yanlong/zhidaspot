module.exports = function (req, res, next) {
    req.user = {
        uid: req.session.uid,
    }
    next();
}