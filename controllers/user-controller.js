const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')
const { User, Tweet } = require('../models')


module.exports = {
  signin: (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()

      switch (true) {
        case (req.originalUrl === '/api/signin' && userData.role !== 'user'):
          throw new Error('帳號不存在！')

        case (req.originalUrl === '/api/admin/signin' && userData.role !== 'admin'):
          throw new Error('帳號不存在！')

        default:
          delete userData.password
          const token = jwt.sign(
            userData, process.env.JWT_SECRET, { expiresIn: '30d' }
          )

          const responseData = { token, user: userData }
          return res.json(responseData)
      }

    } catch (err) { next(err) }
  },

  signup: async (req, res, next) => {
    try {
      // if no any following property within req.body,
      // then just return null instead
      const account = req.body?.account?.trim() || null
      const name = req.body.name?.trim() || null
      const email = req.body.email?.trim() || null
      const password = req.body.password?.trim() || null
      const checkPassword = req.body?.checkPassword?.trim() || null

      if (!account || !name || !email || !password || !checkPassword) {
        throw new Error('每個欄位都屬必填!')
      }

      if (name.length > 50) {
        throw new Error('name 不得超過50字!')
      }

      if (password !== checkPassword) {
        throw new Error('密碼欄位必須一致!')
      }

      // in order to handle two exceptions,
      // it's necessary to do two queries to database
      const [userForAccount, userForEmail] = await Promise.all([
        User.findOne({ where: { account }, raw: true }),
        User.findOne({ where: { email }, raw: true })
      ])
      if (userForAccount) throw new Error('account 已重複註冊！')
      if (userForEmail) throw new Error('email 已重複註冊！')

      // hash password with bcrypt.js
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)

      // create user in database
      const user = await User.create({
        account, name, email, password: hash
      })

      // retrieve complete user data from database
      const responseData = await User.findByPk(user.toJSON().id, { raw: true })
      delete responseData.password

      return res.status(200).json(responseData)

    } catch (err) { next(err) }
  },
  getUser: async (req, res, next) => {
    try {
      const { UserId } = req.params

      const responseData = await User.findByPk(UserId, { raw: true })

      return res.status(200).json(responseData)

    } catch (err) {
      next(err)
    }
  },
  getTweetsOfUser: async (req, res, next) => {
    try {
      const { UserId } = req.params

      const responseData = await Tweet.findAll({
        where: { UserId }, raw: true
      })

      if (!responseData.length) throw new Error('沒有任何推文!')

      return res.status(200).json(responseData)

    } catch (err) {
      next(err)
    }
  }
}