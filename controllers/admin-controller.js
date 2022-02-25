const { User, Tweet } = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const adminController = {
  signIn: (req, res, next) => {
  const { account, password } = req.body
  if (!account || !password) throw new Error('account and password are required!')

  return User.findOne({
    where: { account }
  })
    .then(user => {
      if (!user) throw new Error('User not exist!')
      if (user.role !== 'admin') throw new Error('User not exist!')
      if (!bcrypt.compareSync(password, user.password)) throw new Error('password incorrect!')
      const userData = user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      return res.status(200).json({
        token,
        user: userData
      })
    })
    .catch(err => next(err))
  },
  getAdminUsers: (req, res, next) => {
    return User.findAll({
      attributes: { exclude: ['password'] }
    })
      .then(users => {
        res.status(200).json(users)
      })
      .catch(err => next(err))
  },
  getAdminTweets: (req, res, next) => {
    return Tweet.findAll()
      .then(tweets => {
        res.status(200).json(tweets)
      })
      .catch(err => next(err))
  },
  deleteAdminTweet: (req, res, next) => {
    const getTweetId = Number(req.params.id)
    return Tweet.destroy({
      where: { id: getTweetId }
    })
      .then(deletedTweet => {
        if (!deletedTweet) throw new Error('Tweet not exist!')
        return res.status(200).json({ message: 'Tweet deleted!'})
      })
      .catch(err => next(err))
  }
}

module.exports = adminController