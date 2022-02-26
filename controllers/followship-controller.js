const { User, Followship } = require('../models')
const helpers = require('../_helpers')

const followshipController = {
  followUsesr: (req, res, next) => {
    const followingId = Number(req.body.id)
    const followerId = helpers.getUser(req).id
    if (followingId === followerId) throw new Error('Cannot follow yourself!')
    return Promise.all([
      User.findByPk(followingId),
      Followship.findOne({
        where: {
          followingId,
          followerId
        }
      })
    ])
      .then(([user, isFollowed]) => {
        if (!user) throw new Error('User not exist!')
        if (isFollowed) throw new Error('You are already following this user.')
        return Followship.create({
          followingId,
          followerId
        })
      })
      .then(() => res.status(200).json('Successfully followed this user.'))
      .catch(err => next(err))
  },
  unFollowUser: (req, res, next) => {
    const followingId = Number(req.params.id)
    const followerId = helpers.getUser(req).id
    if (followingId === followerId) throw new Error('Cannot unfollow yourself!')
    return Promise.all([
      User.findByPk(followingId),
      Followship.findOne({
        where: {
          followingId,
          followerId
        }
      })
    ])
      .then(([user, isFollowed]) => {
        if (!user) throw new Error('User not exist!')
        if (!isFollowed) throw new Error('You have not followed this user.')
        return Followship.destroy({
          where: {
            followingId,
            followerId
          }
        })
      })
      .then(() => res.status(200).json('Successfully unfollowed this user.'))
      .catch(err => next(err))
  }
}

module.exports = followshipController