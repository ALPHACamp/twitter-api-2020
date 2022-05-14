const { Followship } = require('../models')
const helpers = require('../_helpers')

const followshipController = {
  postFollowship: (req, res, next) => {
    try {
      const followerId = helpers.getUser(req).id
      const followingId = req.body.id
      Followship.create({
        followerId,
        followingId
      })
        .then(followship => {
          res.status(200).json({ followship })
        })
    } catch (err) {
      next(err)
    }
  },
  deleteFollowship: (req, res, next) => {
    try {
      const followingId = req.params.followingId
      const followerId = helpers.getUser(req).id
      Followship.destroy({
        where: { followerId, followingId }
      })
      res.sendStatus(200)
    } catch (err) {
      next(err)
    }
  }
}
module.exports = followshipController
