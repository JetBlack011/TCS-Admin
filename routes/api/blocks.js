var router = require('express').Router(),
    auth = require('../auth')
    urlExists = require('url-exists')
    normalizeUrl = require('normalize-url');
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
        res.render('blocks/add.html', { err: "URL cannot be blank" })
    } else {
        var url = normalizeUrl(req.body.url)
        urlExists(url, (err, exists) => {
            if (exists) {
                console.log('Adding new block at ' + url)
                if (err) { return next(err) }

                var block = new Block()
                block.url = urlee
                block.save((err, block) => {
                    if (err && err.code === 11000) {
                        return res.render('blocks/add.html', { err: "<strong>" + block.url + "</strong> is already in the Blocklist" })
                    }
                    res.render('blocks/add.html', { msg: "Success! <strong>" + block.url + "</strong> was added to Blocklist" })
                })
            } else {
                res.render('blocks/add.html', { err: "URL does not exist" })
            }
        })
    }
})

router.get('/blocks/remove', auth.user, (req, res, next) => {
    res.render('blocks/remove.html')
})

router.post('/blocks/remove', auth.user, (req, res, next) => {
    if (!req.body.url) {
        res.render('blocks/remove.html', { err: "URL cannot be blank" })
    } else {
        Block.deleteMany({ url: normalizeUrl(req.body.url) }, (err, data) => {
            if (err.code === 11000) {
                return res.render('blocks/remove.html', { err: "<strong>" + data.url + "</strong> is not in the Blocklist" })
            }
            res.render('blocks/remove.html', { msg: "Success! <strong>" + data.url + "</strong> was removed to Blocklist" })
        })
    }
})

router.get('/blocks/list', (req, res, next) => {
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