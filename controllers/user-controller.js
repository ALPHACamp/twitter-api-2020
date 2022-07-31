const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { Sequelize, Op } = require('sequelize')
const { getUser } = require('../_helpers')

const { User, Like, Reply, Tweet } = require('../models')

const userController = {
  signIn: (req, res, next) => {
    try {
      if (req.user.error) {
        return res.json(req.user.error)
      }

      if (req.user.role !== 'user') {
        res.json({
          status: 'error',
          message: '帳號或密碼錯誤'
        })
      }

      const userData = req.user.toJSON()
      delete userData.password
      delete userData.introduction
      delete userData.createdAt
      delete userData.updatedAt
      const token = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: '30d'
      })
      res.json({
        status: 'success',
        token,
        user: userData
      })
    } catch (err) {
      next(err)
    }
  },
  signUp: async (req, res, next) => {
    try {
      const { account, password, checkPassword, name, email } = req.body

      if (!account || !name || !email || !password || !checkPassword) {
        throw new Error('欄位不可空白！')
      }

      if (password !== checkPassword) {
        throw new Error('密碼與確認密碼不相同！')
      }

      const userExist = await User.findAll({
        where: {
          [Op.or]: [
            { account },
            { email }
          ]
        }
      })

      if (userExist.length > 0) {
        throw new Error('帳號或信箱已經有人使用了！')
      }

      const hash = await bcrypt.hash(password, 10)
      const user = await User.create({
        name,
        account,
        email,
        password: hash,
        role: 'user'
      })
      const userData = user.toJSON()
      delete userData.password
      return res.json({ status: 'success', user: userData })
    } catch (error) {
      next(error)
    }
  },
  getUsers: async (req, res, next) => {
    try {
      const limit = Number(req.query.limit) || null
      const users = await User.findAll({
        where: { role: 'user' },
        include: [{
          model: User,
          as: 'Followers',
          attributes: [
            'id',
            'name',
            'avatar',
            'account'
          ]
        }],
        attributes: [
          'id',
          'name',
          'avatar',
          'account',
          [
            Sequelize.literal(
              '(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)'
            ),
            'followersCount'
          ]
        ],
        order: [[Sequelize.literal('followersCount'), 'DESC'], ['name', 'ASC']],
        limit
      })
      res.json({ status: 'success', users })
    } catch (error) {
      next(error)
    }
  },
  getCurrentUser: async (req, res, next) => {
    try {
      const user = getUser(req)
      if (!user) {
        return res.status(500).json({
          status: 'error',
          message: '使用者不存在'
        })
      }
      const { id, account, name, email, avatar, frontCover, role } = user.toJSON()
      const userData = {
        id, account, name, email, avatar, frontCover, role
      }
      res.status(200).json({
        user: userData
      })
    } catch (error) {
      next(error)
    }
  },
  getUserLikes: async (req, res, next) => {
    try {
      const userId = req.params.id
      const user = await User.findByPk(userId)
      if (!user) {
        return res.status(500).json({
          status: 'error',
          message: '使用者不存在'
        })
      }
      let likes = await Like.findAll({
        where: { UserId: userId },
        order: [
          ['createdAt', 'DESC']
        ],
        include: [
          { model: Tweet,
            include: [User, Like, Reply]
          }
        ]
      })

      likes = await likes.map(like => like.toJSON())
      likes = likes.map(like => {
        const likedTweet = like.Tweet
        return {
          likeCreatedAt: like.createdAt, // Like創建時間
          TweetId: likedTweet.id, // 喜歡推文 id
          description: likedTweet.description, // 喜歡推文內容
          createdAt: likedTweet.createdAt, // 喜歡推文創建時間
          userOfLikedTweet: likedTweet.User.id, // 喜歡推文的使用者id
          userNameOfLikedTweet: likedTweet.User.name, // 喜歡推文的使用者名子
          userAccountOfLikedTweet: likedTweet.User.account, // 喜歡推文的使用者帳戶名子
          userAvatarOfLikedTweet: likedTweet.User.avatar, // 喜歡推文的使用者avatar
          repliedCount: likedTweet.Replies.length, // 喜歡推文的回應數量
          likesCount: likedTweet.Likes.length // 喜歡推文的喜歡數量
        }
      })
      return res.status(200).json(likes)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
