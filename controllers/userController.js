const db = require('../models')
const { User,Tweet,Like } = db
const validator = require('validator')
const bcrypt = require('bcryptjs')

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const userController = {
  signIn: async (req, res) => {
    try {
    // check all inputs are required
      const { account, password } = req.body
      if (!account || !password) {
        return res.json({ status: 'error', message: '所有欄位都是必填' })
      }
      const user = await User.findOne({ where: { account } })
      if (!user) return res.status(401).json({ status: 'error', message: '使用者帳號或密碼有誤' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: '使用者帳號或密碼有誤' })
      }
      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.status(200).json({
        status: 'success',
        message: 'ok',
        token: token,
        user: {
          id: user.id,
          account: user.account,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          cover: user.cover,
          role: user.role
        }
      })
    } catch (err) {
      console.log(err)
      res.status(500).json({ status: 'error', message: 'error' })
    }
  },
  signUp: async (req, res) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      const message = []
      // check all inputs are required
      if (!account || !name || !email || !password || !checkPassword) {
        message.push('所有欄位都是必填')
      }
      // check account length and type
      if (name && !validator.isByteLength(name, { min: 0, max: 50 })) {
        message.push('名稱長度必須小於50字')
      }
      // check name length and type
      if (account && !validator.isByteLength(account, { min: 0, max: 20 })) {
        message.push('帳號長度必須小於20字')
      }
      // check email validation
      if (email && !validator.isEmail(email)) {
        message.push('請輸入有效的信箱')
      }
      // check password length and type
      if (password && !validator.isByteLength(password, { min: 5, max: 15 })) {
        message.push('請輸入長度介於 5-15 的密碼')
      }
      // check password and checkPassword
      if (password && (password !== checkPassword)) {
        message.push('密碼與確認密碼不相符')
      }
      if (message.length) {
        return res.status(400).json({ status: 'error', message })
      }
      const [inputEmail, inputAccount] = await Promise.all([User.findOne({ where: { email } }), User.findOne({ where: { account } })])
      const errorMessage = []
      if (inputEmail) {
        errorMessage.push('此信箱已註冊！')
      }
      if (inputAccount) {
        errorMessage.push('此帳號已註冊！')
      }
      if (errorMessage.length) {
        return res.status(409).json({ status: 'error', message: errorMessage })
      }
      await User.create({
        account,
        name,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
      })
      return res.json({ status: 'success', message: '註冊成功！' })
    } catch (err) {
      console.log(err)
      res.status(400).json({ status: 'error', message: 'error' })
    }
  },
  getCurrentUser: (req, res) => {
    return res.status(200).json({
      id: req.user.id,
      name: req.user.name,
      account: req.user.account,
      email: req.user.email,
      avatar: req.user.avatar,
      role: req.user.role,
      cover: req.user.cover,
      introduction: req.user.introduction
    })
  },
  getTopUsers: async (req, res) => {
    try {
      let users = await User.findAll({
        include: [
          { model: User, as: 'Followers' }
        ],
        attributes: ['id', 'name', 'email', 'avatar'],
        limit:10,
      })
      if (!users){
        res.status(404).json({ status: 'error', message: 'Cannot find any user in db.' })
      }
      users = users.map(user => ({
        ...user.dataValues,
        followerCount: user.Followers.length,
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
      }))
      users = users.sort((a, b) => b.followerCount - a.followerCount)
    return res.status(200).json(users)
    } catch (err) {
      console.log(err)
      res.status(500).json({ status: 'error', message: 'error' })
    }
  },
}

module.exports = userController
