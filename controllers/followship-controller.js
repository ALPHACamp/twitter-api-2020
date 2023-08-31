const { User, Followship } = require('../models')
const helpers = require('../_helpers')

const followshipController = {
  addFollowing: (req, res, next) => {
    const followingId = req.body.id
    const followerId = helpers.getUser(req).id
    Promise.all([
      User.findByPk(followerId),
      Followship.findOne({
        where: { followingId, followerId }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error('找不到這位使用者')
        if (followship) throw new Error('你已追蹤這位使用者')
        if (user === followerId) throw new Error('你不能追蹤自己')
        return Followship.create({
          followingId,
          followerId
        })
      })
      .then(() => res.json({ status: 'success' }))
      .catch(err => next(err))
  },
  removeFollowing: (req, res, next) => {
    const { followingId } = req.params
    const followerId = helpers.getUser(req).id
    return Followship.findOne({
      where: {
        followingId: followingId,
        followerId: followerId
      }
    })
      .then(followship => {
        if (!followship) throw new Error('你尚未追蹤這位使用者')
        return followship.destroy()
      })
      .then(() => res.json({ status: 'success' }))
      .catch(err => next(err))
  }
}
module.exports = followshipController
