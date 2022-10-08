const { Followship, User } = require('../models')
const { getUser } = require('../_helpers')

const followshipServices = {
  addFollowing: (req, cb) => {
    const currentUserId = getUser(req).dataValues.id
    const userId = req.body.id
    Promise.all([
      User.findByPk(userId),
      Followship.findOne({
        where: {
          followerId: currentUserId,
          followingId: userId
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error("User didn't exist!")
        if (followship) throw new Error('You are already following this user!')
        if (user.id === currentUserId) throw new Error("You can't yourself!")

        return Followship.create({
          followerId: currentUserId,
          followingId: userId
        })
      })
      .then(followship => cb(null, followship))
      .catch(err => cb(err))
  }
}

module.exports = followshipServices
