const { Followship, User } = require('../models')
const helpers = require('../_helpers')
const followshipController = {
  addFollowing: async (req, res, next) => {
    try {
      const followerId = helpers.getUser(req).id
      const followingId = Number(req.body.id)
      if (followingId === followerId) throw new Error('Cannot follow yourself!')
      const user = await User.findByPk(followingId)
      if (!user) throw new Error('User not exist!')
      const isFollowed = await Followship.findOne({ where: { followingId, followerId } })
      if (isFollowed) throw new Error('You are already following this user')
      await Followship.create({
        followerId,
        followingId
      })
      return res.status(200).json('Successfully followed this user')
    } catch (err) { next(err) }
  },
  removeFollowing: async (req, res, next) => {
    try {
      const followerId = helpers.getUser(req).id
      const followingId = Number(req.params.followingId)
      const user = await User.findByPk(followingId)
      if (!user) throw new Error('User not exist!')
      const isFollowed = await Followship.findOne({ where: { followingId, followerId } })
      if (!isFollowed) throw new Error("You aren't following this user")
      await isFollowed.destroy()
      return res.status(200).json({ message: 'You have unfollowed each other!' })
    } catch (err) { next(err) }
  }
}

module.exports = followshipController
