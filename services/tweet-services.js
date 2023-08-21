const { Tweet } = require('../models')

const tweetServices = {
    getTweets: (req, cb) => {
        Tweet.findAll({ raw: true })
            .then(tweets => cb(null, { tweets }))
            .catch(err => cb(err))
    },
    getTweet: (req, res, next) => {

    },
    postTweet: (req, res, next) => {

    }
}

module.exports = tweetServices