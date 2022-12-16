const assert = require('assert')
const helpers = require('../_helpers')
const { User, Followship } = require('../models')

const followshipServices = {

  addFollowing: (req, cb) => {
    const followerId = helpers.getUser(req).id
    Promise.all([
      User.findByPk(followerId),
      Followship.findOne({
        where: {
          followerId,
          followingId: req.body.id
        }
      })
    ])
      .then(([user, followship]) => {

        assert(user, "User didn't exist!")
        assert(!followship, "You are already following this user!")
        return Followship.create({
          followerId,
          followingId: req.body.id
        })
      })
      .then(addFollowing => cb(null, { addFollowing }))
      .catch(err => cb(err))
  },
  removeFollowing: (req, cb) => {
    const followerId = helpers.getUser(req).id
    Followship.findOne({
      where: {
        followerId,
        followingId: req.params.following_id
      }
    })
      .then(followship => {
        assert(followship, "You haven't followed this user!")
        return followship.destroy()
      })
      .then(removeFollowing => cb(null, { removeFollowing }))
      .catch(err => cb(err))
  }
}

module.exports = followshipServices