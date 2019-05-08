mongoose = require('mongoose')

var isProduction = process.env.NODE_ENV === 'production'

// Initialize models
require('./models/Post')
require('./models/User')
require('./config')
require('./config/passport')

// Initialize Passport
//require('./config')

// Connect to database
if (isProduction) {
    mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
    .then(() => {
        console.log('Database connection established')
    })
    .catch(err => {
        console.error('Failed to connect to database!\n' + err)
    })
} else {
    mongoose.connect('mongodb://localhost:27017/TCS-Admin', { useNewUrlParser: true })
    .then(() => {
        console.log('Database connection established')
    })
    .catch(err => {
        console.error('Failed to connect to database!\n' + err)
    })
    mongoose.set('debug', true)
}