const { User, Tweet, Reply, Like, Followship } = require('../models')
const sequelize = require('sequelize')
const helpers = require('../_helpers')

const followshipController = {
  postFollow: (req, res, next) => {
    const { id } = req.body
    const currentUser = helpers.getUser(req).id
    console.log(currentUser)
    if (id === currentUser) throw new Error ("You couldn't follow yourself")

    return Followship.findOrCreate({ where: { followerId: currentUser, followingId: id }, raw: true })
    .then(([data, isCreated]) => {
      if (!isCreated) throw new Error("You have followed this user")
      res.status(200).json(data)
    }).catch(err => next(err))

  }
}


module.exports = followshipController