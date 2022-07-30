const { Op } = require('sequelize')
const db = require('../models')
const User = db.User
const Followship = db.Followship

const followshipController = {
  getRecommendedFollowings: (req, res) => {
    const userId = req.query.userId
    User.findAll({ where: { id: { [Op.not]: userId } }, limit: 10 })
      .then(users => {
        return res.json(users)
      })
  },
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
