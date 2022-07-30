const { Followship, User } = require('../models')
const helpers = require('../_helpers')

const followController = {
  addFollow: async (req, res, next) => {
    try {
      const followingId = Number(req.body.id)
      const followerId = Number(helpers.getUser(req).id)
      const following = await User.findByPk(followingId)
      const follower = await User.findByPk(followerId)
      if (!follower || !following) {
        return res.status(500).json({
          status: 'error',
          message: '找不到使用者!'
        })
      }

      const followship = await Followship.findOne({
        where: { followerId, followingId }
      })

      if (followship) {
        return res.status(500).json({
          status: 'error',
          message: '使用者已追蹤!'
        })
      }

      await Followship.create({
        followerId,
        followingId
      })

      return res.status(200).json({
        status: 'success',
        message: '成功追蹤!'
      })
    } catch (err) {
      next(err)
    }
  },
  removeFollow: async (req, res, next) => {
    try {
      const followingId = Number(req.params.followingId)
      const followerId = Number(helpers.getUser(req).id)
      const follower = await User.findByPk(followerId)
      const following = await User.findByPk(followingId)

      if (!follower || !following) {
        return res.status(500).json({
          status: 'error',
          message: '找不到使用者!'
        })
      }

      const followship = await Followship.findOne({
        where: { followerId, followingId }
      })

      if (!followship) {
        return res.status(500).json({
          status: 'error',
          message: '使用者未追蹤!'
        })
      }

      await followship.destroy()

      return res.status(200).json({
        status: 'success',
        message: '成功取消追蹤!'
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = followController
