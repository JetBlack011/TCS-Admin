auth = {
    admin: (ws, args, next, wss) => {
        if (ws.isAdmin) {
            ws.do = wss.do
            next()
        }
    }
}

module.exports = auth