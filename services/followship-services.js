const helpers = require('../_helpers')
const db = require('../models')
const { Followship } = db

const followshipServices = {
  followSomeone: (req, cb) => {
    const currentUserId = Number(helpers.getUser(req).id)
    console.log(currentUserId)
    const id = Number(req.body.id)
    console.log(id)
    Followship.create({
      followerId: currentUserId,
      followingId: id
    })
      .then(followship => cb(null, followship))
      .catch(err => cb(err, null))
  },
  unfollowSomeone: (req, cb) => {
    const currentUserId = helpers.getUser(req).dataValues.id
    const { id } = req.params
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
