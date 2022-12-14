const { User, Like, Favorite, Tweet, Followship, Reply } = require('./../models')
const jwt = require('jsonwebtoken')
const { imgurFileHandler } = require('../helpers/file-helpers')
const bcrypt = require('bcryptjs')
const userServices = {
  loginUser: (req, cb) => {
    try {
      delete req.user.password
      const userData = req.user.toJSON()
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
    Promise.all([
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
  getUsers: (req, cb) => {
    return User.findAll({
      nest: true,
      raw: true
    })
      .then(users => {
        return cb(null, { users })
      })
      .catch(err => cb(err))
  },
  getUser: (req, cb) => {
    return User.findByPk(
      {
        id: req.params.userId,
        raw: true
      }
    )
      .then(user => {
        if (!user) throw new Error('user do not exist.')
        cb(null, { user })
      })
      .catch(err => cb(err))
  },
  getTopUsers: (req, cb) => { // Still needs to be fixed
    const limit = req.query.top
    return User.findAll({
      // include: [{
      //   model: User,
      //   as: 'Followers'
      // }]
    })
      .then(users => {
        // const data = users.map(user => ({
        //   ...user.toJSON(),
        //   followerCount: user.Followers.length,
        //   isFollowed: req.user.Followings.some(f => f.id === user.id)
        // }))
        //   .sort((a, b) => b.followerCount - a.followerCount)
        //   .slice(0, limit)
        return cb(null, { users })
      })
      .catch(err => cb(err))
  },
  editUser: (req, cb) => {
    const { account, name, email, introduction, avatar, cover } = req.body
    const userId = req.params.userId
    const { file } = req
    return Promise.all([
      User.findByPk(userId),
      imgurFileHandler(file)])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User didn't exist!")
        return user.update({
          account,
          name,
          email,
          introduction,
          avatar: filePath
          // cover
        })
      })
      .then(updatedUser => {
        cb(null, { user: updatedUser })
      })
      .catch(err => cb(err))
  },
  getUserTweets: (req, cb) => {
    const userId = req.params.userId
    Tweet.findAll({ where: { userId }, include: [User] })
      .then(tweets => {
        cb(null, { tweets })
      })
  },
  getUserReplies: (req, cb) => {
    const userId = req.params.userId
    Reply.findAll({ where: { userId }, include: [User], nested: true, raw: true })
      .then(replies => {
        cb(null, { data: replies })
      })
  },
  getLikedTweets: (req, cb) => {
    const userId = req.params.userId
    Like.findAll({ where: { userId }, include: [Tweet], nested: true, raw: true })
      .then(likedTweets => {
        cb(null, { data: likedTweets })
      })
  }
}
module.exports = userServices
