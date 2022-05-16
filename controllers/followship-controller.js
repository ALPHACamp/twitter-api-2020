const { User, Followship } = require('../models')
const helpers = require('../_helpers')

const followshipController = {
  addFollowing: (req, res, next) => {
    const followingId = Number(req.body.id)
    const followerId = helpers.getUser(req).id

    if (followingId === followerId) throw new Error('不能追蹤自己!')
    return Promise.all([
      User.findByPk(followingId),
      Followship.findOne({
        where: {
          followingId,
          followerId
        }
      })
    ])
      .then(([user, isFollowed]) => {
        if (!user) throw new Error('使用者不存在!')
        if (isFollowed) throw new Error('你已經追蹤該使用者！')
        return Followship.create({
          followingId,
          followerId
        })
      })
      .then(getFollowing => {
        res.status(200).json('成功追蹤使用者！')
      })
      .catch(err => next(err))
  },

  removeFollowing: (req, res, next) => {
    const followingId = Number(req.params.id)
    const followerId = helpers.getUser(req).id
    if (followingId === followerId) throw new Error('不能取消追蹤自己!')
    return Promise.all([
      User.findByPk(followingId),
      Followship.findOne({
        where: {
          followingId,
          followerId
        }
      })
    ])
      .then(([user, isFollowed]) => {
        if (!user) throw new Error('無法取消追蹤不存在的使用者!')
        if (!isFollowed) throw new Error('你尚未追蹤該名使用者！')
        return Followship.destroy({
          where: {
            followingId,
            followerId
          }
        })
      })
      .then(() => res.status(200).json('成功取消追蹤該名使用者！'))
      .catch(err => next(err))
  }
}

module.exports = followshipController
