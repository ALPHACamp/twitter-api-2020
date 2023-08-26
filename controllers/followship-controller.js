const { Followship, User } = require('../models')
const helpers = require('../_helpers')

const followeshipController = {
  addFollowing: async (req, res, next) => {
    try {
      const userId = helpers.getUser(req).id
      const followingId = parseInt(req.body.id)
      const [user, followship] = await Promise.all([
        User.findByPk(userId),
        Followship.findOne({
          where: {
            followerId: userId,
            followingId
          }
        })
      ])
      if (userId === followingId) throw new Error('無法追蹤自己')
      if (!user) throw new Error('用戶不存在')
      if (followship) throw new Error('已追蹤此用戶')
      const newFollowing = await Followship.create({
        followerId: userId,
        followingId
      })
      return res.status(200).json(newFollowing)
    } catch (err) {
      return next(err)
    }
  },
  removeFollowing: async (req, res, next) => {
    try {
      const userId = helpers.getUser(req).id
      const followingId = parseInt(req.params.followingId) // 依照測試檔命名
      const [user, followship] = await Promise.all([
        User.findByPk(userId),
        Followship.findOne({
          where: {
            followerId: userId,
            followingId
          }
        })
      ])
      if (userId === followingId) throw new Error('無法退追蹤自己')
      if (!user) throw new Error('用戶不存在')
      if (!followship) throw new Error('尚未追蹤此用戶')
      const removeFollowing = await followship.destroy()
      return res.status(200).json(removeFollowing)
    } catch (err) {
      return next(err)
    }
  }
}

module.exports = followeshipController
