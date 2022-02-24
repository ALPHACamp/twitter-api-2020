
const { User, Followship } = require('../models')
const authHelpers = require('../_helpers')

const followshipController = {
  // 追蹤他人API
  postFollowships: async (req, res, next) => {

    try {
      const error = new Error()
      // 測試檔必檢查-請勿更動獲取方式
      const loginUserId = authHelpers.getUser(req).id
      const targetUserId = Number(req.body.id)

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

      const targetUser = await User.findByPk(targetUserId)
      const loginUser = await User.findByPk(loginUserId)

      // 找不到對象追蹤
      if (!targetUser) {
        error.code = 404
        error.message = '追蹤對象不存在'
        return next(error)
      }

      // 可以追蹤的狀態

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
      // 系統出錯
      error.code = 500
      return next(error)

    }
  },
  // 取消追蹤他人API
  deleteFollowships: async (req, res, next) => {

    try {
      const error = new Error()
      // 測試檔必檢查-請勿更動獲取方式
      const loginUserId = authHelpers.getUser(req).id
      const targetUserId = Number(req.params.id)
      const targetUser = await User.findByPk(targetUserId)
      const loginUser = await User.findByPk(loginUserId)

      // 不允許取消追蹤自己
      if (loginUserId === targetUserId) {
        return res
          .status(200)
          .json({
            status: 'error',
            message: '使用者不能取消追蹤自己'
          })
      }

      // 找不到對象可以取消追蹤
      if (!targetUser) {
        error.code = 404
        error.message = '取消追蹤對象不存在'
        return next(error)
      }

      // 不可取消從未追蹤過的對象
      const isExistFollowship = await Followship.findOne({
        where: {
          followerId: loginUserId,
          followingId: targetUserId
        }
      })

      if (!isExistFollowship) {
        error.code = 403
        error.message = '該對象從未被追蹤，不可取消追蹤'
        return next(error)
      }


      // 可以取消追蹤的狀態

      await targetUser.decrement('followerCount', { by: 1 })
      await loginUser.decrement('followingCount', { by: 1 })


      const result = await Followship.findOne({
        where: {
          followerId: loginUserId,
          followingId: targetUserId,
        }
      })
        .then(followship => followship.destroy())

      return res
        .status(200)
        .json({
          status: 'success',
          message: '成功取消追蹤對方',
          data: result
        })

    } catch (error) {
      // 系統出錯
      error.code = 500
      next(error)
    }

  }
}

exports = module.exports = followshipController
