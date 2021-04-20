const db = require('../models')
const Followship = db.Followship
const User = db.User
const helpers = require('../_helpers')

const followshipController = {
  followUser: async (req, res) => {
    try {
      const followingId = req.body.id
      const followingUser = await User.findByPk(followingId)
      const followerId = helpers.getUser(req).id

      if (Number(followingId) !== followerId) {
        const followed = await Followship.findOne({ where: { followingId } })

        if (followed) {
          return res.json({
            status: 'error',
            message: `already followed @${followingUser.account}`
          })
        }

        if (!followingUser) {
          return res.json({
            status: 'error',
            message: 'this user doesn\'t exist'
          })
        }

        await Followship.create({
          followerId,
          followingId, // 前端要埋在 form 裡傳過來
          createdAt: new Date(),
          updatedAt: new Date()
        })
        return res.json({
          status: 'success',
          message: `followed @${followingUser.account}`,
          followingUser
        })
      }

      return res.json({
        status: 'error',
        message: 'You cannot follow yourself.'
      })
    } catch (error) {
      console.log(error)
    }
  },

  unfollowUser: async (req, res) => {
    try {
      const followingId = req.params.followingId
      const unfollowedUser = await User.findByPk(followingId)
      const user = await Followship.findOne({ where: { followingId } })

      // 排除 unfollowedUser 不存在的狀況
      if (!unfollowedUser) {
        return res.json({
          status: 'error',
          message: 'cannot unfollow an user that doesn\'t exist'
        })
      }

      // unfollowUser function 排除找不到 user 的狀況（const user = await Followship.findOne({ where: { followingId } }) ）
      if (!user) {
        return res.json({
          status: 'error',
          message: 'unable to perform unfollow since you haven\'t followed this user before'
        })
      }

      await user.destroy()
      return res.json({
        status: 'success',
        message: `Unfollowed ${unfollowedUser.account}`
      })
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = followshipController
