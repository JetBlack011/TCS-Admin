var mongoose = require('mongoose')
var blockSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        unique: true
        /*
        validate: {
            isAsync: true,
            validator: (value, isValid) => {
                const self = this;
                return self.constructor.findOne({ url: value })
                .exec((err, block) => {
                    if (err) {
                        throw err
                    } else if (block) {
                        if (self.id === block.id) {
                            return isValid(true)
                        }
                        return isValid(false)
                    } else {
                        return isValid(true)
                    }
                })
            },
            message:  'That URL is already on the Blocklist!'
        }
        */
    }
}, {timestamps: true})
module.exports = mongoose.model('Block', blockSchema)