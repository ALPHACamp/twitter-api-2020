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
          return res.status(400).json({ status: 'error', message: 'Tweet doesn\'t esist' })
        }
        Like.findOne({ where: { UserId: userId, TweetId: tweetId } })
          .then(like => {
            if (like) {
              return res.status(400).json({ status: 'error', message: 'Already liked this tweet' })
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
  }
}
