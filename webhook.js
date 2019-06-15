const isProduction = process.env.NODE_ENV === 'production'

var secret = isProduction ? process.env.GIT_SECRET : require('./secret').gitSecret
var repo = '/home/pi/TCS-Admin'

var http = require('http')
var crypto = require('crypto')

const exec = require('child_process').exec

function log(msg) {
    console.log(`[*] Webhook: ${msg}`)
}

http.createServer(function (req, res) {
    req.on('data', function(chunk) {
        log("Request recieved")
        let sig = "sha1=" + crypto.createHmac('sha1', secret).update(chunk.toString()).digest('hex')

        if (req.headers['x-hub-signature'] == sig) {
            log("Pulling update...")
            exec('cd ' + repo + ' && git pull')
        }
    });

    res.end()
}).listen(3000)

log("Listening on port 3000")
