const { User, Followship } = require('../models')
const helpers = require('../_helpers')

const followshipController = {
  addFollowing: async (req, res, next) => {
    try {
      const followingId = req.body.id
      const currentUserId = helpers.getUser(req).id

      if (followingId === currentUserId) throw new Error("You can't follow yourself.")

      const user = await User.findByPk(followingId)
      if (!user || user.role === 'admin') throw new Error("User doesn't exist.")

      const followship = await Followship.findOne({
        where: {
          followerId: currentUserId,
          followingId
        }
      })

      if (followship) throw new Error('You are already follow this user.')

      const addFollowship = await Followship.create({
        followerId: currentUserId,
        followingId
      })
      res.status(200).json({ status: 'success', addFollowship })
    } catch (err) {
      next(err)
    }
  },
  removeFollowing: async (req, res, next) => {
    try {
      const followingId = req.params.id
      const currentUserId = helpers.getUser(req).id

      const user = await User.findByPk(followingId)
      if (!user || user.role === 'admin') throw new Error("User doesn't exist.")

      const followship = await Followship.findOne({
        where: {
          followingId,
          followerId: currentUserId
        }
      })

      if (!followship) throw new Error("You're not follower")

      await followship.destroy()
      res.status(200).json({
        status: 'success',
        message: 'Following remove'
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = followshipController
