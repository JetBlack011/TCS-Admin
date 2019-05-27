var mongoose = require('mongoose')

var clientSchema = new mongoose.Schema({
    note: String,
    blocks: [{
        url: String,
        timestamp: Date
    }],
    tabs: [Object],
    history: [Object],
    ips: [String],
}, {timestamps: true})
module.exports = mongoose.model('Client', clientSchema)