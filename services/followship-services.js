const { Followship, User } = require('../models')
// const { getUser } = require('../_helpers')
const helpers = require('../_helpers')
const sequelize = require('sequelize')

const followshipServices = {
  addFollowing: (req, cb) => {
    // const followerId = getUser(req).id
    const followerId = helpers.getUser(req).id
    // const { followingId } = req.body
    const followingId = req.body.id
    if (!followerId) throw new Error('用戶不存在！')
    return Promise.all([
      User.findByPk(followingId),
      Followship.findOne({ where: { followerId, followingId } })
    ]).then(([user, followship]) => {
      if (!user) throw new Error('該名用戶不存在！')
      if (user.id === followerId) throw new Error('不能追蹤自己！')
      if (user.role === 'admin') throw new Error('不能追蹤管理員！')
      if (followship) throw new Error('您已經追蹤過此用戶！')
      return Followship.create({ followerId, followingId })
        .then(data => cb(null, {
          message: '已追蹤！',
          isFollowed: !followship,
          data
        }))
    })

      .catch(err => cb(err))
  },
  removeFollowing: (req, cb) => {
    // const followerId = getUser(req).id
    const followerId = helpers.getUser(req).id
    const { followingId } = req.params
    if (!followerId) throw new Error('用戶不存在！')
    return Promise.all([
      User.findByPk(followingId),
      Followship.findOne({ where: { followerId, followingId } })
    ]).then(([user, followship]) => {
      if (!user) throw new Error('該名用戶不存在！')
      if (!followship) throw new Error('您還沒追蹤此用戶！')
      return followship.destroy()
        .then(data => cb(null, {
          message: '已取消追蹤！',
          isFollowed: !followship,
          data
        }))
        .catch(err => cb(err))
    })
      .catch(err => cb(err))
  },
  topUsers: async (req, cb) => {
    try {
      const topUser = await User.findAll({
        attributes: [
          'id',
          'avatar',
          'name',
          'account',
          [
            sequelize.literal('(SELECT COUNT (*) FROM Followships WHERE Followships.followingId = User.id )'),
            'followingCount'
          ]
        ],
        limit: 10,
        order: [[sequelize.literal('followingCount'), 'DESC']],
        raw: true,
        nest: true
      })
      cb(null, topUser)
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = followshipServices
