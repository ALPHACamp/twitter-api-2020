const { User, Tweet, Like, Reply } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  getTweets: (req, res, next) => {
    Tweet.findAll({
      include: [
        User,
        { model: Like, include: User },
        { model: Reply, include: User }
      ]
    })
      .then(tweets => {
        const result = tweets.map(tweet => ({
          ...tweet.toJSON(),
          likeCount: tweet.Likes.length,
          commentCount: tweet.Replies.length
        }))
          .map(tweet => {
            if (tweet.Replies.length !== 0) {
              tweet.Replies.map(
                reply => delete reply.User.password
              )
            }
            if (tweet.User) delete tweet.User.password

            return tweet
          })
        return res.status(200).json(result)
      })
      .catch(err => next(err))
  },
  addTweet: (req, res, next) => {
    const { description } = req.body
    Tweet.create({
      userId: helpers.getUser(req).id,
      description
    })
    return res.status(200).json({
      status: 'success',
      message: '推文已成功新增'
    })
  },
  getTweet: (req, res, next) => {
    Tweet.findByPk(req.params.id,
      {
        include: [
          User,
          { model: Like, include: User },
          { model: Reply, include: User }
        ]
      })
      .then(tweet => {
        if (tweet.Replies.length !== 0) {
          tweet.Replies.map(
            reply => delete reply.User.toJSON().password
          )
        }
        delete tweet.toJSON().User.password

        const isLike = tweet.Likes.some(l => l.id === helpers.getUser(req).id)
        tweet = ({
          tweet: tweet.toJSON(),
          likeCount: tweet.Likes.length,
          commentCount: tweet.Replies.length,
          isLike
        })
        return tweet
      })
      .then(tweetPswDel => {
        const result = tweetPswDel.tweet
        if (result.Replies) {
          result.Replies.map(
            reply => delete reply.User.password
          )
        }
        if (result.User) delete result.User.password

        return result
      })
      .then(data => res.status(200).json(data))
      .catch(err => next(err))
  },
}


module.exports = tweetController
