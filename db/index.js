var mongoose = require('mongoose')
var isProduction = process.env.NODE_ENV === 'production'
var mongodbURI = isProduction ? process.env.MONGODB_URI : require('../secret').mongodbURI

function log(msg) {
    console.log(`[*] DB: ${msg}`)
}

// Initialize models
require('./models/Block')
require('./models/Client')
require('./models/User')
require('./config')
require('./config/passport')

// Initialize Passport
require('./config')

// Connect to database
if (isProduction) {
    mongoose.connect(mongodbURI, { useNewUrlParser: true })
    .then(() => {
        log('Connection established')
    })
    .catch(err => {
        log('Failed to connect to database!\n' + err)
        process.exit(1)
    })
} else {
    mongoose.connect(mongodbURI, { useNewUrlParser: true })
    .then(() => {
        log('Database connection established')
    })
    .catch(err => {
        log('Failed to connect to database!\n' + err)
        process.exit(1)
    })
    mongoose.set('debug', true)
}

mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)
