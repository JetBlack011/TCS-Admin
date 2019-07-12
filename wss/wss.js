var WebSocket = require('ws'),
    url = require('url'),
    Client = require('mongoose').model('Client')

function log(msg) {
    console.log(`[*] WebSocket: ${msg}`)
}

class Handler {
    constructor() {
        this.handlers = {}
    }

    on(type, ...handlers) {
        this.handlers[type] = handlers
    }

    use(handler) {
        this.handlers.concat(flatten(handler))
    }
}

class WebSocketServer {
    constructor() {
        Handler.call()
    }

    listen(port, callback) {
        this.ws = new WebSocket.Server({ port: port }, callback)

        setInterval(this.ping, pingInterval * 1000)
        this.on('pong', (ws, args) => {
            ws.heartbeat()
        })
    
        this.wss.on('connection', (ws, req) => {
            log("Client connected")

            var query = url.parse(req.url, true).query

            Client.findByIdAndUpdate(query.id, { isAlive: true }, (err, client) => {
                if (err) return log("Error retrieving connected client from DB") 
                if (!client) {
                    log("Issuing client a new ID and storing session...")
                    Client.create({
                        ws: ws,
                        isAlive: true
                    }, (err, client) => {
                        if (err) return log("Error creating new client document")
                        ws.id = client.id
                        ws.do('id', { id: client.id })
                    })
                } else {
                    ws.id = client.id
                }
                ws.isAlive = true
            })

            ws.heartbeat = () => {
                this.isAlive = true
            }

            ws.do = (type, args) => {
                ws.send(JSON.stringify({
                    type: type,
                    args: args
                }))
            }
    
            ws.on('message', (msg) => {
                log("Message recieved")
                var data = JSON.parse(msg)

                var handlers = this.handlers[data.type]
                handlers[0](ws, data.args, handlers[1] || function () {}, this)
            })
        })
    }

    ping() {
        this.wss.clients.forEach((ws) => {
            if (!ws.isAlive) {
                Client.findByIdAndUpdate(ws.id, { isAlive: false }, err => {
                    if (err) log(`${ws.id}: Error updating client's status`)
                })
                return ws.terminate()
            }
            ws.isAlive = false
            ws.do('ping')
        })
    }

    do(type, args) {
        for (var i = 0; i < this.connections.length; ++i) {
            this.connections[i].do(type, args)
        }
    }
}

module.exports = {
    Handler: Handler,
    WebSocketServer: WebSocketServer
}