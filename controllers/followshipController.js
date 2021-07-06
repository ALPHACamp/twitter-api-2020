const { Followship, User } = require('../models')

const helpers = require('../_helpers')

module.exports = {
  createFollowship: async (req, res, next) => {
    try {
      const id = req.body.id
      if (String(id) === String(helpers.getUser(req).id)) {
        return res.json({ status: 'error', message: '不能追蹤自己' })
      }
      const user = await User.findByPk(id)
      if (!user) {
        return res.json({ status: 'error', message: '找不到使用者' })
      }
      const followship = await Followship.findOne({
        where: { followerId: helpers.getUser(req).id, followingId: user.id }
      })
      if (followship) {
        return res.json({ status: 'error', message: '操作重複' })
      }
      await Followship.create({ followerId: helpers.getUser(req).id, followingId: user.id })
      return res.json({
        status: 'success',
        message: '追蹤成功'
      })
    } catch (err) {
      next(err)
    }
  },
  deleteFollowship: async (req, res, next) => {
    try {
      const id = req.params.id
      const user = await User.findByPk(id)
      if (!user) {
        return res.json({ status: 'error', message: '找不到使用者' })
      }
      const followship = await Followship.findOne({
        where: { followerId: helpers.getUser(req).id, followingId: user.id }
      })
      if (!followship) {
        return res.json({ status: 'error', message: '找不到追蹤紀錄' })
      }
      await followship.destroy()
      return res.json({
        status: 'success',
        message: '取消追蹤成功'
      })
    } catch (err) {
      next(err)
    }
  }
}
