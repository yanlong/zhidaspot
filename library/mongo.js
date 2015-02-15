var mongoose = require('mongoose');
var db = mongoose.connection;
var models = require('./models');


db.on('error', console.log.bind(console, 'connection error:'));
db.once('open', function(callback) {
    console.log('db connected.')
});
mongoose.connect('mongodb://10.48.222.106:8301/xxx');

module.exports = models;