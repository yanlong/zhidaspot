var models = require('../library/mongo.js');
var print = console.log
var _ = require('underscore');
var Parallel = require('../library/Parallel');
var cb = function(callback) {
    return function(err) {
        if (err) {
            console.log(err);
        } else {
            callback.apply(Array.prototype.slice(arguments, 1));
        }
    }
}
console.log('#### begin')
// var news1 = new models.News({
//     title: 'fuck',
// })
// var product1 = new models.Product({
//     name: 'pen',
// })
// product1.save(cb(function() {
//     news1.save(function(err) {
//         var kitty = new models.App({
//             name: 'Zildjian',
//             news: [news1._id],
//             products: [product1._id],
//         });
//         kitty.save(function(err) {
//             if (err) // ...
//                 console.log(err);
//             else console.log('done')
//             models.App.find({
//                 name: 'Zildjian'
//             }).populate('news products').exec(function(err, cats) {
//                 console.log(cats)
//                 console.log(cats.length)
//             })
//         });
//     })
// }))
var p = new Parallel();
_.each(models, function(model, name) {
    if (name == 'App') return;
    var inst = model({});
    console.log(inst)
    p.task(name.toLowerCase(), function(done) {
        inst.save(done)
    })
})
p.done(function(err, results) {
    if (err) return console.log(err)
    var app = new models.App({
        name: 'yanlong',
        news: [results.news._id],
        products: [results.product._id],
        promotion: results.promotion._id,
        contact: results.contact._id,
        attracting: results.attracting._id,
    })
    app.save(function(err) {
        if (err) return console.log(err);
        models.App.find({
            name: 'yanlong'
        }).populate('news products promotion contact attracting').exec(function(err, apps) {
            console.log(apps)
            console.log(apps.length)
        })
    })
}).run();