const db = require('../models')
const Followship = db.Followship
const helpers = require('../_helpers')

const followshipController = {
  postFollowship: (req, res) => {
    return Followship.findAll({ where: { followerId: helpers.getUser(req).id } })
      .then(followings => {
        if (followings.map(f => f.followingId).includes(Number(req.params.userId))) {
          return res.json({ status: 'error', message: '已經追蹤' })
        } else {
          Followship.create({
            followerId: helpers.getUser(req).id,
            followingId: req.params.userId
          })
          return res.json({ status: 'success', message: '成功追蹤' })
        }
      })
  }
}

module.exports = followshipController