const { User, Tweet, Reply } = require('../models')


const tweetController = {
  postTweet: async (req, res, next) => {
    try {
      const { description } = req.body
      if (!description) return res.json({ status: 'error', message: '推文不得為空白' })
      if (description.length > 140) {
        return res.json({ status: 'error', message: '已超過推文最高上限140字' })
      }
      await Tweet.create({ description, UserId: req.user.id })
      return res.json({ status: 'success', message: '推文新增成功' })
    }
    catch (err) {
      next(err)
    }
  },

  postReply: async (req, res, next) => {
    try {
      const { content } = req.body
      if (!content) return res.json({ status: 'error', message: '回覆不得為空白' })
      const tweet = await Tweet.findOne({ where: { id: req.params.TweetId } })
      if (!tweet) return res.json({ status: 'error', message: '找不到此推文' })
      await Reply.create({
        content,
        UserId: req.user.id,
        TweetId: tweet.id
      })
      return res.json({ status: 'success', message: '回覆新增成功' })
    }
    catch (err) {
      next(err)
    }
  },


}

module.exports = tweetController