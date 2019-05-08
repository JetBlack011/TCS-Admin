var express = require('express')
var router = express.Router();
var mongoose = require('mongoose')
var User = mongoose.model('User')
var auth = require('./auth');

// Public-facing API routes
router.use(require('./api'));

/*
// Home page route
router.get('*', function (req, res) {
    if (req.user) {
        next('/users/login')
    } else {
        User.findById(req.payload.id)
        .then((user) => {
            res.render('index.html', {user: user})
        })
    }
})
*/

module.exports = router;