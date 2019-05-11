var router = require('express').Router(),
    passport = require('passport'),
    User = require('mongoose').model('User'),
    secure = require('./secure')

router.get('/login', (req, res, next) => {
    return res.render('login.html')
})

router.post('/login', (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) { return next(err) }
            if (!user) {
                return res.render('login.html', { err: "Invalid Email or Password!" })
            }
            req.logIn(user, (err) => {
                if (err) { return next(err) }
                return res.redirect('/')
            })
        })(req, res, next)
    }
)

router.get('/register', secure, (req, res, next) => {
    if (req.user.role === 'admin') {
        res.render('register.html')
    } else {
        if (req.user) {
            res.render('index.html')
        } else {
            res.render('login.html')
        }
    }
})

router.post('/register', secure, (req, res, next) => {
    if (req.user.role === 'admin') {
        var user = new User()

        user.role = req.body.role
        user.username = req.body.username
        user.email = req.body.email
        user.setPassword(req.body.password)

        user.save()
        .then(() => {
            return res.redirect('/register/success')
        }).catch(next)
    }
})

module.exports = router