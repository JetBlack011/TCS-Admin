// Configure express and application
var express = require('express'),
    session = require('cookie-session'),
    bodyParser = require('body-parser'),
    app = express(),
    passport = require('passport')

// Enviornment management
const isProduction = process.env.NODE_ENV === 'production'
const PORT = 8000;
const secret = isProduction ? process.env.SECRET : 'secret'

// Configure render middleware
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

// Configure request logging
app.use(require('morgan')(isProduction ? 'tiny' : 'dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Serve static assets
app.use(require('method-override')())
app.use('/public', express.static(__dirname + '/public'))

// Configure database and session middleware
require('./db')
app.use(session({ secret: secret, cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }))
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.user = req.user;
    next()
})

// Configure routes
app.use(require('./routes'))

// Error handlers
// Print stack trace
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

// Start WebSocketServer to handle/maintain incoming client connections
require('./wss')

// Configure git webhook
if (isProduction) {
    require('./webhook')
}

// Listen on port 8000 or port 80 based on environment
app.listen(PORT, function() {
    console.log('[*] App: Listening on port ' + PORT)
})