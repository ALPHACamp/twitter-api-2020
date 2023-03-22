const { Tweet, User, Like } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  postTweet: (req, res, next) => {
    const { description } = req.body
    if (!description) throw new Error('description is required')

    const user = helpers.getUser(req)
    const UserId = user.id

    return User.findByPk(UserId)
      .then(user => {
        if (!user) throw new Error("User didn't exist!")

        return Tweet.create({
          UserId,
          description
        })
      })
      .then(tweet => {
        res.json({
          tweet
        })
      })
      .catch(err => next(err))
  },
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      include: { model: User },
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    })
      .then(tweets => {
        res.json(tweets)
      })
      .catch(err => next(err))
  },
  getTweet: (req, res, next) => {
    const id = req.params.tweet_id

    return Tweet.findByPk(id, {
      include: [
        { model: User, attributes: ['id', 'account', 'name', 'avatar'] },
        { model: Like, attributes: ['deleted'] }
      ],
      raw: true,
      nest: true
    })
      .then(tweet => {
        if (!tweet) throw new Error("Tweet didn't exist!")

        res.json(tweet)
      })
      .catch(err => next(err))
  }
}

module.exports = tweetController
