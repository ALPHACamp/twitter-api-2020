const db = require('../models')
const Like = db.Like
const Tweet = db.Tweet
const { catchError } = require('../utils/errorHandling')

module.exports = {
  likeTweet: (req, res) => {
    const { tweetId } = req.params
    const userId = req.user.id

    Tweet.findByPk(tweetId)
      .then(tweet => {
        if (!tweet) {
          return res.status(400).json({ status: 'error', message: 'Tweet doesn\'t exist' })
        }
        Like.findOne({ where: { UserId: userId, TweetId: tweetId } })
          .then(like => {
            if (like) {
              return res.status(400).json({ status: 'error', message: 'You already liked this tweet' })
            }
            Like.create({
              UserId: userId,
              TweetId: tweetId
            })
              .then(() => {
                return res.status(200).json({ status: 'success', message: 'Success' })
              })
              .catch(error => {
                catchError(res, error)
              })
          })
          .catch(error => {
            catchError(res, error)
          })
      })
      .catch(error => {
        catchError(res, error)
      })
  },

  unlikeTweet: (req, res) => {
    const { tweetId } = req.params
    const userId = req.user.id

    Tweet.findByPk(tweetId)
      .then(tweet => {
        if (!tweet) {
          return res.status(400).json({ status: 'error', message: 'Tweet doesn\'t exist' })
        }
        Like.findOne({ where: { UserId: userId, TweetId: tweetId } })
          .then(like => {
            if (!like) {
              return res.status(400).json({ status: 'error', message: 'You haven\'t liked this tweet before' })
            }
            like.destroy()
              .then(() => {
                return res.status(200).json({ status: 'success', message: 'Success' })
              })
              .catch(error => {
                catchError(res, error)
              })
          })
          .catch(error => {
            catchError(res, error)
          })
      })
      .catch(error => {
        catchError(res, error)
      })
  }
}
