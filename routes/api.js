var express = require('express');
var router = express.Router();

router.post('/app/add', function(req, res, next) {
    require('../models/App.js')(req.body,function (err) {
        if (err) return next(err);
        res.send(req.body);
    })
  // res.send(req.body);
});

module.exports = router;
