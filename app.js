// Configure express and application
var express = require('express')
var session = require('express-session')
var bodyParser = require('body-parser')
var app = express()

app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

// Enviornment management
var isProduction = process.env.NODE_ENV === 'production'

app.use(require('morgan')('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Configure and connect to database
require('./db')

app.use(require('method-override')())
app.use('/public', express.static(__dirname + '\\public'))

app.use(session({ secret: 'conduit', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }))

// Routes
app.use(require('./routes'))

// Error handlers
// Print stack trace
if (!isProduction) {
    app.use(function(err, req, res, next) {
        console.log(err.stack)
        res.status(err.status || 500)
        res.json({'errors': {
            message: err.message,
            error: err
        }})
    })
} else {
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500)
        res.json({'errors': {
            message: err.message,
            error: {}
        }})
    })
}

// Listen on port 8000
app.listen(8000, function() {
    console.log('app listening on port 8000')
})