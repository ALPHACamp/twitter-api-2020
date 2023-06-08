// const tweetServices = require('../../services/restaurant-services')
const { Tweet, User } = require('../models')
const tweetController = {
    getTweets: (req, res, next) => {
      Tweet.findAll({
        include: User,
        nest: true,
        raw: true
      })
      .then(tweets => {
        const data =Array.from(tweets)
          return res.json(data)
      }).catch (err => next(err))
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
    postTweets: (req, res, next) => {   
      const { description } = req.body
      const UserId = req.user.id
      console.log(UserId)
      if (!description) {
        return Promise.reject(new Error('Tweet不能為空!'))
      }

      if (description.length > 140) {
        return Promise.reject(new Error('輸入不得超過140字!'))
      }

      return Tweet.create({
        description,
        UserId
        })
        .then(tweet => {
          res.status(200).json(tweet)
        })
        .catch(err => {
          next(err)
        })
      }
}
module.exports = tweetController