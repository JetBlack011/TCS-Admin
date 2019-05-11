var router = require('express').Router(),
    secure = require('./secure')

router.use(require('./blocks'))
router.use(require('./users'))
router.use('*', secure, require('./404'))

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