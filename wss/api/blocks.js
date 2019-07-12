var handler = require('../wss').Handler()
    auth = require('../auth')

handler.on('block', auth.admin, (ws, args) => {
    ws.do('block', args)
})

handler.on('')