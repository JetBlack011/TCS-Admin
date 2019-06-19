var mongoose = require('mongoose')

var clientSchema = new mongoose.Schema({
    ws: Object,
    isAlive: Boolean,
    name: String,
    note: String,
    blocks: [{
        title: String,
        url: String,
        timestamp: Date
    }],
    tabs: [Object],
    history: [Object],
    ips: [String],
}, {timestamps: true})

module.exports = mongoose.model('Client', clientSchema)