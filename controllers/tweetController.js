const { User, Tweet, Reply, Like, Followship } = require('../models')


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

  likeTweet: async (req, res, next) => {
    try {
      const { TweetId } = req.params
      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) return res.json({ status: 'error', message: '查無此推文' })
      const [like, created] = await Like.findOrCreate({
        where: {
          UserId: req.user.id,
          TweetId
        }
      })
      if (created) return res.json({ status: 'success', message: '成功按讚推文' })
      return res.json({ status: 'error', message: '推文已按過讚' })
    }
    catch (err) {
      next(err)
    }
  },

  unlikeTweet: async (req, res, next) => {
    try {
      const like = await Like.findOne({
        where: {
          UserId: req.user.id,
          TweetId: req.params.TweetId
        }
      })
      if (!like) return res.json({ status: 'error', message: '此推文並無按讚紀錄' })
      await like.destroy()
      return res.json({ status: 'success', message: '按讚紀錄已刪除' })
    }
    catch (err) {
      next(err)
    }
  },

  postReply: async (req, res, next) => {
    try {
      const { content } = req.body
      const { TweetId } = req.params
      if (!content) return res.json({ status: 'error', message: '回覆不得為空白' })
      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) return res.json({ status: 'error', message: '找不到此推文' })
      await Reply.create({
        content,
        UserId: req.user.id,
        TweetId
      })
      return res.json({ status: 'success', message: '回覆新增成功' })
    }
    catch (err) {
      next(err)
    }
  },

  likeReply: async (req, res, next) => {
    try {

    }
    catch (err) {
      next(err)
    }
  },

  unlikeReply: async (req, res, next) => {
    try {

    }
    catch (err) {
      next(err)
    }
  }

}

module.exports = tweetController