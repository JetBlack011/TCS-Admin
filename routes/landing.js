var router = require('express').Router(),
    auth = require('./auth')

router.get('/', auth.user, (req, res) => {
    res.render('index.html')
})

module.exports = router