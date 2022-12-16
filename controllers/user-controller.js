const assert = require('assert')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt-nodejs')
const { User, Reply, Tweet, Like } = require('../models')
const { getUser, imgurFileHandler } = require('../_helpers')

const userController = {
  userLogin: async (req, res, next) => {
    try {
      // token(效期30天)
      const userData = getUser(req).toJSON()
      if (userData.role !== 'user') return res.status(401).json({ status: 'error', message: '帳號不存在！' })
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      return res.status(200).json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  getUser: async (req, res, next) => {
    try {
      const { id } = req.params
      const user = await User.findByPk(id, {
        include: [
          Reply, Tweet, Like,
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ],
        nest: true
      })
      if (!user) assert(user, "User doesn't exist!")
      res.json({ status: 'success', data: user })
    } catch (err) {
      next(err)
    }
  },
  getUsers: async (req, res, next) => {
    try {
      const top = Number(req.query.top)
      const currentUser = getUser(req)
      const users = User.findAll({
        include: [{ model: User, as: 'Followers' }]
      })
      const result = users
        .map(user => ({
          ...user.toJSON(),
          followerCount: user.Followers.length,
          isFollowed: currentUser.Followings.some(f => f.id === user.id)
        }))
        .sort((a, b) => b.followerCount - a.followerCount)
        .slice(0, top || users.length)
      res.json({ status: 'success', data: result })
    } catch (err) {
      next(err)
    }
  },
  postUser: async (req, res, next) => {
    try {
      const { account, name, email, password, confirmPassword } = req.body
      if (!account || !name || !email || !password || !confirmPassword) throw new Error('所有欄位都是必填！')
      if (password !== confirmPassword) throw new Error('密碼與密碼確認不相同！')

      const user1 = await User.findOne({ where: { email } })
      if (user1) assert(user1, 'email 已重複註冊！')
      const user2 = await User.findOne({ where: { account } })
      if (user2) assert(user2, 'account 已重複註冊！')

      const createdUser = await User.create({
        account,
        name,
        email,
        password: bcrypt.hashSync(password)
      })

      res.json({ status: 'success', data: createdUser })
    } catch (err) {
      next(err)
    }
  },
  putUser: async (req, res, next) => {
    try {
      const { id } = req.params
      const { account, name, email, password, confirmPassword, introduction } = req.body
      const { avatar, cover } = req

      if (!account || !name || !email || !password || !confirmPassword) throw new Error('account, name, email, password, confirmPassword必填！')
      if (password !== confirmPassword) throw new Error('密碼與密碼確認不相同！')
      if (getUser(req).id !== id) throw new Error('無權限更改此使用者！')

      const user = await User.findByPk(id)
      const avatarPath = await imgurFileHandler(avatar)
      const coverPath = await imgurFileHandler(cover)

      if (!user) assert(user, '使用者不存在！')

      const updatedUser = await user.update({
        account,
        name,
        email,
        password: bcrypt.hashSync(password),
        avatar: avatarPath || user.avatar,
        cover: coverPath || user.cover,
        introduction: introduction || user.introduction
      })

      res.json({ status: 'success', data: updatedUser })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
