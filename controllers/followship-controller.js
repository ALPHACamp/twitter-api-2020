const { User, Followship } = require('../models')
const { getUser } = require('../_helpers')

const followshipController = {
  addFollowing: (req, res, next) => {
    const userId = Number(req.params.id)
    const reqUserId = getUser(req).id
    if (userId === reqUserId) throw new Error('無法追蹤自己！')
    return Promise.all([
      User.findByPk(userId),
      Followship.findOne({
        where: {
          followingId: userId,
          followerId: reqUserId
        }
      })
    ])
      .then(([user, isFollowed]) => {
        if (!user) throw new Error('使用者不存在！')
        if (isFollowed) throw new Error('你已經追蹤該使用者！')
        return Followship.create({
          followingId: userId,
          followerId: reqUserId
        })
      })
      .then(addFollowing => {
        res.status(200).json('成功追蹤該使用者')
      })
      .catch(err => next(err))
  },

  removeFollowing: (req, res, next) => {
    Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    })
      .then(followship => {
        if (!followship) throw new Error("You haven't followed this user!")
        return followship.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }
}

module.exports = followshipController
