const { User, Followship } = require('../models')
const helpers = require('../_helpers')

const followshipController = {
  addFollowship: async (req, res, next) => {
    try {
      const followerId = Number(helpers.getUser(req).id)
      const followingId = Number(req.body.id)
      const following = await User.findByPk(followingId, {
        raw: true,
        attributes: { exclude: ['password'] }
      })

      if (followerId === followingId) throw new Error('無法追蹤自己')
      if (!following || following.role === 'admin') throw new Error('追蹤者不存在')

      const [followshiped, created] = await Followship.findOrCreate({
        where: { followerId, followingId }
      })
      if (!created) throw new Error('你已經追蹤該名使用者')

      res.status(200).json({
        status: 'Success',
        message: '已成功追蹤該名使用者。',
        data: followshiped
      })
    } catch (err) {
      next(err)
    }
  },
  deleteFollowing: async (req, res, next) => {
    try {
      const followerId = helpers.getUser(req).id
      const followingId = req.params.followingId
      const following = await User.findByPk(followingId, {
        raw: true,
        attributes: { exclude: ['password'] }
      })

      const deleteFollowship = await Followship.findOne({
        where: { followerId, followingId }
      })

      if (!following || following.role === 'admin') throw new Error("無法取消追蹤不存在的使用者")
      if (!deleteFollowship) throw new Error("你尚未追蹤該使用者")
      await Followship.destroy({
        where: { followerId, followingId }
      })

      res.status(200).json({
        status: 'Success',
        message: '已成功取消追蹤該使用者',
        data: deleteFollowship
      })
    } catch (err) {
      next(err)
    }
  }
}
module.exports = followshipController