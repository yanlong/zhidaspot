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

router.get('/app/:appid', function (req, res, next) {
    models.App.findById(req.params.appid, function (err, doc) {
        if (err) return next(err);
        res.json(doc);
    })
})

router.all('/app/:appid/:model/:modelId', function(req, res, next) {
    var args = [];
    var map = {
        PUT: add,
        POST: update,
        GET: get,
    }
    var action = map[req.method];
    action(req.params.appid, req.params.model, req.params.modelId, req.body);
    function get(appId, model, modelId) {
        // check app and model is matched.
        var cond = {_id:appId};
        cond[model] = modelId;
        models.App.findOne(cond, function(err, inst) {
            if (err) return next(err);
            if (!inst) return next(new Error('No such '+model));
            models[model].findById(modelId, function (err, inst) {
                if (err) return next(err);
                res.json(inst);
            })
        })
    }
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
    function update(appId, model, modelId, doc) {
        // check app and model is matched.
        var cond = {_id:appId};
        cond[model] = modelId;
        models.App.findOne(cond, function(err, inst) {
            if (err) return next(err);
            if (!inst) return next(new Error('No such '+model));
            models[model].findByIdAndUpdate(modelId, doc, function (err, inst) {
                if (err) return next(err);
                res.json(inst);
            })
        })
    }
});
module.exports = router;