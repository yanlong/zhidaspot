var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('underscore');
var CounterSchema = Schema({
    _id: String,
    seq: {
        type: Number,
        default: 0
    },
})
var Counter = mongoose.model('Counter', CounterSchema);

var NewsSchema = Schema({
    _id: Number,
    title: String,
})

var UserSchema = Schema({
    _id: Number,
    uname: String,
    password: String,
})

var ProductSchema = Schema({
    _id: Number,
    name: String,
})

var AppSchema = Schema({
    _id: Number,
    name: String,
    news: [{
        type: Number,
        ref: 'News'
    }],
    products: [{
        type: Number,
        ref: 'Product',
    }]
})

_.each({
    User: UserSchema,
    App: AppSchema,
    News: NewsSchema,
    Product: ProductSchema
}, function(schema, key) {
    schema.pre('save', function(next) {
        var doc = this;
        Counter.findByIdAndUpdate(key, {
            $inc: {
                seq: 1
            }
        }, function(err, counter) {
            if (err) return next(err);
            if (counter == null) {
                return new Counter({
                    _id: key,
                }).save(function(err) {
                    doc._id = 0;
                    next();
                })
            }
            doc._id = counter.seq;
            next();
        });
    });
})


module.exports = {
    User: mongoose.model('User', UserSchema),
    App: mongoose.model('App', AppSchema),
    News: mongoose.model('News', NewsSchema),
    Product: mongoose.model('Product', ProductSchema),
    Counter: Counter,
}