const { User, Followship } = require('../models')
const createError = require('http-errors')
const helpers = require('../_helpers')

const followshipController = {
  postFollowships: (req, res, next) => {
    const loginUserId = helpers.getUser(req).id
    const { id } = req.body

    // 用 req.body 代入要追蹤的 id
    // 在 Uer table 找出對應的 id
    // 在 Followship 找出 follower 為登入者，following 為要追蹤的 id
    Promise.all([
      User.findByPk(id),
      Followship.findOne({
        where: {
          followerId: loginUserId,
          followingId: id
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw createError(404, '該使用者不存在')
        if (user.id === loginUserId) throw createError(422, '無法追蹤自己')
        if (followship) throw createError(422, '已追蹤該使用者')

        // 建立 Followship，follower 是登入者，following 是要追蹤的 id
        return Followship.create({
          followerId: loginUserId,
          followingId: Number(id)
        })
      })
      .then(() => res.json({
        status: 'success',
        message: '使用者新增追蹤成功'
      }))
      .catch(err => next(err))
  },
  deleteFollowships: (req, res, next) => {
    const loginUserId = helpers.getUser(req).id
    const userId = Number(req.params.followingId)

    // 找出 Followship table, follower 為登入者, following 為要取消追蹤者
    Followship.findOne({
      where: {
        followerId: loginUserId,
        followingId: userId
      }
    })
      .then(followship => {
        if (!followship) throw createError(422, '沒有追蹤該使用者')

        return followship.destroy()
      })
      .then(() => res.json({
        status: 'success',
        message: '使用者取消追蹤成功'
      }))
      .catch(err => next(err))
  }
}

module.exports = followshipController
