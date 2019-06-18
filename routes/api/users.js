var router = require('express').Router(),
    passport = require('passport'),
    User = require('mongoose').model('User'),
    auth = require('../auth')

function log(msg) {
    console.log(`[*] Users: ${msg}`)
}

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
                log("Login failure")
                return res.render('users/login.html', { err: "Invalid Email or Password." })
            }
            req.logIn(user, err => {
                if (err) { return next(err) }
                log("User logged in")
                res.redirect('/')
            })
        })(req, res, next)
    }
)

router.get('/forgot', (req, res) => {
    res.render('users/login.html', { msg: "Please contact your GM to reset your password." })
})

router.get('/users/logout', auth.user, (req, res, next) => {
    req.logout()
    log("User logged out")
    res.render('users/login.html', { msg: "Successfully logged out." })
})

router.get('/users/register', auth.admin, (req, res, next) => {
    res.render('users/register.html')
})

router.post('/users/register', auth.admin, (req, res, next) => {
    var user = new User()

    user.role = req.body.role
    user.email = req.body.email
    user.setPassword(req.body.password)

    user.save()
    .then(() => {
        log("New user registered")
        res.render('users/register.html', { msg: "User successfully registered." } )
    }).catch(next)
})

router.get('/users/delete', auth.admin, (req, res, next) => {
    User.find({}, (err, users) => {
        if (err) { return next(err) }
        res.render('users/delete.html', { user: req.user, users: users })
    })
})

router.post('/users/delete', auth.admin, (req, res, next) => {
    User.findOneAndDelete({ email: req.body.email }, (err, user) => {
        User.find({}, (e, users) => {
            if (e) { return next(e) }
            if (err) {
                res.render('users/delete.html', { user: req.user, users: users, err: "User was unable to be deleted." })
            }
            log(`${user.email}: User deleted`)
            res.render('users/delete.html', { user: req.user, users: users, msg: "User successfully deleted." })
        })
    })
})

router.get('/users/reset', auth.admin, (req, res) => {
    User.find({}, (err, users) => {
        if (err) { return next(err) }
        res.render('users/reset.html', { users: users })
    })
})

router.post('/users/reset', auth.admin, (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        user.setPassword(req.body.password)
        user.save()
        User.find({}, (e, users) => {
            if (e) { return next(e) }
            if (err) {
                res.render('users/reset.html', { user: req.user, users: users, err: "Password was unable to be reset." })
            }
            log(`${user.email}: Password reset`)
            res.render('users/reset.html', { user: req.user, users: users, msg: "Password successfully reset." })
        })
    })
})

module.exports = router
