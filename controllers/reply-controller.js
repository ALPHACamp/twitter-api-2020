const replyServices = require('../services/reply-services')

const replyController = {
    getReplies: (req, res, next) => {
        replyServices.getReplies(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
    }
}

module.exports = replyController