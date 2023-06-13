const { User, Followship } = require('../models')
const helpers = require('../_helpers')

const followshipController = {
  addFollowing: (req, res, next) => {
    const followingId = req.body.id
    if (!followingId) throw new Error('Following id is required!')
    const getUser = helpers.getUser(req)
    const userId = getUser.id
    if (userId.toString() === followingId) throw new Error("Can't follow yourself!")
    return Promise.all([
      Followship.findOne({
        where: {
          followerId: userId,
          followingId
        }
      }),
      User.findByPk(followingId)
    ])
      .then(([followship, user]) => {
        if (followship) throw new Error('You are already following this user!')
        if (!user) throw new Error("User didn't exist!")
        return Followship.create({
          followerId: userId,
          followingId
        })
      })
      .then((followship) => {
        res.json({
          status: 'success',
          followship: followship
        })
      })
      .catch(err => next(err))
  },
  deleteFollowing: (req, res, next) => {
    const followingId = req.params.followingId
    const getUser = helpers.getUser(req)
    const userId = getUser.id
    return Followship.findOne({
      where: {
        followerId: userId,
        followingId
      }
    })
      .then(followship => {
        if (!followship) throw new Error("You haven't following this user!")
        return followship.destroy()
      })
      .then(() => {
        res.json({
          status: 'success',
          message: "Followship deleted successfully"
        })
      })
      .catch(err => next(err))
  },
  getTopUser: (req, res, next) => {
    return User.findAll({
      include: [{ model: User, as: 'Followers' }]
    })
      .then(users => {
        const result = users
          .map(user => ({
            ...user.toJSON(),
            followerCount: user.Followers.length,
            isFollowed: req.user.Followings.some(f => f.id === user.id)
          }))
          .sort((a, b) => b.followerCount - a.followerCount)
        return res.json({ users: result })
      })
      .catch(err => next(err))
  },
}

module.exports = followshipController
