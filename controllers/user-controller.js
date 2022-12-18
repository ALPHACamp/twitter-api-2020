const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const { User, Tweet, Reply, Like, Followship, sequelize } = require('../models')
const { getUser } = require('../_helpers')
const imgurFileHandler = require('../helpers/imgur-file-helper')

const userController = {
  register: async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        const errorMessage = errors.errors.map(e => e.msg)
        throw new Error(errorMessage)
      }
      const { name, account, email, password } = req.body
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)
      await User.create({ name, account, email, password: hash })
      // sign token
      const user = await User.findOne({
        where: { account, email, role: 'user' }
      })
      if (!user) return res.status(401).json({ status: 'error', message: 'Redirect fail!' })
      const userData = user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '14d' })
      res.status(200).json({ token, user: userData })
    } catch (err) {
      next(err)
    }
  },
  login: async (req, res, next) => {
    try {
      // check account and password
      const { account, password } = req.body
      const user = await User.findOne({
        where: { account, role: 'user' },
        attributes: { exclude: ['createdAt', 'updatedAt'] }
      })
      if (!user) return res.status(401).json({ status: 'error', message: '帳號不存在' })
      const isPasswordCorrect = await bcrypt.compare(password, user.password)
      if (!isPasswordCorrect) return res.status(401).json({ status: 'error', message: '帳號或密碼錯誤' })
      // sign token
      const userData = user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '14d' })
      res.status(200).json({ token, user: userData })
    } catch (err) {
      next(err)
    }
  },
  getUserProfile: async (req, res, next) => {
    try {
      const { id } = req.params
      const user = await User.findOne({
        where: { id, role: 'user' },
        attributes: {
          include: [
            [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.follower_id = User.id)'), 'followingCounts'],
            [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.following_id = User.id)'), 'followerCounts'],
            [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE Tweets.User_id = User.id)'), 'tweetCounts'],
            [sequelize.literal(`EXISTS(SELECT true FROM Followships WHERE Followships.follower_id = ${getUser(req).id} AND Followships.following_id = User.id)`), 'isFollowed']
          ],
          exclude: ['password', 'createdAt', 'updatedAt']
        }
      })
      if (!user) throw new Error("User didn't exist!")
      const userData = user.toJSON()
      res.status(200).json(userData)
    } catch (err) {
      next(err)
    }
  },
  getUserTweets: async (req, res, next) => {
    try {
      const page = Number(req.query.page) || 1
      const limit = 10
      const offset = (page - 1) * limit
      const { id } = req.params
      const user = await User.findOne({ where: { id, role: 'user' } })
      if (!user) throw new Error("User didn't exist!")
      const tweets = await Tweet.findAll({
        where: { UserId: id },
        include: [{ model: User, attributes: ['account', 'name', 'avatar'] }],
        attributes: {
          include: [
            [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.Tweet_id = Tweet.id)'), 'replyCounts'],
            [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.Tweet_id = Tweet.id)'), 'likeCounts'],
            [sequelize.literal(`EXISTS(SELECT true FROM Likes WHERE Likes.User_Id = ${getUser(req).id} AND Likes.Tweet_Id = Tweet.id)`), 'isLiked']
          ]
        },
        order: [['createdAt', 'DESC']],
        limit,
        offset,
        raw: true,
        nest: true
      })
      res.status(200).json(tweets)
    } catch (err) {
      next(err)
    }
  },
  getUserReplies: async (req, res, next) => {
    try {
      const page = Number(req.query.page) || 1
      const limit = 10
      const offset = (page - 1) * limit
      const { id } = req.params
      const user = await User.findOne({ where: { id, role: 'user' } })
      if (!user) throw new Error("User didn't exist!")
      const replies = await Reply.findAll({
        where: { UserId: id },
        include: [
          { model: User, attributes: ['account', 'name', 'avatar'] },
          { model: Tweet, attributes: ['id'], include: [{ model: User, attributes: ['id', 'account'] }] }
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset,
        raw: true,
        nest: true
      })
      res.status(200).json(replies)
    } catch (err) {
      next(err)
    }
  },
  getUserLikes: async (req, res, next) => {
    try {
      const page = Number(req.query.page) || 1
      const limit = 10
      const offset = (page - 1) * limit
      const { id } = req.params
      const user = await User.findOne({ where: { id, role: 'user' } })
      if (!user) throw new Error("User didn't exist!")
      const likes = await Like.findAll({
        where: { UserId: id },
        include: [
          {
            model: Tweet,
            attributes: [
              'id', 'description', 'createdAt',
              [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.Tweet_id = Tweet.id)'), 'replyCounts'],
              [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.Tweet_id = Tweet.id)'), 'likeCounts'],
              [sequelize.literal(`EXISTS(SELECT true FROM Likes WHERE Likes.User_Id = ${getUser(req).id} AND Likes.Tweet_Id = Tweet.id)`), 'isLiked']
            ],
            include: [{ model: User, attributes: ['id', 'account', 'name', 'avatar'] }]
          }
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset,
        raw: true,
        nest: true
      })
      res.status(200).json(likes)
    } catch (err) {
      next(err)
    }
  },
  getUserFollowings: async (req, res, next) => {
    try {
      const { id } = req.params
      const user = await User.findOne({ where: { id, role: 'user' } })
      if (!user) throw new Error("User didn't exist!")
      const followings = await Followship.findAll({
        where: { followerId: id },
        attributes: {
          include: [
            [sequelize.literal('(SELECT name FROM Users WHERE Users.id = Followship.following_id)'), 'name'],
            [sequelize.literal('(SELECT introduction FROM Users WHERE Users.id = Followship.following_id)'), 'introduction'],
            [sequelize.literal('(SELECT avatar FROM Users WHERE Users.id = Followship.following_id)'), 'avatar'],
            [sequelize.literal(`EXISTS(SELECT true FROM Followships WHERE Followships.follower_id = ${getUser(req).id} AND Followships.following_id = Followship.following_id)`), 'isFollowed']
          ]
        },
        order: [['createdAt', 'DESC']],
        raw: true
      })
      res.status(200).json(followings)
    } catch (err) {
      next(err)
    }
  },
  getUserFollowers: async (req, res, next) => {
    try {
      const { id } = req.params
      const user = await User.findOne({ where: { id, role: 'user' } })
      if (!user) throw new Error("User didn't exist!")
      const followers = await Followship.findAll({
        where: { followingId: id },
        attributes: {
          include: [
            [sequelize.literal('(SELECT name FROM Users WHERE Users.id = Followship.follower_id)'), 'name'],
            [sequelize.literal('(SELECT introduction FROM Users WHERE Users.id = Followship.follower_id)'), 'introduction'],
            [sequelize.literal('(SELECT avatar FROM Users WHERE Users.id = Followship.follower_id)'), 'avatar'],
            [sequelize.literal(`EXISTS(SELECT true FROM Followships WHERE Followships.follower_id = ${getUser(req).id} AND Followships.following_id = Followship.following_id)`), 'isFollowed']
          ]
        },
        order: [['createdAt', 'DESC']],
        raw: true
      })
      res.status(200).json(followers)
    } catch (err) {
      next(err)
    }
  },
  getTopUsers: async (req, res, next) => {
    try {
      const DEFAULT_LIMIT = 10
      const users = await User.findAll({
        limit: DEFAULT_LIMIT,
        where: { role: 'user' },
        attributes: ['id', 'name', 'account', 'avatar',
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.following_id = User.id)'), 'followerCounts'],
          [sequelize.literal(`EXISTS(SELECT true FROM Followships WHERE Followships.follower_id = ${getUser(req).id} AND Followships.following_id = User.id)`), 'isFollowed']
        ],
        order: [[sequelize.literal('followerCounts'), 'DESC']],
        raw: true
      })
      res.status(200).json(users)
    } catch (err) {
      next(err)
    }
  },
  editUserSetting: async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        const errorMessage = errors.errors.map(e => e.msg)
        throw new Error(errorMessage)
      }
      const { name, account, email, password } = req.body
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)
      const user = await User.findByPk(req.params.id)
      const updatedUser = await user.update({ name, account, email, password: hash })
      // sign a new token
      const userData = updatedUser.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '14d' })
      res.status(200).json({ token, user: userData })
    } catch (err) {
      next(err)
    }
  },
  editUserProfile: async (req, res, next) => {
    try {
      const { name, introduction } = req.body
      const { files } = req
      if (introduction?.length > 160) throw new Error('Introduction too long!')
      if (!name || name.length > 50) throw new Error('名稱無效')
      const avatar = await imgurFileHandler(files?.avatar && files.avatar[0])
      const cover = await imgurFileHandler(files?.cover && files.cover[0])
      const user = await User.findByPk(req.params.id)
      const updatedUser = await user.update({
        name,
        introduction,
        avatar: avatar || user.avatar,
        cover: cover || user.cover
      })
      const userData = updatedUser.toJSON()
      delete userData.password
      res.status(200).json({ user: userData })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
