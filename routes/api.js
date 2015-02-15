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

router.all('/app/:appid/:model/:modelId/:action', function(req, res, next) {
    var args = [];
    var action = req.params.action == 'add' ? add: update;
    action(req.params.appid, req.params.model, req.params.modelId, req.body);
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
            models[model].findByIdAndUpdate(modelId, doc, function (err, inst) {
                if (err) return next(err);
                res.json(inst);
            })
        })
    }
});
module.exports = router;