var router = require('express').Router(),
    auth = require('../auth')
    Block = require('mongoose').model('Block')

router.get('/blocks', (req, res, next) => {
    Block
    .find({ })
    .exec((err, blocks) => {
        if (err) { return next(err) }
        var urls = []
        blocks.forEach((block) => {
            urls.push(block.url)
        })
        res.json(urls)
    })
})

router.get('/blocks/add', auth.user, (req, res, next) => {
    res.render('blocks/add.html')
})

router.post('/blocks/add', auth.user, (req, res, next) => {
    if (!req.body.url) {
        res.render('blocks/add.html', { err: "URL cannot be blank." })
    } else {
        var url = req.body.url.toLowerCase()
        console.log('Adding new block at ' + url)

        var block = new Block()
        block.url = url
        block.save((err, block) => {
            if (err && err.code === 11000) {
                return res.render('blocks/add.html', { err: "\"" + url + "\" is already in the Blocklist." })
            }
            res.render('blocks/add.html', { msg: "Success! \"" + url + "\" was added to Blocklist." })
        })
    }
})

router.get('/blocks/remove', auth.user, (req, res, next) => {
    res.render('blocks/remove.html')
})

router.post('/blocks/remove', auth.user, (req, res, next) => {
    if (!req.body.url) {
        res.render('blocks/remove.html', { err: "URL cannot be blank." })
    } else {
        Block.deleteMany({ url: req.body.url }, (err, data) => {
            if (err && err.code === 11000) {
                return res.render('blocks/remove.html', { err: "\"" + data.url + "\" is not in the Blocklist." })
            }
            res.render('blocks/remove.html', { msg: "Success! \"" + data.url + "\" was removed to Blocklist." })
        })
    }
})

router.get('/blocks/list', (req, res) => {
    Block
    .find({ })
    .exec((err, blocks) => {
        res.render('blocks/list.html', { blocks: blocks })
    })
})

router.get('/blocks/list/json', (req, res, next) => {
    Block
    .find({ })
    .exec((err, blocks) => {
        if (err) { return next(err) }
        var urls = []
        blocks.forEach((block) => {
            urls.push(block.url)
        })
        res.json(urls)
    })
})
module.exports = router
