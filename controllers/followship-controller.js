const { User, Followship } = require('../models')
const helpers = require('../_helpers')

const followshipController = {
  addFollowing: async (req, res, next) => {
    try {
      const followingId = req.body.id
      if (!followingId) throw new Error('Following id is required!')
      const getUser = helpers.getUser(req)
      const userId = getUser.id
      if (userId.toString() === followingId) throw new Error("Can't follow yourself!")
      const [followship, user] = await Promise.all([
        Followship.findOne({
          where: {
            followerId: userId,
            followingId
          }
        }),
        User.findByPk(followingId)
      ])
      if (followship) throw new Error('You are already following this user!')
      if (!user) throw new Error("User didn't exist!")
      const createdFollowship = await Followship.create({
        followerId: userId,
        followingId
      })
      res.json({
        status: 'success',
        followship: createdFollowship
      })
    } catch (err) {
      next(err)
    }
  },
  deleteFollowing: async (req, res, next) => {
    try {
      const followingId = req.params.followingId
      const getUser = helpers.getUser(req)
      const userId = getUser.id
      const followship = await Followship.findOne({
        where: {
          followerId: userId,
          followingId
        }
      })
      if (!followship) throw new Error("You haven't following this user!")
      await followship.destroy()
      res.json({
        status: 'success',
        message: 'Followship deleted successfully'
      })
    } catch (err) {
      next(err)
    }
  },
  getTopUser: async (req, res, next) => {
    try {
      const users = await User.findAll({
        include: [{ model: User, as: 'Followers', attributes: { exclude: ['password'] } }],
        attributes: { exclude: ['password'] }
      })
      const result = users
        .map(user => ({
          ...user.toJSON(),
          followerCount: user.Followers.length,
          isFollowed: req.user.Followings.some(f => f.id === user.id)
        }))
        .filter(user => user.role === 'user')
        .sort((a, b) => b.followerCount - a.followerCount)
        .slice(0, 10) // 只留top 10
      return res.json({ users: result })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = followshipController
