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
  },
  deleteFollowship: (req, res) => {
    Followship.destroy({
      where: {
        $and: {
          followerId: helpers.getUser(req).id,
          followingId: req.params.followingId
        }
      }
    }).then(followship => {
      console.log('deleted', req.params.followingId, 'followship ',followship)  //OK; 1 if found and destroyed else 0
      if (!followship) {
        return res.json({ status: 'error', message: 'Unfollowed already' })
      }
      return res.json({ status: 'success', message: 'Unfollowed successfully' })
    })
  }
}


module.exports = followController