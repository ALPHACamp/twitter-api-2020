const RequestError = require('../utils/customError')

const followshipService = require('../services/followshipService')

const followshipController = {
  addFollow: async (req, res, next) => {
    const followReq = { followerId: req.user.id, followingId: req.body.id }
    try {
      if (followReq.followerId === +followReq.followingId) throw new RequestError('You cannot follow yourself.')

      const data = await followshipService.addFollow(followReq)
      return res.json(data)
    } catch (error) {
      next(error)
    }
  },

  unFollow: async (req, res, next) => {
    const followReq = { followerId: req.user.id, followingId: req.params.followingId }
    try {
      const data = await followshipService.unFollow(followReq)
      return res.json(data)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = followshipController
