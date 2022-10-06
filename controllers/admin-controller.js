const jwt = require('jsonwebtoken')
const adminServices = require('../services/admin-services')
const adminController = {
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({
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
  getUsers: (req, res, next) => {
    return adminServices.getUsers(req, (err, data) => {
      err ? next(err) : res.json({ status: 'success', data })
    })
  },
  deleteTweets: (req, res, next) => {
    return adminServices.deleteTweets(req, (err, data) => {
      err ? next(err) : res.json({ status: 'success', data })
    })
  }
}
module.exports = adminController
