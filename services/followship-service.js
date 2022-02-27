const { Followship, User } = require('../models')
const { getUser } = require('../_helpers')
const sequelize = require('sequelize')

const followshipServices = {
  addFollowship: (req, cb) => {
    User.findByPk(req.body.id)
      .then(user => {
        if (!user) throw new Error('輸入錯誤的userId，該使用者不存在')
        if (user.dataValues.role === 'admin') throw new Error('不可追蹤管理者')
        Followship.findOrCreate({
          where: {
            followerId: getUser(req).dataValues.id,
            followingId: req.body.id
          }
        })
          .then(followship => {
            if (!followship[1]) throw new Error('已經追蹤過該使用者了')
            return cb(null, '成功建立追蹤關係')
          })
          .catch(err => cb(err, null))
      })
      .catch(err => cb(err, null))
  },
  deleteFollowship: (req, cb) => {
    Followship.findOne({
      where: {
        followerId: getUser(req).dataValues.id,
        followingId: req.params.id
      }
    })
      .then(followship => {
        if (followship === null) throw new Error('輸入錯誤的followingId，當前使用者並未追隨該使用者')
        followship.destroy().then(() => cb(null, '成功移除追蹤'))
      })
      .catch(err => cb(err, null))
  },
  followshipTop10: (req, cb) => {
    User.findAll({
      group: 'User.id',
      attributes: [
        'id', 'account', 'name', 'avatar', 'introduction',
        [sequelize.literal('(SELECT COUNT(DISTINCT id) FROM Followships WHERE followingId = User.id)'),
          'totalFollowers'],
        [sequelize.literal(`EXISTS (SELECT 1 FROM Followships WHERE followingId = User.id AND followerId = ${req.user.dataValues.id})`), 'followed']
      ],
      include: [{
        model: User,
        as: 'Followers',
        attributes: [],
        through: { attributes: [] }
      }],
      order: [[sequelize.col('totalFollowers'), 'DESC']],
      subQuery: false, // 避免因查詢多張表造成limit失常
      having: { totalFollowers: { [sequelize.Op.gt]: 0 } }, // 只要粉絲大於0的人
      limit: 10
    })
      .then(user => {
        if (user.length === 0) throw new Error('資料庫內沒有任何使用者資料')
        const userData = user.map(i => i.get({ plain: true }))
          .map(i => ({
            ...i,
            followed: Boolean(i.followed)
          }))
        return cb(null, userData)
      })
      .catch(err => cb(err, null))
  }
}

module.exports = followshipServices
