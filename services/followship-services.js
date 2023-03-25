const helpers = require('../_helpers')
const db = require('../models')
const { Followship } = db

const followshipServices = {
  followSomeone: (req, cb) => {
    const currentUserId = Number(helpers.getUser(req).id)
    const id = Number(req.body.id)
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
    const currentUserId = Number(helpers.getUser(req).id)
    const id = req.params.followingId
    Followship.findOne({
      where: {
        followerId: currentUserId,
        followingId: id
      }
    })
      .then(followship => {
        followship.destroy()
          .then(followship => cb(null, followship))
          .catch(err => cb(err, null))
      })
      .catch(err => cb(err, null))
  }
}

module.exports = followshipServices
