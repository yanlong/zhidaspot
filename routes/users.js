var express = require('express');
var session = require('../models/Session.js');
var models = require('../library/mongo.js');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json(typeof req.session)
  res.send('respond with a resource');
});

router.get('/login', function(req, res, next) {
  req.session.uid = req.query.uid
  res.end('login done');
});

router.get('/info', function(req, res, next) {
  res.send(req.session.uid || 'nobody');
});

router.get('/logout', function(req, res, next) {
  delete req.session.uid;
  res.send('logout done');
});

router.get('/register', function (req, res, next) {
  res.render('register');
})

router.post('/register', function (req, res, next) {
  try {
    if (!req.body.password || req.body.password != req.body.password_check) {
      throw new Error('Invaild password');
    }
    var user = new models.User(req.body);
    user.save(function (err) {
      res.send(err|| 'success');
    })
  } catch(e) {
      res.send(e.message);
  }
})

module.exports = router;