const tweetServices = require('../../services/tweet-services')

const tweetController = {
    getTweets: (req, res, next) => {
        // tweetServices.getTweets(req, (err, data) => err ? next(err) : res.json(data))
        tweetServices.getTweets(req, (err, data) => {
            if (err) {
                return next(err)
            } 
            return res.status(200).json(data)
        })
    },
    getTweet: (req, res, next) => {
        tweetServices.getTweet(req, (err, data) => {
            if (err) {
                return next(err)
            } 
            return res.status(200).json(data)
        })
    },
    postTweet: (req, res, next) => {
        console.log(req.user)
        tweetServices.postTweet(req, (err, data) => {
            if (err) {
                return next(err)
            } 
            return res.status(200).json(data)
        })
    }

}

module.exports = tweetController