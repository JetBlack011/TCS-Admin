var handler = require('../wss').Handler()

handler.use(require('./blocks'))
handler.use(require('./commands'))

module.exports = handler