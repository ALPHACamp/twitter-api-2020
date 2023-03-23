const { Op } = require('sequelize')
const db = require('../models')
const User = db.User
const Followship = db.Followship

const followshipController = {
  getRecommendedFollowings: (req, res) => {
    const userId = req.user.id // req.query.userId
    User.findAll({
      where: { id: { [Op.not]: userId }, role: { [Op.not]: 'admin' } },
      include: [{ model: User, as: 'Followers' }],
      order: [['followersNum', 'DESC']],
      limit: 10
    })
      .then(users => {
        users = { users: users }
        users = JSON.stringify(users)
        users = JSON.parse(users)
        users = users.users.map(user => ({
          account: user.account,
          avatar: user.avatar,
          id: user.id,
          introduction: user.introduction,
          name: user.name,
          role: user.role,
          banner: user.banner,
          Followers: user.Followers.map(follower => follower.Followship.followerId)
        }))
        return res.json(users)
      })
      .catch(error => {
        return res.status(404).json({ status: 'error', message: 'not-found', error: error })
      })
  },
  postFollowship: (req, res) => {
    const followerId = req.user.id
    const followingId = req.body.id
    Followship.create({
      followerId: followerId,
      followingId: followingId
    })
      .then(followship => {
        User.findByPk(followingId)
          .then(user => {
            user.update({
              followersNum: user.followersNum + 1
            })
              .then(() => {
                return res.json({ status: 'success', message: '' })
              })
          })
      })
      .catch(error => {
        return res.status(401).json({ status: 'error', error: error })
      })
  },
  deleteFollowship: (req, res) => {
    const followerId = req.user.id
    const followingId = req.params.id
    Followship.findOne({
      where: {
        followerId: followerId,
        followingId: followingId
      }
    })
      .then(followship => {
        followship.destroy()
          .then(() => {
            User.findByPk(followingId)
              .then(user => {
                user.update({
                  followersNum: user.followersNum - 1
                })
                  .then(() => {
                    return res.json({ status: 'success', message: '' })
                  })
              })
          })
      })
      .catch(error => {
        return res.status(401).json({ status: 'error', error: error })
      })
  }
}

module.exports = followshipController
