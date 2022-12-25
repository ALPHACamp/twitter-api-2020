const { User, Followship } = require('./../models')
const sequelize = require('sequelize')
const helpers = require('../_helpers')
const followshipServices = {
  getTopUsers: (req, cb) => {
    const limit = Number(req.query.top)
    const UserId = helpers.getUser(req).id
    return User.findAll({
      attributes: [
        'id', 'avatar', 'name', 'account',
        [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE following_id = user.id)'), 'followerCount'],
        [sequelize.literal(`EXISTS (SELECT id FROM Followships WHERE follower_id = ${UserId} AND following_id = user.id)`), 'isFollowed']
      ],
      order: [[sequelize.literal('followerCount'), 'DESC']],
      limit,
      raw: true,
      nest: true
    })
      .then(datas => {
        const users = datas.map(data => ({
          ...data,
          isFollowed: data.isFollowed === 1
        }))
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
        cb(null, { success: true, followship })
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
      .then(deletedFollowship => cb(null, { success: true, deletedFollowship }))
      .catch(err => cb(err))
  }
}
module.exports = followshipServices
