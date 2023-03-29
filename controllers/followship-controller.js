const { User, Followship } = require('../models')
const createError = require('http-errors')
const helpers = require('../_helpers')

const followshipController = {
  postFollowships: async (req, res, next) => {
    try {
      const loginUserId = helpers.getUser(req).id
      const { id } = req.body

      const [user, followship] = await Promise.all([
        User.findByPk(id),
        Followship.findOne({
          where: {
            followerId: loginUserId,
            followingId: id
          }
        })
      ])

      if (!user || user.role === 'admin') {
        throw createError(404, '帳號不存在')
      }
      if (user.id === loginUserId) {
        throw createError(400, '無法追蹤自己')
      }
      if (followship) {
        throw createError(400, '已追蹤該使用者')
      }

      await Followship.create({
        followerId: loginUserId,
        followingId: Number(id)
      })

      return res.json({
        status: 'success',
        message: '使用者新增追蹤成功'
      })
    } catch (err) {
      return next(err)
    }
  },
  deleteFollowships: async (req, res, next) => {
    const loginUserId = helpers.getUser(req).id
    const userId = Number(req.params.followingId)

    try {
      const followship = await Followship.findOne({
        where: {
          followerId: loginUserId,
          followingId: userId
        }
      })

      if (!followship) throw createError(400, '沒有追蹤該使用者')

      await followship.destroy()

      return res.json({
        status: 'success',
        message: '使用者取消追蹤成功'
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = followshipController
