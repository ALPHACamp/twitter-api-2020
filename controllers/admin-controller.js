const { User, Tweet } = require('../models')

const adminController = {
  getTweets: (req, res, next) => {
    Tweet.findAll({
      nest: true,
      raw: true,
      include: [User]
    })
      .then(tweets => {
        const data = tweets.map(t => ({
          ...t,
          description: t.description.substring(0, 50)
        }))
        // delete data.User.password 我不會刪除user資料的password
        return res.status(200).json({ status: 'success', data })
      })
      .catch(err => next(err))
  },
  deleteTweet: (req, res, next) => {
    return Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (!tweet) {
          const err = new Error('Tweet did not exist!')
          err.status = 404
          throw err
        }
        return tweet.destroy()
      })
      .then(deletedTweet => res.json({ status: 'success', data: deletedTweet }))
      .catch(err => next(err))
  }
}

module.exports = adminController
