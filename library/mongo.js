var print = console.log
var mongoose = require('mongoose');
var db = mongoose.connection;
var models = require('./models');
db.on('error', console.log.bind(console, 'connection error:'));
db.once('open', function(callback) {
    // yay!
});
mongoose.connect('mongodb://10.48.222.106:8301/xxx');
console.log('ffff')
var news1 = new models.News({
    title: 'fuck',
})

news1.save(function(err) {
    var kitty = new models.App({
        name: 'Zildjian',
        news: [news1._id]
    });


    kitty.save(function(err) {
        if (err) // ...
            console.log(err);
        else
            console.log('done')
        models.App.find({
            name: 'Zildjian'
        }).populate('news').exec(function(err, cats) {
            console.log(cats)
            console.log(cats.length)
        })
    });
})