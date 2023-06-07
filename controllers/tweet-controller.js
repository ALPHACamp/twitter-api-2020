// const tweetServices = require('../../services/restaurant-services')
const { Tweet, User } = require('../models')
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
    },
    getTweet: (req, res, next) => {
        return Tweet.findByPk(req.params.id, {
                include: User,
                nest: true,
                raw: true
        })
          .then(tweet => {
            //const isLiked = tweet.LikedUsers.some(l => l.id === req.user.id)
            if (!tweet) throw new Error("Tweet didn't exist!")
            res.json({
                tweet,
                //isLiked
            })
        }).catch (err => next(err))
    },

}
module.exports = tweetController