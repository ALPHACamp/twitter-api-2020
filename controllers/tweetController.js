const { User, Tweet } = require('../models')


const tweetController = {
  postTweet: async (req, res, next) => {
    try {
      const { description } = req.body
      if (description.length > 140) {
        return res.json({ status: 'error', message: '已超過推文最高上限140字' })
      }
      await Tweet.create({ description, UserId: req.user.id })
      return res.json({ status: 'success', message: '推文新增成功' })
    }
    catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController