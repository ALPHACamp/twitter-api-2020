// const tweetServices = require('../../services/restaurant-services')
const { Tweet } = require('../models')
const tweetController = {
    getTweets: (req, res, next) => {
      return Tweet.findAll({
        nest: true,
        raw: true
      }).then(tweets => {
        const data = tweets.map(t => ({
          ...t,
          description: t.description.substring(0, 140)
        }))
        return res.json({
          tweets: data
        })
      })
      //  tweetServices.getTweets(req, (err, data) => err ? next(err) : res.json(data))
    }
}
module.exports = tweetController