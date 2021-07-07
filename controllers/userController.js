const { User } = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userController = {
  signUp: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      if (!account || !name || !email || !password || !checkPassword) {
        return res.json({ status: 'error', message: '所有欄位皆為必填！' })
      } else if (checkPassword !== password) {
        return res.json({ status: 'error', message: '密碼與確認密碼不符！' })
      } else {
        const sameEmailUser = await User.findOne({ where: { email } })
        if (sameEmailUser) {
          return res.json({ status: 'error', message: '此Email已存在。' })
        }
        const sameAccountUser = await User.findOne({ where: { account } })
        if (sameAccountUser) {
          return res.json({ status: 'error', message: '此帳號已存在。' })
        }
        await User.create({
          account,
          name,
          email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
        })
        return res.json({ status: 'success', message: '帳號註冊成功！' })
      }
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  signIn: async (req, res, next) => {
    try {
      const { email, password } = req.body
      // 檢查必填資料
      if (!email || !password) {
        return res.json({ status: 'error', message: 'Email跟密碼皆為必填！' })
      }
      // 檢查 user 是否存在和密碼是否正確
      const user = await User.findOne({ where: { email } })
      if (!user) {
        return res.json({ status: 'error', message: '找不到此Email。' })
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return res.json({ status: 'error', message: '帳號或密碼不正確！' })
      }
      // 檢查是否為管理者
      if (user.role === 'admin') {
        return res.json({ status: 'error', message: '管理者無法登入前台！' })
      }
      // 簽發 token
      const payload = { id: user.id }
      const token = jwt.sign(payload, 'SimpleTwitterSecret')
      return res.json({
        status: 'success',
        message: '登入成功！',
        token: token,
        user: {
          // 這包user回傳資料可依前端需求增減
          id: user.id, account: user.account, name: user.name, email: user.email, role: user.role, avatar: user.avatar
        }
      })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  getUser: async (req, res, next) => {
    try {
      let user = await User.findOne({
        where: { id: req.params.id },
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })
      const { id, name, account, email, role,
        avatar, followingCounts, followerCounts } = user
      return res.json({
        id, name, account, email, role,
        avatar, followingCounts, followerCounts,
        Followers: user.Followers, Followings: user.Followings
      })
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}

module.exports = userController
