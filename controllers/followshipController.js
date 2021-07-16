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
          message: 'This user is already in your following list'
        })
      }

      Promise.all([
        User.findByPk(followerId),
        User.findByPk(followingId)
      ]).then(users => {
        if (!users[1]) {
          return res.status(400).json({
            status: 'error',
            message: 'Current userId or following id may be wrong'
          })
        }

        Promise.all([
          Followship.create({ followerId, followingId }),
          users[0].increment('followingCount'),
          users[1].increment('followerCount')
        ]).then(result => {
          return res.status(200).json({
            status: 'success',
            message: `User.id ${users[0].id} followed user.id ${users[1].id} successfully`
          })
        })
      })
    })
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
