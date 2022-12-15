const { User, Like, Tweet, Followship, Reply } = require('./../models')
const jwt = require('jsonwebtoken')
const { imgurFileHandler } = require('../helpers/file-helpers')
const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')
const userServices = {
  loginUser: (req, cb) => {
    try {
      delete helpers.getUser(req).password
      const userData = helpers.getUser(req).toJSON()
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      cb(null, {
        token,
        user: userData
      })
    } catch (err) {
      cb(err)
    }
  },
  registerUser: (req, cb) => {
    // password check
    if (req.body.password !== req.body.checkPassword) throw new Error('Passwords do not match!')
    // account and email check
    return Promise.all([
      User.findOne({ where: { account: req.body.account } }), User.findOne({ where: { email: req.body.email } })
    ])
      .then(([userWithAccount, userWithEmail]) => {
        if (userWithAccount) throw new Error('Account already exists!')
        if (userWithEmail) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        account: req.body.account,
        name: req.body.name,
        email: req.body.email,
        password: hash,
        role: 'user',
        avatar: `https://loremflickr.com/320/240/cat?random=${Math.random() * 100}`,
        cover: `https://loremflickr.com/820/312/space?random=${Math.random() * 100}`
      }))
      .then(user => {
        delete user.password
        return cb(null, {
          user
        })
      })
      .catch(err => cb(err))
  },
  getUser: (req, cb) => {
    return User.findByPk(req.params.userId, { raw: true })
      .then(user => {
        if (!user) throw new Error('user do not exist.')
        cb(null, user)
      })
      .catch(err => cb(err))
  },
  editUser: (req, cb) => {
    const { account, name, email, introduction, password } = req.body
    const UserId = req.params.userId
    const { avatarFile, coverFile } = req
    return Promise.all([
      User.findByPk(UserId),
      imgurFileHandler(avatarFile),
      imgurFileHandler(coverFile)
    ])
      .then(([user, avatarFilePath, coverFilePath]) => {
        if (!user) throw new Error("User didn't exist!")
        return user.update({
          account,
          name,
          email,
          introduction,
          password,
          avatar: avatarFilePath,
          cover: coverFilePath
        })
      })
      .then(updatedUser => {
        cb(null, { user: updatedUser })
      })
      .catch(err => cb(err))
  },
  getUserFollowings: (req, cb) => {
    const UserId = req.params.userId
    return Followship.findAll({
      where: { followerId: UserId },
      include: [{ model: User, as: 'followingUser' }]
    })
      .then(followings => cb(null, followings))
      .catch(err => cb(err))
  },
  getUserFollowers: (req, cb) => {
    const UserId = req.params.userId
    return Followship.findAll({
      where: { followingId: UserId },
      include: [{ model: User, as: 'followerUser' }]
    })
      .then(followers => cb(null, followers))
      .catch(err => cb(err))
  },
  getUserTweets: (req, cb) => {
    const UserId = req.params.userId
    return Tweet.findAll({ where: { UserId }, include: [{ model: User }] })
      .then(tweets => cb(null, tweets))
      .catch(err => cb(err))
  },
  getUserReplies: (req, cb) => {
    const UserId = req.params.userId
    return Reply.findAll({ where: { UserId }, include: [{ model: User }] })
      .then(replies => cb(null, replies))
      .catch(err => cb(err))
  },
  getLikedTweets: (req, cb) => {
    const UserId = req.params.userId
    return Like.findAll({ where: { UserId }, include: [{ model: Tweet }] })
      .then(likedTweets => cb(null, likedTweets))
      .catch(err => cb(err))
  }
}
module.exports = userServices
