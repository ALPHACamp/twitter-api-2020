const helpers = require('../_helpers')
const { User, Followship } = require('../models')

const followController = {
  addFollowing: (req, res, next) => {
    const followerId = Number(helpers.getUser(req)?.id) // 要追蹤人的使用者
    const followingId = req.body.id // 使用者要追蹤的人
    Promise.all([
      User.findByPk(followingId),
      Followship.findOne({
        where: {
          followerId,
          followingId
        }
      })
    ])
      .then(([user, followship]) => {
        if (user.id === followerId) throw new Error("Can't follow yourself!") // 不能追蹤自己
        if (!user) throw new Error("User didn't exist!") // 使用者不存在
        if (followship) throw new Error('Already following this user!') // 不能重複追蹤

        return Followship.create({
          followerId,
          followingId
        })
      })
      .then(() => res.json({ success: true, message: 'Followed successfully' }))
      .catch(err => next(err))
  },
  removeFollowing: (req, res, next) => {
    const followerId = Number(helpers.getUser(req)?.id) // 要取消追蹤人的使用者
    const followingId = req.params.followingId // 使用者要取消追蹤的人
    return Promise.all([
      User.findByPk(followingId),
      Followship.findOne({
        where: {
          followerId,
          followingId
        }
      })
    ])
      .then(([user, followship]) => {
        if (user.id === followerId) throw new Error("Can't follow yourself!") // 不能追蹤自己
        if (!user) throw new Error("User didn't exist!") // 使用者不存在
        if (!followship) throw new Error("Haven't followed this user")
        return followship.destroy()
      })
      .then(() => res.json({ success: true, message: 'Removed following successfully' }))
      .catch(err => next(err))
  }
}

module.exports = followController
