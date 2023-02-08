const { Followship, User } = require('../models')
const helpers = require('../_helpers')

const followshipController = {
  addFollowing: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const followingId = Number(req.body.id)
      if (followingId === currentUserId) {
        return res.status(422).json({
          status: 'error',
          message: 'User can not follow themself.'
        })
      }
      const user = await User.findByPk(followingId, { raw: true })
      // follow a spooky ghost or admin
      if (!user || user.role === 'admin') {
        return res.status(404).json({
          status: 'error',
          message: 'The user does not exist.'
        })
      }
      const followship = await Followship.findOrCreate({ where: { followingId, followerId: currentUserId } })
      // the followship already exist
      if (followship[1] === false) {
        return res.status(422).json({
          status: 'error',
          message: 'You already followed the user.'
        })
      }
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
        return res.status(404).json({
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
