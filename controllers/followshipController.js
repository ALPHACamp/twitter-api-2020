const helpers = require('../_helpers')

const db = require('../models')
const Followship = db.Followship
const User = db.User

const followshipController = {
  follow: (req, res, next) => {
    const followerId = Number(helpers.getUser(req).id)
    const followingId = Number(req.body.id)
    User.findByPk(followingId)
      .then(user => {
        if (!user) {
          return res.status(404).json({ status: 'failure', message: 'this user not exist' })
        }
        if (followerId === followingId) {
          return res.json({ status: 'failure', message: "Don't be narcissism" })
        }
        return Followship.findOrCreate({
          where: { followingId, followerId },
          default: { followingId, followerId }
        })
          .spread((follow, created) => {
            if (!created) {
              return res.json({ status: 'failure', message: 'Already Followed' })
            } else {
              return res.json({ status: 'success', message: 'OK', follow })
            }
          })
          .catch(next)
      })
      .catch(next)
  },
  unfollow: (req, res) => {}
}

module.exports = followshipController
