const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User, Tweet, Followship } = require('../models')

const userServices = {
  signIn: async (req, cb) => {
    try {
      const { email, password } = req.body
      if (!email || !password) {
        const err = new Error('請輸入帳號密碼')
        err.status = 400
        throw err
      }
      const user = await User.findOne({ where: { email } })
      if (!email) {
        const err = new Error('帳號密碼輸入錯誤')
        err.status = 400
        throw err
      }
      if (user.role === 'admin') {
        const err = new Error('帳號不存在')
        err.status = 404
        throw err
      }
      if (!bcrypt.compareSync(password, user.password)) {
        const err = new Error('帳號密碼輸入錯誤')
        err.status = 400
        throw err
      }
      const userData = user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      return cb(null, {
        status: 'success',
        message: '登入成功！',
        token,
        user: userData
      })
    } catch (err) {
      cb(err)
    }
  },
  getUser: async (req, cb) => {
    try {
      const { id } = req.params
      const [user, tweets, followings, followers] = await Promise.all([
        User.findByPk(id, {
          raw: true
        }),
        Tweet.count({ where: { UserId: id } }),
        Followship.count({ where: { followerId: id } }),
        Followship.count({ where: { followingId: id } })
      ])
      if (!user) {
        const err = new Error('使用者不存在')
        err.status = 404
        throw err
      }
      delete user.password
      const UserData = [
        { ...user },
        { tweetCount: tweets },
        { followerCount: followers },
        { followingCount: followings }
      ]
      cb(null, UserData)
    } catch (err) {
      cb(err)
    }
  }

}

module.exports = userServices
