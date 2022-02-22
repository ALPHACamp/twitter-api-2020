const { Tweet, User } = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const adminServices = {
  signIn: async (req, cb) => {
    try {
      let result = {}
      const { account, password } = req.body
      if (!account || !password) {
        throw new Error('All fields are required!')
      }
      const user = await User.findOne({ where: { account } })
      if (!user) {
        throw new Error('User not found!')
      } else if (!bcrypt.compareSync(password, user.password)) {
        throw new Error('Incorrect Account or Password!')
      } else if (user.role !== 'admin') {
        throw new Error('請使用管理者帳戶登入!')
      } else {
        result = user.toJSON()
      }
      if (result) {
        const payload = { id: user.id }
        const token = jwt.sign(payload, process.env.JWT_SECRET)
        delete result.password
        return cb(null, { token, user: result })
      }
    } catch (err) {
      return cb(err)
    }
  },
  getTweets: async (req, cb) => {
    try {
      const tweets = await Tweet.findAll({
        include: { model: User },
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']]
      })
      const result = tweets.map(tweet => ({
        ...tweet,
        description: tweet.description.substring(0, 50)
      }))
      return cb(null, result)
    } catch (err) {
      cb(err)
    }

  }
}
module.exports = adminServices