const { User, Followship } = require('../models')
const helpers = require('../_helpers')

const followshipController = {
  postFollowship: async (req, res, next) => {
    try {
      const userId = req.body.id
      if (Number(userId) === helpers.getUser(req).id) {
        return res.status(400).json({ status: 'error', message: '無法追蹤自己' })
      }
      const [user, followship] = await Promise.all([
        User.findByPk(Number(userId)),
        Followship.findOne({
          where: {
            followingId: userId,
            followerId: helpers.getUser(req).id
          }
        })
      ])
      if (!user || user.role === "admin") {
        return res
          .status(404)
          .json({ status: "error", message: "找不到使用者" });
      }
      if (followship) {
        return res.status(404).json({ status: 'error', message: '你已追蹤此使用者!' })
      }
      await Followship.create({
        followingId: userId,
        followerId: helpers.getUser(req).id
      })
      return res.status(200).json({ status: 'success', message: '追蹤成功！' })
    } catch (error) {
      next(error)
    }
  },
  deleteFollowship: async (req, res, next) => {
    try {
      const { followingId } = req.params
      if (Number(followingId) === helpers.getUser(req).id) {
        return res.status(400).json({ status: 'error', message: '無法取消追蹤自己' })
      }
      const [user, followship] = await Promise.all([
        User.findByPk(Number(followingId)),
        Followship.findOne({
          where: {
            followerId: helpers.getUser(req).id,
            followingId
          }
        })
      ])
      if (!user || user.role === "admin") {
        return res.status(404).json({ status: 'error', message: '此帳戶不存在' })
      }
      if (!followship) {
        return res.status(404).json({ status: 'error', message: '你未追蹤此使用者!' })
      }
      await followship.destroy()
      return res.status(200).json({ status: 'success', message: '取消追蹤成功！' })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = followshipController
