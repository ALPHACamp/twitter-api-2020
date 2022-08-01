const { Like } = require('../models')
const helpers = require('../_helpers')

const likeController = {
  postLikeToTweet: async (req, res, next) => {
    try {
      const theSignInUserId = helpers.getUser(req)?.id
      const { id } = req.params

      if (!theSignInUserId) throw new Error(`Server side can't get user id.`)
      if (!id) throw new Error(`Params /:id is required!`)

      await Like.findOrCreate({ where: { UserId: theSignInUserId, TweetId: id } })

      res.status(200).json({ status: 'success' })
    } catch (error) {
      next(error)
    }
  },

  postUnlikeToTweet: async (req, res, next) => {
    try {
      const theSignInUserId = helpers.getUser(req)?.id
      const { id } = req.params

      if (!theSignInUserId) throw new Error(`Server side can't get user id.`)
      if (!id) throw new Error(`Params /:id is required!`)

      const userLikedTweet = await Like.findOne({ where: { UserId: theSignInUserId, TweetId: id } })
      if (!userLikedTweet) throw new Error(`User didn't click like to this tweet!`)

      await Like.destroy({ where: { user_id: theSignInUserId, tweet_id: id } })

      res.status(200).json({ status: 'success' })
    } catch (error) {
      next(error)
    }
  },
}

module.exports = likeController
