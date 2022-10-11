const { Followship, User } = require('../models')
const helpers = require('../_helpers')
const followshipController = {
  addFollowing: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const followingId = Number(req.body.id)

      // 400 follow self
      if (followingId === currentUserId) throw new Error('User can not follow themself.')

      // 404 follow a spooky ghost or admin
      const user = await User.findByPk(followingId, { raw: true })
      if (!user || user.role === 'admin') {
        res.status(404).json({
          status: 'error',
          message: 'The user does not exist.'
        })
      }

      // 400 wanna follow same user
      const followship = await Followship.findOne({
        where: { followingId, followerId: currentUserId }
      })
      if (followship) throw new Error('You already followed the user.')

      // create this followShip
      await Followship.create({
        followingId,
        followerId: currentUserId
      })

      // res 200 success
      return res.status(200).json({ status: 'success' })
    } catch (err) {
      next(err)
    }
  },
  deleteFollowing: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const followingId = Number(req.params.followingId)
      const result = await Followship.destroy({ where: { followingId, followerId: currentUserId } })
      // if result = 0, return status 404 for not found followship
      if (!result) {
        res.status(404).json({
          status: 'error',
          message: 'You have not followed the user or the user dose not exist.'
        })
      }
      // if result = 1, return status 200 for success
      return res.status(200).json({ status: 'success' })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = followshipController
