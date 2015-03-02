var mongoose = require('mongoose');
var db = mongoose.connection;
var models = require('./models');

var begin = new Date();
db.on('error', console.log.bind(console, 'connection error:'));
db.once('open', function(callback) {
    console.log('db connected, cost:'+(new Date - begin))
});
mongoose.connect('mongodb://'+config.app.mongodb.host+'/'+config.app.mongodb.name);

module.exports = models;