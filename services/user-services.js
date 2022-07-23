const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { User, Tweet, Reply, Like } = require('../models')

const userServices = {
  signUp: (req, cb) => {
    if (req.body.password !== req.body.checkPassword) throw new Error('Passwords do not match!')

    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')

        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => {
        return User.create({
          account: req.body.account,
          name: req.body.name,
          email: req.body.email,
          password: hash
        })
      })
      .then(newUser => {
        const data = newUser.toJSON()
        delete data.password
        return cb(null, { user: data })
      })
      .catch(err => cb(err))
  },
  signIn: (req, cb) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      return cb(null, { token, user: userData })
    } catch (err) {
      return cb(err)
    }
  },
  getUser: (req, cb) => {
    return User.findByPk(req.params.id)
      .then(user => {
        if (!user) throw new Error("User didn't exist!")

        const userData = user.toJSON()
        delete userData.password
        return cb(null, { user: userData })
      })
      .catch(err => cb(err))
  },
  getUserTweets: (req, cb) => {
    const UserId = req.params.id
    Tweet.findAll({
      where: { UserId },
      include: [User],
      nest: true,
      raw: true
    })
      .then(tweets => cb(null, tweets))
      .catch(err => cb(err))
  },
  getUserReplies: (req, cb) => {
    const UserId = req.params.id
    Reply.findAll({
      where: { UserId },
      include: [{ model: User }, { model: Tweet, include: [{ model: User }] }],
      nest: true,
      raw: true
    })
      .then(replies => cb(null, replies))
      .catch(err => cb(err))
  },
  getUserLikes: async (req, cb) => {
    const UserId = req.params.id
    try {
      const likedTweets = await Like.findAll({
        where: { UserId },
        include: [{ model: Tweet, include: [{ model: User }] }],
        order: [['createdAt', 'DESC']],
        nest: true,
        raw: true
      })

      const results = []
      await Promise.all(
        likedTweets.map(async tweet => {
          const TweetId = tweet.TweetId
          const likeCount = await Like.count({ where: TweetId })
          const replyCount = await Reply.count({ where: TweetId })
          results.push({ ...tweet, Tweet: { ...tweet.Tweet, likeCount, replyCount } })
        })
      )
      return cb(null, results)
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = userServices
