var mongoose = require('mongoose');

var AppSchema = mongoose.Schema({
    id: Number,
    name: String,
})

AppSchema.methods.speak = function () {
    console.log(this.name)
}
module.exports = {
    App: mongoose.model('App', AppSchema),
}