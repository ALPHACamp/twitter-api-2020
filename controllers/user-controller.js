const { User } = require('../models')
const { getUser } = require('../helpers/auth-helpers.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// const { imgurFileHandler } = require('../../helpers/file-helpers.js')

const userController = {
  register: async (req, res, next) => {
    try {
      const { name, account, email, password, checkPassword } = req.body
      if (!name || !account || !email || !password || !checkPassword) throw new Error('所有欄位皆為必填!')
      if (name.length > 50) throw new Error()
      const userEmail = await User.findOne({ where: { email } })
      const userAccount = await User.findOne({ where: { account } })
      if (userEmail) throw new Error('email 已重複註冊！')
      if (userAccount) throw new Error('account 已重複註冊！')
      const hash = await bcrypt.hash(password, 10)
      let userData = await User.create({
        account,
        email,
        password: hash,
        name,
        avatar: 'https://i.imgur.com/NUfWDow.png',
        cover: 'https://i.imgur.com/ApSQQYH.png',
        introduction: 'Hello there!',
        role: 'user'
      })
      userData = userData.toJSON()
      return res.json({
        status: 'success',
        message: '註冊成功',
        data: { user: userData }
      })
    } catch (err) {
      next(err)
    }
  },
  login: async (req, res, next) => {
    try {
      console.log(req.user)
      const userData = await getUser(req)?.toJSON()
      delete userData.password
      const token = await jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      if (userData.role === 'admin') throw new Error('帳號不存在!')
      return res.json({
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
  getUserInfo: async (req, res, next) => { // 元件之一, 提供自己/其他使用者頁的介紹資訊
    try {
      console.log(req.body)
      // if (req.user.dataValues.id.toString() !== req.params.id.toString()) throw new Error('非該用戶不可取得該用戶基本資料!')
      // 上面不需要, 因為每個人都可以互相瀏覽對方的資訊
      const userInfo = await User.findOne({
        where: { id: req.params.id },
        attributes: ['id', 'account', 'name', 'avatar', 'cover', 'introduction', 'role'],
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })
      // if (!userInfo || userInfo.role !== 'user') throw new Error('該用戶不存在')
      const follower = userInfo.Followings.length
      const following = userInfo.Followers.length
      return res.json({
        id: userInfo.id,
        account: userInfo.account,
        name: userInfo.name,
        avatar: userInfo.avatar,
        cover: userInfo.cover,
        introduction: userInfo.introduction,
        follower,
        following
      })
    } catch (err) {
      next(err)
    }
  },
  editUserInfo: async (req, res, next) => {
    try {
      const { name, account, email, password, checkPassword, avatar, cover, introduction } = req.body
      if (req.user.dataValues.id.toString() !== req.params.id.toString()) throw new Error('非該用戶不可編輯該用戶基本資料!')
      const userInfo = await User.findOne({
        where: { id: req.params.id },
        attributes: ['id', 'account', 'email', 'password', 'name', 'avatar', 'cover', 'introduction']
      })
      return res.json({ data: { userInfo } })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
