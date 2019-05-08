var mongoose = require('mongoose')
var postScemha = new mongoose.Schema({ title: String, body: String, date: String, author: String })
module.exports = mongoose.model('Post', postScemha)