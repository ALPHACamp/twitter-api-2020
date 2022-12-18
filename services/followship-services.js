const { User, Followship } = require('./../models')
const sequelize = require('sequelize')
const helpers = require('../_helpers')
const followshipServices = {
  getTopUsers: (req, cb) => {
    const limit = Number(req.query.top)
    return Followship.findAll({
      attributes: [
        'followingId',
        [sequelize.fn('COUNT', 'followingId'), 'followerCount']
      ],
      order: [[sequelize.literal('followerCount'), 'DESC']],
      group: ['followingId'],
      limit,
      include: [
        {
          model: User,
          as: 'followingUser',
          attributes: ['id', 'avatar', 'name', 'account']
        }
      ]
    })
      .then(users => {
        const popularUsers = users.map(user => ({
          ...user.toJSON(),
          isFollowed: helpers.getUser(req).Followings.some(f => f.id === user.followingId)
        }))
        cb(null, popularUsers)
      })
      .catch(err => cb(err))
  },
  addFollowing: (req, cb) => {
    const { id } = req.body
    return Promise.all([
      User.findByPk(id),
      Followship.findOne({
        where: {
          followerId: helpers.getUser(req).id,
          followingId: req.body.id
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error("User didn't exist!")
        if (followship) throw new Error('You are already following this user!')
        return Followship.create({
          followerId: helpers.getUser(req).id,
          followingId: req.body.id
        })
      })
      .then(followship => {
        cb(null, { status: 'success', followship })
      })
      .catch(err => cb(err))
  },
  removeFollowing: (req, cb) => {
    return Followship.findOne({
      where: {
        followerId: helpers.getUser(req).id,
        followingId: req.params.followingId
      }
    })
      .then(followship => {
        if (!followship) throw new Error("You haven't followed this user!")
        return followship.destroy()
      })
      .then(deletedFollowship => cb(null, { status: 'success', deletedFollowship }))
      .catch(err => cb(err))
  }
}
module.exports = followshipServices
