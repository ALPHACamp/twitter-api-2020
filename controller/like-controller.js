const helpers = require('../_helpers')
const { Like } = require('../models')

const likeController = {
  likeTweet: async (req, res, next) => {
    try {
      const tweetId = req.params.id
      const userId = helpers.getUser(req).id
      const isLiked = await Like.findOne({
        where: { UserId: userId, TweetId: tweetId }
      })
      if (isLiked) throw new Error('This tweet has been liked!')
      await Like.create({
        UserId: userId,
        TweetId: tweetId
      })
      return res.status(200).json({ message: 'Liked post successfully!' })
    } catch (err) { next(err) }
  },
  unlikeTweet: async (req, res, next) => {
    try {
      const tweetId = req.params.id
      const userId = helpers.getUser(req).id
      const isLiked = await Like.findOne({
        where: { UserId: userId, TweetId: tweetId }
      })
      if (!isLiked) throw new Error('This tweet has not liked!')
      await isLiked.destroy()
      return res.status(200).json({ message: 'unLiked post successfully!' })
    } catch (err) { next(err) }
  }
}

module.exports = likeController
