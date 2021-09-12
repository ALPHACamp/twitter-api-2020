const db = require('../models')
const Tweet = db.Tweet

const tweetService = {
  postTweet: async (req, res, cb) => {
    try {
      const { description } = req.body
      if (description.trim()) {
        if (description.length > 140) return cb({ status: '400', message: '推文需在140字以內' })
        const tweet = await Tweet.create({
          UserId: req.user.id,
          description
        })
        return cb({ status: '200', message: '推文建立成功', tweetId: tweet.id })
      }
      return cb({ status: '400', message: '內容不可空白' })
    } catch (err) {
      console.warn(err)
      return cb({ status: '500', message: err })
    }
  }
}



module.exports = tweetService