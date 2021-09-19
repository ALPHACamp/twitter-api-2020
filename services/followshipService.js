const { Followship, User, Sequelize } = require('../models')
const helpers = require('../_helpers')

const followshipService = {
  addFollowing: async (req, res, callback) => {
    const followingId = Number(req.body.id)
    const followerId = Number(helpers.getUser(req).id)
    if (followingId === followerId) {
      return callback(400, { status: 'error', message: 'cannot follow yourself' })
    }

    try {
      const user = await User.findByPk(followingId, { raw: true })
      if (!user) {
        return callback(404, { status: 'error', message: "user doesn't exist" })
      }

      if (user.role === 'admin') {
        return callback(400, { status: 'error', message: 'cannot follow administrator' })
      }

      const followingsList = await User.findByPk(followerId, { include: { model: User, as: 'Followings' }, attributes: [] })
      const isFollowed = followingsList.Followings.find(following => following.dataValues.id === followingId) !== undefined

      if (isFollowed) {
        return callback(400, { status: 'error', message: 'you have already followed this user' })
      }

      await Followship.create({
        followerId,
        followingId
      })
      callback(200, { status: 'success', message: 'add following successfully' })
    } catch (err) {
      console.log('addFollowing error', err)
      res.sendStatus(500)
    }
  },
  removeFollowing: async (req, res, callback) => {
    const { followingId } = req.params
    const followerId = helpers.getUser(req).id

    try {
      const removeResult = await Followship.destroy({ where: { followerId, followingId } })

      if (removeResult === 0) {
        return callback(400, { status: 'error', message: 'unable to remove no follow user' })
      }
      callback(200, { status: 'success', message: 'remove following successfully' })
    } catch (err) {
      console.log('removeFollowing error', err)
      res.sendStatus(500)
    }
  }
}

module.exports = followshipService
