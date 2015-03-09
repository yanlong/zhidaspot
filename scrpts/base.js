var xlsx = require('node-xlsx');
var util = require('util');
var _ = require('underscore');
var Q = require('q');

module.exports = {
    excel: {
        parse: parse,
    },
    image: {
        dump: dumpImages,
    },
    str: {
        endsWith: endsWith,
    }
}
function parse(file) {
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
    return app;
}

function dumpImages(app) {
    dump = require('../library/Timg.js').dump;
    var tasks = [];
    tree(app, function(value, key, obj) {
        if (key in {
                images: true,
                introImage: true,
                logo: true,
                bgImage: true,
            }) {
            if (_.isArray(value)) {
                value.forEach(function(v, index) {
                    tasks.push(dump(v, 100, 500, 320).then(function(file) {
                        console.log(file)
                        value[index] = file;
                        return file;
                    }))
                })
            } else {
                tasks.push(dump(value, 100, 500, 1000).then(function(file) {
                    console.log(file)
                    obj[key] = file;
                    return file;
                }))
            }
        }
    })
    return Q.all(tasks).then(function() {
        return app;
    });
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