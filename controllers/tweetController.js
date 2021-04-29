const db = require('../models')
const validator = require('validator')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like

module.exports = {
  getTweets: (req, res) => {
    Tweet.findAll({
      order: [['createdAt', 'DESC']],
      include: [User, Reply, Like]
    })
      .then(tweets => {
        const data = tweets.map(r => ({
          id: r.id,
          UserId: 1,
          description: r.description,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
          replyCount: r.Replies.length,
          likeCount: r.Likes.length,
          isLiked: r.Likes.map(like => like.UserId).includes(req.user.id),
          User: {
            id: r.User.id,
            account: r.User.account,
            name: r.User.name,
            avatar: r.User.avatar
          }
        }))
        return res.status(200).json(data)
      })
      .catch(error => {
        const data = { status: 'error', message: error.toString() }
        console.log(error)
        return res.status(500).json(data)
      })
  },

  getTweet: (req, res) => {
    Tweet.findByPk(req.params.tweetId, {
      include: [
        { model: User, attributes: { exclude: ['password'] } },
        { model: Reply, include: { model: User, attributes: { exclude: ['password'] } } },
        Like
      ],
      order: [[Reply, 'createdAt', 'DESC']]
    })
      .then(tweet => {
        if (!tweet) {
          return res.status(200).json(null)
        }
        tweet = tweet.toJSON()
        tweet.replyCount = tweet.Replies.length
        tweet.likeCount = tweet.Likes.length
        tweet.isLiked = tweet.Likes.map(like => like.UserId).includes(req.user.id)
        delete tweet.Likes
        return res.status(200).json(tweet)
      })
      .catch(error => {
        const data = { status: 'error', message: error.toString() }
        console.log(error)
        return res.status(500).json(data)
      })
  },

  postTweet: (req, res) => {
    const { description } = req.body

    if (!description) {
      return res.status(400).json({ status: 'error', message: 'Please enter description' })
    }

    if (description && !validator.isByteLength(description, { min: 0, max: 140 })) {
      return res.status(400).json({ status: 'error', message: 'The description field can have no more than 140 characters' })
    }
    Tweet.create({
      UserId: req.user.id,
      description: description
    })
      .then(() => {
        return res.status(200).json({ status: 'success', message: 'Success' })
      })
      .catch(error => {
        const data = { status: 'error', message: error.toString() }
        console.log(error)
        return res.status(500).json(data)
      })
  }
}
