const { User, Followship } = require('./../models')
const sequelize = require('sequelize')
const helpers = require('../_helpers')
const followshipServices = {
  getTopUsers: (req, cb) => {
    const limit = Number(req.query.top)
    const UserId = helpers.getUser(req).id
    return Followship.findAll({
      include: {
        model: User, as: 'followingUser', attributes: ['id', 'avatar', 'name', 'account']
      },
      attributes: [
        'followingId',
        [sequelize.literal('(SELECT account FROM Users WHERE id = followingId)'), 'account'],
        [sequelize.literal('(SELECT avatar FROM Users WHERE id = followingId)'), 'avatar'],
        [sequelize.fn('COUNT', 'followingId'), 'followerCount'],
        [sequelize.literal(`EXISTS (SELECT id FROM Followships WHERE follower_id = ${UserId} AND following_id = followingId )`), 'isFollowed']
      ],
      order: [[sequelize.literal('isFollowed'), 'DESC'], [sequelize.literal('followerCount'), 'DESC']],
      group: ['followingId'],
      limit,
      raw: true
    })
      .then(users => {
        cb(null, users)
      })
      .catch(err => cb(err))
  },
  addFollowing: (req, cb) => {
    const { id } = req.body
    const followerId = helpers.getUser(req).id
    if (+id === followerId) throw new Error('You cannot follow yourself!')
    return Promise.all([
      User.findByPk(id),
      Followship.findOne({
        where: {
          followerId,
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