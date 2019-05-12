var router = require('express').Router()

router.use(require('./blocks'))
router.use(require('./users'))

module.exports = router