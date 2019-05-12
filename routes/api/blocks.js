var router = require('express').Router(),
    auth = require('../auth')
    urlExists = require('url-exists')
    normalizeUrl = require('normalize-url');
    Block = require('mongoose').model('Block')

router.get('/blocks', auth.user, (req, res, next) => {
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

router.get('/blocks/success', auth.user, (req, res, next) => {
    res.render('blocks/success.html')
})

router.get('/blocks/add', auth.user, (req, res, next) => {
    
})

router.post('/blocks/add', auth.user, (req, res, next) => {
    var url = normalizeUrl(req.body.url)
    console.log('Adding new block at ' + url)
    urlExists(url, (err, exists) => {
        if (exists) {
            if (err) { return next(err) }

            var block = new Block()
            block.url = url
            block.save()
            .then(() => {
                res.redirect('/blocks/success')
            }).catch(next)
        } else {
            res.render('index.html', { err: "URL Does not exist!" })
        }
    })
})

router.get('/blocks/delete', auth.user, (req, res, next) => {
    res.render('blocks/delete.html')
})

router.post('/blocks/delete', auth.user, (req, res, next) => {
    Block.deleteMany({ url: normalizeUrl(req.body.url) }).catch(next)
})

module.exports = router