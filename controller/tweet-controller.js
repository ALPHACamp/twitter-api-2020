const { Tweet, User } = require('../models')
const helpers = require('../_helpers')
const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        // 將相關使用者資料一併包含在回傳結果中
        include: [{ model: User, attributes: ['name', 'email'] }]
      })
      return res.json({ status: 'success', data: tweets })
    } catch (err) {
      next(err)
    }
  },
  createTweet: async (req, res, next) => {
    try {
      const reqUserId = helpers.getUser(req).id
      const { description } = req.body
      // 檢查推文內容是否為空白或超過字數限制
      if (!description || description.length > 140) {
        return res.status(400).json({ status: 'error', message: 'Invalid tweet description' })
      }

      // 將推文存入資料庫
      const tweet = await Tweet.create({
        description,
        UserId: reqUserId
      })

      return res.json({ status: 'success', data: tweet })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
