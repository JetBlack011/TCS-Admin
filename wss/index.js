var WebSocketServer = require('./wss'),
    wss = new WebSocketServer(8080, 30),
    Client = require('mongoose').model('Client'),
    Block = require('Block').model('Block')

function log(msg) {
    console.log(`[*] WebSocket: ${msg}`)
}

Client.updateMany({ isAlive: true }, { isAlive: false }, (err, res) => {
    if (err) return log(`Error updating clients in DB, ${err}`)
})

Block.watch()
.on('change', () => {
    Block.find({}, (err, blocks) => {
        if (err) return log("Error collecting blocks")
        wss.do('block', { blocks: blocks })
    })
})



module.exports = wss