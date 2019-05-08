var mongoose = require('mongoose')
var router = require('express').Router()
var passport = require('passport')
var User = mongoose.model('User')
var auth = require('../auth')

router.get('/user', auth.required, function(req, res, next){
    User.findById(req.payload.id)
    .then(function(user){
        if (!user){ return res.sendStatus(401) }

        return res.json({user: user.toAuthJSON()})
    }).catch(next)
})

router.put('/user', auth.required, function(req, res, next){
    User.findById(req.payload.id)
    .then(function(user){
        if (!user){ return res.sendStatus(401) }

        if (typeof req.body.user.username !== 'undefined') {
            user.username = req.body.user.username
        }
        if (typeof req.body.user.email !== 'undefined') {
            user.email = req.body.user.email
        }
        if (typeof req.body.user.password !== 'undefined') {
            user.setPassword(req.body.user.password)
        }

        return user.save()
        .then(function(){
            return res.json({ user: user.toAuthJSON() })
        })
    }).catch(next)
})

router.get('/users/login', (req, res) => {
    res.render('login.html')
})

router.post('/users/login', function(req, res, next){
    console.log("Login attempt: " + req.body.email + ":" + req.body.password)
    if (!req.body.email) {
        return res.status(422).json({ errors: { email: "can't be blank" } })
    }
  
    if (!req.body.password) {
        return res.status(422).json({ errors: { password: "can't be blank" } })
    }
  
    passport.authenticate('local', { session: false }, function(err, user, info) {
        if (err) { return next(err) }
    
        if (user) {
            user.token = user.generateJWT()
            return res.json({user: user.toAuthJSON()})
        } else {
            return res.status(422).json(info)
        }
    })(req, res, next)
})
  
router.post('/users', function(req, res, next){
    var user = new User()

    user.username = req.body.user.username
    user.email = req.body.user.email
    user.setPassword(req.body.user.password)

    user.save()
    .then(function(){
        return res.json({user: user.toAuthJSON()})
    }).catch(next)
})

module.exports = router