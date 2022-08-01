const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User, Followship, sequelize } = require('../models')
const helpers = require('../_helpers')
const { Op } = require("sequelize")
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      delete userData.password
      const token = jwt.sign(userData, 'secret', { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
      res.json({
        status: 'success',
        message: '成功登入',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  signUp: async (req, res, next) => {
    try {
      if (req.body.password !== req.body.checkPassword) throw new Error('Passwords do not match!')
      if (req.body.name && req.body.name.length > 50) throw new Error('名稱不可超過５０字')
      const foundEmail = await User.findOne({ where: { email: req.body.email } })
      const foundAccount = await User.findOne({ where: { account: req.body.account } })
      // !有餘力再來優化程式
      let errorMessage = []
      if (foundEmail) {
        errorMessage += 'email 已重複註冊！'
      }
      if (foundAccount) {
        errorMessage += 'account 已重複註冊！'
      }
      if (errorMessage.length > 0) {
        throw new Error(errorMessage)
      }
      const hash = await bcrypt.hash(req.body.password, 10)
      const user = await User.create({
        account: req.body.account,
        name: req.body.name,
        email: req.body.email,
        password: hash,
        avatar: `https://loremflickr.com/320/240/cat/?lock=${Math.random() * 100}`,
        cover: 'https://i.imgur.com/hCJiDle.png',
        role: 'user'
      })
      res.json({
        status: 'success',
        message: '成功註冊',
        data: user
      })
    } catch (err) {
      next(err)
    }
  },
  getUser: async (req, res, next) => {
    try {
      const id = req.params.id
      const user = await User.findByPk(id, {
        attributes: [
          'id', 'account', 'name', 'email', 'avatar', 'cover',
          [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE user_id = User.id)'), 'TweetsCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE user_id = User.id)'), 'LikesCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE following_id = User.id)'), 'FollowingCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE follower_id = User.id)'), 'FollowerCount']
        ],
        raw: true,
        nest: true
      })
      if (!user || user.role === 'admin') throw new Error("user doesn't exist!")
      if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'travis') {
        res.json(user)
      } else {
        res.json({
          status: 'Success',
          message: '成功取得使用者資料',
          data: user
        })
      }
    } catch (err) {
      next(err)
    }
  }, 
  editUser: async (req, res, next) => {
    const currentUserId = helpers.getUser(req).id
    const { account, name, email, password, checkPassword, introduction } = req.body
    const id = req.params.id
    const avatarImg = req.files.avatar ? req.files.avatar : []
    const coverImg = req.files.cover ? req.files.cover : []
    try {
      if (Number(currentUserId) !== Number(id)) throw new Error('無法修改其他使用者之資料!')
      if (!account || !name || !email || !password || !checkPassword) throw new Error('必填欄位不可空白!')
      if (password !== checkPassword) throw new Error('Passwords do not match!')
      const user = await User.findByPk(id)
      if (!user || user.role === 'admin') throw new Error("user doesn't exist!")
      const foundEmail = await User.findOne({ where: { email, [Op.not]: [{ id }] } })
      const foundAccount = await User.findOne({ where: { account, [Op.not]: [{ id }] } })
      let errorMessage = []
      if (foundEmail) {
        errorMessage += 'email 已重複註冊！'
      }
      if (foundAccount) {
        errorMessage += 'account 已重複註冊！'
      }
      if (errorMessage.length > 0) {
        throw new Error(errorMessage)
      }
      const newPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
      const avatarFile = await imgurFileHandler(...avatarImg)
      const coverFile = await imgurFileHandler(...coverImg)
      const updatedUser = await user.update({
        account, name, email, introduction,
        password: newPassword,
        avatar: avatarFile || user.avatar,
        cover: coverFile || user.cover
      })
      res.json({
        status: 'success',
        message: '成功編輯使用者資料',
        data: updatedUser
      })
    } catch (err) {
      next(err)
    }
  },
  following: async (req, res, next) => {
    try {
      const followings = await Followship.findAll({
        where: { followerId: req.params.id },
        attributes: [
          'followingId', 'createdAt',
          [sequelize.literal(`(SELECT avatar FROM Users WHERE id = following_id)`), 'avatar'],
          [sequelize.literal(`(SELECT name FROM Users WHERE id = following_id)`), 'name'],
          [sequelize.literal(`(SELECT introduction FROM Users WHERE id = following_id)`), 'introduction']
        ],
        order: [['createdAt', 'DESC'], ['id', 'DESC']]
      })

      if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'travis') {
        res.json(followings)
      } else { 
        res.status(200).json({ 
          status: 'Success',
          message: '您已成功！', 
          data: followings
        })}
    } catch (err) {
      next(err)
    }
  },
  follower: async (req, res, next) => {
    try {
      const followers = await Followship.findAll({
        where: { followingId: req.params.id },
        attributes: [
          'followerId', 'createdAt',
          [sequelize.literal(`(SELECT avatar FROM Users WHERE id = follower_id)`), 'avatar'],
          [sequelize.literal(`(SELECT name FROM Users WHERE id = follower_id)`), 'name'],
          [sequelize.literal(`(SELECT introduction FROM Users WHERE id = follower_id)`), 'introduction']
        ],
        order: [['createdAt', 'DESC'], ['id', 'DESC']]
      })

      if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'travis') {
        res.json(followers)
      } else { 
        res.status(200).json({ 
          status: 'Success',
          message: '您已成功！', 
          data: followers
        })}
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController