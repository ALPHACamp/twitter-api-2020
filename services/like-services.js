const assert = require('assert')
const { Like, Tweet } = require('../models')
const helpers = require('../_helpers')

const likeServices = {
  // 新增Like
  addLike: (req, cb) => {
    // 使用helpers.getUser(req)拿到req.user for test檔模擬authenticated後的user format
    const UserId = helpers.getUser(req).id
    const TweetId = req.params.tweet_id
    return Promise.all([
      Tweet.findByPk(TweetId),
      Like.findOne({ where: { TweetId, UserId } })
    ])
      .then(([tweet, like]) => {
        // 後端驗證資料庫回傳
        console.log(111)
        assert(tweet, "The tweet doesn't exit!")
        assert(!like, "You've liked this tweet already!")
        console.log(222)
        return Like.create({
          UserId,
          TweetId
        })
      })
      .then(addLike => cb(null, { addLike }))
      .catch(err => cb(err))
  },
  // 收回like
  unLike: (req, cb) => {
    const UserId = helpers.getUser(req).id
    const TweetId = req.params.tweet_id
    return Promise.all([
      Tweet.findByPk(TweetId),
      Like.findOne({ where: { TweetId, UserId } })
    ])
      .then(([tweet, like]) => {
        // 後端驗證資料庫回傳
        assert(tweet, "The tweet doesn't exit!")
        assert(like, "You've not liked this tweet before!")
        // 軟刪除like
        return like.destroy()
      })
      .then(unLike => cb(null, { unLike }))
      .catch(err => cb(err))
  }
}
module.exports = likeServices
