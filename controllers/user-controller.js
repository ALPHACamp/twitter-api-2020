const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')
const { User, Tweet, Reply, Like } = require('../models')
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')
const { imgurFileHandler } = require('../helpers/image-helper')

const userController = {
  signin: async (req, res, next) => {
    try {
      if (req.user.error) {
        return res.status(StatusCodes.NOT_ACCEPTABLE)
          .json(req.user.error)
      }
      const user = req.user.toJSON()
      if (user.role !== 'user') {
        return res.status(StatusCodes.FORBIDDEN)
          .json({
            status: 'error',
            message: '無使用者權限'
          })
      }
      const payload = {
        id: user.id
      }
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' })
      delete user.password
      return res.status(StatusCodes.OK)
        .json({
          status: 'success',
          message: '成功登入',
          token,
          data: user
        })
    } catch (err) {
      next(err)
    }
  },
  signUp: async (req, res, next) => {
    try {
      const account = req.body.account.trim()
      const password = req.body.password.trim()
      const checkPassword = req.body.checkPassword.trim()
      const name = req.body.name.trim()
      const email = req.body.email.trim()
      const emailRegex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/ //eslint-disable-line
      if (!account || !password || !checkPassword || !name || !email) {
        return res.status(StatusCodes.NOT_ACCEPTABLE).json(
          {
            status: 'error',
            message: '必填欄位不可空白'
          })
      }
      if (password !== checkPassword) {
        return res.status(StatusCodes.NOT_ACCEPTABLE).json(
          {
            status: 'error',
            message: '密碼與確認密碼不相符'
          })
      }
      if (!emailRegex.test(email)) {
        return res.status(StatusCodes.NOT_ACCEPTABLE)
          .json({
            status: 'error',
            message: '信箱格式不符合'
          })
      }
      const user = await User.findAll({
        where: {
          [Op.or]: [
            { account },
            { email }
          ]
        }
      })
      if (user.length > 0) {
        return res.status(StatusCodes.NOT_ACCEPTABLE).json(
          {
            status: 'error',
            message: 'Account或Email已被使用'
          })
      }
      const hashedPassword = await bcrypt.hash(password, 10)
      await User.create({
        name,
        account,
        email,
        password: hashedPassword,
        isAdmin: false,
        role: 'user'
      })
      return res.status(StatusCodes.OK).json({
        status: 'success',
        message: '成功創建'
      })
    } catch (error) {
      next(error)
    }
  },
  getCurrentUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(helpers.getUser(req).id, {
        include: [
          { model: Tweet },
          { model: Reply },
          { model: Like }
        ]
      })
      if (!user) {
        return res.status(StatusCodes.NotFound).json({
          status: 'error',
          message: '使用者不存在'
        })
      }
      return res.status(StatusCodes.OK).json({ user })
    } catch (error) {
      next(error)
    }
  },
  getUserPage: async (req, res, next) => {
    try {
      const userId = req.params.id
      let user = await User.findByPk(userId, {
        include: [
          { model: Tweet },
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' }
        ]
      })
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: 'error',
          message: '使用者不存在'
        })
      }
      user = await user.toJSON()
      const isBeingFollowed = user.Followers.some(followers => followers.id === req.user.id)
      delete user.password
      return res.status(StatusCodes.OK).json(
        {
          ...user,
          tweetsCounts: user.Tweets.length,
          followingsCounts: user.Followings.length,
          isBeingFollowed
        }
      )
    } catch (err) {
      next(err)
    }
  },
  editUser: async (req, res, next) => {
    try {
      const userId = req.params.id
      const { name, introduction } = req.body
      const { files } = req
      if (helpers.getUser(req).id !== Number(userId)) {
        return res.stauts(StatusCodes.NOT_ACCEPTABLE).json({
          status: 'error',
          message: '無權限編輯此使用者'
        })
      }
      const user = await User.findByPk(req.params.id)
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: 'error',
          message: '使用者不存在'
        })
      }
      if (!name || !introduction) {
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({
          status: 'error',
          message: '必填欄位不得為空'
        })
      }
      if (name.length > 50) {
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({
          status: 'error',
          message: '名稱不能超過50字'
        })
      }
      if (introduction.length > 150) {
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({
          status: 'error',
          message: '自我介紹不能超過150字'
        })
      }
      const avatar = files.avatar ? await imgurFileHandler(files.avatar[0]) : null
      const cover = files.cover ? await imgurFileHandler(files.cover[0]) : null
      await user.update({
        ...user,
        name,
        introduction,
        avatar: avatar || user.avatar,
        cover: cover || user.cover
      })
      return res.status(StatusCodes.OK).json({ status: 'success' })
    } catch (error) {
      next(error)
    }
  },
  getUserTweets: async (req, res, next) => {
    try {
      const userId = req.params.id
      let user = await User.findByPk(userId, {
        include: [
          { model: Tweet, include: [Reply, Like] }
        ]
      })
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: 'error',
          message: '使用者不存在'
        })
      }
      user = await user.toJSON()
      const tweets = await user.Tweets.map(tweet => {
        return {
          ...tweet,
          userOfTweet: user.id,
          userAccountOfTweet: user.account,
          userNameOfTweet: user.name,
          userAvatarOfTweet: user.avatar,
          repliedCounts: tweet.Replies.length,
          likesCounts: tweet.Likes.length,
          isBeingliked: req.user.LikedTweets ? req.user.LikedTweets.some(like => like.id === tweet.id) : false
        }
      })
      tweets.sort((a, b) => b.createdAt - a.createdAt)
      return res.status(StatusCodes.OK).json(tweets)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = userController
