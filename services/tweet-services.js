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
                const err = new Error('Tweet didnt exist!')
                err.status = 404
                throw err
            }
            return cb(null, tweet)
        })
            .catch(err => cb(err))
    },
    postTweet: (req, res, next) => {

    }
}

module.exports = tweetServices