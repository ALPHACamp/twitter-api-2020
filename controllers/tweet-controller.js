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
    return Reply.findAll({
      where: {
        tweetId: req.params.tweetId
      },
      raw: true,
      nest: true
    })
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
    const { comment } = req.body

    if (!comment.trim()) {
      const error = new Error('Comment is requires!')
      error.status = 404
      throw error
    }

    return Reply.create({
      userId: req.user.id,
      comment,
      tweetId: req.params.tweetId
    })
      .then(newReply => res.json({ status: 'success', newReply }))
      .catch(error => next(error))
  },

  addLike: (req, res, next) => {
    const { tweetId } = req.params

    return Promise.all([
      Tweet.findByPk(tweetId),
      Like.findOne({
        where: {
          user_id: req.user.id,
          tweet_id: tweetId
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
          tweetId: tweetId
        })
      })
      .then(newLike => res.json({ status: 'success', newLike }))
      .catch(error => next(error))
  },

  removeLike: (req, res, next) => {
    return Like.findOne({
      where: {
        user_id: req.user.id,
        tweet_id: req.params.tweetId
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
      .then(deletedLike => res.json({ status: 'success', deletedLike }))
      .catch(error => next(error))
  }
}

module.exports = tweetController
