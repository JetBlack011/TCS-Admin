// Configure express and application
var express = require('express'),
    session = require('cookie-session'),
    bodyParser = require('body-parser'),
    app = express(),
    wss = require('./wss'),
    passport = require('passport')

function log(msg) {
    console.log(`[*] App: ${msg}`)
}

// Enviornment management
const isProduction = process.env.NODE_ENV === 'production'
const HTTP_PORT = 8000;
const WSS_PORT = 8080;
const secret = isProduction ? process.env.SECRET : 'secret'

// Configure rendering middleware
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

// Configure request logging
app.use(require('morgan')(isProduction ? 'tiny' : 'dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Serve static assets
app.use(require('method-override')())
app.use('/public', express.static(__dirname + '/public'))

// Initialize database connection and session middleware
require('./db')
app.use(session({ secret: secret, cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }))
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.user = req.user;
    next()
})

// Configure routing
app.use(require('./routes'))

// Print stack trace on error
if (!isProduction) {
    app.use(function(err, req, res) {
        console.log(err.stack)
        res.status(err.status || 500)
        res.json({'errors': {
            message: err.message,
            error: err
        }})
    })
} else {
    // No stacktraces leaked to user
    app.use(function(err, req, res) {
        res.status(err.status || 500)
        res.json({'errors': {
            message: err.message,
            error: {}
        }})
    })
}

// Configure git webhook
if (isProduction) {
    require('./webhook')
}

// Start WebSocketServer to handle/maintain incoming client connections
wss.listen(WSS_PORT, () => {
    log(`WebSocketServer listening on port ${WSS_PORT}`)
})

// Listen on port 8000 or port 80 based on environment
app.listen(HTTP_PORT, () => {
    log(`Web server listening on port ${HTTP_PORT}`)
})