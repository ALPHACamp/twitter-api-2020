const { Tweet } = require('../models')

const tweetServices = {
    getTweets: (req, cb) => {
        Tweet.findAll({ raw: true })
            .then(tweets => cb(null, { tweets }))
            .catch(err => cb(err))
    },
    getTweet: (req, cb) => {
        const { id } = req.params
        Tweet.findByPk(id, { raw: true }).then(tweet => {
            if (!tweet) {
                const err = new Error('推文不存在！')
                err.status = 404
                throw err
            }
            return cb(null, { tweet })
        })
            .catch(err => cb(err))
    },
    postTweet: (req, cb) => {
        // const { UserId } = req.user
        // 因應登入機制相關問題，暫時使用固定的UserId
        const UserId = 3
        const { description } = req.body
        if (!UserId) throw new Error('用戶不存在！')
        if (!description) throw new Error('內容不可空白')
        return Tweet.create({ description, UserId })
            .then(newTweet => cb(null, { tweet: newTweet }))
            .catch(err => cb(err))
    }
}

module.exports = tweetServices