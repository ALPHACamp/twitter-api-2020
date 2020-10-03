const helpers = require('../_helpers.js')
const db = require('../models')
const Followship = db.Followship
const User = db.User


const followshipController = {
  postFollowing: (req, res) => {
    if (helpers.getUser(req).id === Number(req.body.id)) {
      return res.json({ status: 'error', message: 'Can not follow yourself.' })
    }
    Followship.findOne({ where: { followerId: helpers.getUser(req).id, followingId: req.body.id } })
      .then(data => {
        if (!data) {
          Followship.create({ followerId: helpers.getUser(req).id, followingId: req.body.id })
            .then(() => {
              return res.json({ status: 'success', message: '追蹤成功' })
            })
            .catch(error => res.send(String(error)))
        } else {
          return res.json({ status: 'error', message: '資料庫已有相同資料' })
        }
      })
      .catch(error => res.send(String(error)))
  },

  deleteFollowing: (req, res) => {
    Followship.findOne({ where: { followerId: helpers.getUser(req).id, followingId: req.params.followingId } })
      .then(data => {
        if (data) {
          data.destroy()
            .then(() => {
              return res.json({ status: 'success', message: '取消追蹤' })
            })
            .catch(error => res.send(String(error)))
        } else {
          return res.json({ status: 'error', message: '資料庫沒有相同資料' })
        }
      })
      .catch(error => res.send(String(error)))
  },

  topFollowers: (req, res) => {
    User.findAll({ include: [{ model: User, as: 'Followers' }] })
      .then(user => {
        user = user.map(u => ({
          ...u.dataValues,
          isFollowed: helpers.getUser(req).Followings.map(follow => follow.id).includes(u.id)
        }))
        user = user.sort((a, b) => b.Followers.length - a.Followers.length).slice(0, 10)
        return res.json(user)
      })
      .catch(error => res.send(String(error)))
  }
}

module.exports = followshipController