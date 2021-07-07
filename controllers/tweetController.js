const { User, Tweet, Like } = require('../models')
const helpers = require('../_helpers')

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

  postTweets: (req, res, next) => {
    if (!req.body.description) {
      res.json({ status: 'error', message: "description didn't exist" })
      return res.redirect('back')
    }
    if (req.body.description.length > 140) {
      res.json({ status: 'error', message: 'description only allow 140 characters' })
      return res.redirect('back')
    }
    return Tweet.create({
      description: req.body.description,
      UserId: helpers.getUser(req).id,
    })
      .then((tweet) => {
        res.json({ status: 'success', message: 'description was successfully created' })
      })
      .catch((err) => next(err))
  },
}

module.exports = tweetController
