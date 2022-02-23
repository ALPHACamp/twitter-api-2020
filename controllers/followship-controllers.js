const followshipServices = require('../services/followship-service')

const followshipController = {
  addFollowing: async (req, res, next) => {
    const followerId = Number(req.user.id)
    const followingId = Number(req.body.followingId)

    try {
      const data = await followshipServices.addFollowing(followerId, followingId)

      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },
  removeFollowing: async (req, res, next) => {
    const followingId  = Number(req.params.followingId)
    const followerId = Number(req.user.id)

    try {
      const data = await followshipServices.removeFollowing(followerId, followingId)

      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = followshipController