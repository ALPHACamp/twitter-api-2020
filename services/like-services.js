const { Like, Tweet } = require('../models')
const helper = require('../_helpers')

const likeService = {
  likeTweet: async (req, cb) => {
    try {
      // 檢查是否已經按過讚
      let like = await Like.findOne({
        where: {
          UserId: helper.getUser(req).id,
          TweetId: req.params.tweetId
        }
      })
      const tweet = await Tweet.findByPk(req.params.tweetId)
      console.log(like);
      console.log(req.params);
      //確認是否按過讚
      if (like) { throw new Error('不能對同一貼文按兩次讚!') }
      //確定有這個貼文
      else if (!tweet) { throw new Error('推文不存在!') }

      like = await Like.create({
        UserId: helper.getUser(req).id,
        TweetId: req.params.tweetId
      })
      like = like.toJSON()
      return cb(null, { like })
    } catch (err) {
      console.log(err);
      return cb(err)
    }
  },
  unlikeTweet: async (req, cb) => {
    try {
      const like = await Like.findOne({
        where: {
          UserId: helper.getUser(req).id,
          TweetId: req.params.tweetId
        }
      })
      if (!like) {
        throw new Error('您沒有按讚過這篇貼文!')
      }
      await like.destroy()
      return cb(null, like)
    } catch (err) {
      return cb(err)
    }
  }
}

module.exports = likeService