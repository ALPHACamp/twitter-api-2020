const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')
const { Tweet } = require('../models')
const { newErrorGenerate } = require('../helpers/newError-helper')

const adminController = {
  signIn: (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      if (userData.role !== '管理員') newErrorGenerate('帳號不存在！', 404)
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
      return res.json({
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
  // 管理員能夠刪除貼文
  deleteTweet: async (req, res, next) => {
    try {
      const tweetId = req.params.id
      const tweet = await Tweet.findByPk(tweetId)
      if (!tweet) newErrorGenerate('該篇推文不存在', 404)
      const deletedTweet = await tweet.destroy()
      return res.json({ status: 'success', data: { deletedTweet } })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController
