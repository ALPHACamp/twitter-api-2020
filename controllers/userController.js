'use strict'

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sequelize = require('sequelize')
const { User, Tweet, Reply, Like } = require('../models')
const { Op } = require('sequelize')
const { getUser } = require('../_helpers')

const userController = {
  signUp: async (req, res, next) => {
    try {
      // 反查 account 與 email 是否有被註冊過
      const user = await User.findOne({
        where: {
          [Op.or]: [{ account: req.body.account }, { email: req.body.email }]
        },
        raw: true,
        nest: true
      })

      // 驗證 account 不能重複
      if (user?.account === req.body.account) {
        return res.status(400).json({
          status: 'error',
          message: [{
            path: 'account',
            msg: 'account 已重複註冊！'
          }]
        })
      }

      // 驗證 email 不能重複
      if (user?.email === req.body.email) {
        return res.status(400).json({
          status: 'error',
          message: [
            {
              path: 'email',
              msg: 'email 已重複註冊！'
            }]
        })
      }

      // 建立使用者資料
      const hash = await bcrypt.hash(req.body.password, 10)
      await User.create({
        name: req.body.name,
        account: req.body.account,
        email: req.body.email,
        password: hash,
        role: 'user',
        avatar: 'https://i.imgur.com/q6bwDGO.png',
        cover: 'https://i.imgur.com/1jDf2Me.png'
      })

      // 回傳訊息
      return res.status(200).json({
        status: 'success',
        message: '註冊成功'
      })
    } catch (err) {
      return next(err)
    }
  },

  signIn: async (req, res, next) => {
    try {
      // get user data
      const userData = getUser(req)?.toJSON()
      const tokenData = Object.assign({}, { id: userData.id })

      delete userData.password
      // sign token
      const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
      return res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      return next(err)
    }
  },

  getUserTweet: async (req, res, next) => {
    try {
      const id = req.params.id
      const currentUserId = getUser(req).dataValues.id
      const [user, tweets] = await Promise.all([
        User.findByPk(id, { raw: true }),
        Tweet.findAll({
          where: { UserId: id },
          order: [['createdAt', 'DESC']],
          attributes: {
            include: [
              [sequelize.literal('(SELECT COUNT(id) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'likeCount'],
              [sequelize.literal('(SELECT COUNT(id) FROM Replies WHERE Replies.TweetId = Tweet.id)'),
                'replyCount'],
              [sequelize.literal(`EXISTS (SELECT 1 FROM Likes WHERE UserId = ${currentUserId} AND TweetId = Tweet.id)`), 'isLiked']
            ]
          },
          raw: true,
          nest: true
        })
      ])
      if (!user) return res.status(404).json({ status: 'error', message: '使用者不存在' })
      if (!tweets.length) return res.status(200).json({ status: 'success', message: '無推文資料' })

      const data = tweets.map(tweet => ({
        TweetId: tweet.id,
        tweetOwnerId: user.id,
        tweetOwnerAccount: user.account,
        tweetOwnerName: user.name,
        tweetOwnerAvatar: user.avatar,
        description: tweet.description,
        createdAt: tweet.createdAt,
        replyCount: tweet.replyCount,
        likeCount: tweet.likeCount,
        isLiked: Boolean(tweet.isLiked)
      }))
      return res.status(200).json(data)
    } catch (err) {
      return next(err)
    }
  }
}

module.exports = userController
