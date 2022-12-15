const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt-nodejs')
const { User, Reply, Tweet, Like } = require('../models')
const { getUser, imgurFileHandler } = require('../_helpers')

const userController = {
  userLogin: async (req, res, next) => {
    try {
      const { email, password } = req.body
      // 檢查必填欄位
      if (!email.trim() || !password.trim()) {
        return res.json({ status: 'error', message: '所有欄位都是必填！' })
      }

      const user = await User.findOne({ where: { email } })
      // 若找不到該帳號使用者，顯示錯誤訊息
      if (!user) return res.status(401).json({ status: 'error', message: "User doesn't exist!" })
      // 若使用者的權限是admin，則依據角色權限顯示錯誤訊息
      if (user.role === 'admin') return res.status(401).json({ status: 'error', message: '帳號不存在' })
      // 比對密碼是否錯誤
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: '密碼錯誤！' })
      }
      // token(效期30天)
      const userData = getUser(req).toJSON()
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
      if (!user) return res.status(404).json({ status: 'error', message: "User doesn't exist!" })
      return res.json(user)
    } catch (err) {
      next(err)
    }
  },
  getUsers: async (req, res, next) => {
    try {
      const top = Number(req.query.top)
      const currentUser = getUser(req)
      const users = await User.findAll({
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
      return res.status(200).json({ status: 'success', data: result })
    } catch (err) {
      next(err)
    }
  },
  postUser: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      if (!account || !name || !email || !password || !checkPassword) return res.status(400).json({ status: 'error', message: '所有欄位都是必填！' })
      if (password !== checkPassword) return res.status(400).json({ status: 'error', message: '密碼與密碼確認不相同！' })

      const user1 = await User.findOne({ where: { email } })
      if (user1) return res.status(400).json({ status: 'error', message: 'email 已重複註冊！' })
      const user2 = await User.findOne({ where: { account } })
      if (user2) return res.status(400).json({ status: 'error', message: 'account 已重複註冊！' })

      const createdUser = await User.create({
        account,
        name,
        email,
        password: bcrypt.hashSync(password)
      })

      return res.status(200).json({ status: 'success', data: createdUser })
    } catch (err) {
      next(err)
    }
  },
  putUser: async (req, res, next) => {
    try {
      const { id } = req.params
      const { account, name, email, password, checkPassword, introduction } = req.body
      const { avatar, cover } = req

      if (password && password !== checkPassword) return res.status(400).json({ status: 'error', message: '密碼與密碼確認不相同！' })

      const user = await User.findByPk(id)
      const avatarPath = await imgurFileHandler(avatar)
      const coverPath = await imgurFileHandler(cover)

      if (!user) return res.status(404).json({ status: 'error', message: '使用者不存在！' })
      if (getUser(req).dataValues.id !== Number(id)) return res.status(401).json({ status: 'error', message: '無權限更改此使用者！' })

      const updatedUser = await user.update({
        account: account || user.account,
        name: name || user.name,
        email: email || user.email,
        password: bcrypt.hashSync(password) || user.password,
        avatar: avatarPath || user.avatar,
        cover: coverPath || user.cover,
        introduction: introduction || user.introduction
      })

      return res.status(200).json({ status: 'success', data: updatedUser })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
