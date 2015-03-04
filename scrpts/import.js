var xlsx = require('node-xlsx');
var util = require('util');
var _ = require('underscore');
var fs = require('fs');
var path = require('path');
var Parallel = require('../library/Parallel.js');
global.config = require('../conf')

var args = process.argv.slice(2);
var file = args[0];
var mode = args[1];

if (fs.statSync(file).isDirectory()) {
    fs.readdirSync(file).forEach(function (name) {
        if (!endsWith(name, '.xlsx')) return;
        importApp(path.join(file,name));
    })
} else {
    importApp(file);
}

function importApp(file) {
    var obj = xlsx.parse(file);

    var appData = obj[0]['data'][1];
    var productData = obj[1]['data'].slice(1);
    var newsData = obj[2]['data'].slice(1);
    var promotionData = obj[3]['data'].slice(1);

    var app = {};
    var news = [];
    var product = [];
    var company = {};
    var contact = {};
    var promotion = [];
    var attracting = {};

    app.news = news;
    app.product = product;
    app.company = company;
    app.contact = contact;
    app.promotion = promotion;
    app.attracting = attracting;

    app.style = {};

    app.name = company.name = appData[0];
    app.style.bgImage = appData[1];
    company.address = appData[2];
    contact.tel = appData[3];
    contact.qq = appData[4];
    contact.images = parseImages(appData[5]);
    company.main = appData[6];
    attracting.purpose = appData[7];
    attracting.support = appData[8];
    attracting.images = parseImages(appData[9]);
    company.intro = appData[10];
    company.introImage = appData[11];
    company.images = parseImages(appData[12]);

    productData.forEach(function(v) {
        product.push({
            name: v[0],
            logo: v[1],
            spec: v[2],
            detail: v[3],
            images: parseImages(v[4]),
        })
    })

    newsData.forEach(function(v) {
        var postDate = new Date(1900, 0, v[1] - 1);
        news.push({
            title: v[0],
            postDate: util.format('%d/%d/%d', postDate.getFullYear(), postDate.getMonth() + 1, postDate.getDate()),
            content: v[2],
            images: parseImages(v[3]),
        })
    })
    promotionData.forEach(function(v) {
            promotion.push({
                name: v[0],
                time: v[1],
                qualification: v[2],
                detail: v[3],
                images: parseImages(v[4]),
            })
        })
        // console.log(JSON.stringify(app));
    var App = require('../models/App.js')
    var p = new Parallel();
    var dump = function(src, quality, width, height, callback) {
        p.task(function(done) {
            require('../library/Timg.js').dump(src, quality, width, height, function(err, file) {
                console.log(file)
                callback(err, file);
                done(err, file);
            });
        })
    }


    tree(app, function(value, key, obj) {
        if (key in {
                images: true,
                introImage: true,
                logo: true,
                bgImage: true,
            }) {
            if (_.isArray(value)) {
                value.forEach(function(v, index) {
                    dump(v, 100, 400, 320, function(err, file) {
                        value[index] = file;
                    })
                })
            } else {
                dump(value, 100, 400, 1000, function(err, file) {
                    obj[key] = file;
                })
            }
        }
    })

    p.done(function(err, results) {
        if (err) return console.log(err)
        if (mode == 'image') {
            return;
        }
        App(app, function(err, doc) {
            if (err) return console.log(err)
            console.log(util.inspect(doc._doc, {
                depth: null
            }))
        });
    }).run();
}

function parseImages(content) {
    content = content || '';
    var lines = content.split('\r\n');
    var images = [];
    var reg = /http:\/\/.*\.(jpg|png)/;
    lines.forEach(function(v) {
        if (reg.test(v)) {
            images.push(v.match(reg)[0])
        }
    })
    return images;
}


function tree(obj, proc) {
    if (typeof obj !== 'object') throw new Error('invalid parameter');
    for (var key in obj) {
        var value = obj[key];
        if (_.isObject(value) && !_.isArray(value)) {
            tree(value, proc);
        } else if (_.isArray(value) && _.isObject(value[0])) {
            tree(value, proc);
        } else {
            proc(value, key, obj);
        }
    }
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}