const { User, Followship, sequelize } = require('../models')
const { getUser } = require('../_helpers')
const { relativeTime } = require('../helpers/date-helper')

const followshipController = {
  addFollowing: (req, res, next) => {
    // 測試檔未通過
    const followerId = getUser(req).id // 追隨者AKA登入者
    const followingId = Number(req.body.id) // 被追蹤的人
    return Promise.all([
      User.findByPk(followingId), // 找有沒有這個使用者
      Followship.findOne({ // 找這個追隨關係是否已經成立
        where: {
          followerId,
          followingId
        }
      })
    ]).then(([followingUser, followships]) => {
      if (!followingUser || followingUser.role !== 'user') return res.status(500).json({ status: 'error', message: '查無使用者資料' })
      if (followerId === followingId) return res.status(500).json({ status: 'error', message: '不能追蹤自己' })
      if (followships) return res.status(500).json({ status: 'error', message: '已追蹤這個使用者' })
      return Followship.create({
        followerId,
        followingId
      })
    }).then(followship => {
      const data = followship.toJSON()
      data.createdAt = relativeTime(data.createdAt)
      return res.status(200).json(data)
    }).catch(err => next(err))
  },
  removeFollowing: (req, res, next) => {
    // 測試檔未通過
    return Promise.all([
      User.findByPk(Number(req.params.followingId)), // 找有沒有這個使用者
      Followship.findOne({ // 找這個追隨關係是否已經成立
        where: {
          followerId: getUser(req).id,
          followingId: Number(req.params.followingId)
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user || user.role !== 'user') res.status(404).json({ status: 'error', message: '查無使用者!' })
        if (!followship) res.status(500).json({ status: 'error', message: '你沒有追蹤這個使用者!' })
        followship.destroy()
      }).then(deletedFollowship => res.status(200).json({ status: 'success', message: '取消追蹤成功!', data: deletedFollowship })
      ).catch(err => next(err))
  },
  getTopUsers: (req, res, next) => {
    const currentUserId = getUser(req).id
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
