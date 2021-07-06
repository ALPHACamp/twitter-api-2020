const db = require('../../models')
const User = db.User
const defaultLimit = 10

let userController = {
  getUsers: (req, res) => {
    const offset = req.query.offset || 0
    const limit = req.query.limit || defaultLimit
    const userId = 1 //before building JWT
    const order = [['followerNum', 'DESC']]
    const attributes = ['id', 'account', 'name', 'avatar', 'cover', 'tweetNum', 'likeNum', 'followingNum', 'followerNum', 'lastLoginAt']
    User.findAll({ offset, limit, order, attributes,
      include: [{
        model: User,
        as: "Followers",
        attributes: ['id']
      }]
    }).then(users => {
      users = users.map(user => {
        user.dataValues.isFollowing = user.dataValues.Followers.some(follower => follower.id === userId)
        delete user.dataValues.Followers
        return user
      })
      return res.json({ Users: users })
    }).catch(err => {
      return res.json({ status: 'error', message: err })
    })
  }
}

module.exports = userController;