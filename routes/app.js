var express = require('express');
var router = express.Router();

router.get('/app/:appid', function (req, res, next) {
    require('../library/mongo').App.findById(req.params.appid).populate('products news').exec(function (err, ret) {
        res.send(ret)
    });
})

module.exports = router;
