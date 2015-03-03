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

console.log(get('http://d3.freep.cn/3tb_150301085516jn43545950.jpg'))