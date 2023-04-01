const { User, Followship } = require('../models')
const createError = require('http-errors')
const helpers = require('../_helpers')

const followshipController = {
  postFollowships: async (req, res, next) => {
    try {
      const loginUser = helpers.getUser(req)
      const { id } = req.body

      const [user, followship] = await Promise.all([
        User.findByPk(id, {
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          }
        }),
        Followship.findOne({
          where: {
            followerId: loginUser.id,
            followingId: id
          }
        })
      ])

      if (!user || user.role === 'admin') throw createError(404, '帳號不存在')
      if (user.id === loginUser.id) throw createError(400, '無法追蹤自己')
      if (followship) throw createError(400, '已追蹤該使用者')

      const newFollowship = await Followship.create({
        followerId: loginUser.id,
        followingId: Number(id)
      })

      const { updatedAt, ...data } = newFollowship.toJSON()

      const result = {
        ...data,
        Followings: {
          account: user.account,
          name: user.account,
          introduction: user.introduction,
          avatar: user.avatar,
          isFollowed: true
        }
      }

      return res.json(result)
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
