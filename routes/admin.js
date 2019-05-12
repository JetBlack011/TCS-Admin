var router = require('express').Router(),
    auth = require('./auth')

router.get('/admin', auth.admin, (req, res, next) => {
    res.render('admin.html')
})