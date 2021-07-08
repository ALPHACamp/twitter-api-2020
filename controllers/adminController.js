const { User, Tweet } = require('../models')
const helpers = require('../_helpers')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const adminController = {
  signin: async (req, res, next) => {
    try {
      const { account, password } = req.body
      if (!account || !password) return res.json({ status: 'error', message: '請填入所有欄位' })
      const user = await User.findOne({ where: { account } })
      if (!user) return res.status(401).json({ status: 'error', message: '管理員專用' })
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) return res.status(401).json({ status: 'error', message: '密碼輸入錯誤' })

      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.json({
        status: 'success',
        message: 'ok',
        token,
        user: {
          id: user.id, account: user.account, name: user.name, email: user.email, isAdmin: user.isAdmin
        }
      })
    }
    catch (err) {
      next(err)
    }
  },
  getAllUser: async (req, res, next) => {
    try {
      if (helpers.getUser(req).role !== 'admin') return res.json({ status: 'error', message: '管理員專用' })
      const user = await User.findAll({})
      return res.json(user)
    } catch (err) { next(err) }
  },
  getAllTweet: async (req, res, next) => {
    try {
      if (helpers.getUser(req).role !== 'admin') return res.json({ status: 'error', message: '管理員專用' })
      const tweets = await Tweet.findAll({
        include: [User],
      })
      return res.json(tweets)
    } catch (err) { next(err) }
  },
  deleteTweet: async (req, res, next) => {
    try {
      if (helpers.getUser(req).role !== 'admin') return res.json({ status: 'error', message: '管理員專用' })
      const tweet = await Tweet.findByPk(req.params.id) || false
      if (tweet) {
        tweet.destroy()
        return res.json({ status: 'success', message: "推文刪除成功" })
      }
    } catch (err) { next(err) }
  }
}

module.exports = adminController