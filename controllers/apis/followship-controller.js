const db = require('../../models')
const { User, Followship } = db
const helpers = require('../../_helpers')

const followshipController = {
  followUser: async (req, res, next) => {
    try {
      const followedUserId = req.body.id
      const getUser = helpers.getUser(req)
      const userId = getUser.id
      const [user, followship] = await Promise.all([
        User.findByPk(userId),
        Followship.findOne({
          where: { followerId: followedUserId, followingId: userId }
        })
      ])
      if (!user) throw new Error("User didn't exist!")
      if (followship) throw new Error("You've are already followed this user!")
      Followship.create({
        followerId: followedUserId,
        followingId: userId
      })
      res.json({
        status: 'success',
        message: 'successfully follow user!'
      })
    } catch (err) {
      next(err)
    }
  },
  unfollowUser: (req, res, next) => {},
  getTop10: (req, res, next) => {}
}

module.exports = followshipController
