var router = require('express').Router(),
    passport = require('passport'),
    User = require('mongoose').model('User'),
    auth = require('../auth')

router.get('/login', (req, res, next) => {
    if (!req.user) {
        res.render('login.html')
    } else {
        res.redirect('/')
    }
})

router.post('/login', (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) { return next(err) }
            if (!user) {
                return res.render('login.html', { err: "Invalid Email or Password!" })
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
    res.render('login.html', { msg: "Successfully logged out!" })
})

router.get('/register', auth.admin, (req, res, next) => {
    res.render('register.html')
})

router.post('/register', auth.admin, (req, res, next) => {
    var user = new User()

    user.role = req.body.role
    user.username = req.body.username
    user.email = req.body.email
    user.setPassword(req.body.password)

    user.save()
    .then(() => {
        res.redirect('/register/success')
    }).catch(next)
})

module.exports = router