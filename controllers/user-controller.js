const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('../models')
const { Op } = require('sequelize')
const { User } = db

const userController = {
  login: (req, res, next) => {
    try {
      // 製作token給使用者
      const userData = req.user
      delete userData.password

      const token = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: '30d'
      })
      res.status(200).json({
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
  signup: async (req, res, next) => {
    try {
      // 註冊時，使用者可以設定 account、name、email 和 password
      const { account, name, email, password, checkPassword } = req.body
      if (!account || !name || !email || !password || !checkPassword) throw new Error('請輸入完整資訊')

      // check password
      if (password !== checkPassword) throw new Error('密碼不相同')

      // 檢查account, email 是否重複
      const user = await User.findOne({
        where: {
          [Op.or]: [
            { email: email },
            { account: account }
          ]
        }
      })
      if (user?.email === email) throw new Error('email 已重複註冊！')
      if (user?.account === account) throw new Error('account 已重複註冊！')
      // 創立新使用者
      await User.create({
        account,
        name,
        email,
        password: bcrypt.hashSync(password),
        role: '',
        createAt: new Date(),
        updatedAt: new Date()
      })
      // 回傳成功訊息
      res.json({
        status: 'success', message: '成功建立帳號'
      })
    } catch (err) {
      next(err)
    }
  },
  getUserData: (req, res, next) => {},
  putUserData: (req, res, next) => {},
  getUserTweets: (req, res, next) => {},
  getUserReplies: (req, res, next) => {},
  getUserLikes: (req, res, next) => {},
  getFollowings: (req, res, next) => {},
  getFollowers: (req, res, next) => {}
}
module.exports = userController
