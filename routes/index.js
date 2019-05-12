var router = require('express').Router(),
    auth = require('./auth')

router.use('/', require('./landing'))
router.use(require('./api'))
router.use('*', auth.user, require('./404'))

router.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        return res.status(422).json({
            errors: Object.keys(err.errors).reduce(function(errors, key){
            errors[key] = err.errors[key].message;
    
            return errors;
            }, {})
        });
    }
    return next(err);
});

module.exports = router