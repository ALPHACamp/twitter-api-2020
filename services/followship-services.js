const helpers = require('../_helpers')
const db = require('../models')
const { Followship } = db

const followshipServices = {
  followSomeone: (req, cb) => {
    const currentUserId = Number(helpers.getUser(req).id)
    const id = Number(req.body.id)
    if (currentUserId === id) {
      return cb(new Error('不能追蹤自己'), null)
    }
    Followship.findOne({
      where: {
        followerId: currentUserId,
        followingId: id
      }
    })
      .then(followship => {
        if (followship) throw new Error('已經追蹤過了')
        return Followship.create({
          followerId: currentUserId,
          followingId: id
        }).then(followship => cb(null, followship))
          .catch(err => cb(err, null))
      }
      )
      .catch(err => cb(err, null))
  },
  unfollowSomeone: (req, cb) => {
    const currentUserId = Number(helpers?.getUser(req).id)
    const followingId = Number(req.params.followingId)

    if (currentUserId === followingId) {
      return cb(new Error('不能追蹤或取消追蹤自己'), null)
    }
    Followship.findOne({
      where: {
        followerId: currentUserId,
        followingId
      }
    })
      .then(followship => {
        if (!followship) {
          return cb(new Error('尚未追蹤'), null)
        }

        followship.destroy()
          .then(followship => cb(null, followship))
          .catch(err => cb(err, null))
      })
      .catch(err => cb(err, null))
  }

}

module.exports = followshipServices
