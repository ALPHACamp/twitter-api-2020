const { User, Followship } = require('../models')
const helpers = require('../_helpers')
const { Op } = require("sequelize");

const followshipController = {

  showAllUser: async (req, res, next) => {
    let user = await User.findAll({
      where: {
        id: { [Op.ne]: helpers.getUser(req).id },
        role: { [Op.eq]: 'user' }
      },
      include: [
        { model: User, as: 'Followers' }
      ]
    })

    user = user.map(user => ({
      name: user.dataValues.name,
      account: user.dataValues.account,
      avatar: user.dataValues.avatar,
      isFollowed: helpers.getUser(req).Followings.map(following => following.id).includes(user.dataValues.id)
    }))

    return res.json(user)
  },
  addFollowing: async (req, res, next) => {
    try {
      const [follow, created] = await Followship.findOrCreate({
        where: {
          followerId: helpers.getUser(req).id,
          followingId: Number(req.params.id)
        }
      })
      if (created) {
        return res.json({ status: 'success', message: { isFollowed: true, message: '追蹤成功' } })
      }
      if (follow) {
        return res.json({ status: 'error', message: { isFollowed: true, message: '已經追蹤' } })
      }
    } catch (err) { next(err) }
  },
  deleteFollowing: async (req, res, next) => {
    try {
      const followingShip = await Followship.findOne({
        where: {
          followerId: helpers.getUser(req).id,
          followingId: Number(req.params.id)
        }
      }) || false

      if (!followingShip) { return res.json({ status: 'error', message: '使用者沒有追蹤的人' }) }
      followingShip.destroy()

      return res.json({ status: 'success', message: '已取消追蹤' })
    } catch (err) { next(err) }
  },
}

module.exports = followshipController