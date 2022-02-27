const { Followship, User, sequelize } = require('../models')
const helpers = require('../_helpers')


module.exports = {
  postFollowship: async (req, res, next) => {
    try {
      const followerId = helpers.getUser(req).id
      const followingId = Number(req.body.id)

      if (!followingId) throw new Error('沒有追隨者ID，追隨動作失敗!')
      if (followerId === followingId) {
        throw new Error('不能對自己進行追隨的動作!')
      }

      const [follower, following, followship] = await Promise.all([
        User.findByPk(followerId),
        User.findOne({
          where: { id: Number(followingId), role: 'user' }
        }),
        Followship.findOne({
          where: { followerId, followingId }
        })
      ])

      if (!following) throw new Error('追隨者並不存在，追隨動作失敗!')
      if (followship) throw new Error('不能對同一位使用者重複追隨!')

      const responseData = await sequelize.transaction(async (t) => {
        // only retrieve first array item, which is created followship
        const [createdFollowship] = await Promise.all([
          Followship.create({ followerId, followingId }, { transaction: t }),
          follower.increment('totalFollowings', { by: 1, transaction: t }),
          following.increment('totalFollowers', { by: 1, transaction: t })
        ])
        return createdFollowship
      })

      return res.status(200).json(responseData)

    } catch (err) { next(err) }
  },

  deleteFollowship: async (req, res, next) => {
    try {
      const followerId = helpers.getUser(req).id
      const followingId = Number(req.params.followingId)

      if (!followingId) throw new Error('沒有追隨者ID，取消跟隨動作失敗!')

      const [follower, following, followship] = await Promise.all([
        User.findByPk(followerId),
        User.findByPk(Number(followingId)),
        Followship.findOne({
          where: { followerId, followingId }
        })
      ])

      if (!following) throw new Error('追隨者並不存在，跟隨動作失敗!')
      if (!followship) throw new Error('不能對尚未跟隨的使用者收回跟隨!')

      const responseData = await sequelize.transaction(async (t) => {
        // only retrieve first array item, which is created followship
        const [removedFollowship] = await Promise.all([
          followship.destroy({ transaction: t }),
          follower.decrement('totalFollowings', { by: 1, transaction: t }),
          following.decrement('totalFollowers', { by: 1, transaction: t })
        ])
        return removedFollowship
      })

      return res.status(200).json(responseData)

    } catch (err) { next(err) }
  }
}