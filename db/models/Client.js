var mongoose = require('mongoose')
var clientSchema = new mongoose.Schema({
    note: String
}, {timestamps: true})
module.exports = mongoose.model('Client', clientSchema)