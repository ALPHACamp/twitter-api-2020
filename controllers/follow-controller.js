const { User, Followship } = require('../models')

const followController = {
  addFollowing: (req, res, next) => {
    const followingId = req.body.id
    const followerId = req.user.id
    if (followerId === followingId) throw new Error('You cannot follow yourself.')
    User.findByPk(followingId)
      .then((user) => {
        if (!user) throw new Error('The user does not exist.')
        if (user.dataValues.role === 'admin') throw new Error('You cannot follow an administrator.')
        Followship.findOrCreate({
          where: {
            followerId,
            followingId,
          },
        })
          .then((followship) => {
            if (!followship[1]) throw new Error('You have followed this user!')
            return res.status(200).json({ message: 'Successfully established a following relationship.' })
          })
          .catch((err) => next(err))
      })
      .catch((err) => next(err))
  },
    removeFollowing: (req, res, next) => {
    const followingId = req.params.followingId
    const followerId = req.user.id
    Followship.findOne({
      where: {
        followerId,
        followingId
      },
    })
      .then(followship => {
        if (!followship) throw new Error("You haven't followed this user!")
        followship.destroy().then(()=>{
          return res.status(200).json({ message: 'Successfully removed a following relationship.' })
        })
      })
      .catch((err) => next(err))
  },
}

module.exports = followController