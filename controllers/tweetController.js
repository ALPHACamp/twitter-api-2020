const db = require('../models')
const Tweet = db.Tweet

const tweetController = {
  postTweet: (req, res) => {
    //TODO: if (!req.user.id) 的錯誤處理需要寫在authenticated裡面
    const { description } = req.body
    if (!description) {
      return res.status(400).json({
        status: 'error',
        message: 'Description can not be null'
      })
    } else if (description.length > 140) {
      return res.status(400).json({
        status: 'error',
        message: 'Description can not be longer than 140'
      })
    } else {
      return Tweet.create({
        UserId: req.user.id,
        description,
        replyCount: 0,
        likeCount: 0
      }).then(tweet => {
        return res.status(200).json({
          id: tweet.id,
          status: 'success',
          message: 'Create tweet successfully'
        })
      })
    }
  }
}



module.exports = tweetController