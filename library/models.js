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

var CompanySchema = Schema(SchemaExtend({
    name: {type: String, default: "公司名称"},
    address: {type: String, default: "公司地址"},
    main: {type: String, default: "主营业务"},
    intro: {type: String, default: "公司简介"},
    introImage: {type: String, default: "/img/demo-front-min.jpg"},
    images: [{type: String, default: "/img/demo-front-min.jpg"}],
}))

var NewsSchema = Schema(SchemaExtend({
    title: {type: String, default: "新闻标题"},
    postDate: {type: String, default: "发表日期"},
    hits: {type: Number, default: 0},
    content: {type: String, default: "新闻正文"},
    images: [{type: String, default: "/img/demo-front-min.jpg"}],
}))

var UserSchema = Schema(SchemaExtend({
    uname: {type: String, default: "xxx"},
    password: {type: String, default: "xxx"},
}))

var ProductSchema = Schema(SchemaExtend({
    name: {type: String, default: "产品名称"},
    logo: {type: String, default: "/img/demo-front-min.jpg"},
    images: [{type: String, default: "/img/demo-front-min.jpg"}],
    spec: {type: String, default: "产品规格"},
    detail: {type: String, default: "产品详细信息"},
}))

var PromotionSchema = Schema(SchemaExtend({
    name: {type: String, default: "活动名称"},
    images: [{type: String, default: "/img/demo-front-min.jpg"}],
    time: {type: String, default: "活动时间"},
    qualification: {type: String, default: "活动资格"},
    detail: {type: String, default: "活动详情"},
}))

var ContactSchema = Schema(SchemaExtend({
    qq: {type: String, default: "11111111"},
    tel: {type: String, default: "11111111"},
    images: [{type: String, default: "/img/demo-front-min.jpg"}],
}))

var AttractingSchema = Schema(SchemaExtend({
    purpose: {type: String, default: "公司宗旨"},
    support: {type: String, default: "加盟支持"},
    images: [{type: String, default: "/img/demo-front-min.jpg"}],
}))

var AppSchema = Schema(SchemaExtend({
    name: String,
    style: {
        bgImage:{type: String, default: "/img/demo-front-min.jpg"},
    },
    news: [{
        type: Number,
        ref: 'News'
    }],
    product: [{
        type: Number,
        ref: 'Product',
    }],
    company: {
        type: Number,
        ref: 'Company',
    },
    promotion: [{
        type: Number,
        ref: 'Promotion',
    }],
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
    Company: CompanySchema,
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
    // Add auto increment id for models.
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
    // 
    schema.post('init', function (doc) {
        _.each(doc._doc, function (v,key) {
            if (_.isString(v)) {
                doc[key] = str2html(v);
            }
        })
    })
})

function str2html(str) {
    if (str) {
        var text = str;
        // text = text.replace(/"/g, '&#34;').replace(/'/g, '&#39;');
        // text = text.replace(/</g, '&#60;').replace(/>/g, '&#62;');
        // text = text.replace(/\\/g, '&#92;').replace(/`/g, '&#96;');
        text = text.replace(/\n/g, '<br>');
        // text = text.replace(/\s/g, ' &nbsp; ');
        return text;
    }
    return '';
}

module.exports = models;
