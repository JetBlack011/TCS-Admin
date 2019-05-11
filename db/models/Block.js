var mongoose = require('mongoose')
var blockSchema = new mongoose.Schema({
    url: String
}, {timestamps: true})
module.exports = mongoose.model('Block', blockSchema)