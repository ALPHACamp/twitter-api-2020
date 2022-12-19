const { User, Followship, sequelize } = require('../models')
const helpers = require('../_helpers')
const { relativeTime } = require('../helpers/date-helper')

const followshipController = {
  addFollowing: (req, res, next) => {
    const followerId = helpers.getUser(req).id
    const followingId = Number(req.body.id)
    return Promise.all([
      User.findByPk(followingId),
      Followship.findOne({
        where: { followerId, followingId }
      })
    ]).then(([followingUser, followships]) => {
      if (!followingUser) res.status(404).json({ status: 'error', message: '帳號不存在!' })
      if (followerId === followingId) return res.status(400).json({ status: 'error', message: '不能追蹤自己!' })
      if (followships) res.status(400).json({ status: 'error', message: '已追蹤這個使用者!' })
      return Followship.create({ followerId, followingId })
    }).then(followship => {
      const data = followship.toJSON()
      data.createdAt = relativeTime(data.createdAt)
      return res.status(200).json({ status: 'success', data })
    }).catch(err => next(err))
  },
  removeFollowing: (req, res, next) => {
    return Promise.all([
      User.findByPk(Number(req.params.followingId)),
      Followship.findOne({
        where: {
          followerId: helpers.getUser(req).id,
          followingId: Number(req.params.followingId)
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user) res.status(404).json({ status: 'error', message: '帳號不存在!' })
        if (!followship) res.status(404).json({ status: 'error', message: '你沒有追蹤這個使用者!' })
        return followship.destroy()
      }).then(() => res.status(200).json({ status: 'success', message: '取消追蹤成功!' })
      ).catch(err => next(err))
  },
  getTopUsers: (req, res, next) => {
    const currentUserId = helpers.getUser(req).id
    return User.findAll({
      attributes: [
        'id', 'account', 'name', 'avatar', 'introduction',
        [sequelize.literal('(SELECT COUNT (id) FROM Followships WHERE Followships.following_id = User.id)'), 'followerCount'],
        [sequelize.literal(`EXISTS(SELECT id FROM Followships WHERE Followships.follower_id = ${currentUserId} AND Followships.following_id = User.id)`), 'isFollowed']
      ],
      order: [[sequelize.literal('followerCount'), 'DESC']],
      raw: true,
      nest: true
    }).then(users => {
      const data = users.map(u => ({
        ...u
      }))
      return res.status(200).json(data)
    }).catch(err => next(err))
  }
}
module.exports = followshipController
