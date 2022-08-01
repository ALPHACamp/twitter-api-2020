const helpers = require('../_helpers')
const { Followship, User } = require('../models')

const followController = {
  addFollow: async (req, res, next) => {
    try {
      const followerId = Number(helpers.getUser(req).id)
      const followingId = Number(req.body.id)
      if (!followerId || !followingId) {
        return res.status(400).json({
          status: 'error',
          message: 'followerId and followingId required'
        })
      }

      if (followerId === followingId) {
        return res.status(401).json({
          status: 'error',
          message: 'Can not follow yourself.'
        })
      }

      const followed = await Followship.findOne({
        where: { followerId, followingId }
      })
      if (followed) {
        return res.status(401).json({
          status: 'error',
          message: 'Already followed'
        })
      }

      await Followship.create({ followerId, followingId })
      return res.status(200).json({
        status: 'success',
        message: 'Followship added'
      })
    } catch (err) {
      next(err)
    }
  },
  removeFollow: async (req, res, next) => {
    try {
      const followerId = Number(helpers.getUser(req).id)
      const followingId = Number(req.params.followingId)
      if (!followerId || !followingId) {
        return res.status(400).json({
          status: 'error',
          message: 'followerId and followingId required'
        })
      }

      const follower = await User.findByPk(followerId)
      const following = await User.findByPk(followingId)
      if (!follower || !following) {
        return res.status(401).json({
          status: 'error',
          message: 'Follower or following not exists.'
        })
      }

      const followship = await Followship.findOne({
        where: { followerId, followingId }
      })
      if (!followship) {
        return res.status(401).json({
          status: 'error',
          message: 'Not followed yet'
        })
      }

      await followship.destroy()
      return res.status(200).json({
        status: 'success',
        message: 'Remove followed success'
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = followController
