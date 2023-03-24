const assert = require('assert')
const helpers = require('../_helpers')
const { User, Followship } = require('../models')

const followshipServices = {
  addFollowing: (req, cb) => {
    const curruntUserId = helpers.getUser(req).id
    const followUserId = Number(req.body.id)
    return Promise.all([
      User.findByPk(curruntUserId),
      Followship.findOne({
        where: {
          followerId: curruntUserId,
          followingId: followUserId
        }
      })
    ])
      .then(([user, followship]) => {
        assert(user, '使用者不存在')
        assert(!followship, '已追蹤用戶')
        return Followship.create({
          followerId: curruntUserId,
          followingId: followUserId
        })
      })
      .then(followData => cb(null, followData))
      .catch(err => cb(err))
  },
  deleteFollowing: (req, cb) => {
    const curruntUserId = helpers.getUser(req).id
    const followingUserId = req.params.followingId
    return Promise.all([
      User.findByPk(curruntUserId),
      Followship.findOne({
        where: {
          followerId: curruntUserId,
          followingId: followingUserId
        }
      })
    ])
      .then(([user, followship]) => {
        assert(user, '使用者不存在')
        assert(followship, '未追隨用戶')
        return followship.destroy()
      })
      .then(followData => cb(null, followData))
      .catch(err => cb(err))
  }
}

module.exports = followshipServices
