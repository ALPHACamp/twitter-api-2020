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
      attributes: [ ['id', 'tweetId'], 'UserId', 'description', 'image' ]
    })
      .then(tweets => {
        const tweetsArray = tweets
          .map(t => ({
            ...t.toJSON()
          }))

        tweetsArray
          .forEach(tweet => {
            tweetId = tweet.id
            tweet.name = tweet.User.name
            tweet.account = tweet.User.account
            tweet.isLiked = tweet.Likes.some(like => like.UserId === reqUserId)
            tweet.LikesCount = tweet.Likes.length
            tweet.RepliesCount = tweet.Replies.length
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
    const reqUserId = helpers.getUser(req).id
    return Tweet.findByPk(getTweetId, {
      include: [
        { model: Reply, include: { model: User } },
        { model: Like },
        { model: User }
      ]
    })
      .then(tweet => {
        if (!tweet) throw new Error('Tweet not exist!')

        const result = tweet.toJSON()
        result.Replies
          .forEach(reply => {
            reply.replyId = reply.id
            reply.name = reply.User.name
            reply.account = reply.User.account
            reply.avatar = reply.User.avatar
            delete reply.id
            delete reply.TweetId
            delete reply.userId
            delete reply.User
          })

        result.tweetId = result.id
        result.name = result.User.name
        result.account = result.User.account
        result.avatar = result.User.avatar
        result.isLiked = result.Likes.some(like => like.UserId === reqUserId)
        result.LikesCount = result.Likes.length
        result.RepliesCount = result.Replies.length
        delete result.id
        delete result.userId
        delete result.Likes
        delete result.User

        res.status(200).json(result)
      })
      .catch(err => next(err))
  },
  postTweet: (req, res, next) => {
    const { description, image } = req.body
    const UserId = helpers.getUser(req).id
    if (!description) throw new Error('內容不可空白')
    return Tweet.create({
      UserId,
      description,
      image: image || null
    })
      .then(addTweet => {
        res.status(200).json(addTweet)
      })
      .catch(err => next(err))
  }
}

module.exports = tweetController