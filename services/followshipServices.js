const db = require('../models')
const Followship = db.Followship
const helpers = require('../_helpers')

const followshipServices = {
  addFollowing: (req, res, callback) => {
    const USER = helpers.getUser(req)
    // console.log('followerId:' + USER.id)
    // console.log('followingId:' + req.body.id)
    return Followship.create({
      followerId: USER.id,
      followingId: req.body.id
    }).then(followship => {
      // return Followship.findByPk(2)
      //   .then(followship => {
      //     console.log(followship)
      //   }).then(followship => {
          callback({ status: 'success', message: '' })
        // })
      // Followship.findOne({
      //   where: { followerId: USER.id },
      // }).then(followship => {
      //   console.log(followship)
      // }).then(followship => {
      //   callback({ status: 'success', message: '' })
      // })
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