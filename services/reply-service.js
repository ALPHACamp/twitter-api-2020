const { Tweet, User, Reply } = require('../models')
// const { imgurFileHandler } = require('../helpers/file-helpers') // 引入處理檔案上傳的 helper

const replyServices = {
  postComment: (req, cb) => {
    const tweetId = req.params.tweet_id
    return Tweet.findByPk(tweetId, {
      include: [Reply]
    }).then(tweet => {
      const { comment } = req.body
      const userId = req.user.user_id
      console.log('userId', userId)
      console.log('user.id', req.user.user_id)
      if (!comment) throw new Error('Comment text is required!')
      if (!tweet) throw new Error("Tweet didn't exist!")
      return Reply.create({
        userId,
        tweetId,
        comment
      })
    }).then(reply => cb(null, { reply }))
      .catch(err => cb(err))
  },
  getComment: (req, cb) => {
    const tweetId = req.params.tweet_id
    return Tweet.findByPk(tweetId, { include: [Reply] }).then(tweet => cb(null, { tweet }))
      .catch(err => cb(err))
  }
}

module.exports = replyServices