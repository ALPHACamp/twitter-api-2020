const jwt = require('jsonwebtoken')
const db = require('../models')
const { User } = db
const adminServices = require('../services/admin-services')

const adminController = {
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, 'secret', { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
      res.json({
        status: 'success',
        message: '成功登入',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  getUsers: (req, res, next) => {
    adminServices.getUsers(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getTweets: (req, res, next) => {
    adminServices.getTweets(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  deleteTweet: (req, res, next) => {
    adminServices.deleteTweet(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  }
}

module.exports = adminController
