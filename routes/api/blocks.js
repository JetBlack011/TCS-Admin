var router = require('express').Router(),
    auth = require('../auth')
    Block = require('mongoose').model('Block')

function log(msg) {
    console.log(`[*] Blocks: ${msg}`)
}

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
        var block = new Block()
        block.url = url
        block.save((err, block) => {
            if (err && err.code === 11000) {
                return res.render('blocks/add.html', { err: `"${block.url}" is already in the Blocklist.` })
            }
            log(`Adding ${url} to the Blocklist`)
            res.render('blocks/add.html', { msg: `Success! "${block.url}" was added to Blocklist.` })
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
        Block.findOneAndDelete({ url: req.body.url }, (err, block) => {
            if (err && err.code === 11000) {
                return res.render('blocks/remove.html', { err: `"${block.url}" is not in the Blocklist.` })
            }
            log(`Removing ${block.url} from the Blocklist`)
            res.render('blocks/remove.html', { msg: `Success! "${block.url}" was removed from the Blocklist.` })
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
