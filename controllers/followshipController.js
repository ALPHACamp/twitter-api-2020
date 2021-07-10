const db = require('../models')
const Followship = db.Followship
const User = db.User

const { Op } = require('sequelize')

const followshipController = {
  addFollowing: (req, res) => {
    const followerId = req.user.id
    const followingId = req.body.id

    if (!followingId) {
      return res.status(400).json({
        status: 'error',
        message: 'followingId is required'
      })
    }

    return Followship.findOne({
      where: {
        [Op.and]: [
          { followerId },
          { followingId }
        ]
      }
    }).then(followship => {
      if (followship) {
        return res.status(400).json({
          status: 'error',
          message: 'User had followered before'
        })
      }

      Promise.all([
        User.findByPk(followerId),
        User.findByPk(followingId)
      ]).then(users => {
        if (users.length !== 2) {
          return res.status(400).json({
            status: 'error',
            message: 'current user or following id might wrong'
          })
        }

        Promise.all([
          Followship.create({ followerId, followingId }),
          users[0].increment('followingCount'),
          users[1].increment('followerCount')
        ]).then(result => {
          return res.status(200).json({
            status: 'success',
            message: `User.id ${users[0].id} follow user.id ${users[1].id} successfully`
          })
        })
      })

    })


  }
}

module.exports = followshipController
