
const {
  User,
  Followship,
  sequelize
} = require('../models')
const authHelpers = require('../_helpers')

const followshipController = {
  // 追蹤他人API
  postFollowships: async (req, res, next) => {

    try {
      const error = new Error()
      // 測試檔必檢查-請勿更動獲取方式
      const loginUserId = authHelpers.getUser(req).id
      let targetUserId = req.body.id


      // 找不到對象追蹤
      if (isNaN(targetUserId) || !(await User.findByPk(targetUserId))) {
        error.code = 404
        error.message = '追蹤對象不存在'
        return next(error)
      }

      targetUserId = Number(targetUserId)

      // 不允許追蹤自己
      if (loginUserId === targetUserId) {
        return res
          .status(200)
          .json({
            status: 'error',
            message: '使用者不能追蹤自己'
          })
      }

      const data = await sequelize.transaction(async t => {

        // 不可重複追蹤
        const isExistFollowship = await Followship.findOne({
          where: { followerId: loginUserId, followingId: targetUserId }
        }, { transaction: t })

        if (isExistFollowship) {
          error.code = 403
          error.message = '該對象已被追蹤，不可重複追蹤'
          return next(error)
        }

        // 可以追蹤的狀態
        const [result] = await Promise.all([
          // 建立追蹤關係
          Followship.create({
            followerId: loginUserId, followingId: targetUserId,
          }, { transaction: t }),
          // 增加使用者追隨他人的數量
          User.increment('followerCount', {
            where: { id: targetUserId }, by: 1,
            transaction: t
          }),
          // 增加使用者的跟隨者數量
          User.increment('followingCount', {
            where: { id: loginUserId }, by: 1,
            transaction: t
          })
        ])
        return result
      })

      return res
        .status(200)
        .json({
          status: 'success',
          message: '成功追蹤對方',
          data
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
      let targetUserId = req.params.id

      // 找不到對象可以取消追蹤
      if (isNaN(targetUserId) || !(await User.findByPk(targetUserId))) {
        error.code = 404
        error.message = '取消追蹤對象不存在'
        return next(error)
      }

      targetUserId = Number(targetUserId)

      // 不允許取消追蹤自己
      if (loginUserId === targetUserId) {
        return res
          .status(200)
          .json({
            status: 'error',
            message: '使用者不能取消追蹤自己'
          })
      }

      const data = await sequelize.transaction(async t => {

        // 不可取消從未追蹤過的對象
        const isExistFollowship = await Followship.findOne({
          where: { followerId: loginUserId, followingId: targetUserId }
        }, { transaction: t })


        if (!isExistFollowship) {
          error.code = 403
          error.message = '該對象從未被追蹤，不可取消追蹤'
          return next(error)
        }

        const targetFollowShip = await Followship.findOne({
          where: { followerId: loginUserId, followingId: targetUserId },
          transaction: t
        })

        // 可以取消追蹤的狀態
        await Promise.all([
          // 取消追蹤關係
          targetFollowShip.destroy({ transaction: t }),
          // 減少使用者的追蹤者人數
          User.decrement('followerCount', {
            where: { id: targetUserId }, id: 1,
            transaction: t
          }),
          // 減少使用者所追蹤的人的數量
          User.decrement('followingCount', {
            where: { id: loginUserId }, id: 1,
            transaction: t
          })
        ])

        return targetFollowShip.toJSON()

      })


      return res
        .status(200)
        .json({
          status: 'success',
          message: '成功取消追蹤對方',
          data
        })

    } catch (error) {
      // 系統出錯
      error.code = 500
      next(error)
    }

  }
}

exports = module.exports = followshipController
