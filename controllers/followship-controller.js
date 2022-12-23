const helpers = require('../_helpers')
const { Followship, User } = require('../models')

const followshipController = {
  addFollowing: (req, res, next) => {
    const currentUserId = helpers.getUser(req).id
    const followingId = req.body.id
    if (currentUserId === Number(followingId)) {
      return res.status(406).json({
        status: '406',
        message: 'You can not follow yourself'
      })
    }
    return Promise.all([
      Followship.findOne({
        where: {
          followerId: currentUserId,
          followingId
        }
      }),
      User.findByPk(followingId)
    ])
      .then(([isfollowed, user]) => {
        if (isfollowed) return res.status(404).json({
          status: '404',
          message: 'You have already followed this user!'
        })
        if (!user) {
          return res.status(406).json({
            status: '406',
            message: 'User not exist!'
          })
        }
        return Promise.all([
          Followship.create({
            followerId: currentUserId,
            followingId
          }),
          User.update(
            { followingCount: user.followingCount + 1 },
            { where: { id: followingId } }
          )
        ])
      })
      .then(([followshipData, userData]) => {
        res.status(200).json(followshipData)
      })
      .catch(err => next(err))
  },
  removeFollowing: (req, res, next) => {
    const currentUserId = helpers.getUser(req).id
    const followingId = req.params.followingId
    Promise.all([
      Followship.findOne({
        where: {
          followerId: currentUserId,
          followingId
        }
      }),
      User.findByPk(followingId)
    ])
      .then(([followshipData, userData]) => {
        if (!followshipData) return res.status(404).json({
          status: '404',
          message: 'You have not followed this user!'
        })
        Promise.all([
          followshipData.destroy(),
          User.update(
            { followingCount: userData.followingCount - 1 },
            { where: { id: followingId } }
          )
        ])
          .then(([followshipData, userData]) =>
            res.status(200).json(followshipData))
      })
      .catch(err => next(err))
  }
}

module.exports = followshipController