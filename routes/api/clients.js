var router = require('express').Router(),
    Client = require('mongoose').model('Client')

router.get('/clients/connect', (req, res) => {
    client = new Client()
    client.save((err, client) => {
        if (err) { return next(err) }
        res.send(client._id)
    })
})

router.post('/clients/:clientId/info', (req, res) => {
    
})

module.exports = router