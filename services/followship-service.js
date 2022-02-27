const { User, Followship } = require('../models')

const followshipController = {
  addFollowing: async (req, cb) => {
    try {
      const followerId = req.user?.id
      const followingId = req.body.id

      if (followerId === followingId) {
        return cb(new Error('The user cannot follow himself / herself.'))
      }
      const followingUser = await User.findByPk(followingId)
      if (!followingUser) {
        return cb(new Error('The user who wants to follow does not exist.'))
      }

      const currentUser = await User.findByPk(followerId)
      if (!currentUser) {
        return cb(new Error('The user does not exist.'))
      }

      const checkedFollowships = await Followship.findOne({
        where: {
          followerId,
          followingId
        }
      })

      if (checkedFollowships) {
        return cb(null, {
          status: 'success',
          isFollowing: true,
          message: 'The followship already exist.'
        })
      }
      const newFollowship = await Followship.create({
        followerId,
        followingId
      })

      const followshipData = {
        status: 'success',
        isFollowing: true,
        data: {
          Followship: newFollowship.dataValues
        }
      }
      return cb(null, followshipData)
    } catch (err) {
      return cb(err)
    }
  },
  removeFollowing: async (req, cb) => {
    try {
      const followerId = req.user?.id
      const followingId = req.params.followingId
      const checkedFollowships = await Followship.findOne({
        where: {
          followerId,
          followingId
        }
      })
      if (!checkedFollowships) {
        return cb(null, {
          status: 'success',
          isFollowing: false,
          message: 'The followship does not exist.'
        })
      }
      const deletedFollowship = await checkedFollowships.destroy()
      const followshipData = {
        status: 'success',
        isFollowing: false,
        data: {
          Followship: deletedFollowship.dataValues
        }
      }

      return cb(null, followshipData)
    } catch (err) {
      return cb(err)
    }
  }

}

module.exports = followshipController
