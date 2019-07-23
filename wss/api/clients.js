var handler = require('../wss').Handler(),
    Client = require('mongoose').model('Client')

handler.on('login', (ws, args) => {
    Client.findOne({ isAdmin: true }, (err, client) => {
        if (err) return console.log(`[*] WebSocket: Error retrieving Admin WS client: ${err}`)
        if (client.validPassword(args.password)) {
            ws.isAdmin = true
        }
    })
})

module.exports = handler