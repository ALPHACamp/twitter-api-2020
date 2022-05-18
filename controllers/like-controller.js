const { Like } = require('../models')
const helpers = require('../_helpers')
const tweetService = require('../services/tweets')

const likeControler = {
  add: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const TweetId = Number(req.params.id)
      const like = await Like.findOne({
        where: {
          UserId,
          TweetId
        }
      })
      if (like) throw new Error('已經喜歡過了')
      await Like.create({
        UserId,
        TweetId
      })
      const data = await tweetService.getOne(TweetId, UserId)
      res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },
  remove: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const TweetId = Number(req.params.id)
      const like = await Like.findOne({
        where: {
          UserId,
          TweetId
        }
      })
      if (!like) throw new Error('已經不喜歡了')
      await Like.destroy({
        where: {
          UserId,
          TweetId
        }
      })
      const data = await tweetService.getOne(TweetId, UserId)
      res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  }
}
module.exports = likeControler
