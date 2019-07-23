var mongoose = require('mongoose')

const isProduction = process.env.NODE_ENV === 'production'
const secret = isProduction ? process.env.SECRET : 'secret'

var ClientSchema = new mongoose.Schema({
    isAlive: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    hash: String,
    salt: String,
    name: { type: String, default: "Client" },
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

ClientSchema.methods.validPassword = (password) => {
    var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
    return this.hash === hash
}

ClientSchema.methods.setPassword = (password) => {
    this.salt = crypto.randomBytes(16).toString('hex')
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
}

const Client = mongoose.model('Client', ClientSchema)

var adminClient = new Client({ isAdmin: true, isAlive: false })
adminClient.setPassword(secret)

Client.findOneAndUpdate(
    { isAdmin: true },
    adminClient,
    { upsert: true, new: true },
    (err, client) => {
        if (err) return console.log(`[*] DB: Unable to insert/update Admin WS client: ${err}`)
        console.log("[*] DB: Admin WS client inserted/updated")
    }
)

var pipeline = [{
    $match: {
        $and: [
            { "updateDescription.updateFields.isAlive": { $exists: true }},
            { operationType: "update" }
        ]
    }
}]

Client
.watch(pipeline, { fullDocument: 'updateLookup' })
.on('change', data => {
    console.log(new Date(), data)
})

module.exports = Client