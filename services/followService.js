const db = require('../models')
const Followship = db.Followship
const helper = require('../_helpers')

const followService = {
  addFollowing: (req, res, callback) => {
    const user = helper.getUser(req)
    Followship.findOrCreate({
      where: { followingId: req.body.id },
      defaults: {
        followerId: user.id,
        followingId: req.body.id
      }
    }).then(() => {
      callback({ status: 'success', message: '' })
    })
  },
  removeFollowing: (req, res, callback) => {
    const user = helper.getUser(req)

    Followship.findOne({
      where: {
        followerId: user.id,
        followingId: req.params.followingId
      }
    }).then(followship => {
      followship.destroy()
      callback({ status: 'success', message: '' })
    })
  }
}

module.exports = followService