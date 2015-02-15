var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('underscore');
var BaseSchema = {
    _id: Number,
    ctime: Date,
    mtime: Date,
}

var SchemaExtend = function (source) {
    var base = _.clone(BaseSchema);
    return _.extend(base, source);
}

var CounterSchema = Schema({
    _id: String,
    seq: {
        type: Number,
        default: 0
    },
})
var Counter = mongoose.model('Counter', CounterSchema);

var NewsSchema = Schema(SchemaExtend({
    title: String,
}))

var UserSchema = Schema(SchemaExtend({
    uname: String,
    password: String,
}))

var ProductSchema = Schema(SchemaExtend({
    name: String,
}))

var AppSchema = Schema(SchemaExtend({
    name: String,
    news: [{
        type: Number,
        ref: 'News'
    }],
    products: [{
        type: Number,
        ref: 'Product',
    }]
}))

var schemas = {
    User: UserSchema,
    App: AppSchema,
    News: NewsSchema,
    Product: ProductSchema
}

var models = _.reduce(schemas, function (memo, v, k) {
    memo[k] = mongoose.model(k, v);
    return memo;
}, {})

_.each(schemas, function(schema, key) {
    schema.pre('save', function(next) {
        var doc = this;
        var now = new Date();
        doc.mtime = now;
        if (!doc.ctime) {
            doc.ctime = now;
        }
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


module.exports = models;