const { Like } = require('../models')
const helpers = require('../_helpers')

const likeController = {
  postLikeToTweet: async (req, res, next) => {
    try {
      const currentUser = helpers.getUser(req)?.id
      const { id } = req.params

      if (!currentUser) throw new Error(`Server side can't get user id.`)
      if (!id) throw new Error(`Params /:id is required!`)

      await Like.findOrCreate({ where: { UserId: currentUser, TweetId: id } })

      res.json({ status: 'success' })
    } catch (error) {
      next(error)
    }
  },

  postUnlikeToTweet: async (req, res, next) => {
    try {
      const currentUser = helpers.getUser(req)?.id
      const { id } = req.params

      if (!currentUser) throw new Error(`Server side can't get user id.`)
      if (!id) throw new Error(`Params /:id is required!`)

      const userLikedTweet = await Like.findOne({ where: { UserId: currentUser, TweetId: id } })
      if (!userLikedTweet) throw new Error(`User didn't click like to this tweet!`)

      await Like.destroy({ where: { user_id: currentUser, tweet_id: id } })

      res.json({ status: 'success' })
    } catch (error) {
      next(error)
    }
  },
}

module.exports = likeController
