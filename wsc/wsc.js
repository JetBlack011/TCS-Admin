var WebSocket = require('ws')

function log(msg) {
    console.log(`[*] WebSocketClient: ${msg}`)
}

class WebSocketClient {
    constructor(url, reconnectInterval, callback) {
        this.ws = new WebSocket(url)
        this.isAlive = false
        this.ws.on('open', () => {
            this.isAlive = true
            log("Connection established")
        })
    }

    on(type, args) {

    }
}