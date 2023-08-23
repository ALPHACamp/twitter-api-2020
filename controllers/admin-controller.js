const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')
const { Tweet, User } = require('../models')

const adminController = {
  signIn: (req, res, next) => {
    const userData = helpers.getUser(req).toJSON()
    delete userData.password
    if (userData.role === 'user') {
      const err = new Error('帳號不存在！')
      err.status = 404
      throw err
    }
    try {
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

  getTweets: (req, res, next) => {
    return Tweet.findAll({
      include: [
        // 查詢 password 欄位以外的 user 資料
        { model: User, attributes: { exclude: ['password'] } }
      ],
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    })
      .then(tweets => {
        res.json(tweets)
      })
      .catch(err => next(err))
  }
}

module.exports = adminController
