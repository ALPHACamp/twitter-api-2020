const { User, Followship } = require('../models')

const followshipServices = {
  addFollowing: async (followerId, followingId) => {

    if (followerId === followingId) throw new Error("You can't follow yourself")

    const user = await User.findByPk(followingId, { raw: true })
    if (!user) throw new Error("followingId is required")

    const [isFollowed, created] = await Followship.findOrCreate({
      where: { followerId, followingId }
    })

    if (!created) throw new Error("You have already follow this user!")

    Promise.all([
      User.findByPk(followerId),
      User.findByPk(followingId)
    ]).then(([following, follower]) => {
      following.increment('followingCount')
      follower.increment('followerCount')
    })

    return {
      isFollowed,
      status: 'success',
      message: 'Add following successfully'
    }
  },
  removeFollowing: async (followerId, followingId) => {
    const removeResult = await Followship.destroy({
      where: {
        followerId,
        followingId
      }
    })

    if (!removeResult) throw new Error("You haven't following him!")

    Promise.all([
      User.findByPk(followerId),
      User.findByPk(followingId)
    ]).then(([following, follower]) => {
      following.decrement('followingCount')
      follower.decrement('followerCount')
    })

    return {
      removeResult,
      status: 'success',
      message: 'Remove following successfully'
    }
  }
}


module.exports = followshipServices