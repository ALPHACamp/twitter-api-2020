const { User, Followship, sequelize } = require('../models')
const helpers = require('../_helpers')

const followshipController = {
  postFollowship: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const targetUserId = Number(req.body.id)
      if (!targetUserId) throw new Error('此人不存在')
      if (currentUserId === targetUserId) {
        return res.status(400).json({
          status: 'error',
          message: '不能自己追蹤自己啦！'
        })
      }

      const data = await sequelize.transaction(async transaction => {
        // 判斷是否重複追蹤
        const followship = await Followship.findOne({
          where: { followerId: currentUserId, followingId: targetUserId }
        }, { transaction })

        if (followship) {
          return res.status(403).json({
            status: 'error',
            message: '無法重複追蹤使用者'
          })
        }

        const [result] = await Promise.all([
          // 建立追蹤關係
          Followship.create({ followerId: currentUserId, followingId: targetUserId }, { transaction }),
          // 增加追隨者
          User.increment('followerCount', {
            where: { id: targetUserId },
            by: 1,
            transaction
          }),
          // 增加跟隨者
          User.increment('followingCount', {
            where: { id: currentUserId },
            by: 1,
            transaction
          })
        ])
        return result
      })
      return res.status(200).json({
        status: 'success',
        data,
        message: '成功追蹤對方'
      })
    } catch (err) {
      next(err)
    }
  },
  deleteFollowship: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const targetUserId = Number(req.params.id)
      if (!targetUserId) throw new Error('此人不存在')
      if (currentUserId === targetUserId) {
        return res.status(400).json({
          status: 'error',
          message: '不能取消追蹤自己啦！'
        })
      }

      const data = await sequelize.transaction(async transaction => {
        // 判斷是否已取消追蹤
        const followship = await Followship.findOne({
          where: { followerId: currentUserId, followingId: targetUserId }
        }, { transaction })
        if (!followship) {
          return res.status(403).json({
            status: 'error',
            message: '該對象從未被追蹤'
          })
        }
        const targetFollowShip = await Followship.findOne({
          where: { followerId: currentUserId, followingId: targetUserId },
          transaction
        })
        await Promise.all([
          // 取消追蹤關係
          targetFollowShip.destroy({ transaction }),
          // 減少追蹤者人數
          User.decrement('followerCount', {
            where: { id: targetUserId },
            id: 1,
            transaction
          }),
          // 減少被追蹤者人數
          User.decrement('followingCount', {
            where: { id: currentUserId },
            id: 1,
            transaction
          })
        ])
        return targetFollowShip.toJSON()
      })
      return res.status(200).json({
        status: 'success',
        data,
        message: '成功取消追蹤對方'
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = followshipController
