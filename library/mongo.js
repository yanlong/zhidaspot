var print = console.log
var mongoose = require('mongoose');
var db = mongoose.connection;
db.on('error', console.log.bind(console, 'connection error:'));
db.once('open', function(callback) {
    // yay!
});
console.log('ffff')
mongoose.connect('mongodb://10.48.222.106:8301/xxx');
var CatSchema = mongoose.Schema({
    name: String,
    age: Number,
});
CatSchema.methods.speak = function() {
    console.log(this.name);
}
var Cat = mongoose.model('Cat', CatSchema);

var kitty = new Cat({
    name: 'Zildjian',
    // age: 1,
});
kitty.speak();
kitty.save(function(err) {
    if (err) // ...
        console.log('meow');
    console.log('done')
});
print(Cat.find)
Cat.find({
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