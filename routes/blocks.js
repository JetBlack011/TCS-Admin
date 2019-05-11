var router = require('express').Router(),
    secure = require('./secure')
    urlExists = require('url-exists')
    normalizeUrl = require('normalize-url');
    Block = require('mongoose').model('Block')

router.get('/blocks', secure, (req, res, next) => {
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

router.get('/blocks/success', secure, (req, res, next) => {
    res.render('blocks/success.html')
})

router.post('/blocks/add', secure, (req, res, next) => {
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

router.post('/blocks/delete', secure, (req, res, next) => {
    Block.deleteMany({ url: normalizeUrl(req.body.url) }).catch(next)
})

module.exports = router