var router = require('express').Router(),
    passport = require('passport'),
    User = require('mongoose').model('User'),
    auth = require('../auth')

router.get('/login', (req, res, next) => {
    if (!req.user) {
        res.render('users/login.html')
    } else {
        res.redirect('/')
    }
})

router.post('/login', (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) { return next(err) }
            if (!user) {
                return res.render('users/login.html', { err: "Invalid Email or Password" })
            }
            req.logIn(user, err => {
                if (err) { return next(err) }
                res.redirect('/')
            })
        })(req, res, next)
    }
)

router.get('/logout', auth.user, (req, res, next) => {
    req.logout();
    res.render('users/login.html', { msg: "Successfully logged out" })
})

router.get('/users/register', auth.admin, (req, res, next) => {
    res.render('users/register.html')
})

router.post('/users/register', auth.admin, (req, res, next) => {
    var user = new User()

    user.role = req.body.role
    user.username = req.body.username
    user.email = req.body.email
    user.setPassword(req.body.password)

    user.save()
    .then(() => {
        res.render('users/register.html', { msg: "<strong>Success</strong> User successfully registered"} )
    }).catch(next)
})

router.get('/users/delete', auth.admin, (req, res, next) => {
    User.find({ email: req.body.email })
    .remove()
    .exec(err => {
        if (err) {
            res.render('users/delete.html', { err: "User was unable to be deleted" })
        }
    })
})

module.exports = router