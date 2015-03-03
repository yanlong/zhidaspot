var fs = require('fs');
function get(src, quality, width, height) {
    if (!src) {
      return null;
   }
   quality = quality || 100;
   width = width || 320;
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

function dumpImage(url, callback) {
   callback = callback || function() {};
   var src = require('../library/Timg.js').get(url);
   var file = md5(url);
   var srcFile = '../public/img/upload/' + file + '.jpg';
   var destFile = '/img/upload/' + file + '.jpg';
   if (fs.existsSync(srcFile) && fs.statSync(srcFile).size > 1e3) {
      return callback(null, destFile);
   }
   var req = require('http').get(src, function(res) {
      res.pipe(fs.createWriteStream(srcFile));
      res.on('end', function() {
         callback(null, destFile);
      });
   });
   req.on('error', callback);
}
exports.get = get;
exports.dump = dumpImage;


if (require.main == module) {
      // test
   var file = 'http://d3.freep.cn/3tb_150301085516jn43545950.jpg';
   dumpImage(file);
}