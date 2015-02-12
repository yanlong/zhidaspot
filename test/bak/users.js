var express = require('express');
var session = require('../models/Session.js');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.json(typeof req.session)
  res.send('respond with a resource');
});

router.get('/login', function(req, res, next) {
  var id = Math.floor(Math.random() * 1e10);
  session[id] = {uid:req.query.uid};
  res.header('set-cookie', 'zhidaspot_session_id='+id);
  res.end('login done');
});

router.get('/info', function(req, res, next) {
  res.send(checkLogin(req) || 'nobody');
});
router.get('/logout', function(req, res, next) {
    delete  session[req.cookies.zhidaspot_session_id];
   res.send('logout done');
});

function checkLogin(req) {
    return  session[req.cookies.zhidaspot_session_id];
}
module.exports = router;
