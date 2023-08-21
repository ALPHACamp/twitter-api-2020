const { User, Reply } = require('../models')

const replyServices = {
    getReplies: (req, cb) => {
        const { TweetId } = req.params
        Reply.findAll({
            where: { TweetId },
            raw: true,
            nest: true,
            order: [['createdAt', 'DESC']],
        })
            .then(replies => cb(null, { replies }))
            .catch(err => cb(err))
    }
}

module.exports = replyServices