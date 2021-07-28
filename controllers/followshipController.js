const db = require('../models')
const Followship = db.Followship
const User = db.User

const { Op } = require('sequelize')

const followshipService = require('../services/followshipService')

const followshipController = {
  addFollowing: async (req, res) => {
    const followerId = req.user.id
    const followingId = req.body.id

    try {
      const data = await followshipService.addFollowing(followerId, followingId)

      return res.status(200).json(data)
    } catch (error) {
      return res.status(400).json({
        status: error.name,
        message: error.message
      })
    }
  },

  removeFollowing: (req, res) => {
    const followingId = req.params.id
    const followerId = req.user.id

    return User.findByPk(followerId, {
      attributes: ['id'],
      include: [
        {
          model: User,
          attributes: ['id'],
          as: 'Followings',
          where: { id: followingId }
        }
      ],
      nest: true
    }).then(user => {
      if (!user) {
        return res.status(400).json({
          status: 'error',
          message: 'Followship is not exist'
        })
      }

      return Promise.all([
        user.Followings[0].Followship.destroy(),
        user.decrement('followingCount'),
        user.Followings[0].decrement('followerCount')
      ]).then(result => {
        return res.status(200).json({
          status: 'success',
          message: `User.id ${user.id} removed following to user.id ${user.Followings[0].id} successfully`
        })
      })
    })
  }
}

module.exports = followshipController
