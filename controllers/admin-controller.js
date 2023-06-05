const { User, Tweet } = require('../models')
const tweet = require('../models/tweet')
const adminController = {
  getUsers: (req, res, next) => {
    User.findAll({
      include: [
        Tweet,
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' },
      ],
      raw: true,
      nest: true,
    })
      .then((users) => {
        console.log(users)
        return res.status(200).json(users)
      })
      .catch((err) => next(err))
  },

  getTweets: (req, res, next) => {
    Tweet.findAll({
      include: User,
      nest: true,
      raw: true
    })
      .then((tweets) => {
        if (!tweets) { return res.status(404).json({ status: 'error', message: 'No tweets found' }) }
        return res.status(200).json(tweets)
      })
      .catch((err) => next(err))
  },

  deleteTweet: (req, res, next) => {
    return Tweet.findByPk(req.params.id)
      .then(tweet => {
        // Error: tweet doesn't exist
        if (!tweet) {
          return res.status(404).json({ status: 'error', message: 'No tweets found' })
        }
        // keep the deleted data
        const deletedTweet = tweet.toJSON()
        return tweet.destroy()
          .then(() => {
            return res.status(200).json({ status: 'success', message: 'Tweet deleted', deletedTweet })
          })
      })
      .catch(err => next(err))
  }
}
module.exports = adminController