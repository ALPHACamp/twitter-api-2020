const db = require('../models')
const bcrypt = require('bcryptjs')
const { Tweet, User, Reply, Like } = db

//JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const adminService = {
  signIn: async (req, res, callback) => {
    try {
      if (!req.body.email || !req.body.password) {
        return res.json({ status: 'error', message: "required fields didn't exist" })
      }

      const { email, password } = req.body
      const user = await User.findOne({ where: { email: email } })

      if (!user) return res.status(401).json({ status: 'error', message: "user not found" })

      if (user.role !== 'admin') return res.status(401).json({ status: 'error', message: "Authorization denied" })

      if (!bcrypt.compareSync(password, user.password)) return res.status(401).json({ status: 'error', message: "password is not correct" })
      //簽發token
      const payload = { id: user.id }
      const token = jwt.sign(payload, 'twitterKiller') //之後寫入dotenv
      callback({
        status: 'success',
        message: 'ok',
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      })
    } catch (err) {
      callback({ status: 'error', message: 'codeStatus 500' })
    }
  },
  getUsers: async (req, res, callback) => {
    try {
      const users = await User.findAll({
        where: { role: 'user' },
        include: [
          { model: Like },
          { model: Reply },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })
      callback({ users })
    } catch (err) {
      callback({ status: 'error', message: 'codeStatus 500' })
    }
  },
  getTweets: async (req, res, callback) => {
    try {
      const tweets = await Tweet.findAll({ include: [{ model: User }] })
      callback({ tweets })
    } catch (err) {
      callback({ status: 'error', message: 'codeStatus 500' })
    }
  },
  deleteTweets: async (req, res, callback) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id)
      await tweet.destroy()
      callback({ status: 'success', message: '' })
    } catch (err) {
      callback({ status: 'error', message: 'codeStatus 500' })
    }
  }
}

module.exports = adminService