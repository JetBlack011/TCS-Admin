var wss = require('./wss').WebSocketServer(),
    Client = require('mongoose').model('Client')

function log(msg) {
    console.log(`[*] WebSocket: ${msg}`)
}

Client.updateMany({ isAlive: true }, { isAlive: false }, (err, res) => {
    if (err) log(`Error updating clients in DB, ${err}`)
})

wss.use(require('./api'))

module.exports = wss