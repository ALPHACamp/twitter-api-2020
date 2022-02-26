const { Tweet, Reply, Like, User } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  getTweets: (req, res, next) => {
    const reqUserId = helpers.getUser(req).id
    return Tweet.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        { model: Reply },
        { model: Like },
        { model: User }
      ],
    })
      .then(tweets => {
        const tweetsArray = tweets
          .map(t => ({
            ...t.toJSON()
          }))

        tweetsArray
          .forEach(tweet => {
            tweet.name = tweet.User.name
            tweet.account = tweet.User.account
            tweet.isLiked = tweet.Likes.some(like => like.UserId === reqUserId)
            tweet.likesCount = tweet.Likes.length
            tweet.repliesCount = tweet.Replies.length
            delete tweet.userId
            delete tweet.Likes
            delete tweet.Replies
            delete tweet.User
          })

        return res.json(tweetsArray)
      })
      .catch(err => next(err))
  },
  getTweet: (req, res, next) => {
    const getTweetId = Number(req.params.id)
    return Tweet.findByPk(getTweetId, {
      include: { model: Reply }
    })
      .then(tweet => {
        if (!tweet) throw new Error('Tweet not exist!')
        res.status(200).json(tweet)
      })
      .catch(err => next(err))
  },
  postTweet: (req, res, next) => {
    const { description } = req.body
    const UserId = helpers.getUser(req).id
    if (!description) throw new Error('description is required!')
    return Tweet.create({
      UserId,
      description
    })
      .then(addTweet => {
        res.status(200).json(addTweet)
      })
      .catch(err => next(err))
  }
}

module.exports = tweetController