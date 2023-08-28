const { User, Followship } = require('../models')
const helpers = require('../_helpers')

const followshipController = {
  addFollowing: async (req, res, next) => {
    try {
      const followingId = req.body.id // 特定使用者
      const followerId = helpers.getUser(req).id // 使用者本人
      if (followingId === followerId) throw new Error('無法跟隨自己!')

      const [user, followship] = await Promise.all([
        User.findByPk(followingId),
        Followship.findOne({ where: { followerId, followingId } })
      ])
      if (!user) {
        const err = new Error('特定使用者不存在!')
        err.status = 404
        throw err
      }
      if (followship) throw new Error('已跟隨該使用者!')

      const data = await Followship.create({ followerId, followingId })
      return res.status(200).json({
        message: '跟隨成功!',
        data
      })
    } catch (err) {
      next(err)
    }
  },
  deleteFollowing: async (req, res, next) => {
    try {
      const followingId = req.params.id // 特定使用者
      const followerId = helpers.getUser(req).id // 使用者本人

      const [user, followship] = await Promise.all([
        User.findByPk(followingId),
        Followship.findOne({ where: { followerId, followingId } })
      ])
      if (!user) {
        const err = new Error('特定使用者不存在!')
        err.status = 404
        throw err
      }
      if (!followship) throw new Error('未跟隨該使用者!')

      const data = followship
      await Followship.destroy({ where: { followerId, followingId } })
      return res.status(200).json({
        message: '取消跟隨成功!',
        data
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = followshipController
