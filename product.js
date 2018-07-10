var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ProductSchema = new Schema({
    title: String,
    content: Number,
    visibility: String,
    photo: String,//photo url
});
module.exports = mongoose.model('Product', ProductSchema);