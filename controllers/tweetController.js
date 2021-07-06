const { User, Tweet, Like } = require('../models')

let tweetController = {
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      include: [{ model: User, attributes: ['name', 'avatar', 'account'] }, { model: Like }],
      order: [['createdAt', 'DESC']],
      raw: true,
    })
      .then((tweets) => {
        return res.json(tweets)
      })
      .catch((err) => next(err))
  },
}

module.exports = tweetController
