const helpers = require('../_helpers')
const { Tweet, User } = require('../models')

const tweetController = {
  getTweets: (req, res, next) => {
    Tweet.findAll({
      include: User,
      order: [
        ['createdAt', 'DESC']
      ]
    })
      .then(tweets => {
        // const data = { tweets }
        // res.json({ status: 'success', data })
        res.json(tweets)
      })
      .catch(err => next(err))
  },
  postTweets: (req, res, next) => {
    const { description } = req.body
    if (description.length > 120) throw new Error('description is limited to 120 words!')
    if (!description.trim()) throw new Error('description can not be blank!')
    if (!description) throw new Error('description is required!')
    return Tweet.create({
      description,
      UserId: helpers.getUser(req).id
    })
      .then(newTweet => {
        res.json({ newTweet })
      })
      .catch(err => next(err))
  }
}
module.exports = tweetController
