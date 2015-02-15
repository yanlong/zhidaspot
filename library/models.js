var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('underscore');
var mongo = require('./mongo.js');

var BASE_ID = 1;

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
        default: BASE_ID,
    },
})
var Counter = mongoose.model('Counter', CounterSchema);

var NewsSchema = Schema(SchemaExtend({
    title: String,
    postDate: String,
    hits: Number,
    content: String,
}))

var UserSchema = Schema(SchemaExtend({
    uname: String,
    password: String,
}))

var ProductSchema = Schema(SchemaExtend({
    name: String,
    images: [String],
    spec: String,
    detail: String,
}))

var PromotionSchema = Schema(SchemaExtend({
    name: String,
    images: [String],
    time: String,
    qualificatin: String,
    detail: String,
}))

var ContactSchema = Schema(SchemaExtend({
    qq: String,
    tel: String,
}))

var AttractingSchema = Schema(SchemaExtend({
    purpose: String,
    support: String,
}))

var AppSchema = Schema(SchemaExtend({
    name: String,
    news: [{
        type: Number,
        ref: 'News'
    }],
    product: [{
        type: Number,
        ref: 'Product',
    }],
    promotion: {
        type: Number,
        ref: 'Promotion',
    },
    contact: {
        type: Number,
        ref: 'Contact',
    },
    attracting: {
        type: Number,
        ref: 'Attracting',
    }
}))

var schemas = {
    User: UserSchema,
    App: AppSchema,
    News: NewsSchema,
    Product: ProductSchema,
    Promotion: PromotionSchema,
    Contact: ContactSchema,
    Attracting: AttractingSchema,
}

var models = _.reduce(schemas, function (memo, v, k) {
    memo[k] = mongoose.model(k, v);
    // memo[k.toLowerCase()] = memo[k];
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
                }).save(function(err, counter) {
                    if (err) return next(err);
                    doc._id = counter.seq;
                    next();
                })
            }
            doc._id = counter.seq;
            next();
        });
    });
})


module.exports = models;