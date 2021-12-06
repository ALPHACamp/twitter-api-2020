// 載入所需套件
const { Followship } = require('../models')
const { Op } = require('sequelize')
const helpers = require('../_helpers')
const ReqError = require('../helpers/ReqError')

const followshipService = {
  postFollowship: async (req, res, callback) => {
    const followerId = helpers.getUser(req).id
    const followingId = req.body.id

    //使用者不能追蹤自己
    if (followerId === Number(followingId)) {
      throw new ReqError('不能追蹤自己')
    }
    //不能重複追蹤他人
    const followship = await Followship.findOne({ where: { [Op.and]: [{ followerId }, { followingId }] } })

    if (followship) {
      throw new ReqError('不能重複追蹤')
    } else {
      await Followship.create({
        followerId,
        followingId
      })
      return callback({ status: 'success', message: '成功追蹤' })
    }
  },

  deleteFollowship: async (req, res, callback) => {
    //取消對他人的追蹤
    await Followship.destroy({
      where: {
        followerId: helpers.getUser(req).id,
        followingId: req.params.followingId
      }
    })
    return callback({ status: 'success', message: '已取消追蹤' })
  }
}


// followshipController exports
module.exports = followshipService
