const { User, Tweet, Reply } = require('../models')
const bcrypt = require('bcryptjs')
const { imgurFileHandler } = require('../helpers/file-helper')
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
        if (!user) {
          const err = new Error("User didn't exist!")
          err.status = 404
          throw err
        }
        return cb(null, { user })
      })
      .catch(err => cb(err))
  },
  putUser: (req, cb) => {
    if (Number(req.params.id) !== Number(req.user.id)) {
      const err = new Error('User not authorized to edit.')
      err.status = 404
      throw err
    }
    const { coverPhoto, avatar } = req
    return Promise.all([
      User.findByPk(req.params.id),
      imgurFileHandler(coverPhoto),
      imgurFileHandler(avatar)
    ])
      .then(([user, coverPhotoPath, avatarPath]) => {
        if (!user) throw new Error("User didn't exist.")
        return user.update({
          name: req.body.name,
          intro: req.body.intro,
          avatar: coverPhotoPath || user.coverPhoto,
          coverPhoto: avatarPath || user.avatar
        })
      })
      .then(user => {
        return cb(null, user)
      })
      .catch(err => cb(err))
  }
}

module.exports = userServices
