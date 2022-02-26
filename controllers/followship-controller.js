const { Followship, User } = require('../models')
const helpers = require('../_helpers')


module.exports = {
  postFollowship: async (req, res, next) => {
    try {
      const followerId = helpers.getUser(req).id
      const followingId = Number(req.body.followingId)

      if (!followingId) throw new Error('沒有追隨者ID，跟隨動作失敗!')

      const [follower, following, followship] = await Promise.all([
        User.findByPk(followerId),
        User.findByPk(Number(followingId)),
        Followship.findOne({
          where: { followerId, followingId }
        })
      ])

      if (!following) throw new Error('追隨者並不存在，跟隨動作失敗!')
      if (followship) throw new Error('不能對同一位使用者重複跟隨!')

      // only retrieve first array item, which is created followship
      const [responseData] = await Promise.all([
        Followship.create({ followerId, followingId }),
        follower.increment('totalFollowings', { by: 1 }),
        following.increment('totalFollowers', { by: 1 })
      ])

      return res.status(200).json(responseData)

    } catch (err) { next(err) }
  }
}