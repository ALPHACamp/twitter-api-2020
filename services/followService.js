const db = require('../models')
const { Followship, User } = db
const helper = require('../_helpers')

const followService = {
  addFollowing: async (req, res, callback) => {
    try {
      const user = helper.getUser(req)
      const following = await User.findOne({
        where: { id: req.body.id }
      })
      if (following.role !== 'admin') {
        await Followship.findOrCreate({
          where: { followerId: user.id, followingId: req.body.id },
          defaults: {
            followerId: user.id,
            followingId: req.body.id
          }
        })
        return callback({ status: 'success', message: '' })
      }
      return callback({ status: 'error', message: 'Authorization denied', statusCode: 401 })

    } catch (err) {
      console.log(err)
      callback({ status: 'error', message: 'Internal Server Error', statusCode: 500 })
    }
  },
  removeFollowing: async (req, res, callback) => {
    try {
      const user = helper.getUser(req)
      const followship = await Followship.findOne({
        where: {
          followerId: user.id,
          followingId: req.params.followingId
        }
      })
      if (followship === null) callback({ status: 'success', message: '' })
      await followship.destroy()
      callback({ status: 'success', message: '' })
    } catch (err) {
      console.log(err)
      callback({ status: 'error', message: 'Internal Server Error', statusCode: 500 })
    }
  }
}

module.exports = followService