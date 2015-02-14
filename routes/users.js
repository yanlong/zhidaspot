var express = require('express');
var session = require('../models/Session.js');
var models = require('../library/mongo.js');
var router = express.Router();
router.get('/', function(req, res, next) {
    res.json(typeof req.session)
    res.send('respond with a resource');
});
router.post('/login', function(req, res, next) {
    if (!req.body.uname) {
        return next(new Error('No uname'));
    }
    models.User.findOne({uname: req.body.uname, password: req.body.password}, function (err, user) {
        if (err || user == null)
            return next(new Error('No user'));
        req.session.uid = user._id;
        res.end('login done:' + user.uname);
    })

});
router.get('/login', function(req, res, next) {
    res.render('login');
})
router.get('/info', function(req, res, next) {
    models.User.findOne({_id:req.session.uid}, {_id:1, uname:1}, function (err, user){
        if (err) return next(err);
        res.json(user);
    })
});
router.get('/logout', function(req, res, next) {
    delete req.session.uid;
    res.send('logout done');
});
router.get('/register', function(req, res, next) {
    res.render('register');
})
router.post('/register', function(req, res, next) {
    try {
        if (!req.body.password || req.body.password != req.body.password_check) {
            throw new Error('Invaild password');
        }
        var user = new models.User(req.body);
        user.save(function(err) {
            res.send(err || 'success');
        })
    } catch (e) {
        res.send(e.message);
    }
})
module.exports = router;