const { User } = require('../models/user')
const helpers = require('../_helpers')
const jwt = require('jsonwebtoken')

const adminController = {
  getUsers: (req, res, next) => {
    return User.findAll({
      attributes: { exclude: ['password'] },
      raw: true,
      nest: true
    })
      .then(users => {
        res.status(200).json(users)
      })
      .catch(err => next(err))
  },
  signin: (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()
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
  }
  // getTweets: (req, res, next) => {
  //   res.json(adminDummy.getTweets)
  // },
  // deleteTweet: (req, res, next) => {
  //   res.json(adminDummy.deleteTweet)
  // }
}

module.exports = adminController
