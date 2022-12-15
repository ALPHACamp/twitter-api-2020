const { User, Tweet, Like, FollowShip } = require('../models')
const { getUser } = require('../_helpers')

const adminController = {
  getUsers: (req, res, next) => {
    // if (!getUser(req)) {
    //   return res.status(401).json({ status: 'error', message: 'token is invalidated' })
    // }
    Promise.all([
      User.findAll({
        nest: true,
        raw: true,
        include: Tweet,
        attributes: {
          exclude: 'password'
        }
      })
    ])
      .then(([users]) => {
        return res.status(200).json(users)
      })
      .catch(err => next(err))
  },
  getTweets: (req, res, next) => {
    // if (!getUser(req)) {
    //   return res.status(401).json({ status: 'error', message: 'token is invalidated' })
    // }
    Tweet.findAll({
      nest: true,
      raw: true,
      include: {
        model: User,
        attributes: ['id', 'account', 'name', 'avatar']
      }
    })
      .then(tweets => {
        const data = tweets.map(t => ({
          ...t,
          description: t.description.substring(0, 50)
        }))
        return res.status(200).json(data)
      })
      .catch(err => next(err))
  },
  deleteTweet: (req, res, next) => {
    // if (!getUser(req)) {
    //   return res.status(401).json({ status: 'error', message: 'token is invalidated' })
    // }
    return Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (!tweet) {
          return res.status(400).json(
            { status: 'error', message: 'Tweet did not exist!' }
          )
        }
        res.status(200).json(tweet)
        return tweet.destroy()
      })
      .catch(err => next(err))
  }
}

module.exports = adminController
