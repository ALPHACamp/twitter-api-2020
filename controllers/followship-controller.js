const { User, Followship, sequelize } = require('../models')
const helpers = require('../_helpers')
const { Op } = require('sequelize')

const createError = require('http-errors')

const followshipController = {
  postFollowship: (req, res, next) => {
    const userId = helpers.getUser(req).id
    const { id } = req.body

    return Promise.all([
      User.findByPk(id),
      Followship.findOne({
        where: {
          followerId: userId,
          followingId: id
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw (createError(404, "User doesn't exist!"))

        if (followship) throw (createError(409, 'You already followed this user!'))

        return Followship.create({
          followerId: userId,
          followingId: id
        })
          .then(newFollowing => res.json(newFollowing))
          .catch(error => next(error))
      })
      .catch(error => next(error))
  },

  deleteFollowship: (req, res, next) => {
    const followingId = req.params.followingId
    const userId = helpers.getUser(req).id

    return Followship.findOne({
      where: {
        followerId: userId,
        followingId: followingId
      }
    })
      .then(followship => {
        if (!followship) throw (createError(404, "You haven't followed this user!"))

        return followship.destroy()
      })
      .then(deletedFollowship => res.json(deletedFollowship))
      .catch(error => next(error))
  },

  getTop: (req, res, next) => {
    const topLimit = 10
    const userId = helpers.getUser(req).id

    return User.findAll({
      where: {
        role: 'user',
        id: { [Op.ne]: userId }
      },
      attributes: [
        'id',
        'name',
        'account',
        [
          sequelize.literal(
            '(SELECT COUNT(*) FROM `Followships` WHERE `Followships`.`following_id` = `User`.`id`)'
          ),
          'followerCount'
        ]
      ],
      include: [
        {
          model: User,
          as: 'Followers',
          attributes: ['id']
        }
      ],
      limit: topLimit,
      order: [
        [sequelize.literal('followerCount'), 'desc'],
        ['id', 'asc']
      ]
    }).then(topFollowing => {
      const result = topFollowing.map(user => {
        const { Followers, ...data } = user.toJSON()
        data.isFollowed = Followers.some(follower => follower.id === userId)

        return data
      })
      return (res.json(result))
    })
  }
}

module.exports = followshipController
