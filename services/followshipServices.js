const db = require('../models')
const Followship = db.Followship
const helpers = require('../_helpers')

const followshipServices = {
  addFollowing: (req, res, callback) => {
    const USER = helpers.getUser(req)
    return Followship.create({
      followerId: USER.id,
      followingId: req.body.id
    }).then(followship => {
      callback({ status: 'success', message: '', followship: followship })
    })
  },
  removeFollowing: (req, res, callback) => {
    const USERID = helpers.getUser(req).id
    return Followship.findOne({
      where: {
        followerId: USERID,
        followingId: req.params.followingId
      }
    }).then((followship) => {
      followship.destroy()
        .then(followship => {
          callback({ status: 'success', message: '' })
        })
    })
  }
}

module.exports = followshipServices
