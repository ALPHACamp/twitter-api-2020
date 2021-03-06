const db = require('../models')
const Followship = db.Followship
const helper = require('../_helpers')

const followService = {
  addFollowing: async (req, res, callback) => {
    try {
      const user = helper.getUser(req)
      await Followship.findOrCreate({
        where: { followingId: req.body.id },
        defaults: {
          followerId: user.id,
          followingId: req.body.id
        }
      })
      callback({ status: 'success', message: '' })
    } catch (err) {
      console.log(err)
      callback({ status: 'error', message: 'codeStatus 500', statusCode: 500 })
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
      callback({ status: 'error', message: 'codeStatus 500', statusCode: 500 })
    }
  }
}

module.exports = followService