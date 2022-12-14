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
  }
}

module.exports = adminController
