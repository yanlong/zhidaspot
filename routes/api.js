var express = require('express');
var models = require('../library/models.js');
var router = express.Router();
router.post('/app/add', function(req, res, next) {
    require('../models/App.js')(req.body, function(err) {
        if (err) return next(err);
        res.send(req.body);
    })
});

router.get('/app', function (req, res, next) {
    return res.send(typeof models.App);
})

router.get('/app/:appid/:model/:modelId/:action', function(req, res, next) {
    add(req.params.appid, req.params.model);
    function add(appId, model, modelId) {
        var cond = {};
        cond[model] = modelId;
        var m = new models[model]({title:'xxx'});
        m.save(function(err, inst) {
            cond[model] = inst._id;
            models.App.findByIdAndUpdate(appId, cond, function (err, doc) {
                res.json(doc)
            })
        })
    }
});
module.exports = router;