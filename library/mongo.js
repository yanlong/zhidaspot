var print = console.log
var mongoose = require('mongoose');
var db = mongoose.connection;
var models = require('./models');
db.on('error', console.log.bind(console, 'connection error:'));
db.once('open', function(callback) {
    // yay!
});
console.log('ffff')

var kitty = new models.App({
    name: 'Zildjian',
    // age: 1,
});
kitty.speak();
mongoose.connect('mongodb://10.48.222.106:8301/xxx');

kitty.save(function(err) {
    if (err) // ...
        console.log('meow');
    console.log('done')
});

models.App.find({
    name: 'Zildjian'
}, {
    name: 1,
    age:1,
    _id: 1
}, {
    // limit: 10,
    sort: 'age'
}, function(err, cats) {
    console.log(cats)
    console.log(cats.length)
})