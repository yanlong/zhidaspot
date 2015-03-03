var mongoose = require('mongoose');
var db = mongoose.connection;
var models = require('./models');

var begin = new Date();
var uri = 'mongodb://'+config.app.mongodb.host+'/'+config.app.mongodb.name;
db.on('error', console.log.bind(console, 'connection error:'));
db.once('open', function(callback) {
    console.log('db connected: '+uri+', cost:'+(new Date - begin))
});
mongoose.connect(uri);

module.exports = models;