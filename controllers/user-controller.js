const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const { User, Tweet, Reply, sequelize } = require('../models')
const { getUser } = require('../_helpers')

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
      if (!user) return res.status(401).json({ status: 'error', message: 'redirect fail' })
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
            [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.follower_id = User.id)'), 'followingsCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.following_id = User.id)'), 'followersCount']
          ],
          exclude: ['password', 'createdAt', 'updatedAt']
        }
      })
      if (!user) throw new Error("user didn't exist")
      const userData = user.toJSON()
      res.status(200).json(userData)
    } catch (err) {
      next(err)
    }
  },
  getUserTweets: async (req, res, next) => {
    try {
      const { id } = req.params
      const user = await User.findOne({ where: { id, role: 'user' } })
      if (!user) throw new Error("user didn't exist")
      const tweets = await Tweet.findAll({
        where: { UserId: id },
        include: [{ model: User, attributes: ['account', 'name', 'avatar'] }],
        attributes: {
          include: [
            [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.Tweet_id = Tweet.id)'), 'repliesCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.Tweet_id = Tweet.id)'), 'likesCount'],
            [sequelize.literal(`EXISTS(SELECT true FROM Likes WHERE Likes.User_Id = ${getUser(req).id} AND Likes.Tweet_Id = Tweet.id)`), 'isLiked']
          ]
        },
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })
      if (!tweets.length) return res.status(200).json([])
      res.status(200).json(tweets)
    } catch (err) {
      next(err)
    }
  },
  getUserReplies: async (req, res, next) => {
    try {
      const { id } = req.params
      const user = await User.findOne({ where: { id, role: 'user' } })
      if (!user) throw new Error("user didn't exist")
      const replies = await Reply.findAll({
        where: { UserId: id },
        include: [
          { model: User, attributes: ['account', 'name', 'avatar'] },
          { model: Tweet, attributes: ['id'], include: [{ model: User, attributes: ['id', 'account'] }] }
        ],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })
      if (!replies.length) return res.status(200).json([])
      res.status(200).json(replies)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
