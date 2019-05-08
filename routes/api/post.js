var router = require('express').Router()
var mongoose = require('mongoose')
var Post = mongoose.model('Post')

router.post('/addpost', (req, res) => {
    var postData = new Post()
    postData.title = req.body.title
    postData.body = req.body.body
    postData.save()
    .catch(err => {
        res.status(400).send('Unable to save data!')
        console.error(err)
        res.redirect('/');
    })
    res.redirect('/');
})

module.exports = router