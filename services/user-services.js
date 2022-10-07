const { User, Tweet, Reply } = require('../models')
const bcrypt = require('bcryptjs')
const userServices = {
  signUp: (req, cb) => {
    // 密碼輸入不一致
    if (req.body.password !== req.body.passwordCheck) throw new Error("Passwords doesn't match!")
    return User.findOne({ where: { email: req.body.email } })
      .then(user => {
        // 錯誤處理: user已註冊
        if (user) throw new Error('User already exists!')
        // user未註冊過
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(newUser => cb(null, { newUser }))
      .catch(err => cb(err))
  },
  getTweets: (req, cb) => {
    return User.findByPk(req.params.id, {
      include: Tweet
    })
      .then(user => {
        if (!user) {
          const err = new Error("User didn't exist!")
          err.status = 404
          throw err
        }
        user = user.toJSON()
        return cb(null, { user })
      })
      .catch(err => cb(err))
  },
  getUser: (req, cb) => {
    return User.findByPk(req.params.id, {
      include: [
        { model: Reply },
        { model: Tweet, as: 'LikedTweets' },
        { model: User, as: 'Followings' },
        { model: User, as: 'Followings' }
      ]
    })
      .then(user => {
        console.log(user)
        if (!user) {
          const err = new Error("User didn't exist!")
          err.status = 404
          throw err
        }
        console.log('getUser_user:', user)
        return cb(null, { user })
      })
      .catch(err => cb(err))
  }
}
module.exports = userServices
