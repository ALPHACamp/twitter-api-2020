const db = require('../models')
const Followship = db.Followship

const followshipController = {
  postFollowship: (req, res) => {
    const followerId = 1
    const followingId = req.body.id
    Followship.create({
      followerId: followerId,
      followingId: followingId
    })
      .then(followship => {
        return res.json({ status: 'success', message: '' })
      })
  },
  deleteFollowship: (req, res) => {
    const followerId = 1
    const followingId = req.params.id
    Followship.findOne({
      where: {
        followerId: followerId,
        followingId: followingId
      }
    })
      .then(followship => {
        followship.destroy()
        .then(() => {
          return res.json({ status: 'success', message: '' })
        })
      })
  }
}

module.exports = followshipController
