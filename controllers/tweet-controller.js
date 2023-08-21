const tweetServices = require('../services/tweet-services')

const tweetController = {
    getTweets: (req, res, next) => {
        tweetServices.getTweets(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
    },
    getTweet: (req, res, next) => {
        tweetServices.getTweet(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
    },
    postTweet: (req, res, next) => {
        tweetServices.postTweet()
    }
}

module.exports = tweetController