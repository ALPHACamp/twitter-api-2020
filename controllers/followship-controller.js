const { Followship, User } = require('../models')
const helpers = require('../_helpers')

const followshipController = {
  // follow account
  postFollowing: (req, res, next) => {
    const userId = helpers.getUser(req).id
    const followingId = Number(req.body.id)
    if (userId === followingId) throw new Error('無法追蹤、退追自己')

    return User.findByPk(userId)
      .then(user => {
        if (!user) throw new Error('此使用者不存在')

        return Followship.findOne({
          where: {
            followerId: userId,
            followingId
          }
        })
      })
      .then(followship => {
        if (followship) throw new Error('已追蹤此帳號')

        return Followship.create({
          followerId: userId,
          followingId
        })
      })
      .then(followship => res.status(200).json({
        status: 'success',
        message: '追蹤成功'
      }))
      .catch(error => next(error))
  },
  // unfollow account
  deleteFollowing: (req, res, next) => {
    const userId = helpers.getUser(req).id
    const followingId = Number(req.params.followingId)
    if (userId === followingId) throw new Error('無法追蹤、退追自己')

    return User.findByPk(userId)
      .then(user => {
        if (!user) throw new Error('此使用者不存在')

        return Followship.findOne({
          where: {
            followerId: userId,
            followingId
          }
        })
      })
      .then(followship => {
        if (!followship) throw new Error('已退追蹤此帳號')

        return followship.destroy()
      })
      .then(() => res.status(200).json({
        status: 'success',
        message: '取消追蹤成功'
      }))
      .catch(error => next(error))
  }
}

module.exports = followshipController
