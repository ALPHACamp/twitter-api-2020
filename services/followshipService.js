const db = require('../models')
const { Followship, User } = db

const followshipService = {
  followUser: (req, res, cb) => {
    if (req.user.id == req.body.id) return cb({ status: '400', message: '不能追蹤自己' })
    Promise.all([
      User.findByPk(req.body.id),
      Followship.findOne({
        where: {
          followerId: req.user.id,
          followingId: req.body.id,
        }
      })
    ]).then(([user, followship]) => {
      if (user === null) return cb({ status: '400', message: '用戶不存在，無法追蹤' })
      if (followship) return cb({ status: '400', message: '您已經正在追蹤此用戶，不可重複追蹤' })
      Followship.create({
        followerId: req.user.id,
        followingId: req.body.id
      }).then((followship) => cb({ status: '200', message: '追蹤成功', id: followship.id }))
    })
      .catch(err => {
        console.warn(err)
        return cb({ status: '500', message: err })
      })
  },
  unFollowUser: async (req, res, cb) => {
    try {
      const followship = await Followship.findOne({
        where: {
          followerId: req.user.id,
          followingId: req.params.followingId,
        }
      })
      if (followship !== null) {
        await followship.destroy()
        return cb({ status: '200', message: '取消追蹤成功' })
      }
      return cb({ status: '400', message: '不存在的追蹤關係，故取消追蹤動作失敗' })
    } catch (err) {
      return cb({ status: '500', message: err })
    }
  }
}

module.exports = followshipService