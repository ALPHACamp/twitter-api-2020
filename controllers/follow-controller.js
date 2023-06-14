const { User, Followship } = require('../models')

const followController = {
  addFollowing: (req, res, next) => {
    const followingId = req.body.id
    const followerId = req.user.id
    console.log(followingId, followerId)
    if (followerId === followingId) throw new Error('不可追蹤自己')
    User.findByPk(followingId)
      .then((user) => {
        if (!user) throw new Error('該使用者不存在')
        if (user.dataValues.role === 'admin') throw new Error('不可追蹤管理者')
        Followship.findOrCreate({
          where: {
            followerId,
            followingId,
          },
        })
          .then((followship) => {
            // followship[1]為boolean，建立成功回傳true
            if (!followship[1]) throw new Error('已經追蹤過該使用者了')
            return res.status(200).json({ message: '成功建立追蹤關係' })
          })
          .catch((err) => next(err))
      })
      .catch((err) => next(err))
  },
  removeFollowing: (req, res, next) => {
    const followingId = req.params.followingId
    const followerId = req.user.id
    Followship.findOne({
      where: {
        followerId,
        followingId
      },
    })
      .then(followship => {
        if (!followship) throw new Error("You haven't followed this user!")
        followship.destroy().then(() => {
          return res.status(200).json({ message: '成功移除追蹤' })
        })
      })
      .catch((err) => next(err))
  },
}

module.exports = followController