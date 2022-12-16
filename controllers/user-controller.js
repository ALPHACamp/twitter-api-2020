const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { User, Tweet, Reply, Like, Followship, sequelize } = require('../models')
const helpers = require('../_helpers')
const { relativeTime } = require('../helpers/date-helper')
const { imgurFileHandler } = require('../helpers/file-helper')

const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      switch (true) {
        case (req.originalUrl === '/api/users/login' && userData.role !== 'user'):
          return res.status(403).json({
            status: 'error',
            message: '不允許登入'
          })
        case (req.originalUrl === '/api/admin/login' && userData.role !== 'admin'):
          return res.status(403).json({
            status: 'error',
            message: '不允許登入'
          })
        default: {
          delete userData.password
          const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
          res.json({
            status: 'success',
            token,
            user: userData
          })
        }
      }
    } catch (err) {
      next(err)
    }
  },
  signUp: async (req, res, next) => {
    try {
      const {
        email,
        name,
        account,
        password
      } = req.body

      // 確認email or account是否已存在
      const message = {}
      const [userEmail, userAccount] = await Promise.all([
        User.findOne({ where: { email } }),
        User.findOne({ where: { account } })
      ])

      if (userEmail) message.email = 'email已重複註冊!'
      if (userAccount) message.account = 'account已重複註冊!'
      if (Object.keys(message).length !== 0) {
        return res.status(422).json({
          status: 'error',
          message,
          email,
          account,
          name
        })
      }

      // 建立user資料
      const newUser = await User.create({
        email,
        account,
        password: bcrypt.hashSync(password, 10),
        name
      })

      // 回傳新增使用者資料，刪除password欄位
      const userData = newUser.toJSON()
      delete userData.password

      res.json({
        status: 'success',
        user: userData
      })
    } catch (err) {
      next(err)
    }
  },
  getUserSetting: async (req, res, next) => {
    try {
      const currentUser = helpers.getUser(req).toJSON()

      // 刪除不必要欄位，減少流量。
      delete currentUser.avatar
      delete currentUser.cover
      delete currentUser.introduction
      delete currentUser.role
      res.status(200).json(currentUser)
    } catch (err) {
      next(err)
    }
  },
  putUserSetting: async (req, res, next) => {
    try {
      const reqUserId = Number(req.params.id)
      const {
        email,
        name,
        account,
        password
      } = req.body

      // 確認帳號密碼是否變更
      const currentUser = helpers.getUser(req).toJSON()
      const newData = { email, account }
      if (currentUser.email === email) newData.email = null
      if (currentUser.account === account) newData.account = null

      // 確認email or account是否已存在
      const message = {}
      const [userEmail, userAccount] = await Promise.all([
        User.findOne({ where: { email: newData.email } }),
        User.findOne({ where: { account: newData.account } })
      ])

      if (userEmail) message.email = 'email已重複註冊!'
      if (userAccount) message.account = 'account已重複註冊!'
      if (Object.keys(message).length !== 0) {
        return res.status(422).json({
          status: 'error',
          message,
          email,
          account,
          name
        })
      }

      //  更改帳戶資訊
      const user = await User.findByPk(reqUserId)
      user.update({
        name,
        email,
        account,
        password: bcrypt.hashSync(password, 10)
      })
      res.status(200).json({ status: 'success' })
    } catch (err) {
      next(err)
    }
  },
  getUserProfile: async (req, res, next) => {
    try {
      const reqUserId = Number(req.params.id)
      const user = await User.findByPk(reqUserId, {
        attributes: [
          'id', 'account', 'name', 'avatar', 'cover', 'introduction', 'role',
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE followingId = User.id)'), 'followerCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE followerId = User.id)'), 'followingCount']
        ]
      })

      // 確認使用者是否存在
      if (!user || user.role === 'admin') {
        return res.status(404).json({
          status: 'error',
          message: '使用者不存在.'
        })
      }
      return res.status(200).json(user)
    } catch (err) {
      next(err)
    }
  },
  putUserProfile: async (req, res, next) => {
    try {
      const reqUserId = Number(req.params.id)
      const { name, introduction } = req.body
      const { files } = req

      const option = { name, introduction }
      if (files?.avatar) option.avatar = await imgurFileHandler(files.avatar[0])
      option.cover = files?.cover ? await imgurFileHandler(files.cover[0]) : null // 未上傳cover可以是空白

      //  更新資料
      const user = await User.findByPk(reqUserId)
      await user.update(option)

      res.status(200).json({
        status: 'success'
      })
    } catch (err) {
      next(err)
    }
  },
  getUserTweets: async (req, res, next) => {
    try {
      const reqUserId = Number(req.params.id)
      const currentUserId = helpers.getUser(req).id
      const [user, userTweets] = await Promise.all([
        User.findByPk(reqUserId),
        Tweet.findAll({
          where: { UserId: reqUserId },
          include: { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
          attributes: [
            'id', 'description', 'createdAt',
            [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'replyCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'likeCount'],
            [sequelize.literal(`EXISTS(SELECT id FROM Likes WHERE Likes.UserId = ${currentUserId} AND Likes.TweetId = Tweet.id)`), 'isLiked']
          ],
          order: [['createdAt', 'DESC']],
          nest: true,
          raw: true
        })
      ])

      // 確認使用者是否存在
      if (!user || user.role === 'admin') {
        return res.status(404).json({
          status: 'error',
          message: '使用者不存在.'
        })
      }

      //  轉換人性化時間
      const newUserTweets = userTweets.map(userTweet => ({
        ...userTweet,
        createdAt: relativeTime(userTweet.createdAt)
      }))

      return res.status(200).json(newUserTweets)
    } catch (err) {
      next(err)
    }
  },
  getUserReplies: async (req, res, next) => {
    try {
      const reqUserId = Number(req.params.id)
      const [user, userReplies] = await Promise.all([
        User.findByPk(reqUserId),
        Reply.findAll({
          where: { UserId: reqUserId },
          include: [
            { model: User, attributes: ['id', 'account', 'name', 'avatar'] },
            {
              model: Tweet,
              attributes: ['id'],
              include: [{ model: User, attributes: ['id', 'account'] }]
            }
          ],
          order: [['createdAt', 'DESC']],
          nest: true,
          raw: true
        })
      ])

      // 確認使用者是否存在
      if (!user || user.role === 'admin') {
        return res.status(404).json({
          status: 'error',
          message: '使用者不存在.'
        })
      }

      //  轉換人性化時間
      const newUserReplies = userReplies.map(userReply => ({
        ...userReply,
        createdAt: relativeTime(userReply.createdAt)
      }))

      return res.status(200).json(newUserReplies)
    } catch (err) {
      next(err)
    }
  },
  getUserLikedTeets: async (req, res, next) => {
    try {
      const reqUserId = Number(req.params.id)
      const currentUserId = helpers.getUser(req).id
      const [user, userLikedTeets] = await Promise.all([
        User.findByPk(reqUserId),
        Like.findAll({
          where: { UserId: reqUserId },
          attributes: ['id', 'TweetId'],
          include: [
            {
              model: Tweet,
              attributes: [
                'id', 'description', 'createdAt',
                [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'replyCount'],
                [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'likeCount'],
                [sequelize.literal(`EXISTS(SELECT id FROM Likes WHERE Likes.UserId = ${currentUserId} AND Likes.TweetId = Tweet.id)`), 'isLiked']
              ],
              include: { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
            }
          ],
          order: [['createdAt', 'DESC']],
          nest: true,
          raw: true
        })
      ])

      // 確認使用者是否存在
      if (!user || user.role === 'admin') {
        return res.status(404).json({
          status: 'error',
          message: '使用者不存在.'
        })
      }

      //  轉換人性化時間
      const newUserLikedTeets = userLikedTeets.map(userLikedTeet => ({
        ...userLikedTeet,
        Tweet: {
          ...userLikedTeet.Tweet,
          createdAt: relativeTime(userLikedTeet.Tweet.createdAt)
        }
      }))

      res.status(200).json(newUserLikedTeets)
    } catch (err) {
      next(err)
    }
  },
  getUserFollowings: async (req, res, next) => {
    try {
      const reqUserId = Number(req.params.id)
      const currentUserId = helpers.getUser(req).id
      const [user, followings] = await Promise.all([
        User.findByPk(reqUserId),
        Followship.findAll({
          where: { followerId: reqUserId },
          include: {
            model: User,
            as: 'Followings',
            attributes: [
              'id',
              'name',
              'avatar',
              'introduction',
              [sequelize.literal(`EXISTS(SELECT id FROM Followships WHERE Followships.followerId = ${currentUserId} AND Followships.followingId = Followings.id)`), 'isFollowed']
            ]
          },
          order: [['createdAt', 'DESC']],
          nest: true,
          raw: true
        })
      ])

      // 確認使用者是否存在
      if (!user || user.role === 'admin') {
        return res.status(404).json({
          status: 'error',
          message: '使用者不存在.'
        })
      }

      res.status(200).json(followings)
    } catch (err) {
      next(err)
    }
  },
  getUserFollowers: async (req, res, next) => {
    try {
      const reqUserId = Number(req.params.id)
      const currentUserId = helpers.getUser(req).id
      const [user, followers] = await Promise.all([
        User.findByPk(reqUserId),
        Followship.findAll({
          where: { followingId: reqUserId },
          include: {
            model: User,
            as: 'Followers',
            attributes: [
              'id',
              'name',
              'avatar',
              'introduction',
              [sequelize.literal(`EXISTS(SELECT id FROM Followships WHERE Followships.followerId = ${currentUserId} AND Followships.followingId = Followers.id)`), 'isFollowed']
            ]
          },
          order: [['createdAt', 'DESC']],
          nest: true,
          raw: true
        })
      ])

      // 確認使用者是否存在
      if (!user || user.role === 'admin') {
        return res.status(404).json({
          status: 'error',
          message: '使用者不存在.'
        })
      }

      res.status(200).json(followers)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
