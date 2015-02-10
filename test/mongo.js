var models = require('../library/mongo.js');
var print = console.log
var _ = require('underscore');

var cb = function (callback) {
    return function (err) {
        if (err) {
            console.log(err);
        } else {
            callback.apply(Array.prototype.slice(arguments, 1));
        }
    }
}

console.log('#### begin')

var news1 = new models.News({
    title: 'fuck',
})

var product1 = new models.Product({
    name: 'pen',
})
product1.save(cb(function () {
    news1.save(function(err) {
        var kitty = new models.App({
            name: 'Zildjian',
            news: [news1._id],
            products: [product1._id],
        });


        kitty.save(function(err) {
            if (err) // ...
                console.log(err);
            else
                console.log('done')
            models.App.find({
                name: 'Zildjian'
            }).populate('news products').exec(function(err, cats) {
                console.log(cats)
                console.log(cats.length)
            })
        });
    })
}))

