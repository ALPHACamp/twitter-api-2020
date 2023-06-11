const { Followship, User } = require('../models')
const helpers = require('../_helpers')

const followshipService = {
  addFollowing: (req, cb) => {
    const followingId = req.body.id
    const followerId = helpers.getUser(req).id
    if (followingId === followerId) throw new Error('你不能追蹤自己！')
    Promise.all([
      User.findByPk(followingId),
      Followship.findOne({
        where: {
          followerId,
          followingId
        }
      })
    ])
      .then(([user, isFollowed]) => {
        if (!user) throw new Error("該名使用者不存在，你無法追蹤！")
        if (isFollowed) throw new Error('你已經追蹤過這名使用者了！')
        return Followship.create({
          followerId,
          followingId
        })
          .then(followship => {
            cb (null, {
              status: '追蹤成功！',
              ...followship.toJSON()
            })
          })
          .catch(err => cb (err))
      })
      .catch(err => cb (err))
  },
  removeFollowing: (req, cb) => {
    const { id } = req.params
    Followship.findOne({
      where: {
        followerId: helpers.getUser(req).id,
        followingId: id
      }
    })
      .then(followship => {
        if (!followship) throw new Error("你已追蹤過此人！")
        followship.destroy()
          .then(deletedFollowship => {
            cb ({
              status: '取消追蹤！',
              ...deletedFollowship.toJSON()
            })
          })
          .catch(err => cb (err))
      })
      .catch(err => cb (err))
  }
}

module.exports = followshipService