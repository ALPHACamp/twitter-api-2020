const assert = require('assert')
const helpers = require('../_helpers')
const { User, Followship } = require('../models')

const followshipServices = {
  addFollowing: (req, cb) => {
    const curruntUserId = helpers.getUser(req).id
    const followUserId = Number(req.body.id)
    return Promise.all([
      User.findByPk(curruntUserId),
      User.findByPk(followUserId),
      Followship.findOne({
        where: {
          followerId: curruntUserId,
          followingId: followUserId
        }
      })
    ])
      .then(([currentUser, userToFollow, followship]) => {
        assert(currentUser, '使用者不存在')
        assert(userToFollow, '欲追隨用戶不存在')
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
      User.findByPk(followingUserId),
      Followship.findOne({
        where: {
          followerId: curruntUserId,
          followingId: followingUserId
        }
      })
    ])
      .then(([currentUser, userToUnfollow, followship]) => {
        assert(currentUser, '使用者不存在')
        assert(userToUnfollow, '欲取消追隨用戶不存在')
        assert(followship, '未追隨用戶')
        return followship.destroy()
      })
      .then(followData => cb(null, followData))
      .catch(err => cb(err))
  }
}

module.exports = followshipServices
