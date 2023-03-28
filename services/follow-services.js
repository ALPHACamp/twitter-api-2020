const { User, Followship, sequelize } = require('../models')
const helpers = require('../_helpers')

const followServices = {
  postFollow: async (req, cb) => {
    try {
      const nowUser = helpers.getUser(req).id
      const followingId = Number(req.body.id)
      if (nowUser === followingId) throw new Error('無法追蹤自己')
      const [user, follow] = await Promise.all([
        User.findByPk(followingId),
        Followship.findOne({
          where: {
            followerId: nowUser,
            followingId
          }
        })
      ])
      if (!user) throw new Error('錯誤! 此使用者不存在')
      if (follow) throw new Error('已在追蹤名單')

      const addFollow = await Followship.create({
        followerId: nowUser,
        followingId
      })
      const newFollow = addFollow.toJSON()
      cb(null, newFollow)
    } catch (err) {
      cb(err)
    }
  },
  deleteFollow: async (req, cb) => {
    try {
      const nowUser = helpers.getUser(req).id
      const followingId = Number(req.params.id)
      if (nowUser === followingId) throw new Error('無法追蹤或取消追蹤自己!')
      const follow = await Followship.findOne({
        where: {
          followerId: nowUser,
          followingId
        }
      })
      if (!follow) throw new Error('未追蹤此使用者!')

      await Followship.destroy({
        where: {
          followerId: nowUser,
          followingId
        }
      })
      const removeFollowing = follow.toJSON()
      cb(null, removeFollowing)
    } catch (err) {
      cb(err)
    }
  },
  topFollow: async (req, cb) => {
    try {
      const nowUser = helpers.getUser(req).id
      const user = await User.findAll({
        attributes: [
          'id', 'name', 'account', 'avatar',
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.following_id = User.id)'), 'followingNum'],
          [sequelize.literal(`EXISTS (SELECT id FROM Followships WHERE Followships.follower_id = ${nowUser} AND Followships.following_id = User.id)`), 'isFollowed']
        ],
        group: ['User.id'],
        having: sequelize.literal('followingNum > 0 AND NOT User.name = "root"'),
        order: [[sequelize.literal('followingNum'), 'DESC']],
        raw: true,
        nest: true
      })
      cb(null, user)
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = followServices
