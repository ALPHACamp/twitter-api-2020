const helpers = require('../_helpers.js')
const db = require('../models')
const Followship = db.Followship
const User = db.User


const followshipController = {
  postFollowing: (req, res) => {
    if (helpers.getUser(req).id === Number(req.body.id)) {
      return res.json({ status: 'error', message: 'Can not follow yourself.' })
    }
    if (req.body.id === undefined) {
      return res.json({ status: 'error', message: 'You should enter id.' })
    }
    Followship.findOne({ where: { followerId: helpers.getUser(req).id, followingId: req.body.id } })
      .then(data => {
        if (!data) {
          Followship.create({ followerId: helpers.getUser(req).id, followingId: req.body.id })
            .then(() => {
              return res.json({ status: 'success', message: 'Follow successfully.' })
            })
            .catch(error => res.send(String(error)))
        } else {
          return res.json({ status: 'error', message: 'The database already has the same data.' })
        }
      })
      .catch(error => res.send(String(error)))
  },

  deleteFollowing: (req, res) => {
    Followship.findOne({ where: { followerId: helpers.getUser(req).id, followingId: req.params.followingId } })
      .then(data => {
        if (data) {
          return data.destroy()
        } else {
          return res.json({ status: 'error', message: 'The database does not have the same data.' })
        }
      })
      .then(() => {
        return res.json({ status: 'success', message: 'Unfollow successfully.' })
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
        user.forEach((u, index) => {
          if (u.id === 1) { user.splice(index, 1) }
        })
        return res.json(user)
      })
      .catch(error => res.send(String(error)))
  }
}

module.exports = followshipController