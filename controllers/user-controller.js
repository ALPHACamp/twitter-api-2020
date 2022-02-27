const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')
const validator = require('validator')
const { Op } = require('sequelize')
const { User, Like, Tweet, Followship } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const userController = {
  signUp: async (req, res, next) => {
    try {
      const { name, account, email, password, checkPassword } = req.body
      if (!name || !account || !email || !password || !checkPassword) {
        return res.status(400).json({
          status: 'error',
          message: '欄位必須全部填完' 
        })
      }
      if (email && !validator.isEmail(email)) {
        return res.status(400).json({
          status: 'error',
          message: '請輸入正確信箱格式'
        })
      }
      if (password && !validator.isByteLength(password, { min: 4 })) {
        return res.status(400).json({
          status: 'error',
          message: '密碼請輸入至少 4 個!'
        })
      }
      if (password !== checkPassword) {
        return res.status(400).json({
          status: 'error',
          message: '兩次密碼不相符'
        })
      }
      if (name && !validator.isByteLength(name, { min: 0, max: 50 })) {
        return res.status(400).json({
          status: 'error',
          message: '名字長度不能超過 50 個字'
        })
      }
      const checkedUser = await User.findOne({
        where: {
          [Op.or]: [{ account }, { email }]
        },
        raw: true
      })
      if (checkedUser) return res.status(400).json({
        status: 'error',
        message: 'account 或 email 已註冊!'
      })
      await User.create({
        name,
        account,
        email,
        role: 'user',
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
      })
      return res.status(200).json({
        status: 'success',
        message: 'Account success created!'
      })
    } catch (err) { next(err) }
  },
  signIn: async (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({
        status: 'success',
        message: 'login success!',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) { next(err) }
  },
  postLike: async (req, res, next) => {
    try {
      const TweetId = req.params.id
      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) {
        return res
          .status(404)
          .json({
            status: 'error',
            message: '推文不存在'
          })
      }
      const like = await Like.findOne({
        where: {
          UserId: req.user.id,
          TweetId
        }
      })
      if (like.isDeleted) {
        const toggleLike = await like.update({
          isDeleted: !like.isDeleted
        })
        if (toggleLike) {
          return res.status(200).json({
            status: 'success',
            message: 'Like成功!'
          })
        }
      } else {
        return res
          .status(400)
          .json({
            status: 'error',
            message: '已經按過Like囉'
          })
      }
      await Like.create({
        UserId: req.user.id,
        TweetId,
        isDeleted: false
      })
      return res.status(200).json({
        status: 'success',
        message: '成功加入喜歡的貼文!'
      })
    } catch (error) {res.status(500).json({
      status: 'error',
      message: error
    })}
  },
  postUnlike: async (req, res, next) => {
    try {
      const TweetId = req.params.id
      const tweet = await Tweet.findByPk(TweetId)
      const like = await Like.findOne({
        where: {
          UserId: req.user.id,
          TweetId
        }
      })
      if (!tweet) {
        return res
          .status(404)
          .json({
            status: 'error',
            message: '推文不存在'
          })
      }
      if (like.isDeleted) {
        return res
          .status(400)
          .json({
            status: 'error',
            message: '已經按過Unlike囉'
          })
      } else {
        const toggleLike = await like.update({
          isDeleted: !like.isDeleted
        })
        if (toggleLike) {
          return res.status(200).json({
            status: 'success',
            message: 'Unlike成功!'
          })
        }
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error
      })
    }
  },
  getUser: async (req, res, next) => {
    try {
      const { id } = req.params
      const userData = await User.findByPk(id, {
        raw: true
      })
      if (!userData) return res.status(400).json({
        status: 'error',
        message: 'User not found!'
      })
      const followData = await Followship.findAll({
        where: {},
        raw: true
      })
      delete userData.password

      res.json({ userData })
    } catch (err) { next(err) }
  },
  getUserTweets: async (req, res, next) => {
    try {
      const { id } = req.params
      console.log(id)
      const tweetsData = await Tweet.findAll({
        where: { UserId: id },
        raw: true,
        include: User,
        nest: true
      })
      if (tweetsData.length === 0) return res.status(400).json({
        status: 'error',
        message: 'Tweet not found!'
      })
      res.json({
        status: 'success',
        message: 'getTweets success!',
        data: tweetsData
      })
    } catch (err) { next(err) }
  },
  putUser: async (req, res, next) => {
    try {
      const id = +req.params.id
      const userId = req.user.id
      const { account, name, email, password, checkPassword } = req.body

      if (!name || !account || !email || !password || !checkPassword) {
        return res.status(400).json({
          status: 'error',
          message: '欄位必須全部填完' 
        })
      }
      if (userId !== id) return res.status(400).json({
        status: 'error',
        message: 'No permission'
      })

      if (!validator.isEmail(email)) {
        return res.status(400).json({
          status: 'error',
          message: '請輸入正確信箱格式'
        })
      }
      if (!validator.isByteLength(password, { min: 4 })) {
        return res.status(400).json({
          status: 'error',
          message: '密碼請輸入至少 4 個!'
        })
      }
      if (password !== checkPassword) {
        return res.status(400).json({
          status: 'error',
          message: '兩次密碼不相符'
        })
      }
      if (!validator.isByteLength(name, { min: 0, max: 50 })) {
        return res.status(400).json({
          status: 'error',
          message: '名字長度不能超過 50 個字'
        })
      }
      // 列出全部有相同 account or email 的 user
      const checkedUser = await User.findAll({
        where: { [Op.or]: [{ account }, { email }]},
        attributes: ['id', 'name', 'account', 'email', 'avatar', 'role'],
        raw: true
      })

      const otherUser = checkedUser.find(user => user.id !== userId)

      if (otherUser) return res.status(400).json({
        status: 'error',
        message: 'account or email 已被使用'
      })

      delete req.body.checkPassword
    
      req.body.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
      const user = await User.findByPk(id)
      const updatedUser = await user.update(req.body)

      res.json({
        status: 'success',
        message: 'putUser success',
        updateduser: updatedUser.toJSON()
      })
    } catch (err) { next(err) }
  },
  getCurrentUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: [
          'id',
          'account',
          'name',
          'email',
          'avatar',
          'role'
        ]
      })
      if (!user) return res.status(400).json({
        status: 'error',
        message: 'user not found'
      })
      res.json({ user })
    } catch (err) { next(err) }
  }
}

module.exports = userController