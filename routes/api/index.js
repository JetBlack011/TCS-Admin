var router = require('express').Router()

router.use(require('./clients'))
router.use(require('./blocks'))
router.use(require('./users'))

module.exports = router