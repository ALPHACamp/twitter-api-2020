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
      }).then(() => cb({ status: '200', message: '追蹤成功' }))
    })
      .catch(err => {
        console.warn(err)
        return cb({ status: '500', message: err })
      })
  }
}

module.exports = followshipService