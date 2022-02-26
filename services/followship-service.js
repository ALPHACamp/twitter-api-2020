const { Followship, User } = require('../models')

const followshipServices = {
  addFollowship: (req, cb) => {
    User.findByPk(req.body.id)
      .then(user => {
        if (user === null) throw new Error('輸入錯誤的userId，該使用者不存在')
        Followship.findOrCreate({
          where: {
            followerId: req.user.dataValues.id,
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
        followerId: req.user.dataValues.id,
        followingId: req.params.id
      }
    })
      .then(followship => {
        console.log(req.user.dataValues.id, req.params.id)
        console.log(followship)
        if (followship === null) throw new Error('輸入錯誤的followingId，當前使用者並未追隨該使用者')
        followship.destroy().then(() => cb(null, '成功移追蹤'))
      })
      .catch(err => cb(err, null))
  },
  followshipTop10: (req, cb) => {
    User.findAll({
      attributes: ['id', 'account', 'name', 'avatar', 'introduction'],
      include: [{ model: User, as: 'Followers' }]
    })
      .then(user => {
        if (user.length === 0) throw new Error('資料庫內沒有任何使用者資料')
        const userData = user.map(i => i.get({ plain: true }))
          .map(i => ({
            ...i,
            followed: i.Followers.some(i => i.Followship.followerId === req.user.dataValues.id),
            Followers: i.Followers.length
          }))
          .sort((a, b) => a.Followers > b.Followers)
        return cb(null, userData)
      })
      .catch(err => cb(err, null))
  }
}

module.exports = followshipServices
