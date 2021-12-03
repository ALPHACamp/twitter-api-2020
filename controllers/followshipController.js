const { Op } = require("sequelize")
const db = require('../models')
const Followship = db.Followship
const User = db.User
const helpers = require('../_helpers')

const followshipController = {
  postFollowship: (req, res) => {
    return Followship.findAll({ where: { followerId: helpers.getUser(req).id } })
        .then(followings => {
          return User.findByPk(req.body.id).then(user => {
            if (req.body.id === String(helpers.getUser(req).id) || !user) {
              return res.json({ status: 'error', message: '無法追蹤' })
            } else if (followings.map(f => f.followingId).includes(Number(req.body.id))) {
              return res.json({ status: 'error', message: '已經追蹤' })
            } else {
              Followship.create({
                followerId: helpers.getUser(req).id,
                followingId: req.body.id
              })
              return res.json({ status: 'success', message: '成功追蹤' })
            }
          })
        })
  },

  deleteFollowship: (req, res) => {
    return Followship.destroy({
      where: {
        [Op.and]: [
          { followerId: helpers.getUser(req).id },
          { followingId: req.params.followingId }
        ]
      }
    })
        .then(() => {
          return res.json({ status: 'success', message: '' })
        })
  }
}

module.exports = followshipController