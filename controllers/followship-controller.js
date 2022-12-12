const { User, Followship } = require('../models')
const { getUser } = require('../_helpers')

const followshipController = {
  followUser: async (req, res, next) => {
    try {
      const followerId = Number(getUser(req).id)
      const followingId = Number(req.body.id)
      if (!followingId) throw new Error('following id is required')
      const followingUser = await User.findOne({ where: { id: followingId, role: 'user' } })
      if (!followingUser) throw new Error("user didn't exist")
      if (followerId === followingId) throw new Error("you can't follow yourself")
      const isFollowed = await Followship.findOne({ where: { followerId, followingId } })
      if (isFollowed) throw new Error('you have already followed this user')
      const data = await Followship.create({ followerId, followingId })
      res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },
  unfollowUser: async (req, res, next) => {
    try {
      const followerId = getUser(req).id
      const followingId = req.params.id
      const isFollowed = await Followship.findOne({ where: { followerId, followingId } })
      if (!isFollowed) throw new Error("you haven't followed this user")
      const data = await isFollowed.destroy()
      res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = followshipController
