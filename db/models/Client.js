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

const Client = mongoose.model('Client', clientSchema)
var pipeline = [{
    $match: {
        $and: [
            { "updateDescription.updateFields.isAlive": { $exists: true }},
            { operationType: "update" }
        ]
    }
}]

Client.watch(pipeline, { fullDocument: 'updateLookup' })
    .on('change', data => {
        console.log(new Date(), data)
    })

module.exports = Client