var Models = require('../library/models.js');
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
// var news1 = new Models.News({
//     title: 'fuck',
// })
// var product1 = new Models.Product({
//     name: 'pen',
// })
// product1.save(cb(function() {
//     news1.save(function(err) {
//         var kitty = new Models.App({
//             name: 'Zildjian',
//             news: [news1._id],
//             products: [product1._id],
//         });
//         kitty.save(function(err) {
//             if (err) // ...
//                 console.log(err);
//             else console.log('done')
//             Models.App.find({
//                 name: 'Zildjian'
//             }).populate('news products').exec(function(err, cats) {
//                 console.log(cats)
//                 console.log(cats.length)
//             })
//         });
//     })
// }))
var p = new Parallel();
_.each(Models, function(model, name) {
    if (name == 'App' || name == 'User') return;
    var inst = model({});
    console.log(inst)
    p.task(name.toLowerCase(), function(done) {
        inst.save(done)
    })
})
p.done(function(err, results) {
    if (err) return console.log(err);
    var name = 'yanlong'+ Math.floor(Math.random()*10000);
    var app = new Models.App({
        name: name,
        news: [results.news._id],
        product: [results.product._id],
        promotion: [results.promotion._id],
        contact: results.contact._id,
        attracting: results.attracting._id,
        company: results.company._id,
    })
    app.save(function(err) {
        if (err) return console.log(err);
        Models.App.findOne({
            name: name
        }).populate('news products promotion contact attracting company').exec(function(err, apps) {
            console.log(apps)
        })
    })
}).run();