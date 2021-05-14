const db = require('../models')
const Followship = db.Followship
const User = db.User
const helpers = require('../_helpers')

const followshipController = {
  followUser: async (req, res, next) => {
    try {
      const followingId = req.params.id
      const followingUser = await User.findOne({ where: { id: followingId, $not: { id: 1 } } })
      const followerId = req.user.id

      if (Number(followingId) !== followerId) {
        const followship = await Followship.findOne({ where: { followingId, followerId } })

        if (followship) {
          return res
            .status(409)
            .json({
              status: 'error',
              message: `already followed @${followingUser.account}`
            })
        }

        if (!followingUser) {
          return res
            .status(200)
            .json({
              status: 'error',
              message: 'this user doesn\'t exist'
            })
        }

        await Followship.create({
          followerId,
          followingId
        })

        return res
          .status(200)
          .json({
            status: 'success',
            message: `followed @${followingUser.account}`,
            followingUser
          })
      }

      return res
        .status(403)
        .json({
          status: 'error',
          message: 'You cannot follow yourself.'
        })
    } catch (error) {
      next(error)
    }
  },

  unfollowUser: async (req, res, next) => {
    try {
      const followingId = req.params.id
      const followerId = req.user.id
      const unfollowedUser = await User.findOne({ where: { id: followingId, $not: { id: 1 } } })
      const followship = await Followship.findOne({ where: { followingId, followerId } })

      // 排除 unfollowedUser 不存在的狀況
      if (!unfollowedUser) {
        return res
          .status(200)
          .json({
            status: 'error',
            message: 'cannot unfollow an user that doesn\'t exist'
          })
      }

      // unfollowUser function 排除找不到 user 的狀況（const user = await Followship.findOne({ where: { followingId } }) ）
      if (!followship) {
        return res
          .status(200)
          .json({
            status: 'error',
            message: 'cannot unfollow since you haven\'t followed this user before'
          })
      }

      await followship.destroy()

      return res
        .status(200)
        .json({
          status: 'success',
          message: `Unfollowed ${unfollowedUser.account}`
        })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = followshipController
