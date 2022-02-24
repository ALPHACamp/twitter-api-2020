
const { User, Followship } = require('../models')
const authHelpers = require('../_helpers')

const followshipController = {
  postFollowships: async (req, res, next) => {

    try {
      const loginUserId = authHelpers.getUserId(req)
      const targetUserId = req.body.followingId
      const error = new Error()

      // 不允許追蹤自己
      if (loginUserId === targetUserId) {
        error.code = 403
        error.message = '使用者不允許追蹤自己'
        return next(error)
      }

      const targetUser = await User.findByPk(targetUserId)
      const loginUser = await User.findByPk(loginUserId)

      if (!targetUser) {
        error.code = 404
        error.message = '追蹤對象不存在'
        return next(error)
      }
      // await targetUser.increment('followerCount', { by: 1 })
      // await loginUser.increment('followingCount', { by: 1 })

      // const result = await Followship.create({
      //   followerId: loginUserId,
      //   followingId: targetUserId
      // })

      // return res.json({
      //   status: 'success',
      //   message: '成功追蹤對方',
      //   data: result
      // })

    } catch (error) {
      error.code = 500
      next(error)
    }
  }
}

exports = module.exports = followshipController
