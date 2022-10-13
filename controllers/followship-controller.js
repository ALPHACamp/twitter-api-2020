const { User, Followship } = require('../models')
const sequelize = require('sequelize')
const helpers = require('../_helpers')
const { Op } = require("sequelize");

const followshipController = {
  postFollow: (req, res, next) => {
    const id = req.body.id
    const currentUser = String(helpers.getUser(req).id)
    if (id === currentUser) throw new Error("You couldn't follow yourself")

    return User.findAll({
      where:
        { id: { [Op.in]: [id, currentUser] } }
    })
      .then(users => {
        if (users.length !== 2) throw new Error('User not exist')

        return Followship.findOrCreate({ where: { followerId: currentUser, followingId: id }, raw: true })
      })
      .then(([data, isCreated]) => {
        if (!isCreated) throw new Error("You have followed this user")
        data = data.toJSON()
        data.isFollowed = true
        res.status(200).json(data)
      }).catch(err => next(err))
  },
  deleteFollow: (req, res, next) => {
    const followingId = req.params.followingId
    const followerId = String(helpers.getUser(req).id)

    return User.findAll({
      where:
        { id: { [Op.in]: [followingId, followerId] } }
    }).then(users => {
      if (users.length !== 2) throw new Error('User not exist')

      return Followship.destroy({
        where: { followingId, followerId }
      })
    }).then(deletedData => {
      if (!deletedData) throw new Error("you haven't follow this user")
      res.status(200).json({
        status: 'success',
        isFollowed: false,
        message: 'Deleted successfully'
      })
    }).catch(err => next(err))

  }
}


module.exports = followshipController