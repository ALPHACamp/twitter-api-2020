const { Followship, User } = require('../models')
const helpers = require('../_helpers')

// 為配合資料表外鍵設計，所以統一命名為 userId -> UserId, tweetId -> TweetId

const followshipController = {
  // follow account
  postFollowing: (req, res, next) => {
    const UserId = helpers.getUser(req).id
    const followingId = Number(req.body.id)
    if (UserId === followingId) throw new Error('無法追蹤、退追自己')

    return User.findByPk(UserId)
      .then(user => {
        if (!user) throw new Error('此使用者不存在')

        return Followship.findOne({
          where: {
            followerId: UserId,
            followingId
          }
        })
      })
      .then(followship => {
        if (followship) throw new Error('已追蹤此帳號')

        return Followship.create({
          followerId: UserId,
          followingId
        })
      })
      .then(() => res.status(200).json({
        status: 'success',
        message: '追蹤成功'
      }))
      .catch(error => next(error))
  },
  // unfollow account
  deleteFollowing: (req, res, next) => {
    const UserId = helpers.getUser(req).id
    const followingId = Number(req.params.followingId)
    if (UserId === followingId) throw new Error('無法追蹤、退追自己')

    return User.findByPk(UserId)
      .then(user => {
        if (!user) throw new Error('此使用者不存在')

        return Followship.findOne({
          where: {
            followerId: UserId,
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
