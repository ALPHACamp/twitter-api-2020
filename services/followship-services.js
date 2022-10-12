const { Followship, User, sequelize } = require('../models')
const { getUser } = require('../_helpers')
const { Op } = require('sequelize')

const followshipServices = {
  addFollowing: (req, cb) => {
    const currentUserId = getUser(req).dataValues.id
    const followingId = req.body.id
    return Promise.all([
      User.findByPk(followingId),
      Followship.findOne({
        where: {
          followerId: currentUserId,
          followingId
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error("User didn't exist!")
        if (followship) throw new Error('You are already following this user!')
        if (user.id === currentUserId) throw new Error("You can't follow yourself!")

        return Followship.create({
          followerId: currentUserId,
          followingId
        })
      })
      .then(newFollowship => cb(null, newFollowship))
      .catch(err => cb(err))
  },
  removeFollowing: (req, cb) => {
    return Followship.findOne({
      where: {
        followerId: getUser(req).dataValues.id,
        followingId: req.params.followingId
      }
    })
      .then(followship => {
        if (!followship) throw new Error("You haven't followed this user!")
        return followship.destroy()
      })
      .then(removeFollowship => cb(null, removeFollowship))
      .catch(err => cb(err))
  },
  getTopFollowship: (req, cb) => {
    return User.findAll({
      where: {
        role: 'user',
        id: { [Op.not]: getUser(req).dataValues.id }
      },
      attributes: {
        include: [[sequelize.literal('( SELECT COUNT(*) FROM Followships WHERE Followships.following_id = User.id)'), 'followshipCount']]
      },
      include: [{
        model: User,
        as: 'Followers',
        attributes: ['id', 'name']
      }],
      order: [[sequelize.literal('followshipCount'), 'Desc']],
      limit: 10
    })
      .then(users => {
        const userData = users
          .map(users => {
            const { Followers, ...data } = users.toJSON()
            data.isFollowed = Followers.some(i => i.id === getUser(req).dataValues.id)
            return data
          })
        return cb(null, userData)
      })
      .catch(err => cb(err))
  }
}

module.exports = followshipServices
