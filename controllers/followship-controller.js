
const { User, Followship } = require('../models')
const authHelpers = require('../_helpers')

const followshipController = {
  postFollowships: async (req, res, next) => {

    try {
      const error = new Error()
      // 測試檔必檢查-請勿更動獲取方式
      const loginUserId = authHelpers.getUser(req).id
      const targetUserId = Number(req.body.id)
      // const error = new Error()

      // 不允許追蹤自己
      if (loginUserId === targetUserId) {
        return res
          .status(200)
          .json({
            status: 'error',
            message: '使用者不能追蹤自己'
          })
      }

      // 不可重複追蹤
      const isExistFollowship = await Followship.findOne({
        where: {
          followerId: loginUserId,
          followingId: targetUserId
        }
      })

      if (isExistFollowship) {
        error.code = 403
        error.message = '該對象已被追蹤，不可重複追蹤'
        return next(error)
      }

      // 可以追蹤的狀態


      const targetUser = await User.findByPk(targetUserId)
      const loginUser = await User.findByPk(loginUserId)


      if (!targetUser) {
        error.code = 404
        error.message = '追蹤對象不存在'
        return next(error)
      }


      await targetUser.increment('followerCount', { by: 1 })
      await loginUser.increment('followingCount', { by: 1 })


      const result = await Followship.create({
        followerId: loginUserId,
        followingId: targetUserId,
      })

      return res
        .status(200)
        .json({
          status: 'success',
          message: '成功追蹤對方',
          data: result
        })

    } catch (error) {
      error.code = 500
      return next(error)

    }
  }
}

exports = module.exports = followshipController
