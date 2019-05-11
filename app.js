// Configure express and application
var express = require('express'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    app = express(),
    passport = require('passport')

app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

// Enviornment management
const isProduction = process.env.NODE_ENV === 'production'
const PORT = isProduction ? 80 : 8000;

app.use(require('morgan')('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Configure and connect to database
require('./db')
app.use(passport.initialize());
app.use(passport.session());
app.use(session({ secret: 'conduit', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }))

app.use(require('method-override')())
app.use('/public', express.static(__dirname + '\\public'))

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

// Listen on port 8000 or port 80 based on deployment mode
app.listen(PORT, function() {
    console.log('app listening on port ' + PORT)
})