var wss = require('./wss')

function log(msg) {
    console.log(`[*] WebSocket: ${msg}`)
}

wss.on('connection', (ws) => {
    ws.do = (type, args) => {
        ws.send(JSON.stringify({
            type: type,
            args: args
        }))
    }

    ws.on('message', (msg) => {
        var data = JSON.parse(msg)
        switch (data.type) {
            case 'greet':
                if (!data.args.id) {
                    
                }
        }
    })

    log("Connection recieved, welcoming client")
    //ws.send("hello")
    ws.ping()
})

log("Listening on port 8080")