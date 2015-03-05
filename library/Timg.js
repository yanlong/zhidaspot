var fs = require('fs');
var Q = require('q');

function get(src, quality, width, height) {
   if (!src) {
      return null;
   }
   quality = quality || 100;
   width = width || 640;
   height = height || 640;
   var key = "wisetimgkey";
   var domain = 'http://tc2.baidu-1img.cn/timg?pa';
   var sec = Math.floor(Date.now() / 1000);
   var di = md5(key + sec + src);
   var src = encodeURIComponent(src);
   var url = require('util').format('%s&Imgtype=0&sec=%d&di=%s&quality=%s&size=b%d_%d&src=%s', domain, sec, di, quality, width, height, src);
   return url;
}
var crypto = require('crypto');

function md5(text) {
   return crypto.createHash('md5').update(text).digest('hex');
};

function dump(url, quality, width, height) {
   var defer = Q.defer();
   var src = require('../library/Timg.js').get(url, quality, width, height);
   var file = md5(url);
   var srcFile = '../public/img/upload/' + file + '.jpg';
   var destFile = '/img/upload/' + file + '.jpg';
   if (fs.existsSync(srcFile) && fs.statSync(srcFile).size > 1e3) {
      defer.resolve(destFile);
   } else {
      var req = require('http').get(src, function(res) {
         res.pipe(fs.createWriteStream(srcFile));
         res.on('end', function() {
            console.log('dump:'+url)
            defer.resolve(destFile);
         });
      });
      req.on('error', defer.makeNodeResolver());
   }
   return defer.promise;
}
exports.get = get;
exports.dump = dump;


if (require.main == module) {
   // test
   var file = 'http://d3.freep.cn/3tb_150301085516jn43545950.jpg';
   dump(file, 100, 50, 50).then(function(file) {
      console.log(file)
   });
}