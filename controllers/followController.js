const db = require('../models')
const User = db.User
const Followship = db.Followship
const helpers = require('../_helpers')

const followController = {
  addFollowship: (req, res) => {
    Followship.findOne({
      where: {
        $and: {
          followerId: helpers.getUser(req).id,
          followingId: req.body.id
        }
      }
    }).then(followship => {
      // console.log(followship) // if findOne [], if findAll NULL
      if (followship) {
        return res.json({ status: 'error', message: 'Followed already' })
      }
      Followship.create({
        followerId: helpers.getUser(req).id,
        followingId: req.body.id
      }).then(() => {
        return res.json({ status: 'success', message: 'Followed successfully' })
      })
    })
  }
}


module.exports = followController