var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NewsSchema = Schema({
    title: String,
})

var ProductSchema = Schema({
    name: String,
})

var AppSchema = Schema({
    id: Number,
    name: String,
    news:[{
        type: Schema.Types.ObjectId,
        ref: 'News'
    }],
    products:[{
        type: Schema.Types.ObjectId,
        ref: 'Product',
    }]
})



AppSchema.methods.speak = function () {
    console.log(this.name)
}
module.exports = {
    App: mongoose.model('App', AppSchema),
    News: mongoose.model('News', NewsSchema),
    Product: mongoose.model('Product', ProductSchema),
}