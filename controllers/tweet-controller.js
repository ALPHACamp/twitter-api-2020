const { Tweet, User } = require('../models')
const helpers = require('../_helpers')
const { newErrorGenerate } = require('../helpers/newError-helper')
const { Sequelize } = require('sequelize')

const tweetController = {
  postTweet: async (req, res, next) => {
    try {
      const { description } = req.body
      if (!description.trim()) newErrorGenerate('內容不可空白', 400)
      if (description.length > 140) newErrorGenerate('字數限制140字以內', 400)
      const userId = helpers.getUser(req).id
      const user = await User.findByPk(userId, { raw: true })
      if (!user) newErrorGenerate('使用者不存在', 404)
      const newTweet = Tweet.create({ description, UserId: userId })
      res.status(200).json(newTweet)
    } catch (err) {
      // Sequelize 錯誤處理
      if (err instanceof Sequelize.Error) {
        res.status(500).json({ error: '資料庫錯誤' })
      } else {
        next(err)
      }
    }
  }
}
module.exports = tweetController
