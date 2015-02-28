var xlsx = require('node-xlsx');
var util = require('util');
 
var obj = xlsx.parse(__dirname + '/data/app.xlsx');

// console.log(util.inspect(obj,{depth:null}))

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
var attracting = [];

app.news = news;
app.product = product;
app.company = company;
app.contact = contact;
app.promotion = promotion;
app.attracting = app.attracting;

app.style = {};

app.name = company.name = appData[0];
app.style.bgImage = appData[1];
company.address = appData[2];
contact.tel = appData[3];
contact.qq = appData[4];
contact.images = parseImages(appData[5]);
company.domain = appData[6];
attracting.purpose = appData[7];
attracting.support = appData[8];
attracting.images = parseImages(appData[9]);
company.intro = appData[10];
company.introImage = appData[11];
company.images = parseImages(appData[12]);

productData.forEach(function (v) {
    product.push({
        name: v[0],
        logo: v[1],
        spec: v[2],
        detail: v[3],
        images: parseImages(v[4]),
    })
})

newsData.forEach(function (v) {
    news.push({
        title: v[0],
        postDate: v[1],
        content: v[2],
        images: parseImages(v[3]),
    })
})
promotionData.forEach(function (v) {
    promotion.push({
        name: v[0],
        time: v[1],
        qualificatin: v[2],
        detail: v[3],
        images: parseImages(v[4]),
    })
})
console.log(JSON.stringify(app));

function parseImages(content) {
    content = content || '';
    var lines = content.split('\r\n');
    var images = [];
    var reg = /http:\/\/.*\.(jpg|png)/;
    lines.forEach(function (v) {
        if (reg.test(v)) {
            images.push(v.match(reg)[0])
        }
    })
    return images;
}