const helpers = require('../../_helpers')
const { User, Followship } = require('../../models')

const followController = {
  postFollowing: async (req, res, next) => {
    try {
      const followerId = Number(helpers.getUser(req).id)
      const followingId = Number(req.body.id)

      const following = await User.findByPk(followingId, { raw: true })
      const follower = await User.findByPk(followerId, { raw: true })

      const followshiped = await Followship.findOne({
        where: {
          followerId,
          followingId
        }
      })

      if (followerId === followingId) throw new Error("Can't follow yourself!")
      if (!following) throw new Error("User didn't exist!")
      if (followshiped) throw new Error('You are already following this user!')

      const followship = await Followship.create({
        followerId,
        followingId
      })
      return res.json({
        status: 'success',
        data: {
          followship: followship.toJSON(),
          following: {
            ...following,
            isFollowed: true
          },
          follower: {
            ...follower
          }
        }
      })
    } catch (err) {
      next(err)
    }
  },
  deleteFollowing: async (req, res, next) => {
    try {
      const followerId = helpers.getUser(req).id
      const { followingId } = req.params

      const following = await User.findByPk(followingId, { raw: true })
      const follower = await User.findByPk(followerId, { raw: true })

      const deleteFollowship = await Followship.findOne({
        where: {
          followerId,
          followingId
        }
      })

      if (!following) throw new Error("User didn't exist!")
      if (!deleteFollowship) throw new Error("You haven't followed this user!")

      await deleteFollowship.destroy()
      return res.json({
        status: 'success',
        data: {
          deleteFollowship: deleteFollowship.toJSON(),
          following: {
            ...following,
            isFollowed: false
          },
          follower: {
            ...follower
          }
        }
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = followController
