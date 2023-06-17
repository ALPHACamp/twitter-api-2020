const { User, Followship } = require('../models')
const helpers = require('../_helpers')

const followshipController = {
  // 新增 POST /followships
  postFollowship: (req, res, next) => {
    const userId = helpers.getUser(req).id
    const { id } = req.body

    if (userId === Number(id)) throw new Error('不可追蹤自己')

    Promise.all([
      User.findByPk(userId),
      Followship.findOne({
        where: {
          followerId: userId,
          followingId: id
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error('此user不存在')
        if (followship) throw new Error('已追蹤過此user')
        return Followship.create({
          followerId: user.id,
          followingId: id
        })
      })
      .then(newFollowship => res.json(newFollowship))
      .catch(err => next(err))
  },
  // 刪除 DETELE /followships/:followingId
  deleteFollowship: (req, res, next) => {
    const userId = helpers.getUser(req).id
    const followingUserId = req.params.followingId

    if (userId === Number(followingUserId)) throw new Error('不可取消追蹤自己')

    Promise.all([
      User.findByPk(userId),
      Followship.findOne({
        where: {
          followerId: userId,
          followingId: followingUserId
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error('此user不存在')
        if (!followship) throw new Error('尚未追蹤過此user')
        return followship.destroy()
      })
      .then(deletedFollowship => res.json(deletedFollowship))
      .catch(err => next(err))
  }
}

module.exports = followshipController
