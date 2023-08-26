const db = require('../../models')
const { User, Followship } = db
const helpers = require('../../_helpers')

const followshipController = {
  followUser: async (req, res, next) => {
    try {
      const followingId = req.body.id
      const getUser = helpers.getUser(req)
      const userId = getUser.id
      const [user, followship] = await Promise.all([
        User.findByPk(userId),
        Followship.findOne({
          where: { followerId: userId, followingId }
        })
      ])
      if (!user) throw new Error("User didn't exist!")
      if (followship) throw new Error("You've are already followed this user!")
      Followship.create({
        followerId: userId,
        followingId
      })
      res.json({
        status: 'success',
        message: 'successfully follow user!'
      })
    } catch (err) {
      next(err)
    }
  },
  unfollowUser: async (req, res, next) => {
    try {
      const followingId = req.params.following_id
      const getUser = helpers.getUser(req)
      const userId = getUser.id
      const [user, followship] = await Promise.all([
        User.findByPk(userId),
        Followship.findOne({
          where: { followerId: userId, followingId }
        })
      ])
      if (!user) throw new Error("User didn't exist!")
      if (!followship) throw new Error("You haven't followed this user!")
      Followship.destroy({
        where: { followerId: userId, followingId }
      })
      res.json({
        status: 'success',
        message: 'successfully unfollow user!'
      })
    } catch (err) {
      next(err)
    }
  },
  getTop10: (req, res, next) => {}
}

module.exports = followshipController
