const tweetServices = require('../services/tweet-service')

const tweetController = {
  getTweets: (req, res, next) => {
    tweetServices.getTweets(req, (err, data) => err ? next(err) : res.json(data.tweet))
  },
  getTweet: (req, res, next) =>{
    tweetServices.getTweet(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  createTweet: (req, res, next) =>{
    tweetServices.createTweet(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  }
}  

module.exports = tweetController