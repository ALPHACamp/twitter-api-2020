const { Tweet } = require('../models')

const adminController = {
  deleteTweets: async (req, res, next) => {
    try {
      const deletedTweetId = req.params.id
      const deletedTweet = await Tweet.findByPk(deletedTweetId)

      if (!deletedTweet) throw new Error('無法刪除不存在的推文。')

      const deletedCount = await Tweet.destroy({
        where: {
          id: deletedTweetId
        }
      })

      if (!deletedCount) throw new Error('你已刪除過此推文。')

      res.json({
        status: 'succuss',
        message: '你已成功刪除該筆推文',
        data: {
          deletedTweet, // deleted Twitter
          deletedCount // delete Count
        }
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController