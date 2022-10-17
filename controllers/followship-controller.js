const { User, Followship } = require('../models')
const sequelize = require('sequelize')
const helpers = require('../_helpers')
const { Op } = require("sequelize");

const followshipController = {
  postFollow: (req, res, next) => {
    // POST /api/followships - 追蹤其他使用者
    const id = req.body.id
    const currentUserId = helpers.getUser(req).id.toString()
    if (id === currentUserId) throw new Error("You couldn't follow yourself")

    return User.findAll({
      where:
        { id: { [Op.in]: [id, currentUserId] } }
    })
      .then(users => {
        if (users.length !== 2) throw new Error('User not exist')

        return Followship.findOrCreate({ where: { followerId: currentUserId, followingId: id }, raw: true })
      })
      .then(([data, isCreated]) => {
        if (!isCreated) throw new Error('You have followed this user')
        data = data.toJSON()
        data.isFollowed = true
        res.status(200).json(data)
      }).catch(err => next(err))
  },
  deleteFollow: (req, res, next) => {
    // DELETE /api/followships/:following_id - 取消追蹤其他使用者
    const { followingId } = req.params
    const followerId = helpers.getUser(req).id.toString()

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