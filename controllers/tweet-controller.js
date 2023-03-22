const { Tweet, Like, Reply } = require('../models')

const tweetController = {
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      order: [['created_at', 'desc']],
      raw: true,
      nest: true
    })
      .then(tweets => res.json({ status: 'success', tweets }))
      .catch(error => next(error))
  },

  getTweet: (req, res, next) => {
    return Tweet.findByPk(req.params.tweetId)
      .then(tweet => {
        if (!tweet) {
          const error = new Error("Tweet doesn't exist!")
          error.status = 404
          throw error
        }

        return res.json({ status: 'success', tweet })
      })
      .catch(error => next(error))
  },

  postTweet: (req, res, next) => {
    const { description, userId } = req.body

    if (!description.trim()) {
      const error = new Error('Description is required!')
      error.status = 404
      throw error
    }

    return Tweet.create({
      description,
      userId
    })
      .then(newTweet => res.json({ status: 'success', newTweet }))
      .catch(error => next(error))
  },

  getReplies: (req, res, next) => {
    return Reply.findByPk(req.params.tweetId)
      .then(replies => {
        if (!replies) {
          const error = new Error("Replies does'nt exist!")
          error.status = 404
          throw error
        }

        return res.json({ status: 'success', replies })
      })
      .catch(error => next(error))
  },

  postReply: (req, res, next) => {
    const { comment, tweetId } = req.body

    if (!comment.trim()) {
      const error = new Error('Comment is requires!')
      error.status = 404
      throw error
    }

    return Reply.create({
      comment,
      tweetId
    })
      .catch(error => next(error))
  },

  addLike: (req, res, next) => {
    const { tweetId } = req.params

    return Promise.all([
      Tweet.findByPk(tweetId),
      Like.findOne({
        where: {
          userId: req.user.id,
          tweetId
        }
      })
    ])
      .then(([tweet, like]) => {
        if (!tweet) {
          const error = new Error("Tweet doesn't exist!")
          error.status = 404
          throw error
        }

        if (like) {
          const error = new Error('You already liked this tweet!')
          error.status = 404
          throw error
        }

        return Like.create({
          userId: req.user.id,
          tweetId
        })
      })
      .catch(error => next(error))
  },

  removeLike: (req, res, next) => {
    return Like.findOne({
      where: {
        userId: req.user.id,
        tweetId: req.params.tweetId
      }
    })
      .then(like => {
        if (!like) {
          const error = new Error("You haven't liked this tweet!")
          error.status = 404
          throw error
        }

        return like.destroy()
      })
      .catch(error => next(error))
  }
}

module.exports = tweetController
