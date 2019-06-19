var WebSocket = require('ws')

function log(msg) {
    console.log(`[*] WebSocket: ${msg}`)
}

class WebSocketServer {
    constructor(port) {
        WebSocket.Server.call({ port: port })

        this.handlers = []
    
        this.on('connection', (ws) => {
            log("Client connected")
            ws.do = (type, args) => {
                ws.send(JSON.stringify({
                    type: type,
                    args: args
                }))
            }
    
            ws.on('message', (msg) => {
                log("Message recieved")
                var data = JSON.parse(msg)
                this.handlers.forEach((handler) => {
                    if (handler.type === data.type) {
                        handler.handler(data.args)
                    }
                })
            })
        })
    }

    ping() {
        this.clients.forEach((ws) => {
            ws.
        })
    }

    add(ws) {
        this.connections.push(ws)
    }

    on(type, handler) {
        this.handlers.push({
            type: type,
            handler, handler
        })
    }

    do(type, args) {
        for (var i = 0; i < this.connections.length; i++) {
            this.connections[i].do(type, args)
        }
    }
}