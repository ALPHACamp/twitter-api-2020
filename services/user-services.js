const bcrypt = require('bcryptjs')
const { User, Tweet, Reply, Like } = require('../models')
const userServices = {
  signUp: (req, cb) => {
    const { account, name, email, password, checkPassword } = req.body
    if (password != checkPassword) throw new Error('Password do not match!')

    User.findOne({ where: { account } })
      .then(user => {
        if (user) throw new Error('Account already exists!')
        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({
        account,
        name,
        email,
        password: hash
      }))
      .then(createdUser => cb(null, { createdUser }))
      .catch(err => cb(err))
  },
  getUser: (req, cb) => {
    User.findByPk(req.params.id)
      .then(user => {
        if (!user) throw new Error("User didn't exists!")
        return user = user.get({ plain: true })
      })
      .then(user => cb(null, user ))
      .catch(err => cb(err))
  },
  getUserTweets: (req, cb) => {
    return Promise.all([
      User.findByPk(req.params.id, { raw: true }),
      Tweet.findAll({
        raw: true,
        where: { userId: req.params.id }
      })
    ])
      .then(([user, tweets]) => {
        if (!user) throw new Error("User didn't exists!")
        return cb(null, tweets)
      })
      .catch(err => cb(err))
  },
  getUserRepliedTweets: (req, cb) => {

  },
  getUserLikes: (req, cb) => {

  }
}
module.exports = userServices