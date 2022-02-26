const jwt = require('jsonwebtoken')
const { User, Tweet, Reply, Like } = require('../models')
const bcrypt = require('bcryptjs')

const userController = {
  signUp: async (req, cb) => {
    try {
      if (req.body.password !== req.body.checkPassword) throw new Error('Passwords do not match!')
      const user = await User.findOne({ where: { email: req.body.email } })
      if (user) throw new Error('Email already exists!')
      const hash = await bcrypt.hash(req.body.password, 10)
      const newUser = await User.create({
        account: req.body.account,
        name: req.body.name,
        email: req.body.email,
        password: hash
      })
      const userData = {
        status: 'success',
        data: {
          user: {
            id: newUser.id,
            account: newUser.account,
            name: newUser.name,
            email: newUser.email
          }
        }
      }
      return cb(null, { userData })
    } catch (err) {
      return cb(err)
    }
  },
  signIn: (req, cb) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      const tokenData = {
        status: 'success',
        data: {
          token,
          user: userData
        }
      }
      return cb(null, { tokenData })
    } catch (err) {
      return cb(err)
    }
  },
  getUser: async (req, cb) => {
    try {
      const user = await User.findByPk(req.params.id, {
        raw: true,
        nest: true
      })
      const userData = {
        status: 'success',
        id: user.id,
        name: user.name,
        account: user.account,
        email: user.email
      }
      return cb(null, userData)
    } catch (err) {
      cb(err)
    }
  },
  getTweets: async (req, cb) => {
    try {
      const user = await User.findByPk(req.params.id, {
        raw: true,
        nest: true,
        include: [
          { model: User, as: 'Followings' }
        ]
      })
      const tweets = await Tweet.findAll({
        where: { UserId: user.id },
        attributes: ['id', 'UserId', 'description', 'createdAt', 'updatedAt'],
        raw: true,
        nest: true
      })
      return cb(null, tweets)
    } catch (err) {
      return cb(err)
    }
  },
  getRepliedTweets: async (req, cb) => {
    try {
      const user = await User.findByPk(req.params.id, {
        raw: true,
        nest: true,
        include: [
          { model: User, as: 'Followings' }
        ]
      })
      const replies = await Reply.findAll({
        where: { UserId: user.id },
        attributes: ['id', 'UserId', 'TweetId', 'comment', 'createdAt', 'updatedAt'],
        raw: true
      })
      return cb(null, replies)
    } catch (err) {
      return cb(err)
    }
  },
  putUser: async (req, cb) => {
    try {
      const { account, name, email, password, introduction, avatar, cover } = req.body
      const user = await User.findByPk(req.params.id, {
        include: [
          { model: User, as: 'Followings' }
        ]
      })
      const updatedUser = await user.update({
        account,
        name,
        email,
        password,
        introduction,
        avatar,
        cover
      })
      const updatedData = { ...updatedUser.dataValues }
      delete updatedData.password
      const userData = {
        status: 'success',
        data: {
          user: {
            ...updatedData
          }
        }
      }
      return cb(null, userData)
    } catch (err) {
      return cb(err)
    }
  },
  getFollowers: async (req, cb) => {
    try {
      const user = await User.findByPk(req.params.id, {
        include: [
          { model: User, as: 'Followers' }
        ]
      })
      const followers = user.Followers.map(e => e.dataValues)
      followers.forEach(e => {
        delete e.Followship
        e.followerId = e.id
      })
      return cb(null, followers)
    } catch (err) {
      return cb(err)
    }
  },
  getFollowings: async (req, cb) => {
    try {
      const user = await User.findByPk(req.params.id, {
        include: [
          { model: User, as: 'Followings' }
        ]
      })
      const followings = user.Followings.map(e => e.dataValues)
      followings.forEach(e => {
        delete e.Followship
        e.followingId = e.id
      })
      return cb(null, followings)
    } catch (err) {
      return cb(err)
    }
  },
  getLikes: async (req, cb) => {
    try {
      const user = await User.findByPk(req.params.id, {
        include: [
          { model: User, as: 'Followings' }
        ]
      })
      const likedTweets = await Like.findAll({
        raw: true,
        nest: true,
        where: { UserId: user.id },
        include: [{
          model: Tweet
        }]
      })
      likedTweets.forEach(e => {
        delete e.tweetId
        delete e.userId
        delete e.Tweet.userId
      })
      return cb(null, likedTweets)
    } catch (err) {
      return cb(err)
    }
  }
}
module.exports = userController
