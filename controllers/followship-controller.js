const { User, Followship, sequelize } = require('../models')
const helpers = require('../_helpers')

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
      if (!followingUser) return res.status(404).json({ status: 'error', message: '帳號不存在!' })
      if (followerId === followingId) return res.status(422).json({ status: 'error', message: '不能追蹤自己!' })
      if (followships) return res.status(422).json({ status: 'error', message: '已追蹤這個使用者!' })
      return Followship.create({ followerId, followingId })
    }).then(followship => {
      const data = followship.toJSON()
      data.createdAt = helpers.relativeTime(data.createdAt)
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
        if (!user) return res.status(404).json({ status: 'error', message: '帳號不存在!' })
        if (!followship) return res.status(404).json({ status: 'error', message: '尚未追蹤這個使用者!' })
        return followship.destroy()
      }).then(deletedFollowship => res.status(200).json({ status: 'success', message: '取消追蹤成功!', deletedFollowship })
      ).catch(err => next(err))
  },

  getTopUsers: (req, res, next) => {
    const currentUser = helpers.getUser(req)
    return User.findAll({
      where: { role: 'user' },
      attributes: [
        'id', 'account', 'name', 'avatar', 'introduction',
        [sequelize.literal('(SELECT COUNT (id) FROM Followships WHERE Followships.following_id = User.id)'), 'followerCount'],
        [sequelize.literal(`EXISTS(SELECT true FROM Followships WHERE Followships.follower_id = ${currentUser.id} AND Followships.following_id = User.id)`), 'isFollowed']
      ],
      order: [[sequelize.literal('followerCount'), 'DESC'], ['id', 'ASC']],
      raw: true,
      nest: true,
      limit: 10
    }).then(users => {
      const data = users.map(u => ({
        ...u
        // isFollowed: currentUser?.Followings?.some(currentUserFollow => currentUserFollow?.id === u.id)
      }))
      return res.status(200).json(data)
    }).catch(err => next(err))
  }
}
module.exports = followshipController
