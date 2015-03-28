var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
    var page = {
        pid: "index",
        title: "正信智慧"
      }
    res.render('home/index', page);
});
module.exports = router;