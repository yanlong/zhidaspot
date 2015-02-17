var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: req.data && req.data.company.name });
});

module.exports = router;
