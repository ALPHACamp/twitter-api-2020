const { User, Tweet } = require('../models')
// const { getUser } = require('../_helpers')

const adminController = {
  getUsers: (req, res, next) => {
    // if (!getUser(req)) {
    //   return res.status(401).json({ status: 'error', message: 'token is invalidated' })
    // }
    return User.findAll({
      include: [
        { model: User, as: 'Followers' }
        // { model: User, as: 'Followings' }
      ]
    })
      .then(users => {
        users = users.map(user => ({
          ...user.toJSON(),
          followerCount: user.Followers.length
          // followingCount: user.Followings.length
        }))
        res.status(200).json(users)
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
