const db = require('../models')
const { Reply, Followship, Like, User, Tweet, Sequelize } = db
const { Op } = Sequelize
const RequestError = require('../libs/RequestError')

const followshipService = {
  addFollowing: (followerId, followingId) => {
    if (!followingId) {
      throw new RequestError('followingId is required')
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
        throw new RequestError('This user is already in your following list')
      }

      return Promise.all([
        User.findByPk(followerId),
        User.findByPk(followingId)
      ]).then(users => {
        if (!users[1]) {
          throw new RequestError('Current userId or following id may be wrong')
        }

        return Promise.all([
          Followship.create({ followerId, followingId }),
          users[0].increment('followingCount'),
          users[1].increment('followerCount')
        ]).then(result => {
          return {
            status: 'success',
            message: `User.id ${users[0].id} followed user.id ${users[1].id} successfully`
          }
        })
      })
    })
  },

  removeFollowing: (followerId, followingId) => {
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
        throw new RequestError('Followship is not exist')
      }

      return Promise.all([
        user.Followings[0].Followship.destroy(),
        user.decrement('followingCount'),
        user.Followings[0].decrement('followerCount')
      ]).then(result => {
        return {
          status: 'success',
          message: `User.id ${user.id} removed following to user.id ${user.Followings[0].id} successfully`
        }
      })
    })
  }
}

module.exports = followshipService
