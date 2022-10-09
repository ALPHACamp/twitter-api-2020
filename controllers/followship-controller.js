const { User, Tweet, Reply, Like, Followship } = require('../models')
const sequelize = require('sequelize')
const helpers = require('../_helpers')

const followshipController = {
  postFollow: (req, res, next) => {
    const id = Number(req.body.id)
    const currentUser = Number(helpers.getUser(req).id)
    if (id === currentUser) throw new Error ("You couldn't follow yourself")

    return Followship.findOrCreate({ where: { followerId: currentUser, followingId: id }, raw: true })
    .then(([data, isCreated]) => {
      if (!isCreated) throw new Error("You have followed this user")
      res.status(200).json(data)
    }).catch(err => next(err))

  }
}


module.exports = followshipController